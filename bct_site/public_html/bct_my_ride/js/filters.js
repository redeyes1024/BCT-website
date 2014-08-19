var BCTAppFilters = angular.module('BCTAppFilters', []);

BCTAppFilters.filter('routeFilter', [ 'routeAndStopFilters',
function(routeAndStopFilters) {

    var custom_filter_instance =
    new routeAndStopFilters.RouteAndStopFilterMaker("LName", true);

    return custom_filter_instance.filter;

}]);

BCTAppFilters.filter('stopFilter', [ 'routeAndStopFilters',
function(routeAndStopFilters) {

    var custom_filter_instance =
    new routeAndStopFilters.RouteAndStopFilterMaker("Name", true);

    return custom_filter_instance.filter;

}]);

BCTAppFilters.filter('routeFilterSub', [ 'routeAndStopFilters',
function(routeAndStopFilters) {

    var custom_filter_instance =
    new routeAndStopFilters.RouteAndStopFilterMaker("LName", false);

    return custom_filter_instance.filter;

}]);

BCTAppFilters.filter('stopFilterSub', [ 'routeAndStopFilters',
function(routeAndStopFilters) {

    var custom_filter_instance =
    new routeAndStopFilters.RouteAndStopFilterMaker("Name", false);

    return custom_filter_instance.filter;

}]);