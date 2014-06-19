var BCTAppControllers = angular.module('BCTAppControllers', []);

BCTAppControllers.controller('BCTController', ['$scope',
    '$timeout', 'scheduleWebSocket', 'scheduleSocketService',
    'scheduleDownloadService', 'googleMapUtilities',
    function ($scope, $timeout, scheduleWebSocket, scheduleSocketService,
    scheduleDownloadService, googleMapUtilities) {

    //Mock schedule data for 8:30 AM
    $scope.schedule = {
        cur: [
            "8:00",
            "9:00",
            "10:00",
            "11:00"
        ],
        tot: [
            "5:00",
            "6:00",
            "7:00",
            "8:00",
            "9:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00"
        ]
    };
    $scope.alerts = [
      "Bus route will change to include Data Ave. starting in January"
    ];
    $scope.map_schedule_toggle = false;

    $scope.toggleMapSchedule = function() {
        if ($scope.map_schedule_toggle) {
           $scope.map_schedule_toggle = false;
           $scope.body_scroll = "";
        }
        else {
            $scope.map_schedule_toggle = true;
            var schedule_map = document.getElementById("map-canvas");
            if (!isr.dom_q.maps["schedule-map"]) {
                googleMapUtilities.mapMaker("schedule-map", schedule_map);
            }
            else {
                //Map intance is re-centered right before re-showing the map
                //canvas, so to be more seamless to the user...
                isr.dom_q.maps["schedule-map"].setZoom(10);
                isr.dom_q.maps["schedule-map"].setCenter({
                    lat:26.103277, lng:-80.399114
                });
                angular.element(document).ready(function() {
                    google.maps.event.trigger(
                        isr.dom_q.maps["schedule-map"], "resize"
                    );
                    //...but it must be re-centered once more in case a resize
                    //occured since the map instance was last hidden
                    //N.B. the event.trigger method does not have a callback arg
                    //triggered upon resize, so second re-centering is always attempted
                    isr.dom_q.maps["schedule-map"].setCenter({
                        lat:26.103277, lng:-80.399114
                    });
                });
            }
            $scope.body_scroll = "hide-scroll";
        }
    };

    $scope.page_no = 2;
    $scope.goToSchedule = function(direct) {
        if (direct === "prev") {
            $scope.page_no -= 1;
            if ($scope.page_no < 1) {
                $scope.page_no = 3;
            }
        }
        else if (direct === "next") {
            $scope.page_no += 1;
            if ($scope.page_no > 3) {
                $scope.page_no = 1;
            }
        }
    };

    $scope.schedule_full_toggle = false;
    $scope.toggleFullSchedule = function() {
        if ($scope.schedule_full_toggle) {
           $scope.schedule_full_toggle = false; 
           $scope.schedule_map_scroll = "hide-scroll";
        }
        else {
            $scope.schedule_full_toggle = true;
            $scope.schedule_map_scroll = "";
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
    $scope.body_scroll = "";
    $scope.schedule_map_scroll = "hide-scroll";

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

    scheduleDownloadService.downloadRouteInfo().then(function(res) {
        $scope.route_data= res.data[0].Routes;
    }).
    catch(function() {
        console.log("There was an error retrieving schedule data.");
    });
    scheduleDownloadService.downloadStopInfo().then(function(res) {
        $scope.bstop_data= res.data;
    }).
    catch(function() {
        console.log("There was an error retrieving schedule data.");
    });
    window.test = $scope;

}]).config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/routeschedules', {
        templateUrl: 'partials/route_schedules.html',
        controller: 'routeSchedulesController'
    }).when('/bctappindex', {
        templateUrl: 'partials/bct_app_index.html',
        controller: 'indexController'
    }).when('/tripplanner', {
        templateUrl: 'partials/trip_planner.html',
        controller: 'tripPlannerController'
    }).when('/neareststops', {
        templateUrl: 'partials/nearest_stops.html',
        controller: 'nearestStopsController'
    });
});

