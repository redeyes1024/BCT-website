describe('BCTAppServices.miniScheduleService', function() {

    /* Testing convertToTime Function */

    var miniScheduleService;

    beforeEach(module('BCTAppServices'));

    beforeEach(inject(function($injector) {

        miniScheduleService = $injector.get('miniScheduleService');

    }));

    it('Should convert to a time string', function() {

        expect(miniScheduleService.convertToTime(1230)).toBe("12:30");
        expect(miniScheduleService.convertToTime("1230")).toBe("12:30");

    });

    /* Testing getNearestTimes Function */

    var http;
    var mock_schedule_data;

    beforeEach(inject(function($injector) {

        http = $injector.get('$http');

    }));

    beforeEach(function(done) {
        
        http({

            method: 'GET',

            url: 'mock/' +
            'scheduledownloadAndTransformation_downloadSchedule.mock.json'

        }).then(function(data) {

            mock_schedule_data = miniScheduleService.
            extractDeparturesFromSchedule(data);

            done();

        });

    });

    it('Should return arrays of the bus departure times closest in time ' +
    'to some given departure time, both before and after the given time',
    function() {

        expect(miniScheduleService.getNearestTimes(
            "12:30", // Target time, i.e., get times nearest to this time
            mock_schedule_data, // Schedule data taken from a test request
            1, // Number of times to report before current time
            3  // Number of times to report after current time
        )).toEqual({

            "prev_times":[
                "12:27"
            ],

            "next_times":[
                "12:45",
                "13:01",
                "13:18"
            ]
        
        });

    });

});

describe('BCTAppServices.scheduleDownloadAndTransformation', function() {

////    var $httpBackend;
//    var scheduleDownloadAndTransformation;
////    var scheduleRequestHandler;
//
//    beforeEach(module('BCTAppServices'));
//
//    beforeEach(inject(function($injector) {
//
////        $httpBackend = $injector.get('$httpBackend');
//
//        scheduleDownloadAndTransformation =
//        $injector.get('scheduleDownloadAndTransformation');
//
//    }));
//
//    it('Should add the correct nearest times',
//    function() {
//
////        scheduleRequestHandler = $httpBackend.when(
////            'POST', 'http://174.94.153.48:7777/TransitApi/Schedules/'
////        ).respond(
////            getJSONFixture(
////                'sheduledownloadAndTransformation_downloadSchedule.mock'
////            )
////        );
//
//    });

});