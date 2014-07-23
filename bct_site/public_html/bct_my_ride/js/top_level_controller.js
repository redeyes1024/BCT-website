var BCTAppTopController = angular.module('BCTAppTopController', []);

BCTAppTopController.controller('BCTController', ['$scope',
    '$timeout', 'scheduleWebSocket', 'scheduleSocketService',
    'scheduleDownloadAndTransformation', 'googleMapUtilities', '$q',
    '$interval', 'unitConversionAndDataReporting', 'miniScheduleService',
    'placeholderService', 'locationService', 'location_icons',
    'agency_filter_icons',
    function ($scope, $timeout, scheduleWebSocket, scheduleSocketService,
    scheduleDownloadAndTransformation, googleMapUtilities, $q, $interval,
    unitConversionAndDataReporting, miniScheduleService, placeholderService,
    locationService, location_icons, agency_filter_icons) {

    //For ease of debugging
    window.main_scope = $scope;

    $scope.top_scope = $scope;

    /* START CSS class expressions to be used to ng-class, with defaults */

    /* 
        N.B.: Using the ng-class directive, the positioning of map-related DOM 
        elements is altered significantly, in order for only one map only to be
        loaded throughout the life of the app.
    */

    $scope.body_styles = {
        "hide-scroll": false
    };

    $scope.schedule_map_styles = {
        "hide-scroll": true,
        "schedule-map-planner-inserted": false
    };

    $scope.trip_planner_styles = {
        "trip-planner-module-active": false
    };

    $scope.planner_prefs_styles = {
        "planner-pref-pushed": false
    };

    $scope.planner_dialog_styles = {
        "trip-planner-dialog-start": false,
        "trip-planner-dialog-finish": false,
        "trip-planner-dialog-centered": false,
        "trip-planner-dialog-faded-in": false,
        "trip-planner-dialog-faded-out": true
    };

    $scope.itinerary_selector_styles = {
        "trip-planner-itinerary-selector-pushed": false
    };

    $scope.itinerary_selector_panel_styles = {
        "trip-planner-itinerary-panel-smaller": false
    };

    $scope.itinerary_selector_modal_styles = {
        "trip-planner-itinerary-selector-modal-smaller": false
    };

    $scope.main_module_styles = {
        "page-planner-inserted": false
    };

    /* END CSS class expressions to be used to ng-class, with defaults */

    /* START Overlay Display Controls */

    $scope.show_empty_result_message_search_too_short = true;
    $scope.show_empty_result_message_no_results = true;
    $scope.show_schedule_results_result_panels = false;

    $scope.show_index_nearest_stops_panels = false;

    $scope.show_map_overlay_module = false;
    $scope.show_schedule_map_loading_modal = false;

    $scope.show_schedule_result_top_bar = true;
    $scope.show_schedule_result_top_info_bar = true;
    $scope.show_schedule_result_top_alert_bar = true;

    $scope.show_full_schedule_module = false;

    $scope.show_index_title_normal = true;
    $scope.show_index_title_with_back_function = false;

    $scope.show_trip_planner_title = false;
    $scope.show_trip_planner_options = false;

    $scope.show_geocoder_error_dialog = false;

    $scope.show_trip_planner_itinerary_selector = false;
    $scope.show_trip_planner_itinerary_labels = false;

    $scope.show_schedule_results_module_title_normal = true;
    $scope.show_schedule_results_module_title_with_back_function = false;

    $scope.show_schedule_result_date_pick_row_loading = false;

    (function() {
        for (icon in location_icons) {
            $scope[location_icons[icon].regular_icon] = true;
            $scope[location_icons[icon].spinning_icon] = false;
        }
    }());

    /* END Overlay Display Controls */

    /* START Custom Watchers */

    //Display correct hint text when no route/stop results are available
    //Works with the freshly created/destroyed panelTracker directives
    //Here the schedule_result_panels_counter reflects the value from the
    //last $digest
    $scope.$watch("query_data.schedule_search", function(new_val, old_val) {
        if (new_val !== old_val) {
            if ($scope.query_data.schedule_search.length < 3) {
                $scope.show_empty_result_message_search_too_short = true;
                $scope.show_empty_result_message_no_results = false;
                $scope.show_schedule_results_result_panels = false;
            }
            else {
                $scope.show_empty_result_message_search_too_short = false;

                if ($scope.top_scope.schedule_result_panels_counter === 0) {
                    $scope.top_scope.show_empty_result_message_no_results = true;
                    $scope.top_scope.show_schedule_results_result_panels = false;
                }
                else if ($scope.top_scope.schedule_result_panels_counter > 0) {
                    $scope.top_scope.show_empty_result_message_no_results = false;
                    $scope.top_scope.show_schedule_results_result_panels = true;
                }
            }
        }
    });

    $scope.$watch("show_schedule_result_top_bar", function(new_val, old_val) {
        //If top bar is being closed
        if (new_val < old_val) {
            $interval.cancel($scope.schedule_update_interval);
        }
    });

    $scope.full_schedule_loading_placeholder =
        placeholderService.createLoadingPlaceholder(20, " ");

    angular.element(document).ready(function() {
        $scope.$watch("full_schedule_date", function(new_val, old_val) {
            if (new_val !== old_val) {
                $scope.schedule.date_pick = $scope.full_schedule_loading_placeholder;
                $scope.show_schedule_result_date_pick_row_loading = true;

                scheduleDownloadAndTransformation.downloadSchedule(
                    $scope.map_schedule_info.route,
                    $scope.map_schedule_info.stop,
                    $scope.full_schedule_date).
                then(function(res) {
                    $scope.show_schedule_result_date_pick_row_loading = false;
                    var t_schedule = scheduleDownloadAndTransformation.
                    transformSchedule("datepick", res.data.Today);
                    $scope.schedule.date_pick = t_schedule.date_pick;
                });
            }
        });
    });

    //Itinerary selector's initial appearance and hiding associated with planner
    $scope.$watch("show_trip_planner_title", function(new_val, old_val) {
        if (new_val < old_val) {
            $scope.show_trip_planner_itinerary_selector = false;
        }
    });

    //Trip planner option menu pushes and compresses itinerary selector
    $scope.$watch("show_trip_planner_options", function(new_val, old_val) {
        if (new_val > old_val) {
            $scope.itinerary_selector_modal_styles["trip-planner-itinerary-selector-modal-smaller"] = true;
            $scope.itinerary_selector_styles["trip-planner-itinerary-selector-pushed"] = true;
            $scope.itinerary_selector_panel_styles["trip-planner-itinerary-panel-smaller"] = true;
        }
        else if (new_val < old_val) {
            $scope.itinerary_selector_modal_styles["trip-planner-itinerary-selector-modal-smaller"] = false;
            $scope.itinerary_selector_styles["trip-planner-itinerary-selector-pushed"] = false;
            $scope.itinerary_selector_panel_styles["trip-planner-itinerary-panel-smaller"] = false;
        }
    });

    $scope.$watch("trip_planner_styles['trip-planner-module-active']",
    function(new_val, old_val) {
        //If trip planner is activating
        if (new_val > old_val) {
            $scope.
            schedule_map_styles["schedule-map-planner-inserted"] = true;
        }
        //If trip planner is deactivating
        else if (new_val < old_val) {
            $scope.
            schedule_map_styles["schedule-map-planner-inserted"] = false;
        }
    });

    /* END Custom Watchers */

    /* START Data Object Templates */

    $scope.cur_center = {};

    $scope.alerts = [
      "Bus route will change to include Data Ave. starting in January"
    ];

    $scope.query_data = {
        schedule_search: ""
    };

    $scope.map_schedule_info = {
        route: "",
        stop: ""
    };

    $scope.schedule = {
        nearest: {},
        planned: {
            weekdays: [],
            saturday: [],
            sunday: []
        },
        date_pick: []
    };

    $scope.all_days = [
        "Weekdays",
        "Saturday",
        "Sunday"
    ];

    $scope.routeFilter = { f: "" };
    $scope.bstopFilter = { f: "" };

    $scope.full_schedule_date = new Date;

    //Defaults are for demonstration purposes only
    $scope.trip_inputs = {
        start: "14791 Miramar Pkwy",
        finish: "12400 Pembroke Rd"
    };

    /* END Data Object Templates */

    $scope.getIconPath = unitConversionAndDataReporting.getIconPath;
    $scope.getAltOrTitleText = unitConversionAndDataReporting.getAltOrTitleText;

    $scope.setLocationSpinnerAnimation = function(context, new_state) {
        switch (new_state) {
            case "active":
                $scope[location_icons[context].spinning_icon] = true;
                $scope[location_icons[context].regular_icon] = false;
                break;
            case "inactive":
                $scope[location_icons[context].spinning_icon] = false;
                $scope[location_icons[context].regular_icon]= true;
                break;
        }
    };

    $scope.schedule_result_panels_counter = 0;

    $scope.addRouteStopToTripPlanner = function(route, stop) {
        var bstop_coords = $scope.stops[stop].LatLng;
        var bstop_coords_str = "";

        bstop_coords_str += bstop_coords.Latitude + ",";
        bstop_coords_str += bstop_coords.Longitude;

        $scope.trip_inputs.start = bstop_coords_str;
    };

    $scope.schedule.weekdays = $scope.full_schedule_loading_placeholder;
    $scope.schedule.saturday = $scope.full_schedule_loading_placeholder;
    $scope.schedule.sunday = $scope.full_schedule_loading_placeholder;

    $scope.disableMapToggleOnTitles = function() {
        $scope.show_index_title_normal = true;
        $scope.show_schedule_results_module_title_normal = true;

        $scope.show_index_title_with_back_function = false;
        $scope.show_schedule_results_module_title_with_back_function = false;
    };

    $scope.enableMapToggleOnTitles = function() {
        $scope.show_index_title_normal = false;
        $scope.show_schedule_results_module_title_normal = false;

        $scope.show_index_title_with_back_function = true;
        $scope.show_schedule_results_module_title_with_back_function = true;
    };

    $scope.clearSearch = function(model) {
        $scope.query_data[model] = "";
    };

    $scope.mini_schedule_loading_template = miniScheduleService.
        makeMiniScheduleLoadingTemplate();

    $scope.schedule.nearest.times_and_diffs = $scope.mini_schedule_loading_template;

    $scope.updateAndPushSchedule = function (transformed_schedule) {
        reprocessed_schedule = scheduleDownloadAndTransformation.
        transformSchedule("nearest", transformed_schedule.raw);

        $scope.schedule.nearest = reprocessed_schedule.nearest;

        var nearest_full = {
            times_and_diffs: []
        };
        var nearest_times = reprocessed_schedule.nearest.all;
        var diffs = scheduleDownloadAndTransformation.
        calculateTimeDifference(nearest_times);
        var diff_msgs = unitConversionAndDataReporting.
        addTimeDiffMessages(diffs);

        for (var i=0;i<nearest_times.length;i++) {
            var time_and_diff = {
                time: nearest_times[i],
                diff: diff_msgs[i]
            };
            nearest_full.times_and_diffs.push(time_and_diff);
        }

        $scope.schedule.nearest.times_and_diffs = nearest_full.times_and_diffs;

        $scope.schedule_update_interval = $timeout(function() {
            $scope.updateAndPushSchedule(reprocessed_schedule);
        }, 20000);
    };

    $scope.toggleMapSchedule = function(from_trip_planner, route, stop) {

        /* Closing the map module */

        if ($scope.show_map_overlay_module) {

            $scope.disableMapToggleOnTitles();

            if (from_trip_planner) {
                //Wait for trip planner's slide animation (1 second in CSS)
                $timeout(function() {
                    $scope.map_schedule_toggle = false;
                    $scope.trip_inputs.start = "";
                    $scope.trip_inputs.finish = "";
                }, 1000);
            }
            else {
                $scope.show_map_overlay_module = false;
                $scope.show_full_schedule_module = false;
            }

            $scope.body_styles["hide-scroll"] = false;
            $scope.trip_planner_styles["trip-planner-module-active"] = false;
        }

        /* Opening the map module */

        else {
            $scope.show_map_overlay_module =  true;
            $scope.body_styles["hide-scroll"] = true;

            $scope.enableMapToggleOnTitles();

            if (!from_trip_planner) {
                $scope.schedule.nearest.times_and_diffs =
                    $scope.mini_schedule_loading_template;

                scheduleDownloadAndTransformation.downloadSchedule(route, stop).
                then(function(res) {
                    if (!res.data.Today) {
                        console.log("Schedule loading error.")
                        return false;
                    }

                    var t_schedule = scheduleDownloadAndTransformation.
                    transformSchedule("nearest", res.data.Today);

                    $scope.updateAndPushSchedule(t_schedule);
                });

                $scope.map_schedule_info.route = route;
                $scope.map_schedule_info.stop = stop;
                $scope.cur_center = $scope.stops[stop].LatLng;

                googleMapUtilities.clearMap();
                googleMapUtilities.setMapPosition($scope.cur_center);
                googleMapUtilities.displayRoute(route, $scope.routes);
                googleMapUtilities.displayStops(route, $scope.routes, $scope.stops);

                $scope.show_schedule_result_top_bar = true;
                $scope.show_schedule_result_top_info_bar = true;
                $scope.show_schedule_result_top_alert_bar = true;
                $scope.show_trip_planner_title = false;
            }
            else {
                googleMapUtilities.setMapPosition(null, 10);

                $scope.show_schedule_result_top_bar = false;
                $scope.show_trip_planner_title = true;
            }
        }

    };

    $scope.resetCenter = function() {
        myride.dom_q.map.inst.setZoom(18);
        myride.dom_q.map.inst.setCenter($scope.cur_center);
    };

    $scope.hideMiniScheduleAndAlertBars = function() {
        $scope.show_schedule_result_top_info_bar = false;
        $scope.show_schedule_result_top_alert_bar = false;
    };

    $scope.showMiniScheduleAndAlertBars = function() {
        $scope.show_schedule_result_top_info_bar = true;
        $scope.show_schedule_result_top_alert_bar = true;
    };

    $scope.toggleFullSchedule = function() {

        /* Closing full schedule overlay */

        if ($scope.show_full_schedule_module) {
            $scope.show_full_schedule_module = false;
            $scope.schedule_map_styles["hide-scroll"] = false;
            googleMapUtilities.touchMap();

            $scope.showMiniScheduleAndAlertBars();
        }

        /* Opening full schedule module */

        else {
            $scope.full_schedule_date = new Date;
            $scope.show_full_schedule_module = true;
            $scope.schedule_map_styles["hide-scroll"] = true;

            $scope.hideMiniScheduleAndAlertBars();
        }

    };

    $scope.clearFilters = function() {
        $scope.bstopFilter.f = "";
        $scope.routeFilter.f = "";
    };

    $scope.getCurrentLocationAndDisplayData = locationService.
    getCurrentLocationAndDisplayData;

    $scope.foldOptions = function(event) {
        var c_buttons = document.getElementsByClassName("collapse-button");

        var targ_cl = event.target.children[0].children[0].classList;
        var list = event.target.parentNode.children[1].classList.contains("in");

        for (var i=0;i<c_buttons.length;i++) {
            c_buttons[i].children[0].classList.remove("fa-minus-circle");
            c_buttons[i].children[0].classList.add("fa-plus-circle");
        }
        if (list) {
            targ_cl.remove("fa-plus-circle");
            targ_cl.add("fa-minus-circle");
        }
        else {
            targ_cl.remove("fa-minus-circle");
            targ_cl.add("fa-plus-circle");
        }
        $scope.clearFilters();
    };

    function splitRouteDirections() {
        var directions = cur_route.DirectionHeadSign;
        var dir_name = "";

        for (var d_i=0;d_i<directions.length;d_i++) {
            var cur_dir = directions[d_i];
            var dir_abbr = cur_dir[cur_dir.length-1];

            switch (dir_abbr) {
                case "N":
                    dir_name = "North";
                    break;
                case "S":
                    dir_name = "South";
                    break;
                case "E":
                    dir_name = "East";
                    break;
                case "W":
                    dir_name = "West";
                    break;
                case "O":
                    dir_name = "West";
                    break;
            }
            var full_id = cur_route.RouteId + dir_name;
            var new_route = routes[full_id] = JSON.parse(JSON.stringify(cur_route));
            new_route.Direction = dir_name;
            new_route.full_id = full_id;
        }
    }

    function transformRoutes() {
        var routes = $scope.routes = {};

        for (var r_i=0;r_i<$scope.route_data.length;r_i++) {
            var cur_route = $scope.route_data[r_i];
            var full_route_id = cur_route.Id;

            routes[full_route_id] = cur_route;
        }
    }

    function transformStops() {
        var bstops = $scope.stops = {};

        for (var s_i=0;s_i<$scope.bstop_data.length;s_i++) {
            var cur_bstop = $scope.bstop_data[s_i];
            var full_stop_id = cur_bstop.Id;

            bstops[full_stop_id] = cur_bstop;
        }
    }

    //N.B. "catch" mathod is not used with the dot operator due to
    //YUI Compressor (Rhino Engine) reserving the word for try/catch statement

    var fullDataDownloadPromise= $q.all([
        scheduleDownloadAndTransformation.downloadRouteInfo().
        then(function(res) {
            $scope.route_data = res.data;
            transformRoutes();
        })["catch"](function() {
            console.log("There was an error retrieving the transit data.");
        }),
        scheduleDownloadAndTransformation.downloadStopInfo().
        then(function(res) {
            $scope.bstop_data= res.data;
            transformStops();
        })["catch"](function() {
            console.log("There was an error retrieving the transit data.");
        })
    ]);

    var route_props = ["Id", "LName"];
    var bstop_props = ["Id", "Name"];

    //Creates a partial link between the routes and stops data objects
    //in the form of a numerically indexed array
    fullDataDownloadPromise.then(function() {
        var all_stops = $scope.stops;
        var all_routes = $scope.routes;
        var all_stops_arr = [];
        var all_routes_arr = [];

        for (var route in all_routes) {
            all_routes[route].bstop_refs = [];
            var bstops = all_routes[route].Stops;
            for (var bstop in bstops) {
                var s_res = {};
                for (var i=0;i<bstop_props.length;i++) {
                    s_res[bstop_props[i]] = all_stops[bstops[bstop]][bstop_props[i]];
                }
                all_routes[route].bstop_refs.push(s_res);
            }
            all_routes_arr.push(all_routes[route]);
        }
        for (var bstop in all_stops) {
            all_stops[bstop].route_refs = [];
            var routes = all_stops[bstop].Routes;
            for (var route in routes) {
                var r_res = {};
                for (var i=0;i<route_props.length;i++) {
                    r_res[route_props[i]] = all_routes[routes[route]][route_props[i]];
                }
                all_stops[bstop].route_refs.push(r_res);
            }
            all_stops_arr.push(all_stops[bstop]);
        }

        $scope.routes_arr = all_routes_arr;
        $scope.stops_arr = all_stops_arr;
    });

    $scope.swapTripInputs = function() {
        var old_start = $scope.trip_inputs.start.slice();
        var old_finish = $scope.trip_inputs.finish.slice();

        $scope.trip_inputs.start = old_finish;
        $scope.trip_inputs.finish = old_start;
    };

    $scope.clearFilters = function() {
        $scope.bstopFilter.f = "";
        $scope.routeFilter.f = "";
    };

    $scope.agency_filter_icons = agency_filter_icons;

    $scope.enableAgencyFilter = function(agency) {
        var new_class = "";

        if ($scope.agency_filter_icons[agency].selection_class ===
            "agency-filter-icon-selected") {
            new_class = "";
        }
        else {
            new_class = "agency-filter-icon-selected";
        }
        $scope.agency_filter_icons[agency].selection_class = new_class;
    };

}]).
    
config(function($routeProvider) {

    var site_root = window.myride.site_roots.active;

    $routeProvider.when('/routeschedules', {
        templateUrl: site_root + 'partials/route_schedules.html',
        controller: 'routeSchedulesController'
    }).when('/bctappindex', {
        templateUrl: site_root + 'partials/bct_app_index.html',
        controller: 'indexController'
    });

});