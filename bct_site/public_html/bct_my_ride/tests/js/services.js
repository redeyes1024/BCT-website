var services_mock_data = angular.module('ServicesMockData', []);

describe('BCTAppServices.miniScheduleService.convertToTime', function() {

    beforeEach(module('BCTAppServices'));

    var miniScheduleService;

    beforeEach(inject(function($injector) {

        miniScheduleService = $injector.get('miniScheduleService');

    }));

    it('should convert to a time string', function() {

        expect(miniScheduleService.convertToTime(1230)).toBe("12:30");
        expect(miniScheduleService.convertToTime("1230")).toBe("12:30");

    });

});

describe('BCTAppServices.scheduleDownloadAndTransformation.' +
'tabularizeDepartures', function() {

    beforeEach(module('BCTAppServices', 'BCTAppValues',  'ServicesMockData'));

    var scheduleDownloadAndTransformation;
    var mock_tabularizeDepartures_data;

    beforeEach(inject(function($injector) {

        scheduleDownloadAndTransformation = $injector.get(
            'scheduleDownloadAndTransformation'
        );

        mock_tabularizeDepartures_data = $injector.get(
            'scheduleDownloadAndTransformation_tabularizeDepartures'
        );

    }));

    it('should \"tabularize\" data (see function definition in ' +
    'services.js for details)',
    function() {

        expect(scheduleDownloadAndTransformation.tabularizeDepartures(
            mock_tabularizeDepartures_data.mock_input
        )).toEqual(
            mock_tabularizeDepartures_data.expected_output
        );

    });

});

describe('BCTAppServices.scheduleDownloadAndTransformation.' +
'getNearestTimes', function() {

    beforeEach(module('BCTAppServices', 'BCTAppValues', 'ServicesMockData'));

    var scheduleDownloadAndTransformation;
    var miniScheduleService;
    var mock_schedule_data;

    beforeEach(inject(function($injector) {

        scheduleDownloadAndTransformation = $injector.get(
            'scheduleDownloadAndTransformation'
        );

        miniScheduleService = $injector.get('miniScheduleService');

        mock_schedule_data = $injector.get(
            'scheduledownloadAndTransformation_downloadSchedule'
        );

    }));

    it('should return arrays of the bus departure times closest in time ' +
    'to some given departure time, both before and after the given time',
    function() {

        var mock_departures = scheduleDownloadAndTransformation.
        extractDeparturesFromSchedule(mock_schedule_data.Today);

        expect(miniScheduleService.getNearestTimes(
            "12:30", // Target time, i.e., get times nearest to this time
            mock_departures, // Schedule data taken from a test request
            1, // Number of times to report before current time
            3  // Number of times to report after current time
        )).toEqual({

            "prev_times":[
                "12:27"
            ],

            "next_times":[
                "12:44",
                "13:01",
                "13:18"
            ]

        });

    });

});

describe('BCTAppServices.unitConversionAndDataReporting.' +
'calculateAndFormatTimeDifferences', function() {

    beforeEach(module('BCTAppServices', 'BCTAppValues'));

    var unitConversionAndDataReporting;

    beforeEach(inject(function($injector) {

        unitConversionAndDataReporting = $injector.get(
            'unitConversionAndDataReporting'
        );

    }));

    it('should return an array of \"time and diff\" objects, which contain ' +
    'the given time string, a formatted difference string, and a 12-hour ' +
    'formatted time string, when provided an array of the bus departure ' +
    'times closest to the reference time, and the reference time itself.',
    function() {

        expect(unitConversionAndDataReporting.calculateAndFormatTimeDifferences(
            ["15:17", "15:35", "15:53", "16:12"], "15:29"
        )).toEqual([
            {
                "time":"15:17",
                "diff":"12 minutes ago",
                "time_12H":"3:17 PM"
            },
            {
                "time":"15:35",
                "diff":"in 6 minutes",
                "time_12H":"3:35 PM"
            },
            {
                "time":"15:53",
                "diff":"in 24 minutes",
                "time_12H":"3:53 PM"
            },
            {
                "time":"16:12",
                "diff":"in 43 minutes",
                "time_12H":"4:12 PM"
            }
        ]);

    });

});

describe('BCTAppServices.locationService.' +
'changeToDefaultLocationIfOutsideOfFlorida', function() {

    // Disabling console output for this unit

    var logger;

    beforeAll(function() {

        logger = console.log;

        console.log = function() {};

    });

    beforeEach(module('BCTAppServices', 'BCTAppValues'));

    var locationService;
    var default_demo_coords;

    beforeEach(inject(function($injector) {

        locationService = $injector.get('locationService');

        default_demo_coords = $injector.get('default_demo_coords');

    }));

    var test_coord_obj_within_bounds = {

        "LatLng":{
            "Latitude": 26.00,
            "Longitude": -80.25
        }

    };

    it('should return the coordinates given since the test location is ' +
        'within bounds', function() {

        expect(locationService.changeToDefaultLocationIfOutsideOfFlorida(
            test_coord_obj_within_bounds
        )).toEqual(test_coord_obj_within_bounds);

    });

    var test_coord_obj_out_of_bounds = {

        "LatLng":{
            "Latitude": 45.5017156,
            "Longitude": -73.5728669
        }

    };

    it('should return default coordinates (within Florida) since the test ' +
    'location is out of bounds', function() {

        expect(locationService.changeToDefaultLocationIfOutsideOfFlorida(
            test_coord_obj_out_of_bounds
        )).toEqual(default_demo_coords.LatLng);

    });

    afterAll(function() {

        console.log = logger;

    });

});

