var BCTApp = angular.module('BCTApp', ['ngRoute', 'mobile-angular-ui',
    'BCTAppServices', 'BCTAppControllers', 'BCTAppDirectives', 'ngQuickDate',
    'BCTAppFilters', 'BCTAppTopController', 'BCTAppValues'])
        
.config(function($sceProvider) {
    $sceProvider.enabled(false);
});

//App namespace
window.myride = {};

//For relative directory structure changes
window.myride.directories = {
    site_roots: {
        local: '',
        remote: 'http://www.isrtransit.com/files/bct/webapp/',
        active: ''
    },
    paths: {
        my_ride: 'bct_my_ride/',
        active: ''
    }
};

//Select the current directory from the above object
window.myride.directories.site_roots.active =
window.myride.directories.site_roots.local;

window.myride.directories.paths.active =
window.myride.directories.paths.my_ride;

//RegExp whitelists for external sources
window.myride.directories.site_roots.whitelist_regexps = {
    ISR_main: new RegExp('http:\/\/www.isrtransit.com((\/)?.*?\/)*')
};

//Initial DOM queries
window.myride.dom_q = {
    map: {
        overlays: {
            trip_pline: [],
            trip_points: [],
            //Dummy properties for first-time function calls
            trip_open_info: [{
                close: function() {},
                trip_marker_window_id: -1
            }],
            open_info: [{
                close: function() {},
                content: "<span>Stop: First</span>"
            }],
            ordered_stop_list: [],
            points: {}
        }
    },
    inputs: {
        input_labels: [],
        elements: {}
    }
};

angular.element(document).ready(function() {

    function checkLocationHash() {

        var on_main_page = (
            window.location.toString().match(/\/index.html/) ||
            window.location.toString().match(/\/default.aspx/)
        );
        
        var hash_is_empty = (window.location.hash === "");

        var hash_is_correct = (on_main_page && hash_is_empty);

        return hash_is_correct;

    }

    if (checkLocationHash()) {
        window.location.hash = "#bctappindex";
    }
});