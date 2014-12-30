var module;

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        karma: {
            unit: {
                options: {
                    frameworks: ['jasmine'],
                    singleRun: true,
                    browsers: ['PhantomJS'],
                    files: [

                        //App dependencies
                        'https://maps.googleapis.com/maps/api/js?key=AIzaSyCXxtwuyy3k9Ot5d44hgjHQt4kkg5KZ5Hw&sensor=false',
                        'bct_my_ride/js/libraries/angular.min.js',
                        'bower_components/angular-mocks/angular-mocks.js',
                        'bct_my_ride/js/libraries/angular-route.min.js',
                        'bct_my_ride/js/libraries/mobile-angular-ui.min.js',
                        'bct_my_ride/js/libraries/ng-quick-date.min.js',
                        'bct_my_ride/js/libraries/google_maps_infobox_1.1.9.min.js',
                        'bct_my_ride/js/libraries/markerclustererplus_2.1.2.min.js',
                        'bct_my_ride/js/main.js',
                        'bct_my_ride/js/values.js',
                        'bct_my_ride/js/providers.js',
                        'bct_my_ride/js/top_level_controller.js',
                        'bct_my_ride/js/controllers.js',
                        'bct_my_ride/js/services.js',
                        'bct_my_ride/js/google_maps_utilities_service.js',
                        'bct_my_ride/js/scrolling_alerts_service.js',
                        'bct_my_ride/js/directives.js',

                        //Test sources
                        'bct_my_ride/tests/js/services.js',

                        //JSON Fixtures
                        {
                            pattern: 'bct_my_ride/tests/js/mock/*.json',
                            watched: true,
                            served: true,
                            included: false 
                        }
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test', [
        'karma'
    ]);

};