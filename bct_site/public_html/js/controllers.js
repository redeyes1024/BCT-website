var BCTAppControllers = angular.module('BCTAppControllers', []);

BCTAppControllers.controller('routeSchedulesController', ['$scope',
    '$timeout', '$interval', 'scheduleWebSocket', 'scheduleSocketService',
        function ($scope, $timeout, $interval, scheduleWebSocket, scheduleSocketService) {
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
    function ($scope, googleMapUtilities, $timeout, tripPlannerService) {
        //For ease of debugging
        window.trip_scope = $scope;

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

        //Placeholder trip plan itinerary labels
        //Deleted after successful trip plan request
        $scope.current_trip_plan_data = {
            planField: {
                itinerariesField: [
                    {
                        loading: "Loading..."
                    },
                    {
                        loading: "Loading..."
                    },
                    {
                        loading: "Loading..."
                    }
                ]
            }
        };

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
                    $scope.current_trip_plan_data = res.data;
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
        $scope.tripPlannerInputsEmpty = function() {
            if ($scope.trip_inputs.start === "" ||
                $scope.trip_inputs.finish === "" ) {
                return false;
            }
            return true;
        };

        $scope.submitTripPlannerQueryAndShowMap = function() {
            if (!$scope.tripPlannerInputsEmpty()) return true;
            googleMapUtilities.clearMap();
            $scope.getTripPlan();
            //$scope.$parent.map_canvas_hide = false;
            //Modify show map, hide map's top bar, and slide in trip planner...
            $scope.$parent.schedule_bar_hide = true;
            $scope.trip_planner_styles["trip-planner-module-active"] = true;
            //...after its slide animation completes (1 second long in CSS)
            if (!$scope.map_schedule_toggle) {
                //$timeout(function() {
                    $scope.toggleMapSchedule(true);
                //}, 1000);
            }
            $scope.$parent.trip_back_show = true;
            //Do not toggle map the subsequent times this function is called
            //until function is re-defined yet again (when map is closed)
            $scope.submitTrip = $scope.submitTripPlannerQueryWithoutNewMap;
        };
        $scope.submitTripPlannerQueryWithoutNewMap = function() {
            if (!$scope.tripPlannerInputsEmpty()) return true;
            $scope.getTripPlan();
        };

        //The first time the trip form is submitted, the map is shown (see above)
        $scope.submitTrip = $scope.submitTripPlannerQueryAndShowMap;

        $scope.$parent.tripPlannerBack = function() {
            $scope.$parent.trip_back_show = false;
            //$scope.planner_prefs_styles["planner-pref-pushed"] = false;
            $scope.toggleMapSchedule();
            $scope.$parent.schedule_bar_hide = false;

            //If full schedule overlay was enabled when trip planner was active
            //$scope.$map_canvas_hide = false;
            $scope.$parent.schedule_full_toggle = false;

            $scope.submitTrip = $scope.submitTripPlannerQueryAndShowMap;
        };
}]);