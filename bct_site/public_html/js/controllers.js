var BCTAppControllers = angular.module('BCTAppControllers', []);

BCTAppControllers.controller('BCTController', ['$scope',
    '$timeout', 'scheduleWebSocket', 'scheduleSocketService',
    'scheduleDownloadService', 'googleMapUtilities', '$q',
    function ($scope, $timeout, scheduleWebSocket, scheduleSocketService,
    scheduleDownloadService, googleMapUtilities, $q) {
    window.main_scope = $scope.top_scope = $scope;

    $scope.query_data = {};

    $scope.clearSearch = function(model) {
        $scope.query_data[model] = "";
        $scope.routes = {};
        $scope.stops = {};
    };

    //Class expressions to be used to ng-class, with defaults
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

    //Display toggles
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

    function convertToTime(time_int) {
        var int_arr = String(time_int).split("")
        int_arr.splice(-2,0,":");

        return int_arr.join("");
    }

    window.getNearestTimes = function(time, times, bef, aft) {
        if (!bef) {
            var bef = 1;
            var aft = 3;
        }
        else if (!aft) {
            var aft = 3;
        }
        
        var times_int = times.map(function(a) { return parseInt(a.replace(/:/,"")) })
        var now_int = parseInt(time.replace(/:/,""));
        var nearest = {
            prev_times: [],
            next_times: []
        };

        times_int.push(now_int);
        times_int.sort((function(a,b) { return (a-b); }));

        var int_index = times_int.indexOf(now_int);

        for (var b=0;b<bef;b++) {
            if (!times_int[int_index - (1 + b)]) { break; }
            nearest.prev_times.push(times_int[int_index - (1 + b)]);
        }
        for (var a=0;a<aft;a++) {
            if (!times_int[int_index + (1 + a)]) { break; }
            nearest.next_times.push(times_int[int_index + (1 + a)]);
        }

        nearest.prev_times = nearest.prev_times.map(convertToTime);
        nearest.next_times = nearest.next_times.map(convertToTime);

        return nearest;
    };

    function transformSchedule() {
        var date_time = new Date;
        var now = date_time.toTimeString().slice(0,5);
        var s_data = $scope.schedule_data;
        var s_times = s_data.Today;
        $scope.schedule = {
            departures: []
        };

        for (var i=0;i<s_times.length;i++) {
            $scope.schedule.departures.push(s_times[i].DepartureTime);
        }
        $scope.schedule.nearest = getNearestTimes(now, $scope.schedule.departures);
        $scope.schedule.nearest.all = $scope.schedule.nearest.prev_times.concat($scope.schedule.nearest.next_times);
    }

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
            scheduleDownloadService.downloadSchedule(route, stop).then(function(res) {
                $scope.schedule_data = res.data;
                transformSchedule();
            });
            $scope.map_schedule_info.route = route;
            $scope.map_schedule_info.stop = stop;
            $scope.map_schedule_toggle = true;
            $scope.body_styles["hide-scroll"] = true;

            if (!from_trip_planner) {
                googleMapUtilities.setMapPosition($scope.stops[stop].LatLng);
            }
            else {
                googleMapUtilities.setMapPosition();
            }
        }
    };

    $scope.schedule_full_toggle = false;
    $scope.toggleFullSchedule = function() {
        if ($scope.schedule_full_toggle) {
            $scope.schedule_full_toggle = false; 
            $scope.schedule_map_styles["hide-scroll"] = true;
            googleMapUtilities.touchMap();
        }
        else {
            $scope.schedule_full_toggle = true;
            $scope.schedule_map_styles["hide-scroll"] = false;
        }
    };

    $scope.all_days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    $scope.routeFilter = { f: "" };
    $scope.bstopFilter = { f: "" };

    $scope.clearFilters = function() {
        $scope.bstopFilter.f = "";
        $scope.routeFilter.f = "";
    };

    var c_buttons = document.getElementsByClassName("collapse-button");

    $scope.foldOptions = function(event) {
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

    $scope.trip_inputs = {
        start: "",
        finish: ""
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

BCTAppControllers.controller('routeSchedulesController', ['$scope',
    '$timeout', '$interval', 'scheduleWebSocket', 'scheduleSocketService',
        function ($scope, $timeout, $interval, scheduleWebSocket, scheduleSocketService) {
        window.rs_scope = $scope;

        $scope.drawPath = function() {
            isr.dom_q.map.panTo({ lat: 26.115, lng: -80.41138 });
            isr.dom_q.map.setZoom(13);
            isr.dom_q.pline.setPath(path_coords);
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
    function ($scope, googleMapUtilities, $timeout, tripPlannerService) {
        window.trip_scope = $scope;

        $scope.trip_opts = {
            optimize: "",
            modeswitch: {
                bus: false,
                train: false,
                bike: false
            },
            datetarg: "",
            datepick: new Date
        };

//        googleMapUtilities.resetMap();
//
//        $scope.top_scope.map_schedule_toggle = true;
//        $scope.top_scope.schedule_bar_hide = true;

        //Using the ng-class directive, the flow of these DOM elements is
        //altered significantly in order for the map only to be loaded once.
        //Here, they are set to flow with the Trip Planner module...
        $scope.top_scope.schedule_map_styles["schedule-map-planner"] = true;
        $scope.top_scope.schedule_map_styles["schedule-map-overlay"] = false;
        //$scope.top_scope.schedule_map_canvas_styles["schedule-map-canvas-planner"] = true;

        $scope.$on("$destroy", function(){
            $scope.top_scope.map_schedule_toggle = false;
            $scope.top_scope.schedule_bar_hide = false;

            //...and upon being routed away from the module, the map is taken
            //out of the flow again, in order to return to being an overlay
            $scope.top_scope.schedule_map_styles["schedule-map-planner"] = false;
            $scope.top_scope.schedule_map_styles["schedule-map-overlay"] = true;
            //$scope.top_scope.schedule_map_canvas_styles["schedule-map-canvas-planner"] = false;
        });

        $scope.getTripPlan = function() {
            tripPlannerService.getLatLon(
                $scope.$parent.trip_inputs.start,
                $scope.$parent.trip_inputs.finish
            ).then(function(coords) {
                var start_coords = coords[0].data.results[0].geometry.location;
                var finish_coords = coords[1].data.results[0].geometry.location;

                tripPlannerService.getTripPlanPromise(
                    $scope.trip_opts,
                    start_coords,
                    finish_coords
                ).then(function(res) {
                    googleMapUtilities.displayPath(
                        res.data.planField.itinerariesField[0].legsField
                    );
                    //$scope.route_data= res.data[0].Routes;
                });
            }).
            catch(function() {
                console.log("There was an error retrieving the trip plan data.");
            });
        };

        $scope.show_trip_options = false;
        $scope.toggleTripOptions = function() {
            if ($scope.show_trip_options) {
                $scope.show_trip_options = false;
            }
            else {
                $scope.show_trip_options = true;
            }
        };

        //Check if inputs are empty or contain just spaces; false -> do not submit
        $scope.submitTripCheck = function() {
            if ($scope.trip_inputs.start === "" ||
                $scope.trip_inputs.finish === "" ) {
                return false;
            }
            return true;
        };

        $scope.submitShowMap = function() {
            if (!$scope.submitTripCheck()) return true;
            $scope.getTripPlan();
            //Modify show map, hide map's top bar, and slide in trip planner...
            $scope.$parent.schedule_bar_hide = true;
            $scope.trip_planner_styles["trip-planner-module-active"] = true;
            //...after its slide animation completes (1 second long in CSS)
            if (!$scope.map_schedule_toggle) {
                //$timeout(function() {
                    $scope.toggleMapSchedule(true);
                //}, 1000);
            }
            //Display "back" button and move the preferences button to make room
            $scope.trip_back_show = true;
            $scope.planner_prefs_styles["planner-pref-pushed"] = true;

            //Do not toggle map the subsequent times this function is called
            //until function is re-defined yet again (when map is closed)
            $scope.submitTrip = $scope.submitKeepMap;
        };
        $scope.submitKeepMap = function() {
            if (!$scope.submitTripCheck()) return true;
            $scope.getTripPlan();
        };

        //The first time the trip form is submitted, the map is shown (see above)
        $scope.submitTrip = $scope.submitShowMap;

        $scope.tripPlannerBack = function() {
            $scope.trip_back_show = false;
            $scope.planner_prefs_styles["planner-pref-pushed"] = false;
            $scope.toggleMapSchedule();
            $scope.$parent.schedule_bar_hide = false;

            $scope.submitTrip = $scope.submitShowMap;
        };
}]);
