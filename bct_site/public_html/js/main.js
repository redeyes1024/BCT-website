var BCTApp = angular.module('BCTApp', ['ngRoute', 'mobile-angular-ui',
    'BCTAppServices', 'BCTAppControllers', 'BCTAppDirectives', 'ngQuickDate',
    'BCTAppFilters', 'BCTAppTopController', 'BCTAppValues']);

//App namespace (company name)
window.isr = {};

//Holder for classes (constructors)
window.isr.classes = {};

//Holder for instances when classes are instantiated
window.isr.instances = {};

//Initial DOM queries
window.isr.dom_q = {
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
            points: {}
        }
    },
    inputs: {}
};

angular.element(document).ready(function() {
    window.location += "#bctappindex";
});