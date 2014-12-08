var BCTAppServices = angular.module('BCTAppServices', []);

//BCTAppServices.service('scheduleSocketService', ['$q', 'scheduleWebSocket',
//    function($q, scheduleWebSocket) {
//
//    var self = this;
//    var currentCallbackId = 0;
//    //this.callbacks = {};
//
//    this.sendRequest = function(request) {
//        //var callbackId = self.getCallbackId();
//
//        //request.callback_id = callbackId;
//        console.log('Sending request', request);
//        scheduleWebSocket.send(request);
//    };
//    this.listener = function(data) {
//        var messageObj = data;
//        console.log("Received data from websocket: ", messageObj);
//        if(callbacks.hasOwnProperty(messageObj.callback_id)) {
//            console.log(callbacks[messageObj.callback_id]);
//            $rootScope.$apply(self.callbacks[messageObj.callback_id].
//            cb.resolve(messageObj.data));
//            delete self.callbacks[messageObj.callbackID];
//        }
//    };
////    this.getCallbackId = function() {
////        currentCallbackId += 1;
////        if(currentCallbackId > 10000) {
////            currentCallbackId = 0;
////        }
////        return currentCallbackId;
////    };
//    this.echo = function(request) {
//        self.sendRequest(request);
//    };
//}]);

BCTAppServices.service('miniScheduleService', [ function() {

    var self = this;

    this.convertToTime = function(time) {

        var int_arr;

        var day_flag = "";

        if (typeof time === "string") {

            var int_arr_with_flag = time.split(";");

            int_arr = int_arr_with_flag[0].split("");

            day_flag = int_arr_with_flag[1] ? ";" + int_arr_with_flag[1] : "";

        }

        else if (typeof time === "number") {

            int_arr = String(time).split("");

        }

        int_arr.splice(-2,0,":");

        return int_arr.join("") + day_flag;

    };

    this.mini_schedule_quantity_defaults = {
        before_times: 1,
        after_times: 3
    };

    this.mini_schedule_quantity_defaults.total_times =
        this.mini_schedule_quantity_defaults.before_times +
        this.mini_schedule_quantity_defaults.after_times;

    this.makeMiniScheduleLoadingTemplate = function(loading_error) {

        var mini_schedule_loading_template = [];

        if (loading_error) {

            var time_holder = {

                time: "",
                diff: "",
                time_12H: ""

            };

        }

        else {

            var time_holder = {

                time: "Loading...",
                diff: "",
                time_12H: "Loading..."

            };

        }

        for (var i=0;i<self.mini_schedule_quantity_defaults.total_times;i++) {

            mini_schedule_loading_template.push(time_holder);

        }

        return mini_schedule_loading_template;

    };

    this.findPrevNearestTimes = function(nearest, times_int, int_index, bef) {

        var spliced_flag = false;

        var first_day_schedule_index = 0;

        var prev_day_schedule_index = times_int.length - 1;

        var prev_time_index = int_index - first_day_schedule_index - 1;

        while (nearest.prev_times.length < bef) {

            first_day_schedule_index = 0;

            if (prev_time_index > -1 && times_int[prev_time_index]) {

                nearest.prev_times.push("" + times_int[prev_time_index]);

                prev_time_index--;

            }

            else {

                if (!spliced_flag) {

                    times_int.splice(int_index, 1);

                    spliced_flag = true;

                    prev_day_schedule_index--;

                }

                nearest.prev_times.push(
                    "" + times_int[prev_day_schedule_index] + ";prev"
                );

                prev_day_schedule_index--;

            }

        }

    };

    this.findNextNearestTimes = function(nearest, times_int, int_index, aft) {

        var spliced_flag = false;

        var first_day_schedule_index = 0;

        var next_day_schedule_index = 0;

        var next_time_index = int_index + first_day_schedule_index + 1;

        while (nearest.next_times.length < aft) {

            first_day_schedule_index = 0;

            if (times_int[next_time_index]) {

                nearest.next_times.push("" + times_int[next_time_index]);

                next_time_index++;

            }

            else {

                if (!spliced_flag) {

                    times_int.splice(int_index, 1);

                    spliced_flag = true;

                }

                nearest.next_times.push(
                    "" + times_int[next_day_schedule_index] + ";next"
                );

                next_day_schedule_index++;

            }

        }

    };

    this.getNearestTimes = function(time, times, bef, aft) {

        if (!bef) {
            var bef = self.mini_schedule_quantity_defaults.before_times;
            var aft = self.mini_schedule_quantity_defaults.after_times;
        }

        else if (!aft) {
            var aft = self.mini_schedule_quantity_defaults.after_times;
        }
        
        var times_int = times.map(function(a) {

            return parseInt(a.replace(/:/,""));

        });

        var now_int = parseInt(time.replace(/:/,""));

        var nearest = {
            prev_times: [],
            next_times: []
        };

        times_int.push(now_int);
        times_int.sort((function(a,b) { return (a-b); }));

        var int_index = times_int.indexOf(now_int);

        self.findPrevNearestTimes(nearest, times_int, int_index, bef);

        self.findNextNearestTimes(nearest, times_int, int_index, aft);

        nearest.prev_times = nearest.prev_times.map(self.convertToTime);
        nearest.next_times = nearest.next_times.map(self.convertToTime);

        return nearest;

    };

}]);

