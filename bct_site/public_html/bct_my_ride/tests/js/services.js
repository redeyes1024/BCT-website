describe('BCTAppServices.miniScheduleService', function() {

    /* Testing convertToTime Function */

    beforeEach(module('BCTAppServices'));

    var miniScheduleService;

    beforeEach(inject(function($injector) {

        miniScheduleService = $injector.get('miniScheduleService');

    }));

    it('Should convert to a time string', function() {

        expect(miniScheduleService.convertToTime(1230)).toBe("12:30");
        expect(miniScheduleService.convertToTime("1230")).toBe("12:30");

    });

});

describe('BCTAppServices.scheduleDownloadAndTransformation', function() {

    /* Testing getNearestTimes Function */

    beforeEach(module('BCTAppServices', 'BCTAppValues', 'AllMockData'));

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

    it('Should return arrays of the bus departure times closest in time ' +
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