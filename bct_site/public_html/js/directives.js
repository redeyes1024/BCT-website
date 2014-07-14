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
            //cur_route is referred to by sub-panels only
            scope.cur_route = scope.routes[route_id];

            //i.e. panel was closed and is now being opened
            if (panel_is_closed) {
                angular.element(element[0].childNodes[0].childNodes[3].childNodes[1].childNodes[3]).
                append($compile("<sub-panel-routes></sub-panel-routes>")(scope));
            }
            //i.e. panel was open and now is being closed
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
            //cur_route is referred to by sub-panels only
            scope.cur_stop = scope.stops[stop_id];

            //i.e. panel was closed and is now being opened
            if (panel_is_closed) {
                angular.element(element[0].childNodes[0].childNodes[3].childNodes[1].childNodes[3]).
                append($compile("<sub-panel-stops></sub-panel-stops>")(scope));
            }
            //i.e. panel was open and now is being closed
            else {
                angular.element(
                    element[0].childNodes[0].childNodes[3].
                    childNodes[1].childNodes[3].childNodes[0]
                ).remove();
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

BCTApp.directive('tripPlannerDialog', [ function() {
    var template = '' +
        '<div id="trip-planner-dialog" ng-class="planner_dialog_styles"' +
            'ng-show="show_geocoder_error_dialog">' +
            '{{ geocoder_error_dialog_text }}' +
        '<div>';

    return {
        restrict: 'E',
        template: template
    };
}]);

//Keeps track of schedule result page panels through a counter in the top scope
//Works together with query_data.schedule_search watcher (also in top scope)
//Here theschedule_result_panels_counter reflects the value from the current $digest
BCTApp.directive('panelTracker', [ function() {
    function link(scope) {
        scope.top_scope.schedule_result_panels_counter++;

        if (scope.$last) {
            scope.top_scope.show_empty_result_message_no_results = false;
            scope.top_scope.show_schedule_results_result_panels = true;
        }

        scope.$on('$destroy', function() {
            scope.top_scope.schedule_result_panels_counter--;

            if (scope.top_scope.schedule_result_panels_counter === 0 &&
                scope.top_scope.query_data.schedule_search.length >= 3) {
                scope.top_scope.show_empty_result_message_no_results = true;
                scope.top_scope.show_schedule_results_result_panels = false;
            }
        });
    }
    return {
        link: link,
        restrict: 'A'
    };
}]);

BCTApp.directive('plannerOptionBar', [ function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/planner_option_bar.html'
    };
}]);

BCTApp.directive('nearestStops', [ function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/nearest_stops.html'
    };
}]);