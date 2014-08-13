var BCTAppDirectives = angular.module('BCTAppDirectives', []);

BCTApp.directive('iconLegendOverlay', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/icon_legend.html'
    };
}]);

BCTApp.directive('bctMyRideTopLevelOverlays', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/main.html'
    };
}]);

BCTApp.directive('scheduleMap', [ 'googleMapUtilities',
function(googleMapUtilities) {
    return {
        link: function() {
            myride.dom_q.map.cont = document.getElementById("map-canvas");
            googleMapUtilities.mapMaker(myride.dom_q.map.cont);
        },
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/schedule_map.html'
    };
}]);

BCTApp.directive('scheduleMapOverlay', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/schedule_map_overlay.html'
    };
}]);

BCTApp.directive('tripPlanner', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/trip_planner.html'
    };
}]);

BCTApp.directive('subPanelRoutes', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/sub_panel_routes.html'
    };
}]);

BCTApp.directive('subPanelStops', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
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
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
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
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
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

BCTApp.directive('plannerOptionBar', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/planner_option_bar.html'
    };
}]);

BCTApp.directive('nearestStops', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
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

BCTApp.directive('tripPlannerNavigationBar', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/trip_planner_navigation_bar.html'
    };

}]);

BCTApp.directive('scheduleMapNavigationBar', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/schedule_map_navigation_bar.html'
    };

}]);

BCTApp.directive('tripPlannerStep', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/trip_planner_step.html'
    };

}]);

BCTApp.directive('globalAlertsHeader', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/global_alerts_header.html'
    };

}]);

BCTApp.directive('scheduleMapAlertsHeader', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/schedule_map_alerts_header.html'
    };

}]);