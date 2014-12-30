describe('BCTAppServices.miniScheduleService', function() {

    var miniScheduleService;

    beforeEach(module('BCTAppServices'));

    beforeEach(inject(function($injector) {

        miniScheduleService = $injector.get('miniScheduleService');

    }));

    it('Should convert to a time string', function() {

        expect(miniScheduleService.convertToTime(1230)).toBe("12:30");
        expect(miniScheduleService.convertToTime("1230")).toBe("12:30");

    });

});

describe('BCTAppServices.scheduleDownloadAndTransformation', function() {

//    var $httpBackend;
    var scheduleDownloadAndTransformation;
    var http;
//    var scheduleRequestHandler;

    beforeEach(module('BCTAppServices'));

    beforeEach(inject(function($injector) {

        http = $injector.get('$http');

//        $httpBackend = $injector.get('$httpBackend');

        scheduleDownloadAndTransformation =
        $injector.get('scheduleDownloadAndTransformation');

    }));

    it('Should transform the schedule',
    function() {

//        scheduleRequestHandler = $httpBackend.when(
//            'POST', 'http://174.94.153.48:7777/TransitApi/Schedules/'
//        ).respond(
//            getJSONFixture(
//                'sheduledownloadAndTransformation_downloadSchedule.mock'
//            )
//        );

        http.get(
            'sheduledownloadAndTransformation_downloadSchedule.mock.json'
        ).success(function(data) {

            var mock_schedule_data = data;

            expect(scheduleDownloadAndTransformation.transformSchedule(
                "nearest", mock_schedule_data
            )).toBe("");

            expect(scheduleDownloadAndTransformation.transformSchedule(
                "datepick", mock_schedule_data
            )).toBe("");

        });

    });

});