BCTAppServices.service('locationService', [ '$timeout', 'latest_location',
'default_demo_coords', 'target_area_bounds', 'timer_constants',

function($timeout, latest_location, default_demo_coords, target_area_bounds,
timer_constants) {

    var self = this;

    this.getDefaultDemoCoords = function(coord_labels) {

        var default_coords = {};

        default_coords[coord_labels[0]] = default_demo_coords.LatLng.Latitude;
        default_coords[coord_labels[1]] = default_demo_coords.LatLng.Longitude;  

        return default_coords;

    };

    this.updateLatestLocation = function(location) {

        var lat = location.coords.latitude;
        var lng = location.coords.longitude;
        var time = location.timestamp;

        latest_location.timestamp = time;

        latest_location.LatLng = {
            Latitude: lat,
            Longitude: lng
        };

    };

    /*  
        Note on the getCurrentLocation function:

        Since the geolocation API contains no indication that the user
        agreed to share their location before loading, the loading animation
        begins when the location button is pressed. Thus the actual loading
        will
        not start until the user agrees to share their location to the browser.

        Furthermore, some browsers let users ignore location requests
        without a definitive acceptance or refusal to share location. When
        this occurs, there is no way to tell when the loading animation
        must stop.

        Therefore, the function contains a work-around that will cover
        most cases. It depends on the presumption that if a location isn't
        received within some (adjustable) cutoff time, it is presumed that
        the user ignored the request, and the animation will stop. If the
        user then decides to share their location after ignoring it, the
        result will be ignored, requiring the user to send a fresh location
        request, preventing the coordinates from popping up in the start
        input section of the trip planner unexpectedly.

        In short, the user has the number of seconds stored in the 
        'constant' $scope.timer_constants.location_service.request_ignored
        *minus* the amount of time it takes the location to be retrieved,
        otherwise it is presumed that the user ignored the location request
        and will have to click the location button again.
    */

    this.getCurrentLocationAndDisplayData =
    function(setLoadingAnimation, displayData) {

        var latest_location_prompt_time = new Date;

        var time_since_last_location_prompt = 
        latest_location_prompt_time - latest_location.timestamp;

        if (time_since_last_location_prompt <
            timer_constants.location_service.recalculate_location) {

            displayData(latest_location);

            return true;

        }

        setLoadingAnimation("active");

        navigator.geolocation.getCurrentPosition(

            function(p_res) {

                var latest_successful_location_request_time = new Date;

                if ((latest_successful_location_request_time -
                    latest_location_prompt_time) <
                    timer_constants.location_service.request_ignored) {

                    self.updateLatestLocation(p_res);

                    displayData(latest_location);

                    setLoadingAnimation("inactive");

                }

            },

            function() {

                console.log("Location request cancelled or failed.");

                setLoadingAnimation("inactive");

            },

            {
                timeout: timer_constants.location_service.request_ignored
            }

        );

        var user_ignored_location_request_timer = $timeout(function() {
            setLoadingAnimation("inactive");
        }, timer_constants.location_service.request_ignored);

        return user_ignored_location_request_timer;

    };

    this.checkIfLocationWithinBounds = function(coords) {

        var bounds = target_area_bounds;

        var lat = coords.LatLng.Latitude;
        var lng = coords.LatLng.Longitude;

        var within_lat_bounds = bounds.lat.min <= lat && lat <= bounds.lat.max;
        var within_lng_bounds = bounds.lng.min <= lng && lng <= bounds.lng.max;

        var bounds_check = within_lat_bounds && within_lng_bounds;

        return bounds_check;

    };

    //Change reference location if client is not in South East Florida
    //For demonstration/testing only, to make development location-agnostic
    this.changeToDefaultLocationIfOutsideOfFlorida = function(
        current_location
    ) {

        if (!self.checkIfLocationWithinBounds(current_location)) {

            current_location = self.getDefaultDemoCoords(
                ["Latitude", "Longitude"]
            );

            console.log(
                "User outside of local region. " +
                "Using demonstration coordinates."
            );

        }

        return current_location;

    };

}]);

BCTAppServices.service('nearestStopsService', [ 'locationService',
'full_bstop_data', 'nearest_stops_service_constants',

function(locationService, full_bstop_data, nearest_stops_service_constants) {

    var self = this;

    //Calculate distance between two geographic points, not taking the Earth's
    //curvature into account since the comparison is between relatively short
    //distances and it is unlikely that factoring this in would change the
    //order of shorest-to-longest distances
    this.computeLinearDistance = function(coords1, coords2) {

        var lat_span = coords1.Latitude - coords2.Latitude;
        var lng_span = coords1.Longitude - coords2.Longitude;

        var distance_sq = Math.pow(lat_span, 2) + Math.pow(lng_span, 2);
        var linear_distance = Math.pow(distance_sq, 0.5);

        return linear_distance;

    };

    this.labelDistancesAndConvertFromDegrees = function (distance) {

        var units = "yards";
        var distance_in_degrees = distance;
        var reported_distance = "";

        var distance_in_meters = distance_in_degrees * 111111;
        var distance_in_yards = distance_in_meters * 1.09361;

        if (distance_in_yards >= 10) {

            //Because distances were converted roughly to and from degrees
            //latitude and longitude, rounding is extensive
            var rounded_distance = (distance_in_yards / 10).toFixed(0) * 10;

            reported_distance = rounded_distance + " " + units;

        }

        else {

            reported_distance = "within 10 yards";

        }

        return reported_distance;

    };

    this.sortStopsByDistance = function(
        current_location,
        bstops_list,
        keep_distance_property
    ) {

        for (var i=0;i<bstops_list.length;i++) {

            var current_coords = current_location.LatLng || current_location;

            var distance = self.computeLinearDistance(
                current_coords,
                bstops_list[i].LatLng
            );

            bstops_list[i].distance = distance;

        }

        bstops_list.sort(function(sd1, sd2) {
            return sd1.distance - sd2.distance;
        });

        if (!keep_distance_property) {
            for (var i=0;i<bstops_list.length;i++) {
                //delete bstops_list[i].distance;
            }
        }

        return bstops_list;
    };

    this.findNearestStops = function(
        current_location,
        return_full_list,
        disable_location_check
    ) {

        if (!disable_location_check) {

            current_location =
            locationService.
            changeToDefaultLocationIfOutsideOfFlorida(current_location);

        }

        var full_bstop_list_ids_coords = [];

        for (var i=0;i<full_bstop_data.list.length;i++) {

            full_bstop_list_ids_coords.push({
                Id: full_bstop_data.list[i].Id,
                LatLng: full_bstop_data.list[i].LatLng,
                Code: full_bstop_data.list[i].Code
            });

        }

        full_bstop_list_ids_coords = self.sortStopsByDistance(
            current_location,
            full_bstop_list_ids_coords,
            true
        );

        var stops_below_cutoff = full_bstop_list_ids_coords.
        filter(function(sd) {
            return sd.distance < nearest_stops_service_constants.max_dist;
        });

        var nearest_bstops;

        if (return_full_list) {

            nearest_bstops = stops_below_cutoff;

        } 

        else {

            nearest_bstops = stops_below_cutoff.
            slice(0, nearest_stops_service_constants.max_reported_stops);

        }

        for (var j=0;j<nearest_bstops.length;j++) {

            nearest_bstops[j].distance = self.
            labelDistancesAndConvertFromDegrees(nearest_bstops[j].distance);

            nearest_bstops[j].Name =
            full_bstop_data.dict[nearest_bstops[j].Id].Name;
            
            nearest_bstops[j].show_dist = true;

        }

        return nearest_bstops;
    };

}]);

