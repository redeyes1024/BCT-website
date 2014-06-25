var BCTAppTopController = angular.module('BCTAppTopController', []);

BCTAppTopController.controller('BCTController', ['$scope',
    '$timeout', 'scheduleWebSocket', 'scheduleSocketService',
    'scheduleDownloadService', 'googleMapUtilities', '$q',
    function ($scope, $timeout, scheduleWebSocket, scheduleSocketService,
    scheduleDownloadService, googleMapUtilities, $q) {

    //For ease of debugging
    window.main_scope = $scope;

    $scope.top_scope = $scope;

    $scope.clearSearch = function(model) {
        $scope.query_data[model] = "";
    };

    $scope.cur_center = {};

    /* START Class expressions to be used to ng-class, with defaults */

    $scope.body_styles = {
        "hide-scroll": false
    };
    $scope.schedule_map_styles = {
        "hide-scroll": true,
        "schedule-map-overlay": true,
        "schedule-map-planner": false
    };
//    $scope.schedule_map_canvas_styles = {
//        "schedule-map-canvas-planner": false
//    };
    $scope.trip_planner_styles = {
        "trip-planner-module-active": false
    };
    $scope.planner_prefs_styles = {
        "planner-pref-pushed": false
    };

    /* END Class expressions to be used to ng-class, with defaults */

    /* START Display toggles */

    $scope.schedule_bar_hide = false;
    $scope.trip_back_show = false;

    $scope.map_schedule_toggle = false;

    $scope.alerts = [
      "Bus route will change to include Data Ave. starting in January"
    ];

    $scope.map_schedule_info = {
        route: "",
        stop: ""
    };

    /* END Display Toggles */

    /* START Custom Watchers */

    $scope.query_data = {
        schedule_search: ""
    };
    $scope.show_empty_result_message_search_too_short = true;
    $scope.show_empty_result_message_no_results = false;

    //Display correct hint text when no route/stop results are available
    $scope.$watch("query_data.schedule_search", function(new_val, old_val) {
        if (new_val !== old_val) {
            if ($scope.query_data.schedule_search.length < 3) {
                $scope.show_empty_result_message_search_too_short = true;
                $scope.show_empty_result_message_no_results = false;
            }
            else {
                $scope.show_empty_result_message_search_too_short = false;

                //The app needs to run a $digest first to populate the results
                //of the route/stop filters, hence the use of $evalAsync,
                //to ensure the "no result" hint text only appears if
                //no result panels are present
                $scope.$evalAsync(function() {
                    var first_result_panel = document.getElementsByClassName("panel-default")[0];

                    if (!first_result_panel) {
                        $scope.show_empty_result_message_no_results = true;
                    }
                    else {
                        $scope.show_empty_result_message_no_results = false;
                    }
                });
            }
        }
    });

    $scope.full_schedule_date = new Date;

    angular.element(document).ready(function() {
        $scope.$watch("full_schedule_date", function(new_val, old_val) {
            if (new_val !== old_val) {
                scheduleDownloadService.downloadSchedule(
                    $scope.map_schedule_info.route,
                    $scope.map_schedule_info.stop,
                    $scope.full_schedule_date).
                    then(function(res) {
                        var t_schedule = scheduleDownloadService.transformSchedule("datepick", res.data);
                        $scope.schedule.date_pick = t_schedule.date_pick;
                    });
            }
        });
    });

    /* END Custom Watchers */

    $scope.schedule = {
        nearest: {},
        planned: {
            weekdays: [],
            saturday: [],
            sunday: []
        },
        date_pick: []
    };

    $scope.toggleMapSchedule = function(from_trip_planner, route, stop) {
        if ($scope.map_schedule_toggle) {
            if (from_trip_planner) {
                $timeout(function() {
                    $scope.map_schedule_toggle = false;
                    $scope.trip_inputs.start = "";
                    $scope.trip_inputs.finish = "";
                }, 1000);
            }
            else {
                $scope.map_schedule_toggle = false;
            }
            $scope.body_styles["hide-scroll"] = false;
            $scope.trip_planner_styles["trip-planner-module-active"] = false;
        }
        else {
            $scope.map_schedule_toggle = true;
            $scope.body_styles["hide-scroll"] = true;

            if (!from_trip_planner) {
                $scope.map_schedule_info.route = route;
                $scope.map_schedule_info.stop = stop;

                scheduleDownloadService.downloadSchedule(route, stop).then(function(res) {
                    var t_schedule = scheduleDownloadService.transformSchedule("nearest", res.data);
                    $scope.schedule.nearest = t_schedule.nearest;
                });

                $scope.cur_center = $scope.stops[stop].LatLng;

                googleMapUtilities.clearMap();
                googleMapUtilities.setMapPosition($scope.cur_center);
                googleMapUtilities.displayRoute(route, $scope.routes);
                googleMapUtilities.displayStops(route, $scope.routes, $scope.stops);
            }
            else {
                googleMapUtilities.setMapPosition(undefined, 10);
            }
        }
    };

    $scope.resetCenter = function() {
        isr.dom_q.map.inst.setZoom(18);
        isr.dom_q.map.inst.setCenter($scope.cur_center);
    };

    $scope.schedule_full_toggle = false;

//    $scope.$watch('schedule_full_toggle', function(new_val, old_val) {
//        if (new_val !== old_val) {
//            if (!new_val) {
//                $scope.map_canvas_hide = false;
//            }
//        }
//    });

    $scope.toggleFullSchedule = function() {
        if ($scope.schedule_full_toggle) {
            $scope.schedule_full_toggle = false; 
            $scope.schedule_map_styles["hide-scroll"] = true;
            googleMapUtilities.touchMap();
        }
        else {
            $scope.full_schedule_date = new Date;
            $scope.schedule_full_toggle = true;
            $scope.schedule_map_styles["hide-scroll"] = false;
        }
    };

    $scope.all_days = [
        "Weekdays",
        "Saturday",
        "Sunday"
    ];

    $scope.routeFilter = { f: "" };
    $scope.bstopFilter = { f: "" };

    $scope.clearFilters = function() {
        $scope.bstopFilter.f = "";
        $scope.routeFilter.f = "";
    };

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

    var fullDataDownloadPromise= $q.all([
        scheduleDownloadService.downloadRouteInfo().then(function(res) {
            $scope.route_data = res.data;
            transformRoutes();
        }).
        catch(function() {
            console.log("There was an error retrieving the transit data.");
        }),
        scheduleDownloadService.downloadStopInfo().then(function(res) {
            $scope.bstop_data= res.data;
            transformStops();
        }).
        catch(function() {
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

    //Defaults are for demonstration purposes only
    $scope.trip_inputs = {
        start: "14791 Miramar Pkwy",
        finish: "12400 Pembroke Rd"
    };
    $scope.swapTripInputs = function() {
        var old_start = $scope.trip_inputs.start.slice();
        var old_finish = $scope.trip_inputs.finish.slice();

        $scope.trip_inputs.start = old_finish;
        $scope.trip_inputs.finish = old_start;
    };

    $scope.routeFilter = { f: "" };
    $scope.bstopFilter = { f: "" };

    $scope.clearFilters = function() {
        $scope.bstopFilter.f = "";
        $scope.routeFilter.f = "";
    };
    
    $scope.agency_filter_icon_selection = {
        broward: "",
        miami: "",
        palm: ""
    };

    $scope.enableAgencyFilter = function(agency) {
        var new_class = "";

        if ($scope.agency_filter_icon_selection[agency] === "agency-filter-icon-selected") {
            new_class = "";
        }
        else {
            new_class = "agency-filter-icon-selected";
        }
        switch (agency) {
            case "broward":
                $scope.agency_filter_icon_selection.broward = new_class;
                break;
            case "miami":
                $scope.agency_filter_icon_selection.miami = new_class;
                break;
            case "palm":
                $scope.agency_filter_icon_selection.palm = new_class;
                break;
        }
    };
}]).config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/routeschedules', {
        templateUrl: 'partials/route_schedules.html',
        controller: 'routeSchedulesController'
    }).when('/bctappindex', {
        templateUrl: 'partials/bct_app_index.html',
        controller: 'indexController'
    });
});