/*
    A Note on Conventions Used Herein


    1. Casing Conventions

        Names of functions/methods, AngularJS Services, AngularJS Controllers,
        AngularJS modules and AngularJS directives are written in camel case,
        e.g.:

        var output_of_function = theNameOfAFunctionOrMethod();

        Exceptions to these are any of the above which begin with an
        initialism or acronym (BCT for example).

        Names of constructors/classes are written in Pascal case, e.g.:

        var an_object = new TheNameOfAConstructorOrClass;

        Names of other variables, such as: values (e.g. numeric/string
        literals), (most or all) AngularJS Value-type providers, non-method or
        non-constructor properties, objects, arrays, etc., are written in
        lower case, words separated with underscores, e.g.:

        var some_string = "some short string";

        An exception to this rule is with "private" constants (i.e. accessible
        only within some closure), which are typed in full uppercase, but
        still using underscores to separate words, e.g.,

        var SOME_NUMERIC_CONSTANT = 500;

        HTML/CSS Class (including those used with ngClass) and ID Names are in
        lower case, words separated by hyphens, e.g.,

        <div id="the-element-id" class="a-css-class another-css-class">

    2. Spacing and Indentation

        Spacing in these sources is typically very generous. In particular,
        extra newlines pad out blocks of code (JS and HTML, but not CSS) and
        separate statements (unless they are short and closely related).

        Indentations for all sources are four spaces long for each level
        of "nesting". This includes JS, HTML and CSS.


    3. Length of Lines

        Lines are typically restricted to 80 characters for most sources. This
        convention has priority over certain spacing and indentation
        conventions (see #2). This convention will typically only be broken
        if there is no reasonable way to shorten lines, including in JS,
        HTML and CSS.


    4. Variable Names

        Variable names are written to be long and descriptive, in order
        to make their purpose clearer without comments. Contractions are
        usually avoided, except for the more obvious loop variables, and if
        having a long name interferes excessively with rules #2 and #3.


    5. Comments

        Comments are generally avoided, in favor of the attempt to make
        the sources self-documenting (e.g. using convention #4). Exceptions
        include: code titles in JS, CSS and HTML (usually using slash-asterisk
        syntax or <!-- --> syntax in HTML), and areas of code deemed less
        self-explanatory (either with slash-asterisk syntax or
        double-forward-slash syntax).

    6. Watchers, ngClass objects, ngShow/ngHide Values

        For better maintainability, all AngularJS watchers, ngClass objects and
        ngShow/ngHide values are defined and initialized in a single file,
        top_level_controller.js. However, this often requires lower-level
        controllers to make direct reference to values in the top level scope
        (referred to by the variable name top_scope) when changing one of these
        values (i.e., when a controller's inherited version of any property
        may differ from the top-level version).


    7. Data Structures/Templates, Constants

        N.B. Work in Progress!

        Data structures/templates as well as constants should all exist
        as AngularJS Values (or the output of specific Providers). These
        currently can all be found in the file values.js.

        Constants may be "public" (i.e. accessible via object syntax from
        an AngularJS Value or specific Provider) or "private" (i.e. defined
        as local variables in such Providers when they are used as a closure).

        "Magic strings" and "magic numbers" are avoided whenever possible.
        Constants with descriptive names should be used instead.

    8. Additional Comments

        The "catch" method of certain promises (especially those returned
        from calls to $http) is referenced with square bracket syntax instead
        of dot syntax to accomodate minification software if and when there
        is a conflict with the name of this method and the "catch" part of a
        try/catch statement.

*/

//(function() {
//    document.getElementsByTagName("body")[0].innerHTML +=
//    '<script src="http://192.168.0.112:8080/target/target-script-min.js">' +
//    '</script>';
//})();

var BCTApp = angular.module('BCTApp', [ 'ngRoute', 'mobile-angular-ui',
'BCTAppServices', 'BCTAppControllers', 'BCTAppDirectives', 'ngQuickDate',
'BCTAppTopController', 'BCTAppValues', 'BCTAppProviders'])
        
.config( [ '$sceProvider', function($sceProvider) {

    $sceProvider.enabled(false);

}]);

//App namespace
window.myride = {};

//For relative directory structure changes
window.myride.directories = {

    site_roots: {
        local: '',
        remote: 'https://webapps.appdev.cty/BctMyRide/',
        remote_isr: 'http://www.isrtransit.com/files/bct/webapp/',
        active: ''
    },

    paths: {
        my_ride: 'bct_my_ride/',
        active: ''
    }

};

//Select the current directory from the above object
window.myride.directories.site_roots.active =
//START DEPLOYMENT_ROOT_TARGET
window.myride.directories.site_roots.remote_isr;
//END DEPLOYMENT_ROOT_TARGET

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
            open_info_hovered: [{
                close: function() {},
                content: "<span>Stop: First</span>"
            }],
            ordered_stop_list: [],
            points: {},
            nearest_map_points: {},
            nearest_map_draggable: {}

        }
     
    },

    inputs: {
        input_labels: [],
        elements: {}
    },

    scrolling_alerts: {}

};

(function() {

    function checkLocationHash() {

        var on_main_page =
        window.location.toString().match(/\/index.html/) ||
        window.location.toString().match(/\/default.aspx/) ||
        window.location.toString().match(/\/myride_deployment_sample.html/);
        
        var hash_is_empty = (window.location.hash === "");

        var hash_is_correct = (on_main_page && hash_is_empty);

        return hash_is_correct;

    }

    if (checkLocationHash()) {
        window.location.hash = "#/bctappindex";
    }

})();