BCTAppServices.service('placeholderService', [ function() {

    this.createLoadingPlaceholder = function(length, content) {

        var placeholder_arr = [];
        var placeholder_length = length;
        var placeholder_content = content;

        for (var i=0;i<placeholder_length;i++) {
            placeholder_arr.push(placeholder_content);
        }

        return placeholder_arr;

    };

}]);

BCTAppServices.service('landmarkInfoService', ['$http', '$q',
'generalServiceUtilities',

function($http, $q, generalServiceUtilities) {

    this.downloadLandmarkInfo = function() {

        if (localStorage.landmark_data) {

            var deferred = $q.defer();
            var promise = deferred.promise;

            var virtual_response = {
                data: JSON.parse(localStorage.landmark_data)
            };

            deferred.resolve(virtual_response);

            return promise;

        }

        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitApi/Landmarks/',
            data: {
                "AgencyId":"BCT"
            },
            transformResponse: function(res) {

                if (localStorage) {
                    localStorage.setItem('landmark_data', res);
                }

                return generalServiceUtilities.
                tryParsingResponse(res, "downloadLandmarkInfo");

            }
        });

    };

}]);

BCTAppServices.service('scheduleDownloadAndTransformation', ['$http', '$q',
'miniScheduleService', 'generalServiceUtilities',
'full_schedule_category_with_datepicker',

function($http, $q, miniScheduleService, generalServiceUtilities,
full_schedule_category_with_datepicker) {

    //TO DO: Backend will create "booking version" string for all data sets;
    //It will be requested and compared to see if and what data must be updated
    var self = this;

    this.downloadRouteInfo = function() {

        if (localStorage.route_data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var virtual_response = {
                data: JSON.parse(localStorage.route_data)
            };

            deferred.resolve(virtual_response);

            return promise;
        }

        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitApi/Routes/',
            data: {
                "AgencyId":"BCT"
            },
            transformResponse: function(res) {

                if (localStorage) {
                    localStorage.setItem('route_data', res);
                }

                return generalServiceUtilities.
                tryParsingResponse(res, "downloadRouteInfo");

            }
        });

    };

    this.downloadStopInfo = function() {

        if (localStorage.stop_data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var virtual_response = {
                data: JSON.parse(localStorage.stop_data)
            };

            deferred.resolve(virtual_response);

            return promise;
        }

        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitApi/Stops/',
            data: { 
                "AgencyId": "BCT"
            },
            transformResponse: function(res) {

                if (localStorage) {
                    localStorage.setItem('stop_data', res);
                }

                return generalServiceUtilities.
                tryParsingResponse(res, "downloadStopInfo");

            }
        });

    };

    this.downloadSchedule = function(route, stop, date) {

        if (!date) {
            var date = new Date;
        }

        var formatted_date = generalServiceUtilities.formatDateYYYYMMDD(date);

        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitApi/Schedules/',
            data: { 
                "AgencyId": "BCT",
                "RouteId": route,
		"StopId": stop,	
		"Direction": "1",
		"Date": formatted_date
            },
            transformResponse: function(res) {

//                if (localStorage) {
//                    localStorage.setItem('route_data', res);
//                }

                return generalServiceUtilities.
                tryParsingResponse(res, "downloadSchedule");

            }
        });

    };

    this.downloadStopsForRoute = function(route) {

        var date = new Date;

        var formatted_date = generalServiceUtilities.formatDateYYYYMMDD(date);

        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitApi/BusStop/',
            data: {
                "AgencyId": "BCT",
                "RouteId": route,
		"Direction": "0",
		"Date": formatted_date
            },
            transformResponse: function(res) {

                return generalServiceUtilities.
                tryParsingResponse(res, "downloadStopsForRoute");

            }
        });

    };

    /*

        Converts an array of 24-hour time strings into "tabular" form. e.g.:

        Input:

        ["15:00", "15:10", "15:20", "15:30", "17:50"]

        Output:

        hours: [
            ...
            {
                hour_label: 15,
                minutes: ["00", "10", "20", "30"]
            },
            {
                hour_label: 16,
                minutes: []
            },
            {
                hour_label: 17,
                minutes: ["50"]
            }
            ...
        ]

        Note that the function first creates an intermediate data structure
        that labels the indices of the "hours" array as strings of an object,
        so that "minute" strings can be added more easily in the loop. The
        output structure is finalized by the last loop.

    */

    this.tabularizeDepartures = function(departures) {

        var hour_obj_list_labelled = {};

        var hours_in_day = 24;

        for (var i=0;i<hours_in_day;i++) {

            var hour_obj = {

                hour_label: String(i),
                minutes: []

            };

            if (i < 10) {

                i = "0" + i;

            }

            hour_obj_list_labelled[String(i)] = hour_obj;

        }

        for (var d=0;d<departures.length;d++) {

            var departure_split = departures[d].split(":");

            var hour = departure_split[0];
            var minute = departure_split[1]; 

            hour_obj_list_labelled[hour].minutes.push(minute);

        }

        var hour_obj_list_numerically_indexed = [];

        for (var h_obj in hour_obj_list_labelled) {

            hour_obj_list_numerically_indexed.
            push(hour_obj_list_labelled[h_obj]);

        }

        hour_obj_list_numerically_indexed.sort(function(hour_1, hour_2) {
            return Number(hour_1.hour_label) - Number(hour_2.hour_label);
        });

        return hour_obj_list_numerically_indexed;

    };

    this.transformSchedule = function(output_type, s_times) {

        var date_time = new Date;
        var now = date_time.toTimeString().slice(0,5);
        var departures = [];
        var schedule_output = {};

        for (var i=0;i<s_times.length;i++) {

            departures.push(s_times[i].DepartureTime);

        }

        switch (output_type) {

            case "nearest":

                schedule_output.nearest =
                miniScheduleService.getNearestTimes(now, departures);

                schedule_output.nearest.all = schedule_output.nearest.
                prev_times.concat(schedule_output.nearest.next_times);

                break;

            case "datepick":

                full_schedule_category_with_datepicker[0].hours =
                self.tabularizeDepartures(departures.slice());

                break;

        }

        schedule_output.raw = s_times;

        return schedule_output;

    };

    this.calculateTimeDifference = function(times_arr) {

        var diff_arr = [];

        var t2 = (new Date).toTimeString().slice(0,5);
        var t2_h = parseInt(t2.split(":")[0]);
        var t2_m = parseInt(t2.split(":")[1]);
        var min_t2 = t2_h * 60 + t2_m;

        for (var i=0;i<times_arr.length;i++) {

            var day_flag = times_arr[i].split(";")[1];

            var t1;

            if (day_flag) {

                t1 = times_arr[i].split(";")[0];

            }

            else {

                t1 = times_arr[i];

            }

            var t1_h = parseInt(t1.split(":")[0]);
            var t1_m = parseInt(t1.split(":")[1]);
            var min_t1 = t1_h * 60 + t1_m;

            var diff = min_t1 - min_t2;

            if (day_flag) {

                if (day_flag === "next") { diff += 1440; }
                else if (day_flag === "prev") { diff -= 1440; }

            }

            diff_arr.push(diff);

        }

        return diff_arr;

    };

}]);

