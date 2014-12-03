var BCTAppControllers = angular.module('BCTAppControllers', []);

BCTAppControllers.controller('routeSchedulesController', ['$scope', '$timeout',
'$q',

function ($scope, $timeout, $q) {

    //For ease of debugging (development only)
    window.rs_scope = $scope;

    myride.dom_q.inputs.elements.rs_search_input =
    document.getElementById("route-stop-search-input");

    myride.dom_q.inputs.elements.rs_search_input.value =
    $scope.query_data.schedule_search;

    $scope.top_scope.stop_result_panel_top_container_class_name =
    "schedule-results-main-container";

    $scope.$on('$viewContentLoaded', function() {

        $scope.top_scope.route_schedules_module_loaded_deferred.resolve();

        $scope.top_scope.route_schedules_module_loaded_deferred = $q.defer();

    });

    $scope.loaded_results = {
        routes: [],
        stops: []
    };

    $scope.sort_bstops_by_distance = false;

    $scope.sortResultStopsByDistance = function() {

        $scope.top_scope.sort_bstops_by_distance = true;

        $scope.top_scope.filtered_stops_arr = $scope.stopFilterFunc(
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
'nearestStopsService', 'recently_viewed_items',
function ($scope, $timeout, nearestStopsService, recently_viewed_items) {

    //For ease of debugging (development only)
    window.index_scope = $scope;

    myride.dom_q.inputs.elements.index_search_input =
    document.getElementById("route-stop-search-index-input");

    $scope.nearest_bstops = $scope.nearest_bstops_loading;

    $scope.top_scope.stop_result_panel_top_container_class_name  =
    "index-main-container";

    $scope.calculateAndShowNearestBusStops = function(location) {

        $scope.nearest_bstops = nearestStopsService.findNearestStops(location);

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

    $scope.top_scope.recently_viewed_items = recently_viewed_items;

}]);

BCTAppControllers.controller('tripPlannerController', ['$scope',
'googleMapsUtilities', '$timeout', 'tripPlannerService', 'warning_messages',
'recentlyViewedService', 'locationService', 'timer_constants',

function ($scope, googleMapsUtilities, $timeout, tripPlannerService,
warning_messages, recentlyViewedService, locationService, timer_constants) {

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

        }, timer_constants.trip_planner.update_request_time);

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

    $scope.selectTripPlannerErrorMessage = function (error_field) {

        var trip_planner_error_dialog_text = "";

        if (!error_field || error_field.idField) {

            trip_planner_error_dialog_text =
            warning_messages.trip_planner.no_error_data;

            console.log(
                "Trip planner error: problem communicating with server."
            );

        }

        else if (error_field === "plan_start_late") {

            trip_planner_error_dialog_text =
            warning_messages.trip_planner.departure_time_passed;

            console.log(
                "Trip planner error: plan start time already passed"
            );

        }

        else if (error_field === "all_trips_filtered_out") {

            trip_planner_error_dialog_text =
            warning_messages.trip_planner.all_trips_filtered_out;

            console.log(
                "Trip planner error: no practical trips found."
            );

        }

        return trip_planner_error_dialog_text;

    };

    $scope.alertUserToTripPlannerErrors = function(error_field) {

        $scope.top_scope.show_trip_planner_itinerary_selector = false;
        $scope.top_scope.show_schedule_map_loading_modal = false;
        myride.dom_q.inputs.trip[0].focus();

        var dialog_styles = $scope.top_scope.planner_dialog_styles;

        if ($scope.planner_error_alert_dialog_hide_in_progress ||
            dialog_styles["error-dialog-faded-in"]) {
            return false;
        }

        dialog_styles["error-dialog-centered"] = true;
        dialog_styles["trip-planner-dialog-centered"] = true;

        dialog_styles["trip-planner-dialog-finish"] = false;
        dialog_styles["trip-planner-dialog-start"] = false;

        $scope.top_scope.show_geocoder_error_dialog = true;

        $timeout(function() {

            dialog_styles["error-dialog-faded-out"] = false;
            dialog_styles["error-dialog-faded-in"] = true;

        }, timer_constants.error_dialog_delays.geocoder.fade_gap);

        $scope.geocoder_error_dialog_timeout = $timeout(function() {

            dialog_styles["error-dialog-faded-in"] = false;
            dialog_styles["error-dialog-faded-out"] = true;

            $scope.planner_error_alert_dialog_hide_in_progress = true;

            $timeout(function() {

                $scope.top_scope.show_geocoder_error_dialog = false;
                $scope.planner_error_alert_dialog_hide_in_progress = false;

            }, timer_constants.error_dialog_delays.geocoder.full_hide);

        }, timer_constants.error_dialog_delays.geocoder.main);

        $scope.geocoder_error_dialog_text =
        $scope.selectTripPlannerErrorMessage(error_field);

    };

    $scope.displayFromAndToFieldGeocoderErrors = function(input_field_name) {

        var dialog_styles = $scope.top_scope.planner_dialog_styles;

        dialog_styles["error-dialog-centered"] = false;
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

    };

    $scope.alertUserToGeocoderErrors = function(
        input_field_name, error_status
    ) {

        $scope.top_scope.show_trip_planner_itinerary_selector = false;
        $scope.top_scope.show_schedule_map_loading_modal = false;

        var dialog_styles = $scope.top_scope.planner_dialog_styles;

        switch (error_status) {

            case "ZERO_RESULTS":

                $scope.geocoder_error_dialog_text =
                warning_messages.geocoder.not_found;

                $scope.displayFromAndToFieldGeocoderErrors(input_field_name);

                break;

            case "out_of_bounds":

                $scope.geocoder_error_dialog_text =
                warning_messages.geocoder.out_of_bounds;

                $scope.displayFromAndToFieldGeocoderErrors(input_field_name);

                break;

            case "OVER_QUERY_LIMIT":

                $scope.geocoder_error_dialog_text =
                warning_messages.geocoder.over_request_limit;

                dialog_styles["error-dialog-centered"] = true;

                dialog_styles["trip-planner-dialog-finish"] = false;
                dialog_styles["trip-planner-dialog-start"] = false;

                break;

        }

        $scope.top_scope.show_geocoder_error_dialog = true;

        $timeout(function() {

            dialog_styles["error-dialog-faded-out"] = false;
            dialog_styles["error-dialog-faded-in"] = true;

        }, timer_constants.error_dialog_delays.geocoder.fade_gap);

        $timeout.cancel($scope.geocoder_error_dialog_timeout);

        $scope.geocoder_error_dialog_timeout = $timeout(function() {

            dialog_styles["error-dialog-faded-in"] = false;
            dialog_styles["error-dialog-faded-out"] = true;

            $timeout(function() {

                $scope.top_scope.show_geocoder_error_dialog = false;

            }, timer_constants.error_dialog_delays.geocoder.full_hide);

        }, timer_constants.error_dialog_delays.geocoder.main);

    };

    $scope.checkForGeocoderErrors = function(geocoder_output) {

        if (typeof(geocoder_output[0]) === "string") {

            $scope.alertUserToGeocoderErrors("start", geocoder_output[0]);

            return false;

        }

        if (typeof(geocoder_output[1]) === "string") {

            $scope.alertUserToGeocoderErrors("finish", geocoder_output[1]);

            return false;

        }

        var test_coords = {};

        var input_field_labels = ["start", "stop"];

        for (var i=0;i<geocoder_output.length;i++) {

            var test_lat = geocoder_output[i].Latitude ||
            geocoder_output[i][0].geometry.location.lat();

            var test_lng = geocoder_output[i].Longitude ||
            geocoder_output[i][0].geometry.location.lng();

            test_coords.LatLng = { Latitude: test_lat, Longitude: test_lng };

            if (!locationService.checkIfLocationWithinBounds(test_coords)) {

                $scope.alertUserToGeocoderErrors(
                    input_field_labels[i], "out_of_bounds"
                );

                return false;

            }

        }

        return true;

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

        var valid_itineraries_counter = 0;

        for (var i=0;i<itineraries.length;i++) {

            var itinerary_is_valid = true;

            itinerary_is_valid =
            itineraries[i].times_valid =
            $scope.checkValidityOfTripPlanTimes(itineraries[i]);

            valid_itineraries_counter += itinerary_is_valid;

        }

        var at_least_one_itinerary_time_is_valid = true;

        if (valid_itineraries_counter < 1) {
            at_least_one_itinerary_time_is_valid = false;
        }

        return at_least_one_itinerary_time_is_valid;

    };

    $scope.checkValidityOfTripPlanTimes = function(cur_itinerary) {

        var cur_date = new Date;
        var cur_day = Number(cur_date.toDateString().slice(8,10));
        var cur_time = cur_date.toTimeString().slice(0,5);

        var start_date = cur_itinerary.startTimeField;
        var start_day = Number(start_date.slice(8,10));

        var start_time =
        start_date.split("T")[1].match(/[0-9][0-9]:[0-9][0-9]/)[0];

        var trip_plan_time_is_valid = false;

        if (start_day > cur_day) {

            trip_plan_time_is_valid = true;

            cur_itinerary.start_date = start_date.slice(0,10);

        }

        else {

            var cur_time_num = Number(cur_time.replace(/:/,""));
            var start_time_num = Number(start_time.replace(/:/,""));

            trip_plan_time_is_valid = start_time_num >= cur_time_num;

        }

        var end_date = cur_itinerary.endTimeField;
        var end_day = Number(end_date.slice(8,10));

        if (end_day > cur_day) {

            cur_itinerary.end_date = end_date.slice(0,10);

        }

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
        ).
        then(function(all_coords) {

            if (!$scope.checkForGeocoderErrors(all_coords)) { return false; }

            var start_coords = all_coords[0];
            var finish_coords = all_coords[1];

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

                recentlyViewedService.saveRecentlyViewedItem("trip_planner", {
                    start: $scope.top_scope.trip_inputs.start,
                    finish: $scope.top_scope.trip_inputs.finish
                });

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

                $scope.top_scope.current_trip_plan_data =
                tripPlannerService.formatRawTripStats(
                    res.data.planField.itinerariesField
                );

                $scope.top_scope.current_trip_plan_data =
                tripPlannerService.filterTripItineraries(
                    $scope.top_scope.current_trip_plan_data
                );

                if ($scope.top_scope.current_trip_plan_data.length === 0) {

                    $scope.alertUserToTripPlannerErrors(
                        "all_trips_filtered_out"
                    );

                    return true;

                }

                tripPlannerService.addAlternateRouteIds(
                    $scope.top_scope.current_trip_plan_data
                );

                $scope.top_scope.show_trip_planner_itinerary_labels = true;

                $scope.top_scope.show_schedule_map_loading_modal = false;

                //N.B. "catch" method is not used with the dot operator due
                //to the fact that the YUI Compressor (which uses the Rhino
                //Engine) reserves this word for try/catch statements

            })["catch"](function() {

                console.log(
                    "There was an error retrieving the trip plan data."
                );

                $scope.alertUserToTripPlannerErrors();

                $scope.top_scope.show_schedule_map_loading_modal = false;

            });

        })["catch"](function() {

            console.log(
                "There was an error retrieving trip planner coordinate data. " +
                "Consult additional console output for Geocoder error messages."
            );

            $scope.top_scope.show_schedule_map_loading_modal = false;

        });

    };

    $scope.displayTripPlan = function(selection) {

        googleMapsUtilities.displayTripPath(
            $scope.current_trip_plan_data[selection].legsField
        );

        $scope.top_scope.show_trip_planner_itinerary_selector = false;

        $scope.goToFirstStep("planner");

        var cur_trip_data =
        $scope.top_scope.current_trip_plan_data_selection =
        $scope.current_trip_plan_data[selection];

        $scope.top_scope.current_trip_plan_summary = {

            first_LatLng: {

                lat: cur_trip_data.legsField[0].fromField.latField,
                lng: cur_trip_data.legsField[0].fromField.lonField

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

    $scope.submitTripPlannerQuery = function() {

        if ( !$scope.tripPlannerInputsEmpty() ) { return true; }

        if (!$scope.trip_planner_is_open) {

            $scope.top_scope.openTripPlannerMap();

        }

        googleMapsUtilities.clearMap();

        $scope.getTripPlan();

        $scope.top_scope.show_trip_planner_title = true;

        $scope.top_scope.show_schedule_result_top_bar = false;

        $scope.top_scope.show_nearest_map_stops_info_container = false;

    };

}]);

BCTAppControllers.controller('nearestMapStopsController', ['$scope',
'$timeout', 'googleMapsUtilities', 'selected_nearest_map_stop',
'nearestMapStopsService', 'nearest_map_stop_distances',
'nearest_map_stops_instructions',

function ($scope, $timeout, googleMapsUtilities, selected_nearest_map_stop,
nearestMapStopsService, nearest_map_stop_distances,
nearest_map_stops_instructions) {

    //For ease of debugging (development only)
    window.nms_scope = $scope;

    googleMapsUtilities.clearMap();

    $scope.top_scope.show_schedule_result_top_bar = false;

    $scope.top_scope.show_schedule_map_stop_navigation_bar = false;

    $scope.toggleMapSchedule("nearest");

    $scope.top_scope.show_trip_planner_title = false;

    $scope.top_scope.show_nearest_map_stops_info_container = true;

    $scope.top_scope.nearest_map_stops_instructions =
    nearest_map_stops_instructions;

    nearest_map_stops_instructions.selected =
    nearest_map_stops_instructions.default;

    $scope.top_scope.nearestMapDragendDisplayStops = function(lat, lng) {

        var coords = {

            LatLng: {
                Latitude: lat,
                Longitude: lng
            }

        };

        var nearest_stops_to_map_point =
        nearestMapStopsService.showNearestStopsFromMapCoords(coords);

        var stop_ids_and_dists = {};

        for (var i=0;i<nearest_stops_to_map_point.length;i++) {

            var cur_stop_id = nearest_stops_to_map_point[i].Id;

            var cur_dist_to_stop =
            nearest_stops_to_map_point[i].distance;

            stop_ids_and_dists[cur_stop_id] = cur_dist_to_stop;

        }

        nearest_map_stop_distances.dists = stop_ids_and_dists;

    };

    var add_drag_pin_dragend_listener;

    var add_drag_pin_click_listener = google.maps.event.addListenerOnce(

        myride.dom_q.map.inst,
        'click',
        function(e) {

            $scope.top_scope.nearestMapDragendDisplayStops(
                e.latLng.lat(), e.latLng.lng()
            );

            nearest_map_stops_instructions.selected =
            nearest_map_stops_instructions.clicked;

            var marker =
            myride.dom_q.map.overlays.nearest_map_draggable.default.marker =
            new google.maps.Marker({
                map: myride.dom_q.map.inst,
                position: e.latLng,
                draggable: true
            });

            add_drag_pin_dragend_listener = google.maps.event.addListener(
                marker,
                'dragend',
                function() {

                    var lat = this.getPosition().lat();
                    var lng = this.getPosition().lng();

                    $scope.top_scope.nearestMapDragendDisplayStops(lat, lng);

                }
            );

        }

    );

    $scope.$on("$destroy", function() {

        if (add_drag_pin_dragend_listener) {

            google.maps.event.removeListener(add_drag_pin_dragend_listener);

        }

        google.maps.event.removeListener(add_drag_pin_click_listener);

    });

}]);