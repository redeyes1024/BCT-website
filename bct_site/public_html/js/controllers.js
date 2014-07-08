var BCTAppControllers = angular.module('BCTAppControllers', []);

BCTAppControllers.controller('routeSchedulesController', ['$scope',
    '$timeout', '$interval', 'scheduleWebSocket', 'scheduleSocketService',
    function ($scope, $timeout, $interval, scheduleWebSocket, scheduleSocketService) {

    //For ease of testing
    window.rs_scope = $scope;

    $scope.loaded_results = {
        routes: [],
        stops: []
    };
}]);

BCTAppControllers.controller('indexController', ['$scope',
    '$timeout', '$interval', '$routeParams',
    function ($scope, $routeParams) {
        isr.dom_q.inputs["index-schedule-search"] = document.getElementById("index-schedule-search");
        $scope.recently_viewed = {
            trips: [
                {
                    start: "Picard Blvd. / Riker St.",
                    finish: "1701 Enterprise Pl."
                },
                {
                    start: "Picard Blvd. / Riker St.",
                    finish: "Beverley Crusher Community Center"
                }
            ],
            stops: [
                {
                    stop_id: "123ABC",
                    route_id: "ABC123",
                    route_info: {
                        number: "101",
                        name: "Picard Blvd.",
                        direction: "east"
                    },
                    bstop_info: {
                        stop_id: "11717",
                        inter: "Picard Blvd. / Giordi Rd."
                    }
                }
            ]
        };

        var recent = $scope.recently_viewed;

        //Currently, this Anonymous function is called only when $route service
        //directs to the "nearest stops" page
        (function() {
            for (var i=0;i<recent.trips.length;i++) {
                recent.trips[i].name = recent.trips[i].start + " to " +
                    recent.trips[i].finish;
            }
            for (var j=0;j<recent.stops.length;j++) {
                var cur_stop = recent.stops[j];
                cur_stop.name = "";

                for (var r_prop in cur_stop.route_info) {
                    cur_stop.name += cur_stop.route_info[r_prop];
                    cur_stop.name += " ";
                }
                for (var s_prop in cur_stop.bstop_info) {
                    cur_stop.name += cur_stop.bstop_info[s_prop];
                    cur_stop.name += " ";
                }
                cur_stop.name = cur_stop.name.trim();
            }
        })();

        //Init operations completed when the $scope.init flag is set to "true"
        if (!$scope.init) {
            angular.element(document).ready(function() {
                $scope.init = true;
            });
        }

        $scope.changeURLHash = function(new_hash, model) {
            if (model) {
                var input_str = $scope.query_data[model];
                if (!input_str || input_str.trim() === "") {
                    if (input_str !== "") {
                        $scope.query_data[model] = "";
                    }
                    return true;
                }
            }
            window.location.hash = new_hash;
        };
}]);