BCTAppServices.service('unitConversionAndDataReporting', [ 
'scheduleDownloadAndTransformation',

function(scheduleDownloadAndTransformation) {

    var self = this;

    this.formatReportedDistance = function(raw_distance) {
        var reported_distance = 0;
        var reported_distance_unit = "";

        var d_in_yards = raw_distance * 1.0936133;

        if (d_in_yards >= 880) {
            var d_in_miles = d_in_yards / 1760;
            reported_distance = d_in_miles.toFixed(1);
            reported_distance_unit = "miles";
        }
        else {
            reported_distance = d_in_yards.toFixed(0);
            reported_distance_unit = "yards";
        }

        return {
            reported_distance: reported_distance,
            reported_distance_unit: reported_distance_unit
        };

    };

    this.splitHoursMinutes = function(minutes_count) {

        var minutes_label = " minute";
        var mins_plural = "s";

        var hours_label = "";
        var hours_count = "";
        var hours_plural = "s";

        var divider = ", ";

        if (parseInt(minutes_count) > 59) {
            hours_count = String(parseInt(minutes_count / 60));
            minutes_count = String(minutes_count % 60);

            hours_label = " hour";
        }
        else {
            hours_plural = "";
            divider = "";
        }

        if (parseInt(minutes_count) === 1) {
            mins_plural = "";
        }
        if (parseInt(hours_count) === 1) {
            hours_plural = "";
        }

        var formatted_hours_with_minutes = hours_count + hours_label +
        hours_plural + divider + minutes_count + minutes_label +
        mins_plural;

        return formatted_hours_with_minutes;

    };

    this.formatReportedDuration = function(raw_duration) {

        var minutes_count =  (raw_duration / 1000 / 60).toFixed(0);

        var formatted_duration = self.splitHoursMinutes(minutes_count);

        return formatted_duration;

    };

    this.addTimeDiffMessages = function(diff_arr) {

        var message_arr = [];

        for (var i=0;i<diff_arr.length;i++) {

            var start_text = "";
            var end_text = "";
            var time_difference = "";

            if (diff_arr[i] < 0) {
                time_difference = self.splitHoursMinutes(diff_arr[i] * -1);
                end_text = " ago";
            }

            else if (diff_arr[i] > 0) {
                time_difference = self.splitHoursMinutes(diff_arr[i]);
                start_text = "in ";
            }

            else if (diff_arr[i] === 0) {
                start_text = "about now";
            }

            var time_diff_message = start_text + time_difference + end_text;

            message_arr.push(time_diff_message);

        }
        return message_arr;

    };

    this.formatReportedDate = function(raw_date) {

        var formatted_date = raw_date.slice(11, 16);

        return formatted_date;

    };

    this.checkIfCorrectTripPlannerIcon = function(leg_data, icon_type) {

        var icon_is_correct = false;

        if (leg_data.modeField === icon_type) {

            icon_is_correct = true;

        }

        return icon_is_correct;

    };

    this.getAltOrTitleText = function(leg_data) {

        return full_text;

    };

    this.convertToTwelveHourTime = function(twenty_four_hour_time) {

        var twelve_hour_time;

        var am_pm = "AM";

        var hour = Number(twenty_four_hour_time.split(":")[0]);

        var minute = twenty_four_hour_time.split(":")[1];

        if (hour >= 13) {

            am_pm = "PM";

            hour -= 12;

        }

        else if (hour === 12) {

            am_pm = "PM";

        }

        else if (hour === 0) {

            hour = 12;

        }

        twelve_hour_time = "" + hour + ":" + minute + " " + am_pm;

        return twelve_hour_time;

    };

    this.formatTimeDifferences = function(reprocessed_schedule) {

        var nearest_times = reprocessed_schedule.nearest.all;

        var diffs = scheduleDownloadAndTransformation.calculateTimeDifference(
            nearest_times
        );

        var diff_msgs = self.addTimeDiffMessages(diffs);

        nearest_times =
        reprocessed_schedule.nearest.all.map(function(time_with_day_label) {

            var time = time_with_day_label.split(";")[0];

            return time;

        });

        var times_and_diffs = [];

        for (var i=0;i<nearest_times.length;i++) {

            var time_12H = self.convertToTwelveHourTime(
                nearest_times[i]
            );

            var time_and_diff = {
                time: nearest_times[i],
                diff: diff_msgs[i],
                time_12H: time_12H
            };

            times_and_diffs.push(time_and_diff);

        }

        return times_and_diffs;

    };

}]);

BCTAppServices.service('generalServiceUtilities', [ function() {

    var self = this;

    /*
        passTopScopePropRefsToGenUtils

        This function allows for certain top-level scope values and functions
        to be accessed from the services layer. This is to avoid passing in
        a direct reference to the top-level scope to this layer. Note that
        this function should be used sparingly and only when absolutely
        necessary, e.g., when the alternative would be to put large blocks of
        service-heavy code into the controller layer (thereby bloating the
        controller layer), just to make use of a few top-level scope
        values or functions.

        Select which properties you wish to pass into the services layer via
        the call to generalServiceUtilities.passTopScopePropRefsToGenUtils
        in top_level_controller.js.
    */
    this.passTopScopePropRefsToGenUtils = function(top_level_scope_props) {

        self.top_level_scope_prop_refs = top_level_scope_props;

    };

    this.formatDateYYYYMMDD = function(date_obj) {

        var date = String(date_obj.getDate());
        var date_two_digits = date[1] ? date : "0" + date;

        var full_year = String(date_obj.getFullYear());

        var month = String(date_obj.getMonth() + 1);
        var month_two_digits = month[1] ? month : "0" + month;

        var full_date = full_year + month_two_digits + date_two_digits;

        return full_date;

    };

    this.tryParsingResponse = function(res, function_name) {

        var error_message =
        "There was a problem parsing the data into JSON: " +
        function_name;

        try {

            return JSON.parse(res);

        }

        catch(e) {

            console.log(error_message);

            return false;

        }

    };

}]);

