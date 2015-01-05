var services_mock_data = angular.module('ServicesMockData', []);

describe('BCTAppServices.miniScheduleService', function() {

    /* Testing convertToTime Function */

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

describe('BCTAppServices.scheduleDownloadAndTransformation', function() {

    /* Testing tabularizeDepartures Function */

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

describe('BCTAppServices.scheduleDownloadAndTransformation', function() {

    /* Testing getNearestTimes Function */

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

describe('BCTAppServices.locationService', function() {

    // Disabling console output for this unit

    var logger;

    beforeAll(function() {

        logger = console.log;

        console.log = function() {};

    });

    /* Testing changeToDefaultLocationIfOutsideOfFlorida Function */

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