describe('BCTAppServices.generalServiceUtilities.formatDateYYYYMMDD', 
function() {

    beforeEach(module('BCTAppServices', 'BCTAppValues'));

    var generalServiceUtilities;

    beforeEach(inject(function($injector) {

        generalServiceUtilities = $injector.get('generalServiceUtilities');

    }));

    var mock_date = new Date("2015/01/02");

    it('should convert a date object to the format YYYYMMDD', function() {

        expect(generalServiceUtilities.formatDateYYYYMMDD(mock_date)).toEqual(
            "20150102"
        );

    });

});

describe('BCTAppServices.nearestStopsService.findNearestStops', function() {

    beforeEach(module('BCTAppServices', 'BCTAppValues', 'ServicesMockData'));

    var nearestStopsService;
    var mock_findNearestStops_data;

    beforeEach(inject(function($injector) {

        nearestStopsService = $injector.get('nearestStopsService');

        mock_findNearestStops_data = $injector.get(
            'nearestStopsService_findNearestStops'
        );

    }));

    it('should sort a given list of stops by distance to a reference stop',
    function() {

        var mock_location = {
            "LatLng":{
                "Latitude": 26.00,
                "Longitude": -80.25
            }
        };

        expect(
            nearestStopsService.findNearestStops(
                mock_location,
                false,
                false
            )
        ).toEqual(
            mock_findNearestStops_data.expected_output
        );

    });

});

/*

    BCTAppServices_AllDataDownloads

    This testing suite checks to see if JSON data returned from the backend
    is always in the expected format. Due to its relatively slow nature, it
    should always be the last suite to run.

    The requests are not made with Angular's $http and $httpBackend service,
    and instead are made from a utility found in test_main.js, the tests init
    file. This is because, for unit testing and for this version of Angular
    (1.2.x) and Jasmine (2.1.x), $httpBackend can only mock API requests.

    With Angular's End-to-End testing package, $httpBackend allows actual
    API calls to be made. However, this simple suite does not technically
    fall under the category integration testing. Since it involves making
    non-mock requests to the application's backend, it perhaps cannot be
    considered to be unit testing per se either.

    For these reasons, this suite will be considered a form of "mid-way"
    testing, and the data retrieval will rely solely on the built-in XHR
    methods.

*/

describe('BCTAppServices_AllDataDownloads', function() {

    beforeAll(function() {

        console.log("Performing mid-way tests.");

        jasmine.addMatchers(ISR.testing.utils.custom_matchers);

    });

    var info_types = {

        landmarks: {

            url: "http://174.94.153.48:7777/TransitApi/Landmarks/",
            body: { "AgencyId": "BCT" }

        },

        routes: {

            url: "http://174.94.153.48:7777/TransitApi/Routes/",
            body: { "AgencyId": "BCT" }

        },

        stops: {

            url: "http://174.94.153.48:7777/TransitApi/Stops/",
            body: { "AgencyId": "BCT" }

        }

    };

    it('should return properly-formatted data for landmarks',
    function(done) {

        ISR.testing.utils.POSTRequestJSONFromAPI(
            info_types.landmarks.url,
            info_types.landmarks.body,
            function(responseText) {

                var landmarks = JSON.parse(responseText);

                for (var lmk=0;lmk<landmarks.length;lmk++) {

                    expect(landmarks[lmk]).toBeFormattedProperly("landmarks");

                }

                ISR.testing.utils.reportErrorsIfExist();

                done();

            }
        );

    });

    it('should return properly-formatted data for routes',
    function(done) {

        ISR.testing.utils.POSTRequestJSONFromAPI(
            info_types.routes.url,
            info_types.routes.body,
            function(responseText) {

                var routes = JSON.parse(responseText);

                for (var route=0;route<routes.length;route++) {

                    expect(routes[route]).toBeFormattedProperly("routes");

                }

                ISR.testing.utils.reportErrorsIfExist();

                done();

            }
        );

    });

    it('should return properly-formatted data for stops',
    function(done) {

        ISR.testing.utils.POSTRequestJSONFromAPI(
            info_types.stops.url,
            info_types.stops.body,
            function(responseText) {

                var stops = JSON.parse(responseText);

                for (var bstop=0;bstop<stops.length;bstop++) {

                    expect(stops[bstop]).toBeFormattedProperly("stops");

                }

                ISR.testing.utils.reportErrorsIfExist();

                done();

            }
        );

    });

});