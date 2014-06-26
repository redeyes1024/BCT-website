var BCTAppDirectives = angular.module('BCTAppDirectives', []);

BCTApp.directive('scheduleMap', [ 'googleMapUtilities', function(googleMapUtilities) {
    return {
        link: function() {
            isr.dom_q.map.cont = document.getElementById("map-canvas");
            googleMapUtilities.mapMaker(isr.dom_q.map.cont);
        },
        restrict: 'E',
        templateUrl: 'partials/schedule_map.html'
    };
}]);

BCTApp.directive('scheduleMapOverlay', [ function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/schedule_map_overlay.html'
    };
}]);

BCTApp.directive('tripPlanner', [ function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/trip_planner.html'
    };
}]);

BCTApp.directive('routeResultPanel', [ '$compile', function($compile) {
    function link(scope, element) {
        angular.element(element[0].childNodes[0].childNodes[1]).bind("click", function() {
            var route_id = element[0].childNodes[0].getAttribute("id");
            var panel = document.getElementById(route_id + "-collapse");
            var panel_is_closed = panel.classList.contains("in");
//            if (scope.loaded_results.routes.indexOf(route_id) !== -1) { return true; }
//            scope.loaded_results.routes.push(route_id);
            scope.route = scope.routes[route_id];

            if (panel_is_closed) {
                angular.element(element[0].childNodes[0].childNodes[3].childNodes[1].childNodes[3]).
                append($compile("<sub-panel-routes></sub-panel-routes>")(scope));
            }
            else {
                angular.element(element[0].childNodes[0].childNodes[3].childNodes[1].childNodes[3].childNodes[0]).
                remove();
            }
        });
    }
    return {
        link: link,
        restrict: 'E',
        templateUrl: 'partials/route_result_panel.html'
    };
}]);

BCTApp.directive('subPanelRoutes', [ function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/sub_panel_routes.html'
    };
}]);

BCTApp.directive('stopResultPanel', [ '$compile', function($compile) {
    function link(scope, element) {
        angular.element(element[0].childNodes[0].childNodes[1]).bind("click", function() {
            var stop_id = element[0].childNodes[0].getAttribute("id");
            var panel = document.getElementById(stop_id + "-collapse");
            var panel_is_closed = panel.classList.contains("in");
//            if (scope.loaded_results.stops.indexOf(stop_id) !== -1) { return true; }
//            scope.loaded_results.stops.push(stop_id);
            scope.stop = scope.stops[stop_id];

            if (panel_is_closed) {
                angular.element(element[0].childNodes[0].childNodes[3].childNodes[1].childNodes[3]).
                append($compile("<sub-panel-stops></sub-panel-stops>")(scope));
            }
            else {
                angular.element(element[0].childNodes[0].childNodes[3].childNodes[1].childNodes[3].childNodes[0]).
                remove();
            }
        });
    }
    return {
        link: link,
        restrict: 'E',
        templateUrl: 'partials/stop_result_panel.html'
    };
}]);

BCTApp.directive('subPanelStops', [ function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/sub_panel_stops.html'
    };
}]);