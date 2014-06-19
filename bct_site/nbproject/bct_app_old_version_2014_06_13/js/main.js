var BCTApp = angular.module('BCTApp', ['ngRoute', 'mobile-angular-ui',
    'BCTAppServices', 'BCTAppControllers', 'BCTAppDirectives']);

//App namespace (company name)
window.isr = {};
//Initial DOM queries
isr.dom_q = {
    maps: {},
    inputs: {}
};
isr.query_data = {};

angular.element(document).ready(function() {
    window.location += "#bctappindex";
});