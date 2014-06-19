var BCTAppDirectives = angular.module('BCTAppDirectives', []);

BCTApp.directive('scheduleMap', [ function() {
    return {
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