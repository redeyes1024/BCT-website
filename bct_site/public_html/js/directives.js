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

BCTApp.directive('subPanelRoutes', [ function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/sub_panel_routes.html'
    };
}]);