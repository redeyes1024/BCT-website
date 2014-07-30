var BCTApp = angular.module('BCTApp', ['ngRoute', 'mobile-angular-ui',
    'BCTAppServices', 'BCTAppControllers', 'BCTAppDirectives', 'ngQuickDate',
    'BCTAppFilters', 'BCTAppTopController', 'BCTAppValues']);

//App namespace
window.myride = {};

//For relative directory structure changes
window.myride.site_roots = {
    embedded: 'bct_my_ride/',
    iframe: '',
    active: ''
};

//Select the current directory from the above object
window.myride.site_roots.active = window.myride.site_roots.embedded;

//Initial DOM queries
window.myride.dom_q = {
    map: {
        overlays: {
            trip_plines: [],
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
    inputs: {}
};

angular.element(document).ready(function() {
    window.location.hash = "#bctappindex";
});