BCTAppServices.service('generalUIUtilities', [ 'map_navigation_marker_indices',
function(map_navigation_marker_indices) {

    var self = this;

    this.getAccordionTopContainer = function(
        main_container, optional_class_label
    ) {

        var accordion_container;

        switch (main_container) {

        case "landmark":
        case "route":

            accordion_container = document.getElementsByClassName(
                "schedule-results-main-container"
            )[0];

            break;

        case "stop":

            accordion_container = document.getElementsByClassName(
                optional_class_label
            )[0];

            break;

        case "recently_viewed":

            accordion_container = document.getElementsByClassName(
                "index-main-container"
            )[0];

            break;

        case "full_schedule":

            accordion_container = document.getElementById(
                "full-schedule-accordion"
            );

            break;

        default:

            console.log(
                "setAccordionPlusMinusIcons: " +
                "You must specify the name of the main target container."
            );

            accordion_container = false;

            break;

        }

        return accordion_container;

    };

    this.setAccordionPlusMinusIcons = function(
        event, main_container, optional_class_label
    ) {

        var accordion_container = self.getAccordionTopContainer(
            main_container, optional_class_label
        );

        var c_buttons =
        accordion_container.getElementsByClassName("collapse-button");

        var targ_cl = event.target.children[0].children[0].classList;
        var list = event.target.parentNode.children[1].classList.contains("in");

        for (var i=0;i<c_buttons.length;i++) {

            c_buttons[i].children[0].classList.remove("fa-minus-circle");
            c_buttons[i].children[0].classList.add("fa-plus-circle");

        }

        if (list) {

            targ_cl.remove("fa-plus-circle");
            targ_cl.add("fa-minus-circle");

        }

        else {

            targ_cl.remove("fa-minus-circle");
            targ_cl.add("fa-plus-circle");

        }

    };

    this.addRouteAndStopParamsToUrl = function(route, stop) {

        var location_prefix;

        if (window.location.toString().
            match(/\/index.html/)) {

            location_prefix = "index.html";

        }

        else if(window.location.toString().
                match(/\/default.aspx/)) {

            location_prefix = "default.aspx";

        }
        
        else if(window.location.toString().
                match(/\/myride_deployment_sample.html/)) {

            location_prefix = "myride_deployment_sample.html";

        }

        var new_url =
        location_prefix + "#routeschedules?route=" + route + "&" +
        "stop=" + stop;

        return new_url;

    };

    this.cycleMarkerInfoWindows = function(original_index, counter_name) {

        var new_index = original_index;

        var marker_list_length = 0;

        if (counter_name === "planner") {
            marker_list_length = myride.dom_q.map.overlays.trip_points.length;
        }

        else if (counter_name === "schedule") {
            marker_list_length =
            myride.dom_q.map.overlays.ordered_stop_list.length;
        }

        if (map_navigation_marker_indices[counter_name] < 0) {

            new_index =
            map_navigation_marker_indices[counter_name] =
            marker_list_length - 1;

        }
        else if (map_navigation_marker_indices[counter_name] ===
        marker_list_length) {

            new_index = map_navigation_marker_indices[counter_name] = 0;

        }

        return new_index;

    };

}]);

BCTAppServices.service('tripPlannerService', [ '$http', '$q',
'generalServiceUtilities', 'unitConversionAndDataReporting',
'trip_planner_constants', 'bct_routes_alt_names',

function($http, $q, generalServiceUtilities, unitConversionAndDataReporting,
trip_planner_constants, bct_routes_alt_names) {

    var self = this;
    var geocoder = new google.maps.Geocoder;

    this.geocodeAddress = function(query_address) {

        var deferred = $q.defer();

        var lat_lng_input = query_address.
        match(/-?[0-9]*\.[0-9]*,-?[0-9]*\.[0-9]*/);

        if (lat_lng_input) {

            var bstop_coords_arr = lat_lng_input[0].split(",");

            var bstop_coords_obj = {
                Latitude: Number(bstop_coords_arr[0]),
                Longitude: Number(bstop_coords_arr[1])
            };

            deferred.resolve(bstop_coords_obj);

        }

        else {

            geocoder.geocode(
                { 'address': query_address },
                function(results, status) {

                    if (status === google.maps.GeocoderStatus.OK) {
                        deferred.resolve(results);
                    }
                    else {
                        deferred.resolve(status);
                    }

                }
            );

        }
        return deferred.promise;
    };

    this.getLatLon = function(start_input_string, finish_input_string) {

        return $q.all([
            self.geocodeAddress(start_input_string),
            self.geocodeAddress(finish_input_string)
        ]);

    };

    this.transformGeocodeCoords = function(coords_object) {

        var lat = coords_object.lat();
        var lng = coords_object.lng();

        return {
            Latitude: lat,
            Longitude: lng
        };

    };

    this.getTripPlanPromise = function(trip_opts, start, finish) {

        var arrdep = false;

        var date =
        generalServiceUtilities.formatDateYYYYMMDD(trip_opts.datepick);

        var time = trip_opts.datepick.toTimeString().slice(0,5);
        var optimize = "";
        var modearr = ["WALK"];

        if (trip_opts.datetarg === "arrive_by") {
            arrdep = true;
        }
        for (var mode in trip_opts.modeswitch) {

            if (trip_opts.modeswitch[mode] === true) {
                modearr.push(mode.toUpperCase());
            }

        }

        return $http({
             method: 'POST',
             url: 'http://174.94.153.48:7777/TransitApi/TripPlanner/',
             data: {
                 "From": start,
                 "To": finish,
                 "ArriveBy": String(arrdep),
                 "MaxWalk": 900,
                 "Date": date,
                 "Time": time,
                 "Mode": modearr
             }
         });
    };

    this.formatRawTripStats = function(all_itineraries) {

        for (var i=0;i<all_itineraries.length;i++) {

            all_itineraries[i].durationFieldFormatted =
            unitConversionAndDataReporting.formatReportedDuration(
                all_itineraries[i].durationField
            );

            all_itineraries[i].startTimeFieldFormatted =
            unitConversionAndDataReporting.formatReportedDate(
                all_itineraries[i].startTimeField
            );

            all_itineraries[i].endTimeFieldFormatted =
            unitConversionAndDataReporting.formatReportedDate(
                all_itineraries[i].endTimeField
            );

            all_itineraries[i].legsField[0].styles =
            "trip-planner-itinerary-step-highlighted";

            for (var j=1;j<all_itineraries[i].legsField.length;j++) {
                all_itineraries[i].legsField[j].styles = "";
            }

        }

        return all_itineraries;

    };

    this.filterTripItineraries = function(all_itineraries) {

        var filtered_trip_itineraries = [];

        var trip_duration_cutoff =
        trip_planner_constants.trip_duration_cutoff_hours;

        var trip_walking_cutoff =
        trip_planner_constants.trip_walking_cutoff_meters;

        for (var i=0;i<all_itineraries.length;i++) {
            
            var trip_duration_in_hours =
            all_itineraries[i].durationField / 1000 / 60 / 60;

            var trip_walking_distance =
            all_itineraries[i].walkDistanceField;

            if (trip_duration_in_hours < trip_duration_cutoff &&
                trip_walking_distance < trip_walking_cutoff) {

                filtered_trip_itineraries.push(all_itineraries[i]);

            }

        }

        return filtered_trip_itineraries;

    };

    this.addAlternateRouteIds = function(all_itineraries) {

        for (var i=0;i<all_itineraries.length;i++) {

            for (var j=0;j<all_itineraries[i].legsField.length;j++) {

                var legs = all_itineraries[i].legsField;

                for (var route_name in bct_routes_alt_names) {

                    if (legs[j].routeLongNameField === route_name) {

                        legs[j].routeField = bct_routes_alt_names[route_name];

                    }

                }

            }

        }

    };

}]);