BCTAppControllers.controller('tripPlannerController', ['$scope',
    'googleMapUtilities', '$timeout', 'tripPlannerService',
    'unitConversionAndDataReporting', 'placeholderService',
    'nearestStopsService',
    function ($scope, googleMapUtilities, $timeout, tripPlannerService,
        unitConversionAndDataReporting, placeholderService,
        nearestStopsService) {
        //For ease of debugging
        window.trip_scope = $scope;

        $scope.geocoder_error_dialog_text = "Default dialog text";

        $scope.trip_opts = {
            optimize: "QUICK",
            modeswitch: {
                bus: true,
                train: true,
                bike: false
            },
            datetarg: "arrive_by",
            datepick: new Date
        };

        /*  Note on the getCurrentLocation function:

            Since the geolocation API contains no indication that the user
            agreed to share their location before loading, the loading animation
            begins when the location button is pressed. Thus the actual loading
            will
            not start until the user agrees to share their location to the browser.

            Furthermore, some browsers let users ignore location requests
            without a definitive acceptance or refusal to share location. When
            this occurs, there is no way to tell when the loading animation
            must stop.

            Therefore, the function contains a work-around that will cover
            most cases. It depends on the presumption that if a location isn't
            received within some (adjustable) cutoff time, it is presumed that
            the user ignored the request, and the animation will stop. If the
            user then decides to share their location after ignoring it, the
            result will be ignored, requiring the user to send a fresh location
            request, preventing the coordinates from popping up in the start
            input section of the trip planner unexpectedly.

            In short, the user has the number of seconds stored in the 
            'constant' $scope.TIME_UNTIL_LOCATION_REQUEST_PRESUMED_IGNORED
            *minus* the amount of time it takes the location to be retrieved,
            otherwise it is presumed that the user ignored the location request
            and will have to click the location button again.
        */

        $scope.TIME_UNTIL_LOCATION_REQUEST_PRESUMED_IGNORED = 15000;

        $scope.getCurrentLocation = function() {
            $scope.latest_location_prompt_time = new Date;

            $scope.top_scope.show_planner_location_icon = false;
            $scope.top_scope.show_planner_location_icon_with_spin = true;

            navigator.geolocation.getCurrentPosition(
                function(p_res) {
                    $scope.latest_successful_location_request_time = new Date;

                    if (($scope.latest_successful_location_request_time -
                        $scope.latest_location_prompt_time)
                        < $scope.TIME_UNTIL_LOCATION_REQUEST_PRESUMED_IGNORED) {

                        $scope.top_scope.trip_inputs.start = p_res.coords.latitude +
                        "," + p_res.coords.longitude;

                        $scope.top_scope.show_planner_location_icon = true;
                        $scope.top_scope.show_planner_location_icon_with_spin = false;

                        $scope.top_scope.$apply();
                    }
                },
                function() {
                    console.log("Location request cancelled or failed.");

                    $scope.top_scope.show_planner_location_icon = true;
                    $scope.top_scope.show_planner_location_icon_with_spin = false;

                    $scope.top_scope.$apply();
                },
                {
                    timeout: $scope.TIME_UNTIL_LOCATION_REQUEST_PRESUMED_IGNORED
                }
            );

            var user_ignored_location_request_timer = $timeout(function() {
                $scope.top_scope.show_planner_location_icon = true;
                $scope.top_scope.show_planner_location_icon_with_spin = false;
            }, $scope.TIME_UNTIL_LOCATION_REQUEST_PRESUMED_IGNORED);

        };

        $scope.current_location = {
            LatLng: {
                Latitude: 26,
                Longitude: -80
            }
        };

        $scope.nearest_bstops = nearestStopsService.findNearestStops(
            $scope.current_location,
            $scope.stops_arr
        );

        //Using the ng-class directive, the flow of these DOM elements is
        //altered significantly in order for the map only to be loaded once.
        //Here, they are set to flow with the Trip Planner module.
        $scope.top_scope.schedule_map_styles["schedule-map-planner"] = true;
        $scope.top_scope.schedule_map_styles["schedule-map-overlay"] = false;

        $scope.planner_error_alert_dialog_hide_in_progress = false;

        $scope.alertUserToTripPlannerErrors = function(error_field) {
            $scope.top_scope.show_trip_planner_itinerary_selector = false;
            $scope.top_scope.show_schedule_map_loading_modal = false;
            isr.dom_q.inputs.trip[0].focus();

            var dialog_styles = $scope.top_scope.planner_dialog_styles;

            if ($scope.planner_error_alert_dialog_hide_in_progress ||
                dialog_styles["trip-planner-dialog-faded-in"]) {
                return false;
            }

            $scope.geocoder_error_dialog_text = $scope.TRIP_PLANNER_ERROR_TEXT_NO_PLAN_FOUND;
            dialog_styles["trip-planner-dialog-centered"] = true;

            dialog_styles["trip-planner-dialog-finish"] = false;
            dialog_styles["trip-planner-dialog-start"] = false;

            $scope.top_scope.show_geocoder_error_dialog = true;

            $timeout(function() {
                dialog_styles["trip-planner-dialog-faded-out"] = false;
                dialog_styles["trip-planner-dialog-faded-in"] = true;
            }, 200);
            
            $scope.geocoder_error_dialog_timeout = $timeout(function() {
                dialog_styles["trip-planner-dialog-faded-in"] = false;
                dialog_styles["trip-planner-dialog-faded-out"] = true;

                $scope.planner_error_alert_dialog_hide_in_progress = true;

                $timeout(function() {
                    $scope.top_scope.show_geocoder_error_dialog = false;
                    $scope.planner_error_alert_dialog_hide_in_progress = false;
                }, 1000);
            }, $scope.GEOCODER_ERROR_ALERT_DIALOG_HIDE_DELAY);

            console.log("Trip planner error: " + error_field.idField);
        };

        $scope.GEOCODER_ERROR_ALERT_DIALOG_HIDE_DELAY = 3000;
        $scope.GEOCODER_ERROR_ALERT_DIALOG_TEXT_NOT_FOUND = "Location not found.";
        $scope.GEOCODER_ERROR_ALERT_DIALOG_TEXT_OVER_LIMIT = "Please wait before posting again.";

        $scope.alertUserToGeocoderErrors = function(input_field_name, error_status) {
            $scope.top_scope.show_trip_planner_itinerary_selector = false;
            $scope.top_scope.show_schedule_map_loading_modal = false;

            var dialog_styles = $scope.top_scope.planner_dialog_styles;

            if (error_status === "ZERO_RESULTS") {
                $scope.geocoder_error_dialog_text = $scope.GEOCODER_ERROR_ALERT_DIALOG_TEXT_NOT_FOUND;
                dialog_styles["trip-planner-dialog-centered"] = false;
                
                switch (input_field_name) {
                case "start":
                    dialog_styles["trip-planner-dialog-finish"] = false;
                    dialog_styles["trip-planner-dialog-start"] = true;
                    isr.dom_q.inputs.trip[0].focus();
                    break;
                case "finish":
                    dialog_styles["trip-planner-dialog-start"] = false;
                    dialog_styles["trip-planner-dialog-finish"] = true;
                    isr.dom_q.inputs.trip[1].focus();
                    break;
                }
            }
            else if (error_status === "OVER_QUERY_LIMIT") {
                $scope.geocoder_error_dialog_text = $scope.GEOCODER_ERROR_ALERT_DIALOG_TEXT_OVER_LIMIT;
                dialog_styles["trip-planner-dialog-centered"] = true;

                dialog_styles["trip-planner-dialog-finish"] = false;
                dialog_styles["trip-planner-dialog-start"] = false;
            }

            $scope.top_scope.show_geocoder_error_dialog = true;

            $timeout(function() {
                dialog_styles["trip-planner-dialog-faded-out"] = false;
                dialog_styles["trip-planner-dialog-faded-in"] = true;
            }, 200);

            $timeout.cancel($scope.geocoder_error_dialog_timeout);

            $scope.geocoder_error_dialog_timeout = $timeout(function() {
                dialog_styles["trip-planner-dialog-faded-in"] = false;
                dialog_styles["trip-planner-dialog-faded-out"] = true;
                $timeout(function() {
                    $scope.top_scope.show_geocoder_error_dialog = false;
                }, 1000);
            }, $scope.GEOCODER_ERROR_ALERT_DIALOG_HIDE_DELAY);
        };

        $scope.TRIP_PLANNER_ERROR_TEXT_NO_PLAN_FOUND = "No trip plan found.";

        $scope.checkForGeocoderErrors = function(coords) {
            if (typeof(coords[0]) === "string") {
                $scope.alertUserToGeocoderErrors("start", coords[0]);
                return false;
            } else if (typeof(coords[1]) === "string") {
                $scope.alertUserToGeocoderErrors("finish", coords[1]);
                return false;
            }
            return true;
        };

        $scope.formatRawTripStats = function(all_itineraries) {

            for (var i=0;i<all_itineraries.length;i++) {
                all_itineraries[i].durationField = unitConversionAndDataReporting.
                    formatReportedDuration(all_itineraries[i].durationField);

                all_itineraries[i].startTimeField = unitConversionAndDataReporting.
                    formatReportedDate(all_itineraries[i].startTimeField);
                all_itineraries[i].endTimeField = unitConversionAndDataReporting.
                    formatReportedDate(all_itineraries[i].endTimeField);
            }

            return all_itineraries;
        };

        window.isr.dom_q.inputs.trip = document.getElementsByClassName("planner-input");

        $scope.showMapLoading = function() {
            $scope.top_scope.show_schedule_map_loading_modal = true;
            $scope.top_scope.show_trip_planner_options = false;
            $scope.top_scope.show_trip_planner_itinerary_selector = false;

            for (var i=0;i<isr.dom_q.inputs.trip.length;i++) {
                isr.dom_q.inputs.trip[i].blur();
            }
        };

        $scope.getTripPlan = function() {
            $scope.showMapLoading();

            tripPlannerService.getLatLon(
                $scope.$parent.trip_inputs.start,
                $scope.$parent.trip_inputs.finish
            ).then(function(coords) {
                if (!$scope.checkForGeocoderErrors(coords)) { return false; }

                var start_coords = coords[0];
                var finish_coords = coords[1];

                //If coordinate data is wrapped in an array, it is the output
                //of the GM Geocoder and needs to be transformed
                if (start_coords[0]) {
                    start_coords = tripPlannerService.
                        transformGeocodeCoords(start_coords[0].geometry.location);
                }
                if (finish_coords[0]) {
                    finish_coords = tripPlannerService.
                        transformGeocodeCoords(finish_coords[0].geometry.location);
                }

                tripPlannerService.getTripPlanPromise(
                    $scope.trip_opts,
                    start_coords,
                    finish_coords
                ).then(function(res) {
                    if (!res.data.planField) {
                        $scope.alertUserToTripPlannerErrors(res.data.errorField);
                        return false;
                    }

                    if ($scope.top_scope.show_trip_planner_title) {
                        $scope.top_scope.show_trip_planner_itinerary_selector = true;
                    }

                    $scope.current_trip_plan_data = $scope.formatRawTripStats(
                        res.data.planField.itinerariesField);
                    $scope.top_scope.show_trip_planner_itinerary_labels = true;

                    $scope.top_scope.show_schedule_map_loading_modal = false;
                });
            }).
            catch(function() {
                console.log("There was an error retrieving the trip plan data.");

                $scope.top_scope.show_schedule_map_loading_modal = false;
            });
        };

        $scope.displayTripPlan = function(selection) {
            googleMapUtilities.displayTripPath(
                $scope.current_trip_plan_data[selection].legsField
            );
            $scope.top_scope.show_trip_planner_itinerary_selector = false;
        };

        $scope.toggleTripOptions = function() {
            if ($scope.top_scope.show_trip_planner_options) {
                $scope.top_scope.show_trip_planner_options = false;
            }
            else {
                $scope.top_scope.show_trip_planner_options = true;
            }
        };

        //Check if inputs are empty or contain just spaces; false -> do not submit
        $scope.tripPlannerInputsEmpty = function() {
            if ($scope.trip_inputs.start === "" ||
                $scope.trip_inputs.finish === "" ) {
                return false;
            }
            return true;
        };

        $scope.submitTripPlannerQueryAndShowMap = function() {
            if ( !$scope.tripPlannerInputsEmpty() ) { return true; }

            googleMapUtilities.clearMap();
            $scope.getTripPlan();

            $scope.trip_planner_styles["trip-planner-module-active"] = true;
            //Wait for tripplanner slide animation (1 second long in CSS)
            if (!$scope.show_map_overlay_module) {
                //$timeout(function() {
                    $scope.toggleMapSchedule(true);
                //}, 1000);
            }

            $scope.top_scope.show_trip_planner_title = true;
            $scope.top_scope.show_schedule_result_top_bar = false;

            //Do not toggle map the subsequent times this function is called
            //until function is re-defined yet again (when map is closed)
            $scope.submitTrip = $scope.submitTripPlannerQueryWithoutNewMap;
        };

        $scope.submitTripPlannerQueryWithoutNewMap = function() {
            if (!$scope.tripPlannerInputsEmpty()) { return true; }

            $scope.getTripPlan();
        };

        //The first time the trip form is submitted, the map is shown (see above)
        $scope.submitTrip = $scope.submitTripPlannerQueryAndShowMap;

        $scope.top_scope.closeMapAndResetTripPlanner = function() {
            $scope.toggleMapSchedule();

            $scope.top_scope.show_trip_planner_title = false;

            $scope.submitTrip = $scope.submitTripPlannerQueryAndShowMap;
        };
}]);