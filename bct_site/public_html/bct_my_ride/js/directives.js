var BCTAppDirectives = angular.module('BCTAppDirectives', []);

BCTApp.directive('scheduleMap', [ 'googleMapUtilities',
function(googleMapUtilities) {
    return {
        link: function() {
            myride.dom_q.map.cont = document.getElementById("map-canvas");
            googleMapUtilities.mapMaker(myride.dom_q.map.cont);
        },
        restrict: 'E',
        templateUrl: window.myride.site_roots.active +
        'partials/schedule_map.html'
    };
}]);

BCTApp.directive('scheduleMapOverlay', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.site_roots.active +
        'partials/schedule_map_overlay.html'
    };
}]);

BCTApp.directive('tripPlanner', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.site_roots.active +
        'partials/trip_planner.html'
    };
}]);

BCTApp.directive('subPanelRoutes', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.site_roots.active +
        'partials/sub_panel_routes.html'
    };
}]);

BCTApp.directive('subPanelStops', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.site_roots.active +
        'partials/sub_panel_stops.html'
    };
}]);

BCTApp.directive('routeResultPanel', [ 'linkFunctions', 
function(linkFunctions) {

    function link(scope, element) {

        var type = "route";

        linkFunctions.dynamicPanelContentsLoader(
            scope, element, type
        );
    }

    return {
        link: link,
        restrict: 'E',
        templateUrl: window.myride.site_roots.active +
        'partials/route_result_panel.html'
    };
}]);

BCTApp.directive('stopResultPanel', [ 'linkFunctions',
function(linkFunctions) {

    function link(scope, element) {

        var type = "stop";

        linkFunctions.dynamicPanelContentsLoader(
            scope, element, type
        );
    }

    return {
        link: link,
        restrict: 'E',
        templateUrl: window.myride.site_roots.active +
        'partials/stop_result_panel.html'
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
        templateUrl: window.myride.site_roots.active +
        'partials/planner_option_bar.html'
    };
}]);

BCTApp.directive('nearestStops', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.site_roots.active +
        'partials/nearest_stops.html'
    };
}]);

BCTApp.directive('mobileFilterIcons', [ 'templateGenerators',
function(templateGenerators) {

    var template = templateGenerators.createFilterIconBarTemplate("mobile");

    return {
        restrict: 'E',
        template: template
    };

}]);

BCTApp.directive('inlineFilterIcons', [ 'templateGenerators',
function(templateGenerators) {

    var template = templateGenerators.createFilterIconBarTemplate("inline");

    return {
        restrict: 'E',
        template: template
    };

}]);