BCTAppServices.service('profilePageService', [ '$http', 'favorites_data',
'generalServiceUtilities',

function($http, favorites_data, generalServiceUtilities) {

    var self = this;

    this.downloadUserFavorites = function() {

        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitAPI/Favorites',
            data: {
                "UserId": 777,
                "Action": "GET"
            },
            transformResponse: function(res) {

                return generalServiceUtilities.
                tryParsingResponse(res, "downloadUserFavorites");

            }
        });

    };

    this.addFavoriteRouteStop = function(route, stop) {

        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitAPI/Favorites',
            data: {
                UserId: 777,
                Action: "ADD",
                Favorite: {
                    AgencyId: "BCT",
                    RouteId: route,
                    StopId: stop
                }
            }
        });

    };

    this.deleteFavoriteRouteStop = function(record_id) {

       return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitAPI/Favorites',
            data: {
                UserId: 777,
                Action: "DELETE",
                Favorite: {
                    RecordId: record_id + ""
                }
            }
        });

    };

    this.checkIfRouteStopFavorited = function(agency_id, route, stop) {

        for (var i=0;i<favorites_data.favorites.length;i++) {

            if (favorites_data.favorites[i].AgencyId === agency_id &&
                favorites_data.favorites[i].RouteId === route &&
                favorites_data.favorites[i].StopId + "" === stop) {

                return true;

            }

        }

        return false;

    };

    this.showOrHideFavoriteIconSpinner = function(element, show_or_hide) {

        var new_style;
        
        switch (show_or_hide) {

            case "show":

                new_style = "block";

                break;

            case "hide":
                
                new_style = "";

                break;
                
            default:

                console.log(
                    "showOrHideFavoriteIconSpinner: option not available: " +
                    show_or_hide
                );

                return false;

        }

        element.parentNode.children[2].style.display = new_style;

    };

    this.addAndRecordFavoriteRouteStop = function(
        agency_id, route, stop, event
    ) {

        var element = event.currentTarget;

        self.showOrHideFavoriteIconSpinner(element, "show");

        var route_stop_add_promise = self.addFavoriteRouteStop(route, stop);

        route_stop_add_promise.then(function(res) {

            self.showOrHideFavoriteIconSpinner(element, "hide");

            if (res.data.Type === "success") {

                var record_id = res.data.Message;

                var new_favorite = {

                    AgencyId: agency_id,
                    RouteId: route,
                    StopId: stop,
                    RecordId: record_id

                };

                favorites_data.favorites.push(new_favorite);

            }

            else if (res.data.Message === "favorite_already_added") {

                console.log(
                    "Favorite route/stop already added."
                );

            }

            else {

                console.log(
                    "Error adding stop: " + res.data.Message
                );

            }

        })["catch"](function() {

            self.showOrHideFavoriteIconSpinner(element, "hide");

            console.log(
                "Failed to add stop to favorites."
            );

        });

    };

    this.deleteAndRecordFavoriteRouteStop = function(
        agency_id, route, stop, event
    ) {

        var element = event.currentTarget;

        self.showOrHideFavoriteIconSpinner(element, "show");

        for (var f_i=0;f_i<favorites_data.favorites.length;f_i++) {

            var record_id;

            if (favorites_data.favorites[f_i].AgencyId === agency_id &&
                favorites_data.favorites[f_i].RouteId === route &&
                favorites_data.favorites[f_i].StopId + "" === stop) {

                record_id = favorites_data.favorites[f_i].RecordId;

                break;

            }

        }

        if (!record_id) {

            console.log(
                "Unable to find record for: " +
                "agency " + agency_id + ", " +
                "route " + route + ", " +
                "stop " + stop + "."
            );

            return false;

        }

        var route_stop_delete_promise =
        self.deleteFavoriteRouteStop(record_id);

        route_stop_delete_promise.then(function(res) {

            self.showOrHideFavoriteIconSpinner(element, "hide");

            if (res.data.Type === "success") {

                favorites_data.favorites.splice(f_i, 1);

            }

            else if (res.data.Message === "record_id_not_found") {

                console.log(
                    "Unable to delete route/stop. Record ID not found."
                );

            }
            
            else {

                console.log(
                    "Error deleting stop: " + res.data.Message
                );

            }

        })["catch"](function() {

            self.showOrHideFavoriteIconSpinner(element, "hide");

            console.log(
                "Failed to delete stop from favorites."
            );

        });

    };

}]);

BCTAppServices.service('filterHelpers', [ 'results_exist', 'filter_buffer_data',
function(results_exist, filter_buffer_data) {

    this.bufferResultsExistTruthiness = function(
        results_exist_flag,
        current_results_exist,
        search_input
    ) {

        results_exist[results_exist_flag] = false;

        filter_buffer_data.results_exist_counter +=
        current_results_exist;

        filter_buffer_data.search_string_buffer.push(search_input);

        if (filter_buffer_data.search_string_buffer[0] !== 
        search_input) {

            filter_buffer_data.search_string_buffer =
            [search_input];

            filter_buffer_data.results_exist_counter =
            current_results_exist;

        }

        results_exist[results_exist_flag] =
        Boolean(filter_buffer_data.results_exist_counter);
    };
 
}]);