BCTAppControllers.controller('routeSchedulesController', ['$scope',
    '$timeout', '$interval', 'scheduleWebSocket', 'scheduleSocketService',
        function ($scope, $timeout, $interval, scheduleWebSocket, scheduleSocketService) {

//        scheduleWebSocket.onopen = function(){  
//            console.log("Socket Opened.");
//        };
//        scheduleWebSocket.onmessage = function(message) {
//            console.log("Response received: " + message.data);
//        };
//        $scope.testRequest = function() {
//            scheduleSocketService.sendRequest($scope.query_data.schedules.query);
//        };
        $scope.$watch('query_data.schedules.query', function(newValue, oldValue) {
            //$scope.testRequest();
        });

        //Mock data
        var all_routes = $scope.routes = {
            "ABC123": {
                id: "ABC123",
                number: "101",
                name: "Picard Street",
                direction: "East",
                stop_ids: ["123ABC", "123ABD"],
                acc_id: "r_collapseOne"
            },
            "ABC124": {
                id: "ABC124",
                number: "101",
                name: "Picard Street",
                direction: "West",
                stop_ids: ["123ABC", "123ABD"],
                acc_id: "r_collapseTwo"
            }
        };
        var all_stops = $scope.stops = {
            "123ABC": {
                id: "123ABC",
                stop_id: "11717",
                inter: "Picard Pl. and Riker Rd.",
                route_ids: ["ABC123", "ABC124"],
                acc_id: "s_collapseOne"
            },
            "123ABD": {
                id: "123ABD",
                stop_id: "11718",
                inter: "Picard Pl. and Geordi Rd.",
                route_ids: ["ABC123", "ABC124"],
                acc_id: "s_collapseTwo"
            }
        };

        var route_props = ["number", "name", "direction"];
        var bstop_props = ["stop_id", "inter"];

        //Creates a partial link between the routes and stops data objects
        //in the form of a numerically indexed array
        (function() {
            for (var route in all_routes) {
                all_routes[route].bstop_refs = [];
                var bstops = all_routes[route].stop_ids;
                for (var bstop in bstops) {
                    var s_res = {};
                    for (var i=0;i<bstop_props.length;i++) {
                        s_res[bstop_props[i]] = all_stops[bstops[bstop]][bstop_props[i]];
                    }
                    all_routes[route].bstop_refs.push(s_res);
                }
            }
            for (var bstop in all_stops) {
                all_stops[bstop].route_refs = [];
                var routes = all_stops[bstop].route_ids;
                for (var route in routes) {
                    var r_res = {};
                    for (var i=0;i<route_props.length;i++) {
                        r_res[route_props[i]] = all_routes[routes[route]][route_props[i]];
                    }
                    all_stops[bstop].route_refs.push(r_res);
                }
            }
        })();

        $scope.drawPath = function() {
            isr.dom_q.map.panTo({ lat: 26.115, lng: -80.41138 });
            isr.dom_q.map.setZoom(13);
            isr.dom_q.pline.setPath(path_coords);
        };
        $scope.clearSearch = function(event) {
            event.target.parentNode.parentNode.children[0].value = "";
            $scope.routes = {};
            $scope.stops = {};
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

        $scope.query_data = isr.query_data;
        $scope.changeURLHash = function(new_hash, model) {
            if (model) {
                var input_str = isr.query_data[model];
                if (!input_str || input_str.trim() === "") {
                    if (input_str !== "") {
                        isr.query_data[model] = "";
                    }
                    return true;
                }
            }
            window.location.hash = new_hash;
        };
}]);

BCTAppControllers.controller('tripPlannerController', ['$scope',
    'googleMapUtilities',
    function ($scope, googleMapUtilities) {

        $scope.show_trip_options = false;
        $scope.toggleTripOptions = function() {
            if ($scope.show_trip_options) {
                $scope.show_trip_options = false;
            }
            else {
                $scope.show_trip_options = true;
            }
        };

        var mapOptions = {
            center: new google.maps.LatLng(26.103277, -80.399114),
            zoom: 10
        };

        angular.element(document).ready(function() {
            var planner_map = document.getElementById("planner-map-canvas");
            googleMapUtilities.mapMaker("planner-map", planner_map);

//            isr.dom_q.pline = new google.maps.Polyline({ map: isr.dom_q.map} );
//            var pline = isr.dom_q.pline;
//            window.path_coords = [];
//            var service = new google.maps.DirectionsService;
//
//            service.route({
//                origin: "26.11,-80.41",
//                destination: "26.12,-80.42",
//                travelMode: google.maps.DirectionsTravelMode.DRIVING,
//                waypoints: [
//                    { location: "26.1167365, -80.3943407" }
//                ]
//            }, function(result, status) {
//                var res_coords = result.routes[0].overview_path;
//                for (var i=0; i<res_coords.length; i++) {
//                    var lat = res_coords[i].k;
//                    var lng = res_coords[i].A;
//                    var lat_lng = {};
//
//                    lat_lng.lat = lat;
//                    lat_lng.lng = lng;
//
//                    path_coords.push(lat_lng);
//                }
//            });
//            google.maps.event.addListenerOnce(isr.dom_q.map, 'idle', function() {
//                scope.map_schedule_toggle = false;
//                scope.show_loading_screen = false;
//                scope.$apply();
//            });
        });
}]);

BCTAppControllers.controller('nearestStopsController', ['$scope',
    '$timeout', '$interval', '$routeParams',
    function ($scope, $routeParams) {
            var all_stops = $scope.stops = {
            "551ABC": {
                id: "551ABC",
                stop_id: "11717",
                inter: "Picard Pl. and Riker Rd.",
                route_ids: ["ABC123", "ABC124"],
                acc_id: "s_collapseOne"
            },
            "552ABD": {
                id: "552ABD",
                stop_id: "11718",
                inter: "Picard Pl. and Geordi Rd.",
                route_ids: ["ABC123", "ABC124"],
                acc_id: "s_collapseTwo"
            }
        };

        //Mock data
        var all_routes = $scope.routes = {
            "ABC123": {
                id: "ABC123",
                number: "101",
                name: "Picard Street",
                direction: "East",
                stop_ids: ["123ABC", "123ABD"],
                acc_id: "r_collapseOne"
            },
            "ABC124": {
                id: "ABC124",
                number: "101",
                name: "Picard Street",
                direction: "West",
                stop_ids: ["123ABC", "123ABD"],
                acc_id: "r_collapseTwo"
            }
        };
        var route_props = ["number", "name", "direction"];
        (function() {
            for (var bstop in all_stops) {
                all_stops[bstop].route_refs = [];
                var routes = all_stops[bstop].route_ids;
                for (var route in routes) {
                    var r_res = {};
                    for (var i=0;i<route_props.length;i++) {
                        r_res[route_props[i]] = all_routes[routes[route]][route_props[i]];
                    }
                    all_stops[bstop].route_refs.push(r_res);
                }
            }
        })();

        $scope.routeFilter = { f: "" };
        $scope.bstopFilter = { f: "" };

        $scope.clearFilters = function() {
            $scope.bstopFilter.f = "";
            $scope.routeFilter.f = "";
        };
}]);