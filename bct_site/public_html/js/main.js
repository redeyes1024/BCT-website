var BCTApp = angular.module('BCTApp', ['ngRoute', 'mobile-angular-ui',
    'BCTAppServices', 'BCTAppControllers', 'BCTAppDirectives', 'ngQuickDate']);

//App namespace (company name)
window.isr = {};
//Initial DOM queries
isr.dom_q = {
    map: {
        overlays: {
            open_info: [{ close: function() {} }],
            points: {}
        }
    },
    inputs: {}
};

angular.element(document).ready(function() {
    window.location += "#bctappindex";
});