BCTAppServices.factory('routeAndStopFilters', [ 'nearestStopsService',
'locationService', 'latest_location', 'filterHelpers', 'full_bstop_data',
'full_route_data', 'full_landmark_data',
function(nearestStopsService, locationService, latest_location, filterHelpers,
full_bstop_data, full_route_data, full_landmark_data) {

    return {

        RouteAndStopFilterMaker: function(filter_type, use_minimum_length) {

            var self = this;

            if (filter_type === "stop") {

                this.full_item_list = full_bstop_data;
                this.property_name = "Name";
                this.id_or_code = "Code";

            }

            else if (filter_type === "route") {

                this.full_item_list = full_route_data;
                this.property_name = "LName";
                this.id_or_code = "Id";

            }

            else if (filter_type === "landmark") {

                this.full_item_list = full_landmark_data;
                this.property_name = "Description";
                this.id_or_code = false;

            }

            //The two top level search filters use minimum length
            if (use_minimum_length) {

                this.filter_condition = function(input_string_length) {

                    if (input_string_length < 3) {
                        return false;
                    }

                    return true;

                };

                this.results_exist_flag = "main";

            }
            else {

                this.filter_condition = function() {
                    return true;
                };

                this.results_exist_flag = "sub";

            }

            this.filter = function(
                search_string,
                sort_bstops_by_distance,
                items
            ) {

                if (!items) {
                    var items = self.full_item_list.list;
                }

                var filtered = [];

                var input_lower = search_string.toLowerCase();

                var input_simplified =
                input_lower.replace("\(", "\\(").replace("\)", "\\)");

                if (!self.filter_condition(search_string.length)) { 
                    return true; 
                }

                if (search_string.length === 0) {
                    return items;
                };

                if (filter_type === "route" &&
                    input_simplified === "all routes") {

                    filtered = items;

                }

                else {

                    for (var i=0;i<items.length;i++) {

                        var item_search_string_cased;

                        item_search_string_cased = "" +
                        items[i][self.property_name];

                        if (self.id_or_code) {

                            item_search_string_cased +=
                            " " + items[i][self.id_or_code];

                        }

                        var item_search_string =
                        item_search_string_cased.toLowerCase();

                        if (item_search_string.match(input_simplified)) {
                            filtered.push(items[i]);
                        }

                    }

                }

                if (sort_bstops_by_distance) {

                    var current_location = locationService.
                    changeToDefaultLocationIfOutsideOfFlorida(latest_location);

                    filtered = nearestStopsService.sortStopsByDistance(
                        current_location,
                        filtered
                    );

                }

                var current_results_exist = !!filtered[0];

                filterHelpers.bufferResultsExistTruthiness(
                    self.results_exist_flag,
                    current_results_exist,
                    input_simplified
                );

                return filtered;

            };
        }

    };

}]);

BCTAppServices.service('linkFunctions', [ '$compile', 'full_route_data',
'full_bstop_data', 'full_landmark_data',

function($compile, full_route_data, full_bstop_data, full_landmark_data) {

    this.dynamicPanelContentsLoader = function(
        scope, element, type
    ) {

        var inner_template =
        "<sub-panel-" + type + "s></sub-panel-" + type + "s>";

        angular.element(element[0].childNodes[0].childNodes[1]).
        bind("click", function() {

            element[0].parentNode.parentNode.parentNode.scrollTop =
            element[0].offsetTop - 10;

            var data_id;

            if (type === "route") {

                data_id = element[0].childNodes[0].getAttribute("id");

                scope.cur_route = full_route_data.dict[data_id];

                scope.top_scope.filtered_sub_routes_arr = 
                scope.top_scope.route_stop_list =
                scope.cur_route.bstop_refs;

            }

            else if (type === "stop") {

                data_id = element[0].childNodes[0].getAttribute("id");

                scope.cur_stop = full_bstop_data.dict[data_id];

                scope.top_scope.filtered_sub_stops_arr = 
                scope.top_scope.stop_route_list =
                scope.cur_stop.route_refs;

            }

            else if (type === "landmark") {

                var landmark_id = element[0].childNodes[0].getAttribute("id");

                var all_landmarks = full_landmark_data.list;

                for (var lmk_idx=0;lmk_idx<all_landmarks.length;lmk_idx++) {

                    if (all_landmarks[lmk_idx].Id === landmark_id) {
                        break;
                    }

                }

                scope.cur_landmark = all_landmarks[lmk_idx];

                scope.top_scope.filtered_sub_landmarks_arr = 
                scope.top_scope.landmark_stop_list =
                scope.cur_landmark.bstop_refs;

            }

            var sub_panel_already_exists = Boolean(
                element.children().children()[1].childNodes[1].childNodes[3].
                innerHTML.
                match(/sub-panel-stops|sub-panel-landmarks|sub-panel-routes/)
            );

            if(!sub_panel_already_exists) {
                angular.element(
                    element[0].childNodes[0].childNodes[3].
                    childNodes[1].childNodes[3]
                ).append($compile(inner_template)(scope));
            }

        });

    };

}]);

BCTAppServices.service('templateGenerators', [ 'agency_filter_icons',
function(agency_filter_icons) {

    this.createFilterIconBarTemplate = function(filter_type) {

        var icon_arrangement_class = "";

        switch (filter_type) {
            case "mobile":
                icon_arrangement_class = "schedule-results-icons-mobile";
                break;
            case "inline":
                icon_arrangement_class = "schedule-results-icons-inline";
                break;
        }

        var template = '';

        for (var agency in agency_filter_icons) {

            var agency_filter = agency_filter_icons[agency];

            var agency_name = agency_filter_icons[agency].name;

            template += '' +

            '<span id="' + agency_filter.agency + '-filter-' + filter_type +
            '"' +
            'class="link-icon agency-filter ' +
            icon_arrangement_class + '">' +

                '<img ' +
                'alt="Select Agency: ' + agency_name + '" ' +
                'title="Select Agency: ' + agency_name + '" ' +
                'class="agency-filter-icon ptr ' +
                '{{ agency_filter_icons.' + agency_filter.agency +
                '.selection_class }}" ' +
                'src="' +
                window.myride.directories.site_roots.active +
                window.myride.directories.paths.active +
                'css/ico/' +
                agency_filter.icon_filename + '" ' +
                'ng-click="enableAgencyFilter(\'' + agency_filter.agency +
                '\'' + '); ' +
                '">' +

            '</span>';

        }

        return template;

    };

}]);

