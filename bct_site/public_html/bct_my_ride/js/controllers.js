var BCTAppControllers = angular.module('BCTAppControllers', []);

BCTAppControllers.controller('routeSchedulesController', ['$scope',
'$timeout', 'profilePageService',
function ($scope, $timeout, profilePageService) {

    //For ease of debugging (development only)
    window.rs_scope = $scope;

    myride.dom_q.inputs.elements.rs_search_input =
    document.getElementById("route-stop-search-input");

    myride.dom_q.inputs.elements.rs_search_input.value =
    $scope.query_data.schedule_search;

    $scope.top_scope.rs_scope_loaded = true;

    $scope.$on("destroy", function() {
        $scope.top_scope.rs_scope_loaded = false;
    });

    $scope.loaded_results = {
        routes: [],
        stops: []
    };

    $scope.sort_bstops_by_distance = false;

    $scope.sortResultStopsByDistance = function() {

        $scope.top_scope.sort_bstops_by_distance = true;

        $scope.filtered_stops_arr = $scope.stopFilterFunc(
            $scope.stops_arr,
            $scope.query_data.schedule_search,
            $scope.top_scope.sort_bstops_by_distance
        );

    };

    $scope.setNearestResultStopsLocationSpinner = function(new_state) {
        $scope.setLocationSpinnerAnimation(
            "nearest_results_bstops",
            new_state
        );
    };

    $scope.$on('$destroy', function() {
        $scope.setLocationSpinnerAnimation(
            "nearest_results_bstops", "inactive"
        );

        $timeout.cancel($scope.results_page_location_spinner_timeout);
    });

    $scope.getLocationAndDisplayForResultsPage = function() {
        $scope.results_page_location_spinner_timeout =
        $scope.getCurrentLocationAndDisplayData(
            $scope.setNearestResultStopsLocationSpinner,
            $scope.sortResultStopsByDistance
        );
    };

}]);

