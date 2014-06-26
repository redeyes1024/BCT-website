var BCTAppFilters = angular.module('BCTAppFilters', []);

isr.classes.RouteAndStopFilter = function(non_id_property, use_minimum_length) {
    var self = this;

    this.property_name = non_id_property;

    if (use_minimum_length) {
        this.filter_condition = function(input_string_length) {
            if (input_string_length < 3) {
                return false;
            }
            return true;
        };
    }
    else {
        this.filter_condition = function() {
            return true;
        };
    }

    this.filter = function(items, input) {
        var filtered = [];
        var input_lower = input.toLowerCase();

        if (!self.filter_condition(input.length)) { return true; }
        if (input.length === 0) {
            return items;
        };

        for (var i=0;i<items.length;i++) {
            var search_str_cased = items[i].Id + " " + items[i][self.property_name];
            var search_str = search_str_cased.toLowerCase();

            if (search_str.match(input_lower)) {
                filtered.push(items[i]);
            }
        }
        return filtered;
    };
};

isr.instances.filters = {};

isr.instances.filters.routeFilter = new isr.classes.RouteAndStopFilter("LName", true);
isr.instances.filters.stopFilter = new isr.classes.RouteAndStopFilter("Name", true);
isr.instances.filters.routeFilterSub = new isr.classes.RouteAndStopFilter("LName", false);
isr.instances.filters.stopFilterSub = new isr.classes.RouteAndStopFilter("Name", false);

BCTAppFilters.filter('routeFilter', function() {
    return isr.instances.filters.routeFilter.filter;
});
BCTAppFilters.filter('stopFilter', function() {
    return isr.instances.filters.stopFilter.filter;
});
BCTAppFilters.filter('routeFilterSub', function() {
    return isr.instances.filters.routeFilterSub.filter;
});
BCTAppFilters.filter('stopFilterSub', function() {
    return isr.instances.filters.stopFilterSub.filter;
});