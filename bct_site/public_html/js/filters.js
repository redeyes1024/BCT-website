var BCTAppFilters = angular.module('BCTAppFilters', []);

isr.classes.RouteAndStopFilter = function(non_id_property, use_minimum_length) {
    var self = this;

    var computeLinearDistance = function(coords1, coords2) {
        var lat_span = coords1.Latitude - coords2.Latitude;
        var lng_span = coords1.Longitude - coords2.Longitude;

        var distance_sq = Math.pow(lat_span, 2) + Math.pow(lng_span, 2);
        var linear_distance = Math.pow(distance_sq, 0.5);

        return linear_distance;
    };

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

    this.filter = function(items, search_string, sort_bstops_by_distance) {
        var filtered = [];
        var input_lower = search_string.toLowerCase();

        if (!self.filter_condition(search_string.length)) { return true; }
        if (search_string.length === 0) {
            return items;
        };

        for (var i=0;i<items.length;i++) {
            var search_str_cased = items[i].Id + " " + items[i][self.property_name];
            var search_str = search_str_cased.toLowerCase();

            if (search_str.match(input_lower)) {
                filtered.push(items[i]);
            }
        }

        if (sort_bstops_by_distance && sort_bstops_by_distance.enabled) {
            var current_location = {
                LatLng: {
                    Latitude: 25.977301,
                    Longitude: -80.12027
                }
            };

            var distances_associated_by_index = [];

            for (var i=0;i<filtered.length;i++) {
                var distance = computeLinearDistance(
                    current_location.LatLng, filtered[i].LatLng
                );

                filtered[i].distance = distance;
            }

            filtered.sort(function(sd1, sd2) {
                return sd1.distance - sd2.distance;
            });

            for (var i=0;i<filtered.length;i++) {
                delete filtered[i].distance;
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