BCTAppControllers.controller('indexController', ['$scope', '$timeout',
'nearestStopsService',
function ($scope, $timeout, nearestStopsService) {

    //For ease of debugging (development only)
    window.index_scope = $scope;

    myride.dom_q.inputs.elements.index_search_input =
    document.getElementById("route-stop-search-index-input");

    $scope.nearest_bstops = $scope.nearest_bstops_loading;

    $scope.calculateAndShowNearestBusStops = function(location) {
        $scope.nearest_bstops = nearestStopsService.findNearestStops(
            location,
            $scope.stops_arr,
            $scope.stops
        );

        $scope.show_index_nearest_stops_panels = true;
    };

    $scope.setNearestStopsLocationSpinner = function(new_state) {
        $scope.setLocationSpinnerAnimation(
            "nearest_bstops", new_state
        );
    };

    $scope.$on('$destroy', function() {
        $scope.setLocationSpinnerAnimation(
            "nearest_bstops", "inactive"
        );

        $timeout.cancel($scope.nearest_stops_location_timeout);
    });

    $scope.getLocationAndDisplayNearestStops = function() {
        $scope.nearest_stops_location_timeout =
        $scope.getCurrentLocationAndDisplayData(
            $scope.setNearestStopsLocationSpinner,
            $scope.calculateAndShowNearestBusStops
        );
    };

    $scope.recently_viewed = {
        trips: [
            {
                start: "Coming soon",
                finish: "BCT - My Ride"
            },
            {
                start: "Coming soon",
                finish: "BCT - My Ride"
            }
        ],
        stops: [
            {
                stop_id: "123ABC",
                route_id: "ABC123",
                route_info: {
                    number: "Coming",
                    name: "soon",
                    direction: "to"
                },
                bstop_info: {
                    stop_id: "BCT",
                    inter: "- My Ride"
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

}]);

BCTAppControllers.controller('tripPlannerController', ['$scope',
'googleMapUtilities', '$timeout', 'tripPlannerService',
'unitConversionAndDataReporting',
function ($scope, googleMapUtilities, $timeout, tripPlannerService,
        unitConversionAndDataReporting) {

    //For ease of debugging (development only)
    window.trip_scope = $scope;

    //Top-level reference used only for the enter key press workaround callbacks
    $scope.top_scope.trip_scope = $scope;

    $scope.geocoder_error_dialog_text = "Default dialog text";

    $scope.top_scope.trip_opts = {
        optimize: "QUICK",
        modeswitch: {
            bus: true,
            train: true,
            bike: false,
            com_bus: true
        },
        datetarg: "depart_by",
        datepick: new Date
    };

    $scope.updateTripPlannerTime = function() {

        $timeout(function() {

            if (!$scope.top_scope.trip_date_changed.value) {

                $scope.trip_opts.datepick = new Date;

                $scope.updateTripPlannerTime();

            }

        }, 120000);

    };

    $scope.updateTripPlannerTime();

    $scope.setPlannerLocationSpinner = function(new_state) {
        $scope.setLocationSpinnerAnimation(
            "trip_planner", new_state
        );
    };

    $scope.displayPlannerLocationData = function(location) {
        var lat = location.LatLng.Latitude;
        var lng = location.LatLng.Longitude;

        $scope.trip_inputs.start = lat + "," + lng;
    };

    $scope.getLocationAndAddToPlannerStart = function() {
        $scope.getCurrentLocationAndDisplayData(
            $scope.setPlannerLocationSpinner,
            $scope.displayPlannerLocationData
        );
    };

    $scope.planner_error_alert_dialog_hide_in_progress = false;

    $scope.TRIP_PLANNER_ERROR_TEXT_NO_PLAN_FOUND =
    "No trip plan found.";

    $scope.TRIP_PLANNER_ERROR_DEPART_TIME_PASSED =
    "Please try setting a later departure time.";

    $scope.TRIP_PLANNER_ERROR_NO_DATA_ERROR_MESSAGE =
    "There was a problem retrieving your trip plan. Please try again later.";

    $scope.selectTripPlannerErrorMessage = function (error_field) {

        var geocoder_error_dialog_text = "";

        if (!error_field) {

            geocoder_error_dialog_text =
            $scope.TRIP_PLANNER_ERROR_NO_DATA_ERROR_MESSAGE;

            console.log(
                "Trip planner error: problem communicating with server."
            );

        }

        else if (error_field === "plan_start_late") {

            geocoder_error_dialog_text =
            $scope.TRIP_PLANNER_ERROR_DEPART_TIME_PASSED;

            console.log(
                "Trip planner error: plan start time already passed"
            );

        }

        else if (error_field.idField) {

            geocoder_error_dialog_text =
            $scope.TRIP_PLANNER_ERROR_NO_DATA_ERROR_MESSAGE;

            console.log(
                "Trip planner error: problem communicating with server."
            );

        }

        return geocoder_error_dialog_text;

    };

    $scope.alertUserToTripPlannerErrors = function(error_field) {
        $scope.top_scope.show_trip_planner_itinerary_selector = false;
        $scope.top_scope.show_schedule_map_loading_modal = false;
        myride.dom_q.inputs.trip[0].focus();

        var dialog_styles = $scope.top_scope.planner_dialog_styles;

        if ($scope.planner_error_alert_dialog_hide_in_progress ||
            dialog_styles["trip-planner-dialog-faded-in"]) {
            return false;
        }

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

        $scope.geocoder_error_dialog_text =
        $scope.selectTripPlannerErrorMessage(error_field);

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
                myride.dom_q.inputs.trip[0].focus();
                break;
            case "finish":
                dialog_styles["trip-planner-dialog-start"] = false;
                dialog_styles["trip-planner-dialog-finish"] = true;
                myride.dom_q.inputs.trip[1].focus();
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

            all_itineraries[i].legsField[0].styles =
            "trip-planner-itinerary-step-highlighted";

            for (var j=1;j<all_itineraries[i].legsField.length;j++) {
                all_itineraries[i].legsField[j].styles = "";
            }

        }

        return all_itineraries;
    };

    window.myride.dom_q.inputs.trip =
    document.getElementsByClassName("planner-input");

    $scope.showMapLoading = function() {
        $scope.top_scope.show_schedule_map_loading_modal = true;
        $scope.top_scope.show_trip_planner_options = false;
        $scope.top_scope.show_trip_planner_itinerary_selector = false;

        for (var i=0;i<myride.dom_q.inputs.trip.length;i++) {
            myride.dom_q.inputs.trip[i].blur();
        }
    };

    $scope.handleTripPlanTimePastDepartureTimes = function(res) {

        var itineraries = res.data.planField.itinerariesField;

        var all_itinerary_start_times_valid;

        for (var i=0;i<itineraries.length;i++) {

            itineraries[i].times_valid =
            all_itinerary_start_times_valid =
            $scope.checkValidityOfTripPlanTimes(itineraries[i]);

        }

        return all_itinerary_start_times_valid;

    };

    $scope.checkValidityOfTripPlanTimes = function(cur_itinerary) {

        var cur_time = (new Date).toString().match(/[0-9][0-9]:[0-9][0-9]/)[0];

        var start_time_raw = cur_itinerary.startTimeField;

        var start_time =
        start_time_raw.split("T")[1].match(/[0-9][0-9]:[0-9][0-9]/)[0];

        var cur_time_num = Number(cur_time.replace(/:/,""));
        var start_time_num = Number(start_time.replace(/:/,""));

        var trip_plan_time_is_valid = start_time_num >= cur_time_num;

        return trip_plan_time_is_valid;

    };

    $scope.setTripPlannerStepIconContainerSizeClass =
    function(itinerary_number, current_trip_plan_data) {

        var trip_planner_itinerary_step_container;

        switch (itinerary_number) {

                case 0:

                    trip_planner_itinerary_step_container =
                    $scope.trip_planner_itinerary_step_container_size_0;

                    break;

                case 1:

                    trip_planner_itinerary_step_container =
                    $scope.trip_planner_itinerary_step_container_size_1;

                    break;

                case 2:

                    trip_planner_itinerary_step_container =
                    $scope.trip_planner_itinerary_step_container_size_2;

                    break;


        }

        for (var i=0;i<current_trip_plan_data.length;i++) {

            for (var style in trip_planner_itinerary_step_container) {

                trip_planner_itinerary_step_container[style] = false;

            }

        }

        var leg_count = current_trip_plan_data[itinerary_number].
        legsField.length;

        var trip_planner_step_icon_container_size_class = "";

        if (leg_count <= 6) {

            trip_planner_step_icon_container_size_class =
            "trip-planner-itinerary-step-container-le-6";

        }

        else if (leg_count <= 8) {

            trip_planner_step_icon_container_size_class =
            "trip-planner-itinerary-step-container-le-8";

        }

        //TODO: Add new size classes if needed
        else if (leg_count > 8) {

            trip_planner_step_icon_container_size_class =
            "trip-planner-itinerary-step-container-le-10";

        }

        trip_planner_itinerary_step_container[
            trip_planner_step_icon_container_size_class
        ] = true;

    };

    $scope.getTripPlan = function() {

        $scope.showMapLoading();

        tripPlannerService.getLatLon(
            $scope.top_scope.trip_inputs.start,
            $scope.top_scope.trip_inputs.finish
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

                if (!$scope.handleTripPlanTimePastDepartureTimes(res)) {

                    $scope.alertUserToTripPlannerErrors("plan_start_late");

                    return false;

                }

                if ($scope.top_scope.show_trip_planner_title) {

                    var trip_planner_itineraries_count =
                    res.data.planField.itinerariesField.length;

                    $scope.top_scope.
                    show_trip_planner_itinerary_selector = true;

                    for (var i=0;i<trip_planner_itineraries_count;i++) {

                        $scope.setTripPlannerStepIconContainerSizeClass(
                            i, res.data.planField.itinerariesField
                        );

                    }

                }

                $scope.current_trip_plan_data = $scope.formatRawTripStats(
                    res.data.planField.itinerariesField
                );

                $scope.top_scope.show_trip_planner_itinerary_labels = true;

                $scope.top_scope.show_schedule_map_loading_modal = false;

            });

        //N.B. "catch" mathod is not used with the dot operator due to the fact
        //that the YUI Compressor (which uses the Rhino Engine) reserves this
        //word for try/catch statements

        })["catch"](function() {
            console.log("There was an error retrieving the trip plan data.");

            $scope.top_scope.show_schedule_map_loading_modal = false;
        });

    };

    $scope.displayTripPlan = function(selection) {

        googleMapUtilities.displayTripPath(
            $scope.routes,
            $scope.current_trip_plan_data[selection].legsField
        );

        $scope.top_scope.show_trip_planner_itinerary_selector = false;

        $scope.goToFirstStep("planner");

        var cur_trip_data =
        $scope.top_scope.current_trip_plan_data_selection =
        $scope.current_trip_plan_data[selection];

        $scope.top_scope.current_trip_plan_summary = {

            first_LatLng: {

                lat: cur_trip_data.legsField[0].stepsField[0].latField,
                lng: cur_trip_data.legsField[0].stepsField[0].lonField

            },

            zoom: myride.dom_q.map.inst.getZoom()

        };

        $scope.top_scope.show_trip_planner_step_navigation_bar = true;

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

        if (!$scope.show_map_overlay_module) {
            $scope.toggleMapSchedule(true);
        }

        $scope.top_scope.show_trip_planner_title = true;
        $scope.top_scope.show_schedule_result_top_bar = false;

        //Do not toggle map the subsequent times this function is called
        //until function is re-defined yet again (when map is closed)
        $scope.submitTrip =
        $scope.submitTripPlannerQueryWithoutNewMap;

    };

    $scope.submitTripPlannerQueryWithoutNewMap = function() {

        if (!$scope.tripPlannerInputsEmpty()) { return true; }

        $scope.getTripPlan();

    };

    //The first time the trip form is submitted, the map is shown (see above)
    $scope.submitTrip = $scope.submitTripPlannerQueryAndShowMap;

    $scope.top_scope.closeMapAndResetTripPlanner = function() {

        googleMapUtilities.createDummyInfoWindow("trip_points");

        $scope.toggleMapSchedule(true);

        $scope.top_scope.show_trip_planner_title = false;

        $scope.submitTrip = $scope.submitTripPlannerQueryAndShowMap;

    };

    $scope.top_scope.closeMapAndResetScheduleMap = function() {

        googleMapUtilities.createDummyInfoWindow("points");

        $scope.toggleMapSchedule();

        $scope.top_scope.show_schedule_result_top_bar = false;

        $scope.top_scope.show_trip_planner_title = false;

        $scope.submitTrip = $scope.submitTripPlannerQueryAndShowMap;

    };

}]);