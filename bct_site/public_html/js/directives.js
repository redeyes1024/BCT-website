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
        element.bind("click", function() {
            var route_id = element[0].childNodes[0].getAttribute("id");
            if (scope.loaded_results.routes.indexOf(route_id) !== -1) { return true; }
            scope.loaded_results.routes.push(route_id);
            scope.route = scope.routes[route_id];

            angular.element(element[0].childNodes[0].childNodes[3].childNodes[1].childNodes[3]).
            append($compile("<sub-panel-routes></sub-panel-routes>")(scope));
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
        element.bind("click", function() {
            var stop_id = element[0].childNodes[0].getAttribute("id");
            if (scope.loaded_results.stops.indexOf(stop_id) !== -1) { return true; }

            scope.loaded_results.stops.push(stop_id);
            scope.stop = scope.stops[stop_id];

            angular.element(element[0].childNodes[0].childNodes[3].childNodes[1].childNodes[3]).
            append($compile("<sub-panel-stops></sub-panel-stops>")(scope));
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

BCTApp.filter('routeFilter', function() {
    return function(items, input) {
        if (input.length < 3) { return []; }

        var filtered = [];
        var input_lower = input.toLowerCase();

        for (var i=0;i<items.length;i++) {
            var search_str_cased = items[i].Id + items[i].LName;
            var search_str = search_str_cased.toLowerCase();

            if (search_str.match(input_lower)) {
                filtered.push(items[i]);
            }
        }
        return filtered;
    };
});

BCTApp.filter('stopFilter', function() {
    return function(items, input) {
        if (input.length < 3) { return []; }

        var filtered = [];
        var input_lower = input.toLowerCase();

        for (var i=0;i<items.length;i++) {
            var search_str_cased = items[i].Id + items[i].Name;
            var search_str = search_str_cased.toLowerCase();

            if (search_str.match(input_lower)) {
                filtered.push(items[i]);
            }
        }
        return filtered;
    };
});