BCTAppServices.service('nearestMapStopsService', [ 'nearestStopsService',
'googleMapsUtilities',

function(nearestStopsService, googleMapsUtilities) {

    this.showNearestStopsFromMapCoords = function(coords) {

        var nearest_stops_to_map_point = nearestStopsService.findNearestStops(
            coords, true, true
        );

        googleMapsUtilities.clearMap(true);

        googleMapsUtilities.displayNearestMapStops(
            nearest_stops_to_map_point
        );

        return nearest_stops_to_map_point;

    };

}]);

BCTAppServices.service('recentlyViewedService', [ 'recently_viewed_items',
'full_bstop_data', function(recently_viewed_items, full_bstop_data) {

    var self = this;

    this.MAXIMUM_RECENTLY_VIEWED_ITEM_NUMBER = 5;

    this.loadRecentlyViewedList = function() {

        if (!localStorage) {

            console.log(
                "Unable to store recently viewed items (no localStorage)"
            );

            return false;

        }

        else if (!localStorage.recently_viewed_items) {

            localStorage.setItem(
                'recently_viewed_items',
                JSON.stringify(recently_viewed_items)
            );

        }

        else {

            var stored_recently_viewed_items =
            JSON.parse(localStorage.recently_viewed_items);

            //Properties are added individually to ensure the the value is
            //changed, not just the local reference to it
            for (var prop in recently_viewed_items) {

                recently_viewed_items[prop] =
                stored_recently_viewed_items[prop];

            }

        }

    };

    this.saveRecentlyViewedItem = function(type, data_obj) {

        if (!localStorage) {

            console.log(
                "Unable to store recently viewed items (no localStorage)"
            );

            return false;

        }

        var new_recently_viewed_item;

        var prop_names;

        var search_name;

        if (type === "schedule_map") {

            prop_names = ["route", "stop"];

            new_recently_viewed_item = {

                route: data_obj.route,
                stop: data_obj.stop,
                name: search_name

            };

        }

        else if (type === "trip_planner") {

            prop_names = ["start", "finish"];

            new_recently_viewed_item = {

                start: data_obj.start,
                finish: data_obj.finish

            };

        }

        var recently_viewed_list =
        JSON.parse(localStorage.recently_viewed_items);

        for (var i=0;i<recently_viewed_list[type].length;i++) {

            var same_prop_counter = 0;

            for (var j=0;j<prop_names.length;j++) {

                if (recently_viewed_list[type][i][prop_names[j]] ===
                    new_recently_viewed_item[prop_names[j]]) {

                    same_prop_counter++;

                }

            }

            if (same_prop_counter === prop_names.length) {
 
                return true;

            }

        }

        recently_viewed_list[type].push(new_recently_viewed_item);

        if (recently_viewed_list[type].length >=
            self.MAXIMUM_RECENTLY_VIEWED_ITEM_NUMBER) {

            recently_viewed_list[type].splice(0,1);

        }

        for (var prop in recently_viewed_list) {

            recently_viewed_items[prop] =
            recently_viewed_list[prop];

        }

        localStorage.setItem(
            'recently_viewed_items',
            JSON.stringify(recently_viewed_list)
        );

    };

}]);

BCTAppServices.service('routeStopLandmarkTransformationService', [
'full_bstop_data', 'full_route_data', 'full_landmark_data', 'all_alerts',

function(full_bstop_data, full_route_data, full_landmark_data, all_alerts) {

    var self = this;

    this.transformLandmarks = function() {

        for (var i=0;i<full_landmark_data.orig.length;i++) {

            var cur_landmark = full_landmark_data.orig[i];

            for (var j=0;j<cur_landmark.POIS.length;j++) {

                full_landmark_data.list.push(cur_landmark.POIS[j]);

            }

        }

    };

    this.transformRoutes = function() {

        for (var i=0;i<full_route_data.list.length;i++) {

            var cur_route = full_route_data.list[i];

            full_route_data.dict[cur_route.Id] = cur_route;

        }

    };

    this.transformStops = function() {

        for (var i=0;i<full_bstop_data.list.length;i++) {

            var cur_bstop = full_bstop_data.list[i];

            full_bstop_data.dict[cur_bstop.Id] = cur_bstop;

        }

    };

    this.linkRouteAndStopReferences = function() {

        var route_props = ["Id", "LName"];
        var bstop_props = ["Id", "Name", "Code"];

        var all_stops = full_bstop_data.list;
        var all_routes = full_route_data.list;
        var all_landmarks = full_landmark_data.list;

        self.transformStops();
        self.transformRoutes();

        self.transformLandmarks();

        var bstop_dict = full_bstop_data.dict;
        var route_dict = full_route_data.dict;

        for (var r_i=0;r_i<all_routes.length;r_i++) {

            var route = all_routes[r_i];

            route.route_icon_label = route.Id.replace(/BCT/,"");

            //The following property contains mock data
            route.alerts = all_alerts.schedule_map;

            route.bstop_refs = [];

            for (var b_i_ref=0;b_i_ref<route.Stops.length;b_i_ref++) {

                var ref_bstop_id = route.Stops[b_i_ref];

                var bstop_reference = {};

                for (var stop_p=0;stop_p<bstop_props.length;stop_p++) {

                    bstop_reference[bstop_props[stop_p]] =
                    bstop_dict[ref_bstop_id][bstop_props[stop_p]];

                }

                route.bstop_refs.push(bstop_reference);

            }

        }

        for (var s_i=0;s_i<all_stops.length;s_i++) {

            var bstop = all_stops[s_i];

            bstop.route_refs = [];

            for (var b_i_ref=0;b_i_ref<bstop.Routes.length;b_i_ref++) {

                var ref_route_id = bstop.Routes[b_i_ref];

                var route_reference = {};

                for (var route_p=0;route_p<route_props.length;route_p++) {

                    route_reference[route_props[route_p]] =
                    route_dict[ref_route_id][route_props[route_p]];

                }

                bstop.route_refs.push(route_reference);

            }

        }

        for (var l_i=0;l_i<all_landmarks.length;l_i++) {

            var landmark = all_landmarks[l_i];

            landmark.bstop_refs = [];

            for (var lmk_s=0;lmk_s<landmark.Stops.length;lmk_s++) {

                var lmk_stop_id = landmark.Stops[lmk_s];

                var lmk_stop_reference = {};

                for (var stop_p=0;stop_p<bstop_props.length;stop_p++) {

                    lmk_stop_reference[bstop_props[stop_p]] =
                    bstop_dict[lmk_stop_id][bstop_props[stop_p]];

                }

                landmark.bstop_refs.push(lmk_stop_reference);

            }

        }

    };

}]);