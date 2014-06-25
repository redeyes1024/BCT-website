var BCTAppFilters = angular.module('BCTAppFilters', []);

BCTAppFilters.filter('routeFilter', function() {
    return function(items, input) {
        if (input.length < 3) { return []; }

        var filtered = [];
        var input_lower = input.toLowerCase();

        for (var i=0;i<items.length;i++) {
            var search_str_cased = items[i].Id + " " + items[i].LName;
            var search_str = search_str_cased.toLowerCase();

            if (search_str.match(input_lower)) {
                filtered.push(items[i]);
            }
        }
        return filtered;
    };
});

BCTAppFilters.filter('stopFilter', function() {
    return function(items, input) {
        if (input.length < 3) { return []; }

        var filtered = [];
        var input_lower = input.toLowerCase();

        for (var i=0;i<items.length;i++) {
            var search_str_cased = items[i].Id + " " + items[i].Name;
            var search_str = search_str_cased.toLowerCase();

            if (search_str.match(input_lower)) {
                filtered.push(items[i]);
            }
        }
        return filtered;
    };
});