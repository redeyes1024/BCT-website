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
'default_demo_coords', 'out_of_region_cutoff_coords',
function($timeout, latest_location, default_demo_coords,
out_of_region_cutoff_coords) {

    var self = this;

    this.OUT_OF_REGION_CUTOFF_COORDS = out_of_region_cutoff_coords;

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

    /*  Note on the getCurrentLocation function:

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
        'constant' $scope.TIME_UNTIL_LOCATION_REQUEST_PRESUMED_IGNORED
        *minus* the amount of time it takes the location to be retrieved,
        otherwise it is presumed that the user ignored the location request
        and will have to click the location button again.
    */

    this.TIME_UNTIL_LOCATION_REQUEST_PRESUMED_IGNORED = 15000;

    this.TIME_ELAPSED_UNTIL_LOCATION_MUST_BE_RECALCULATED = 30000;

    this.getCurrentLocationAndDisplayData =
    function(setLoadingAnimation, displayData) {

        var latest_location_prompt_time = new Date;

        var time_since_last_location_prompt = 
        latest_location_prompt_time - latest_location.timestamp;

        if (time_since_last_location_prompt <
            self.TIME_ELAPSED_UNTIL_LOCATION_MUST_BE_RECALCULATED) {
            displayData(latest_location);
            return true;
        }

        setLoadingAnimation("active");

        navigator.geolocation.getCurrentPosition(
            function(p_res) {
                var latest_successful_location_request_time = new Date;

                if ((latest_successful_location_request_time -
                    latest_location_prompt_time) <
                    self.TIME_UNTIL_LOCATION_REQUEST_PRESUMED_IGNORED) {

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
                timeout: self.TIME_UNTIL_LOCATION_REQUEST_PRESUMED_IGNORED
            }
        );

        var user_ignored_location_request_timer = $timeout(function() {
            setLoadingAnimation("inactive");
        }, self.TIME_UNTIL_LOCATION_REQUEST_PRESUMED_IGNORED);

        return user_ignored_location_request_timer;

    };

    //Change reference location if client is not in South East Florida
    //For demonstration/testing only, to make development location-agnostic
    this.changeToDefaultLocationIfOutsideOfFlorida =
    function(current_location) {

        var bounds = self.OUT_OF_REGION_CUTOFF_COORDS;
        var current_lat = current_location.LatLng.Latitude;
        var current_lng = current_location.LatLng.Longitude;

        if (
            !(bounds.lat.min <= current_lat && current_lat <= bounds.lat.max) ||
            !(bounds.lng.min <= current_lng && current_lng <= bounds.lng.max)
        ) {
            current_location = self.getDefaultDemoCoords(
                ["Latitude", "Longitude"]
            );
            console.log(
                "User outside of local region. Using demonstration coordinates."
            );
        }

        return current_location;
    };

}]);

BCTAppServices.service('nearestStopsService', [ 'locationService',
function(locationService) {

    var self = this;

    //Will not report stops further than this distance
    //In degrees, or meters divided by 111111 as a rough conversion
    this.MAXIMUM_DISTANCE = 1000 / 111111;

    this.MAXIMUM_REPORTED_STOPS = 3;

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
        full_bstop_list,
        bus_stop_dictionary,
        return_full_list,
        disable_location_check
    ) {

        if (!disable_location_check) {

            current_location =
            locationService.
            changeToDefaultLocationIfOutsideOfFlorida(current_location);

        }

        var full_bstop_list_ids_coords = [];

        for (var i=0;i<full_bstop_list.length;i++) {

            full_bstop_list_ids_coords.push({
                Id: full_bstop_list[i].Id,
                LatLng: full_bstop_list[i].LatLng,
                Code: full_bstop_list[i].Code
            });

        }

        full_bstop_list_ids_coords = self.sortStopsByDistance(
            current_location,
            full_bstop_list_ids_coords,
            true
        );

        var stops_below_cutoff = full_bstop_list_ids_coords.
        filter(function(sd) {
            return sd.distance < self.MAXIMUM_DISTANCE;
        });

        var nearest_bstops;

        if (return_full_list) {

            nearest_bstops = stops_below_cutoff;

        } 

        else {

            nearest_bstops = stops_below_cutoff.
            slice(0, self.MAXIMUM_REPORTED_STOPS);

        }

        for (var j=0;j<nearest_bstops.length;j++) {

            nearest_bstops[j].distance = self.
            labelDistancesAndConvertFromDegrees(nearest_bstops[j].distance);

            nearest_bstops[j].Name =
            bus_stop_dictionary[nearest_bstops[j].Id].Name;
            
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

    var self = this;

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

function($http, $q, miniScheduleService, generalServiceUtilities) {

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

                schedule_output.date_pick = departures.slice();

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
'generalServiceUtilities',

function(generalServiceUtilities) {

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

}]);

BCTAppServices.service('generalServiceUtilities', [ function() {

    var self = this;

    /* START Force Digest Workaround */

    //Used only when absolutely necessary, i.e., for when Angular
    //fails to 'detect' a change to certain values from a function
    //defined in a service method. Checks if $apply is already in
    //progress as a safety measure.
    angular.element(document).ready(function() {

        self.top_level_scope = angular.element(
            document.getElementById("bct-app")
        ).scope();

        self.forceDigest = function() {
            if(!self.top_level_scope.$$phase) {
                self.top_level_scope.$apply();
            }
        };

    });

    /* END Force Digest Workaround */

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

        var error_message = "" +
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

BCTAppServices.service('googleMapUtilities', [ '$compile', '$q',
'scheduleDownloadAndTransformation', 'unitConversionAndDataReporting',
'locationService', 'map_navigation_marker_indices',
'generalServiceUtilities', 'default_demo_coords', 'svg_icon_paths',
'map_clusterer', 'marker_icon_options', 'marker_click_memory',
'selected_nearest_map_stop', 'nearest_map_stop_distances',

function($compile, $q, scheduleDownloadAndTransformation,
unitConversionAndDataReporting, locationService,
map_navigation_marker_indices, generalServiceUtilities,
default_demo_coords, svg_icon_paths, map_clusterer, marker_icon_options,
marker_click_memory, selected_nearest_map_stop, nearest_map_stop_distances) {

    var self = this;

    var top_self = this;

    this.palette = {
        colors: {
            blue: "#017AC2",
            red: "#C14E4E",
            black: "#000000"
        },
        weights: {
            markers: {
                thick: 8,
                mid: 7,
                thin: 6
            },
            lines: {
                thick: 5,
                mid: 4,
                thin: 3
            }
        },
        scales: {
            markers: {
                big: 10,
                mid: 5,
                small: 3
            }
        }
    };

    this.initializeMarkerClusterer = function() {

        var clusterer_icon_image_url_base =
        window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'css/ico/';

        var clusterer_options = {

            styles: [
                {
                    url: clusterer_icon_image_url_base +
                    "button_green.svg",
                    width: 50,
                    height: 50,
                    textColor: "#FFFFFF",
                    textSize: 18
                },
                {
                    url: clusterer_icon_image_url_base +
                    "button_yellow.svg",
                    width: 50,
                    height: 50,
                    textColor: "#FFFFFF",
                    textSize: 16
                },
                {
                    url: clusterer_icon_image_url_base +
                    "button_red.svg",
                    width: 50,
                    height: 50,
                    textColor: "#FFFFFF",
                    textSize: 14
                }
            ],

            maxZoom: 14

        };

        map_clusterer.clusterer = new MarkerClusterer(
            myride.dom_q.map.inst, [], clusterer_options
        );

    };

    this.mapMaker = function(container, lat, lng) {

        var center;

        if (lat && lng) {

            center = { 
                lat: lat,
                lng: lng 
            };

        }
        
        else {

            center = locationService.getDefaultDemoCoords(["lat", "lng"]);

        }

        var map_options = {
            center: center,
            zoom: 10,
            minZoom: 8,
            styles: [
                {
                    featureType: "transit.station.bus",
                    stylers: [
                        { visibility: "off" }
                    ]
                }
            ]
        };

        myride.dom_q.map.inst = new google.maps.Map(
            container,
            map_options
        );

        self.initializeMarkerClusterer();

    };

    //Forces embedded Google Maps map to redraw
    this.touchMap = function() {

        var cur_map_center_data =
        myride.dom_q.map.inst.getCenter();

        var cur_map_center = {
            
            lat: cur_map_center_data.lat(),
            lng: cur_map_center_data.lng() + 0.0000000001
            
        };

        myride.dom_q.map.inst.setCenter(cur_map_center);

        var deferred = $q.defer();

        google.maps.event.addListenerOnce(

            myride.dom_q.map.inst,
            'idle',
            function() {

                google.maps.event.trigger(
                    myride.dom_q.map.inst, "resize"
                );

                deferred.resolve();

            }

        );

        return deferred.promise;

    };

    this.setMapPosition = function(coords, zoom) {

        if (!zoom) {
            var zoom = 18;
        }
        if (!coords) {
            var coords = locationService.getDefaultDemoCoords(["lat", "lng"]);
        }
        else if (coords.Latitude) {

            var old_lat = coords.Latitude;
            var old_lng = coords.Longitude;

            coords = {};

            coords.lat = old_lat;
            coords.lng = old_lng;

        }

        myride.dom_q.map.inst.setZoom(zoom);

        var deferred = $q.defer();

        var map_ready_promise = self.touchMap();

        map_ready_promise.then(function() {

            myride.dom_q.map.inst.setCenter(coords);

            deferred.resolve();

        });

        return deferred.promise;

    };

    this.clearMap = function(keep_draggable) {

        var points = myride.dom_q.map.overlays.points;

        var pline =  myride.dom_q.map.overlays.pline;

        var trip_points = myride.dom_q.map.overlays.trip_points;

        var trip_pline = myride.dom_q.map.overlays.trip_pline;

        var nearest_map_points = myride.dom_q.map.overlays.nearest_map_points;

        var nearest_map_draggable =
        myride.dom_q.map.overlays.nearest_map_draggable;

        for (var mk=0;mk<trip_points.length;mk++) {
            trip_points[mk].marker.setMap(null);
        }

        for (var mk=0;mk<trip_points.length;mk++) {

            trip_points[mk].info.close();

        }

        myride.dom_q.map.overlays.trip_points = [];

        for (var pl=0;pl<trip_pline.length;pl++) {
            trip_pline[pl].setMap(null);
        }

        myride.dom_q.map.overlays.trip_pline = [];

        for (p in points) {
            points[p].marker.setMap(null);
        }

        for (p in points) {

            points[p].info.close();

        }

        myride.dom_q.map.overlays.plines = [];

        if (pline) {
            myride.dom_q.map.overlays.pline.setMap(null);
        }

        myride.dom_q.map.overlays.points = {};

        map_clusterer.clusterer.markers_ = [];

        for (var cl=0;cl<map_clusterer.clusterer.clusters_.length;cl++) {

            map_clusterer.clusterer.clusters_[cl].remove();

        }

        for (var np in nearest_map_points) {

            nearest_map_points[np].marker.setMap(null);

        }

        myride.dom_q.map.overlays.nearest_map_points = {};

        if (!keep_draggable) {

            for (var nd in nearest_map_draggable) {

                if (nd === "default" && nearest_map_draggable.default.marker) {

                    nearest_map_draggable[nd].marker.setMap(null);

                }

            }

            myride.dom_q.map.overlays.nearest_map_draggable = {};

        }

        marker_click_memory.nearest = "";

        selected_nearest_map_stop.stop_id = "";

        nearest_map_stop_distances.dists = [];

    };

    this.displayRoute = function(route, routes) {

        var route_coords = self.decodePath(routes[route].Shp);
        var route_coords_cor = [];

        for (var i=0;i<route_coords.length;i++) {

            var coords_obj = { lat: "", lng: "" };

            coords_obj.lat = route_coords[i][0];
            coords_obj.lng = route_coords[i][1];

            route_coords_cor.push(coords_obj);

        }

        var route_color = "#" + routes[route].Color;

        myride.dom_q.map.overlays.pline = new google.maps.Polyline({
            map: myride.dom_q.map.inst,
            path: route_coords_cor,
            strokeColor: route_color,
            strokeWeight: self.palette.weights.lines.mid
        });

        return route_coords_cor;

    };

    //Replace items in "other routes" list with clickable
    //buttons that change the displayed route
    this.addRouteSwapButtons = function(
        route_swap_button_holders,
        open_info_stop
    ) {

        var scope = 
        angular.element(document.getElementById("bct-app")).scope();

        var route_swap_button_container =
        route_swap_button_holders[0].parentNode;

        route_swap_button_container.innerHTML =
        route_swap_button_container.innerHTML.replace(/,/g, "");

        while (route_swap_button_holders.length > 0) {

            var route_swap_button = angular.element(
                '<a class="ptr" ng-click="switchRoutes(' +
                    '\'' + route_swap_button_holders[0].innerHTML + '\', ' +
                    '\'' + open_info_stop + '\'' +
                ');">' +
                    route_swap_button_holders[0].innerHTML +
                '</a>'
            );

            angular.element(route_swap_button_container).
            append($compile(route_swap_button)(scope));

            route_swap_button_holders[0].outerHTML = "";

            if (route_swap_button_holders[0]) {
                angular.element(route_swap_button_container).append(",&nbsp;");
            }

        }

    };

    //Creates a temporary object made to resemble an info window/box object by
    //including mock placeholder properties. These objects are generally used
    //in order to get around checks for which info windows/boxes are open
    this.createDummyInfoWindow = function(marker_list_name, hovered) {

        var open_info_name = "";

        if (marker_list_name === "trip_points") {
            open_info_name = "trip_open_info";
        }
        else if (marker_list_name === "points") {

            if (hovered) {
                open_info_name = "open_info_hovered";
            }

            else {
                open_info_name = "open_info";
            }

        }

        myride.dom_q.map.overlays[open_info_name] = [{
            close: function() {},
            content: "<span>Stop: First</span>"
        }];

    };

    this.showSelectedInfoWindow = function(
        module,
        point,
        e,
        point_name,
        hovered
    ) {

        var open_info_name = "";
        var id_type_name = "";

        if (module === "planner") {

            open_info_name = "trip_open_info";
            id_type_name = "trip_marker_window_id";

        }
        else if (module === "schedule") {

            if (hovered) {

                open_info_name = "open_info_hovered";

            }

            else {

                open_info_name = "open_info";

            }

            id_type_name = "schedule_marker_window_id";

        }

        //Prevent info box from opening from hover if already opened from click
        if (module === "schedule" && !!hovered) {

            if (typeof myride.dom_q.map.
                overlays["open_info"][0][id_type_name] !== "undefined" &&
                point.info[id_type_name] ===
                myride.dom_q.map.overlays["open_info"][0][id_type_name]) {

                return true;

            }

        }

        var open_window = myride.dom_q.map.overlays[open_info_name][0];

        if (point.info[id_type_name] === open_window[id_type_name]) { 
            return true;
        }

        point.info.open(
            myride.dom_q.map.inst,
            point.marker
        );

        var marker_label =
        myride.dom_q.map.overlays[open_info_name][0].marker_label;

        if ((!hovered && marker_label) || module === "planner") {

            myride.dom_q.map.overlays[open_info_name][0].close();

            if (module === "schedule") {

                myride.dom_q.map.overlays.points[marker_label].info.clicked =
                false;

            }

        }

        myride.dom_q.map.overlays[open_info_name].pop();

        //Store a reference to the latest opened info window
        //so it can be closed when another is opened
        myride.dom_q.map.overlays[open_info_name].push(point.info);

        if (!hovered) {

            var point_coords = point.marker.getPosition();

            myride.dom_q.map.inst.setCenter({
                lat: point_coords.lat(),
                lng: point_coords.lng()
            });

            if (e) {

                var ordered_stops = myride.dom_q.map.overlays.ordered_stop_list;

                if (ordered_stops && module === "schedule") {

                    map_navigation_marker_indices.schedule =
                    ordered_stops.indexOf(point_name);

                }
                else if (module === "planner") {

                    var newly_opened_window = myride.dom_q.map.
                    overlays[open_info_name][0];

                    map_navigation_marker_indices.planner =
                    newly_opened_window[id_type_name];

                }

            }

        }

        //False, i.e., window not already opened (normal execution)
        return false;

    };

    this.addMarkerClickAndCloseListeners = function(
        marker_list_name, 
        marker_id
    ) {

        google.maps.event.addListener(
            myride.dom_q.map.overlays[marker_list_name][marker_id].info,
            'closeclick',
            function() {

                self.createDummyInfoWindow(marker_list_name);

                self.createDummyInfoWindow(marker_list_name, true);

                myride.dom_q.map.overlays[marker_list_name][marker_id].
                info.clicked = false;

            }
        );

        if (marker_list_name === "points") {

            google.maps.event.addListener(
                myride.dom_q.map.overlays[marker_list_name][marker_id].marker,
                'click',
                function() {
                    myride.dom_q.map.overlays[marker_list_name][marker_id].
                    ShowWindow.func("click", false);
                }
            );

            google.maps.event.addListener(
                myride.dom_q.map.overlays[marker_list_name][marker_id].marker,
                'mouseover',
                function() {

                    var icon_options =
                    marker_icon_options.schedule_map.mouseover;

                    icon_options.fillColor =
                    myride.dom_q.map.overlays[marker_list_name][marker_id].
                    marker.getIcon().fillColor;

                    myride.dom_q.map.overlays[marker_list_name][marker_id].
                    marker.setOptions(
                        {
                            icon: icon_options
                        }
                    );

                    myride.dom_q.map.overlays[marker_list_name][marker_id].
                    ShowWindow.func(null, true);

                }
            );

            google.maps.event.addListener(
                myride.dom_q.map.overlays[marker_list_name][marker_id].marker,
                'mouseout',
                function() {

                    var icon_options = marker_icon_options.schedule_map.default;

                    icon_options.fillColor =
                    myride.dom_q.map.overlays[marker_list_name][marker_id].
                    marker.getIcon().fillColor;

                    myride.dom_q.map.overlays[marker_list_name][marker_id].
                    marker.setOptions(
                        {
                            icon: icon_options
                        }
                    );

                    var marker_was_clicked =
                    myride.dom_q.map.overlays[marker_list_name][marker_id].
                    info.clicked;

                    if (!marker_was_clicked) {

                        myride.dom_q.map.overlays[marker_list_name][marker_id].
                        info.close();

                        self.createDummyInfoWindow(marker_list_name, true);

                    }

                }
            );

        }
        
        else if (marker_list_name === "trip_points") {
        
            google.maps.event.addListener(
                myride.dom_q.map.overlays[marker_list_name][marker_id].marker,
                'click',
                myride.dom_q.map.overlays[marker_list_name][marker_id].
                ShowWindow.func
            );

        }

    };

    this.getOrderedStopListForCurrentRoute = function(route) {

        var ordered_stop_name_list_for_current_route = [];

        var promise = scheduleDownloadAndTransformation.
        downloadStopsForRoute(route).then(function(res) {

            for (var i=0;i<res.data.Stops.length;i++) {
                ordered_stop_name_list_for_current_route.
                push(res.data.Stops[i].Id);
            }

            map_navigation_marker_indices.schedule =
            ordered_stop_name_list_for_current_route.
            indexOf(map_navigation_marker_indices.schedule_named);

            return ordered_stop_name_list_for_current_route;

        });

        return promise;

    };

    this.mapStopsToRoutePath = function(coords, route_path) {

        //Disabling stop coordinate projection; verify before function deleted
        return coords;

        var linear_dist_arr = [];

        for (var i=0;i<route_path.length;i++) {

            var x1 = route_path[i].lat;
            var y1 = route_path[i].lng;

            var x2 = typeof coords.lat === "number" ? coords.lat : coords.lat();
            var y2 = typeof coords.lng === "number" ? coords.lng : coords.lng();

            var h_dist_pow_2 = Math.pow((x2 - x1), 2);
            var v_dist_pow_2 = Math.pow((y2 - y1), 2);

            var linear_dist = Math.pow((h_dist_pow_2 + v_dist_pow_2), 0.5);

            var dist_obj = {

                orig_coord: route_path[i],
                linear_dist: linear_dist

            };

            linear_dist_arr.push(dist_obj);

        }

        linear_dist_arr.sort(function(d_obj1, d_obj2) {
            return d_obj1.linear_dist - d_obj2.linear_dist;
        });

        return linear_dist_arr[0].orig_coord;

    };

    this.displayStops = function(route, routes, stops, route_path) {

        var cur_route = routes[route];
        var bstops_names = cur_route.Stops;

        var clustered_markers = [];

//        //Test code showing points used to generate polyline
//        var line_points =
//        myride.dom_q.map.overlays.pline.latLngs.getArray()[0].getArray();
//
//        for (var z=0;z<line_points.length;z++) {
//            
//            var test_lat = line_points[z].lat();
//            var test_lng = line_points[z].lng();
//
//            var test_marker = new google.maps.Marker({
//                map: myride.dom_q.map.inst,
//                position: {lat: test_lat, lng: test_lng}
//            });
//
//        }

        for (var i=0;i<bstops_names.length;i++) {

            if (!stops[bstops_names[i]].LatLng.Latitude) { continue; }

            var lat = stops[bstops_names[i]].LatLng.Latitude;
            var lng = stops[bstops_names[i]].LatLng.Longitude;

            var stop_svg = svg_icon_paths.stop;
            var bus_svg = svg_icon_paths.bus;

            var raw_coords = new google.maps.LatLng(lat, lng);

            var coords = self.mapStopsToRoutePath(
                raw_coords, route_path
            );

            var route_color = "#" + routes[route].Color;

            var icon_options = marker_icon_options.schedule_map.default;

            icon_options.fillColor = route_color;

            var marker = new google.maps.Marker({
                map: myride.dom_q.map.inst,
                position: coords,
                title: route + ' ' + bstops_names[i],
                icon: icon_options
            });

            var associated_routes = stops[bstops_names[i]].Routes;

            //Put current route as the first element (CSS pseudo-element
            //will handle highlighting)
            associated_routes.splice(associated_routes.indexOf(route), 1);

            associated_routes.splice(0, 0, route);

            var associated_routes_icons = '';

            var schedule_template = '' +

                '<span class="schedule-map-info-window-schedule-contents">' +
                    'Loading Schedule...' +
                '</span>';

            for (var k=0; k<associated_routes.length; k++) {

                var switch_route_function_attribute;

                if (k === 0) {

                    switch_route_function_attribute = "";

                }

                else {

                    switch_route_function_attribute = '' +
                    'ng-click="switchRoutes(' +
                        '\'' + stops[bstops_names[i]].Routes[k] + '\', ' +
                        '\'' + bstops_names[i] + '\'' +
                    ');"';

                }

                associated_routes_icons += '' +

                    '<div class="schedule-map-info-box-route-icon ' +
                    'no-highlight ptr" ' + switch_route_function_attribute +
                    '>' +

                        '<span class="schedule-map-info-box-route-id">' +

                            stops[bstops_names[i]].Routes[k].replace(/BCT/,"") +

                        '</span>' +

                        '<bus-svg></bus-svg>' +

                    '</div>';

            }

            var schedule_map_info_box_contents = '' +

                '<div class="myride-info-box-contents">' +

                    '<div class="schedule-map-info-box-top">' +

                        '<div class="schedule-map-info-box-top-contents">' +

                            '<span>' +
                                "[ID #" + stops[bstops_names[i]].Code + "]" +
                            //'</span>' +
                                " - " +
                            //'<span>' +
                                stops[bstops_names[i]].Name +
                            '</span>' +

                        '</div>' +

                    '</div>' +

                    '<div class="schedule-map-info-box-bottom">' +

                        //The class name is needed for $compile step when opened
                        '<span class="info-window-associated-routes"></span>' +

                        '<span class="schedule-map-info-window-schedule">' +
                        '</span>' +

                    '</div>' +

                '</div>';

            var info_window =
            new InfoBox({

                content: schedule_map_info_box_contents,
                boxClass: "schedule-map-info-box",
                pixelOffset: {

                    width: -103,
                    height: -122

                },
                infoBoxClearance: {

                    width: 0,
                    height: 20

                }

            });

            info_window.set("schedule_marker_window_id", i);

            info_window.set("marker_label", bstops_names[i]);

            myride.dom_q.map.overlays.points[bstops_names[i]] = {
                marker: marker,
                info: info_window
            };

            clustered_markers.push(marker);

            myride.dom_q.map.overlays.points[bstops_names[i]].ShowWindow =
            new (function() {

                var self = this;

                this.s_id = bstops_names[i];

                this.pt_name = bstops_names[i];

                this.pt = myride.dom_q.map.overlays.points[self.pt_name];

                this.associated_routes_icons = associated_routes_icons;

                this.schedule_template = schedule_template;

                this.func = function(e, hovered) {

                    var window_already_open = 
                    top_self.showSelectedInfoWindow(
                        "schedule",
                        self.pt,
                        e,
                        self.pt_name,
                        hovered
                    );

                    if (window_already_open) { return true; }

                    var scope = generalServiceUtilities.top_level_scope;

                    angular.element(document).ready(function() {

                        try {

                            var route_icons_el = self.pt.info.div_.
                            getElementsByClassName(
                                "info-window-associated-routes"
                            )[0];

                            var schedule_el = self.pt.info.div_.
                            getElementsByClassName(
                                "schedule-map-info-window-schedule"
                            )[0];

                            schedule_el.style.display = "none";

                            var route_icons_el_ang_obj =
                            angular.element(route_icons_el);

                            var schedule_el_ang_obj =
                            angular.element(schedule_el);

                            route_icons_el_ang_obj.
                            append(
                                $compile(self.associated_routes_icons)(scope)
                            );

                            schedule_el_ang_obj.
                            append(
                                $compile(self.schedule_template)(scope)
                            );

                        }

                        catch(e) {

                            console.log(
                                "Info box closed too quickly to load SVGs."
                            );

                        }

                    });

                    if (!hovered) {

                        self.pt.info.clicked = true;

                        angular.element(document).ready(function() {

                            var schedule_el = self.pt.info.div_.
                            getElementsByClassName(
                                "schedule-map-info-window-schedule"
                            )[0];

                            schedule_el.style.display = "block";

                        });

                        scope.show_info_window_schedule = true;

                        //Request next arrivals for clicked route/stop
                        scheduleDownloadAndTransformation.
                        downloadSchedule(route, self.s_id).then(function(res) {

                            if (!res.data.Today) {

                                console.log(
                                    "Problem communicating with server: " +
                                    "InfoBox schedule."
                                );

                                return true;

                            }

                            var nearest_schedule =
                            scheduleDownloadAndTransformation.
                            transformSchedule("nearest", res.data.Today);

                            angular.element(document).ready(function() {

                                try {

                                    var schedule_el_cont = self.pt.info.div_.
                                    getElementsByClassName(
                                        "schedule-map-info-" +
                                        "window-schedule-contents"
                                    )[0];

                                    var nearest_times =
                                    nearest_schedule.nearest.next_times;

                                    var converted_nearest_times = [];

                                    for (var i=0;i<nearest_times.length;i++) {

                                        converted_nearest_times.push(
                                            unitConversionAndDataReporting.
                                            convertToTwelveHourTime(
                                                nearest_times[i]
                                            )
                                        );

                                    }

                                    if (converted_nearest_times[0]) {

                                        schedule_el_cont.innerHTML =
                                        converted_nearest_times.map(
                                            function(time) {

                                                var time_no_flags =
                                                time.replace(/;next|;prev/, "");

                                                return time_no_flags;

                                            }
                                        ).join(", ");

                                    }

                                    else {

                                        schedule_el_cont.innerHTML =
                                        "No more departures today.";

                                    }

                                }

                                catch(e) {

                                    console.log("A Google Maps infowindow " +
                                    "was closed before next times were fully " +
                                    "loaded.");

                                }

                            });

                        });

                    }

                    angular.element(document).ready(function() {

                        var route_swap_button_holders =
                        document.getElementsByClassName(
                            "route-swap-button-holder"
                        );

                        if (route_swap_button_holders[0]) {
                            top_self.addRouteSwapButtons(
                                route_swap_button_holders,
                                self.s_id
                            );
                        }

                    });

                };

            });

            top_self.addMarkerClickAndCloseListeners("points", bstops_names[i]);

        }

        map_clusterer.clusterer.markers_ = clustered_markers;

    };

    this.addNearestMapMarkerClickAndHoverListeners = function(
        cur_point,
        cur_point_id
    ) {

        google.maps.event.addListener(
            cur_point.marker,
            'mouseover',
            function() {

                var icon_options = marker_icon_options.schedule_map.mouseover;

                icon_options.fillColor = self.palette.colors.blue;

                cur_point.marker.setOptions(
                    {
                        icon: icon_options
                    }
                );

            }
        );

        google.maps.event.addListener(
            cur_point.marker,
            'mouseout',
            function() {

                if(!cur_point.clicked) {

                    var icon_options = marker_icon_options.schedule_map.default;

                    icon_options.fillColor = self.palette.colors.red;

                    cur_point.marker.setOptions(
                        {
                            icon: icon_options
                        }
                    );

                }

            }
        );

        google.maps.event.addListener(
            cur_point.marker,
            'click',
            function() {

                if (marker_click_memory.nearest === cur_point_id) {
                    return true;
                }

                cur_point.clicked = true;

                var icon_options;

                if (!!myride.dom_q.map.overlays.
                    nearest_map_points[marker_click_memory.nearest]) {

                    var old_point = myride.dom_q.map.overlays.
                    nearest_map_points[marker_click_memory.nearest];

                    old_point.clicked = false;

                    icon_options =
                    marker_icon_options.schedule_map.default;

                    icon_options.fillColor = self.palette.colors.red;

                    old_point.marker.setOptions( {
                        icon: icon_options
                    });

                }

                marker_click_memory.nearest = cur_point_id;

                icon_options =
                marker_icon_options.schedule_map.mouseover;

                icon_options.fillColor = self.palette.colors.blue;

                cur_point.marker.setOptions(
                    {
                        icon: icon_options
                    }
                );

                selected_nearest_map_stop.stop_id = cur_point_id;

            }
    );

    };

    this.displayNearestMapStops = function(
        nearest_stops,
        stops
    ) {

        for (var i=0; i<nearest_stops.length;i++) {

            var marker_coords = { 
                lat: nearest_stops[i].LatLng.Latitude,
                lng: nearest_stops[i].LatLng.Longitude
            };

            var marker_options = marker_icon_options.
            schedule_map.default;

            marker_options.fillColor = self.palette.colors.red;

            var marker = new google.maps.Marker({
                map: myride.dom_q.map.inst,
                position: marker_coords,
                icon: marker_options
            });

            var cur_point =
            myride.dom_q.map.overlays.nearest_map_points[nearest_stops[i].Id] =
            {
                marker: marker
            };

            top_self.addNearestMapMarkerClickAndHoverListeners(
                cur_point,nearest_stops[i].Id
            );

        }

    };

    //TODO: Request API modification to return GTFS route colors directly
    this.formatTransitModeResult = function(
        all_routes,
        mode_field,
        route_field
    ) {

        var leg_color = "";
        var route_text = "";
        var label = "";

        switch (mode_field) {
            case "BUS":
                leg_color = "#" + all_routes["BCT" + route_field].Color;
                route_text = "BCT" + route_field;
                label = "Bus route";
                break;
            case "WALK":
                leg_color = self.palette.colors.black;
                route_text = "";
                label = "Walk";
                break;
            case "TRAIN":
                leg_color = "#009933";
                route_text = "";
                label = "Train";
                break;
            case "DEST":
                leg_color = "#000000",
                route_text = "",
                label = "Destination";
                break;
            default:
                throw (new Error).message = "" +
                "Invalid transit mode setting: " + mode_field;
        }

        return {
            leg_color: leg_color,
            route_text: route_text,
            label: label
        };

    };

    this.getCoordsMidsAndSpans = function(all_path_coords_divided) {
        var all_lats = all_path_coords_divided.lats;
        var all_lngs = all_path_coords_divided.lngs;

        all_lats.sort();
        all_lngs.sort();

        var lat_min = all_lats[0];
        var lat_max = all_lats[all_lats.length-1];
        var lng_min = all_lngs[0];
        var lng_max = all_lngs[all_lngs.length-1];

        var lat_span = Number((lat_max - lat_min).toFixed(5));
        var lng_span = Number((lng_max - lng_min).toFixed(5));

        var lat_mid = Number((lat_min + (lat_span / 2)).toFixed(5));
        var lng_mid = Number((lng_min + (lng_span / 2)).toFixed(5));

        return {
            lat: {
                span: Math.abs(lat_span),
                mid: lat_mid
            },
            lng: {
                span: Math.abs(lng_span),
                mid: lng_mid
            }
        };
    };

    this.inferZoomFromMaxCoordSpan = function(max_coord_span) {

        /* Force zoom level break points manually here */

        var span_breakpoints = [
            {
                needed_zoom: 16,
                manual_breakpoint: null
            },
            {
                needed_zoom: 15,
                manual_breakpoint: null
            },
            {
                needed_zoom: 14,
                manual_breakpoint: null
            },
            {
                needed_zoom: 13,
                manual_breakpoint: null
            },
            {
                needed_zoom: 12,
                manual_breakpoint: null
            },
            {
                needed_zoom: 11,
                manual_breakpoint: null
            },
            {
                needed_zoom: 10,
                manual_breakpoint: null
            },
            {
                needed_zoom: 9,
                manual_breakpoint: null
            }
        ];

        /* Calculate zoom level break points automatically
           Assumes log(2) relationship between breakpoints and zoom levels */

        //Start of breakpoint calculation with lowest zoom (16 in this case)
        //Increase this slightly if you need more room on edges of plan path
        var ZOOM_16_BREAKPOINT = 0.01200;

        for (var i=0;i<span_breakpoints.length;i++) {
            var power = i;

            span_breakpoints[i].calculated_breakpoint = ZOOM_16_BREAKPOINT *
                Math.pow(2, power);
        }

        //Factor in map canvas width into required zoom breakpoint calculation
        //This is the calibration value, and is arbitrarily assigned to 1.0
        //e.g.: map canvas is 600px wide at some zoom (14) --> 1.0
        //      map canvas is 300px wide at some zoom (14) --> 0.5
        var ZOOM_14_SPAN_0_5_MAP_WIDTH = 600;

        var map_width = myride.dom_q.map.cont.clientWidth;
        var map_width_calibration_ratio = Number(
                map_width / ZOOM_14_SPAN_0_5_MAP_WIDTH
            ).toFixed(1);

        for (var j=0;j<span_breakpoints.length;j++) {
            var old_breakpoint = span_breakpoints[j].calculated_breakpoint;

            span_breakpoints[j].calculated_breakpoint = old_breakpoint *
                map_width_calibration_ratio;
        }

        //Use manual breakpoint if one was chosen, otherwise use calculated
        for (var i=0;i<span_breakpoints.length;i++) {
            var cur_zoom_breakpoint = span_breakpoints[i].manual_breakpoint ||
                                      span_breakpoints[i].calculated_breakpoint;

            if (max_coord_span <= cur_zoom_breakpoint) {
                return span_breakpoints[i].needed_zoom;
            }
        }
        //Default if coordinate span is too large, as it covers
        //Broward, Miami-Dade and Palm Beach
        return 8;
    };

    this.findBestZoomAndCenter = function(all_path_coords_divided) {
        var coords_stats = self.getCoordsMidsAndSpans(all_path_coords_divided);

        var center = {
            lat: coords_stats.lat.mid,
            lng: coords_stats.lng.mid
        };

        var max_coord_span = Math.max(
            coords_stats.lat.span, coords_stats.lng.span
        );

        var zoom = self.inferZoomFromMaxCoordSpan(max_coord_span);

        return {
            zoom: zoom,
            center: center
        };
    };

    this.displayTripPath = function(all_routes, line_data) {

        self.clearMap();

        var legs = line_data;
        var all_path_coords_divided = {
            lats: [],
            lngs: []
        };

        var orig_legs_count = legs.length;

        for (var i=0;i<orig_legs_count + 1;i++) {

            var path_coords_raw;

            if (i === orig_legs_count) {

                legs[i] = {

                    legGeometryField: {
                        pointsField: []
                    },
                    modeField: "DEST",
                    routeField: null,
                    fromField: {
                        latField: legs[i-1].toField.latField,
                        lonField: legs[i-1].toField.lonField
                    },
                    distanceField: "DEST",
                    durationField: "DEST"

                };

                path_coords_raw = [];

            }

            else {

                path_coords_raw = self.decodePath(
                    legs[i].legGeometryField.pointsField
                );

            }

            var path_coords = [];

            var last_pline_coords;

            for (var j=0;j<path_coords_raw.length;j++) {

                var LatLng = {};

                LatLng.lat = path_coords_raw[j][0];
                LatLng.lng = path_coords_raw[j][1];

                all_path_coords_divided.lats.push(path_coords_raw[j][0]);
                all_path_coords_divided.lngs.push(path_coords_raw[j][1]);

                path_coords.push(LatLng);

                last_pline_coords = path_coords_raw[j];

            }

            var formattedModeResult = self.formatTransitModeResult(
                all_routes,
                legs[i].modeField,
                legs[i].routeField
            );

            var leg_color = formattedModeResult.leg_color;
            var route_text = formattedModeResult.route_text;
            var label = formattedModeResult.label;

            var line_symbol = {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 1,
                strokeWeight: 3,
                strokeOpacity: 1
            };

            var leg_pline_config;


            if (legs[i].modeField === "WALK") {

                leg_pline_config = {
                    map: myride.dom_q.map.inst,
                    path: path_coords,
                    strokeColor: leg_color,
                    strokeWeight: self.palette.weights.lines.mid,
                    strokeOpacity: 0,
                    icons: [{
                        icon: line_symbol,
                        offset: '0',
                        repeat: '7px'
                    }]
                };

            }

            else {

                leg_pline_config = {
                    map: myride.dom_q.map.inst,
                    path: path_coords,
                    strokeColor: leg_color,
                    strokeWeight: self.palette.weights.lines.mid
                };

            }

            var leg_pline = new google.maps.Polyline(leg_pline_config);

            myride.dom_q.map.overlays.trip_pline.push(leg_pline);

            var walking_svg = svg_icon_paths.walking;
            var bus_svg = svg_icon_paths.bus;
            var dest_svg = svg_icon_paths.dest;

            var icon_svg_path = "";

            var icon_offset;

            var icon_offset_coord1 = 0;
            var icon_offset_coord2 = 0;

            var icon_color = "";

            switch (legs[i].modeField) {

                case "WALK":

                    icon_svg_path = walking_svg;

                    icon_offset_coord1 = 32;
                    icon_offset_coord2 = 57;

                    icon_color = "#017AC2";

                    break;

                case "BUS":

                    icon_svg_path = bus_svg;

                    icon_offset_coord1 = 7;
                    icon_offset_coord2 = 20;

                    icon_color = formattedModeResult.leg_color;

                    break;

                case "DEST":

                    icon_svg_path = dest_svg;

                    icon_offset_coord1 = 8;
                    icon_offset_coord2 = 4;

                    icon_color = "#017AC2";

                    break;

            }

            icon_offset =
            new google.maps.Point(icon_offset_coord1, icon_offset_coord2);

            var marker_coords = {
                lat: legs[i].fromField.latField,
                lng: legs[i].fromField.lonField
            };

            var marker = new google.maps.Marker({
                map: myride.dom_q.map.inst,
                position: marker_coords,
                icon: {
                    path: icon_svg_path,
                    scale: 1.5,
                    strokeColor: "#000000",
                    strokeWeight: 1,
                    fillColor: icon_color,
                    fillOpacity: 1,
                    anchor: icon_offset
                }
            });

            var formattedDistance;
            var reported_distance;
            var reported_distance_unit;

            formattedDistance = unitConversionAndDataReporting.
            formatReportedDistance(legs[i].distanceField);

            reported_distance = formattedDistance.reported_distance;

            reported_distance_unit = formattedDistance.
            reported_distance_unit;

            var trip_planner_info_box_contents;

            if (i === orig_legs_count) {

                trip_planner_info_box_contents = '' +
                    '<div class="trip-marker-info-window">' +
                        "<span>" +
                            "Arrived at destination." +
                        "</span>" +
                    '</div>';

            }

            else {

                trip_planner_info_box_contents = '' +
                    '<div class="trip-marker-info-window">' +
                        "<span>" +
                            "<em>" + (i+1) + ". </em> " +
                            label + " " + route_text +
                        "</span>" +
                        "<span>" +
                            "<em>Distance: </em>" +
                            reported_distance + " " + reported_distance_unit +
                        "</span>" +
                        "<span>" +
                            "<em> Time: </em>" +
                            legs[i].startTimeField.slice(11,16) +
                            " - " +
                            legs[i].endTimeField.slice(11,16) +
                        "</span>" +
                        "<span>" +
                            "<em> Duration: </em>" +
                            (legs[i].durationField / 1000 / 60).toFixed(0) +
                            " minutes" +
                        "</span>";
                    '</div>';

            }

            var info_window =
            new InfoBox({

                content: trip_planner_info_box_contents,
                boxClass: "trip-planner-info-box",
                pixelOffset: {

                    width: -100,
                    height: -101

                },
                infoBoxClearance: {

                    width: 0,
                    height: 25

                }

            });

            info_window.set("trip_marker_window_id", i);

            var trip_marker_window = {
                marker: marker,
                info: info_window
            };

            myride.dom_q.map.overlays.trip_points.push(trip_marker_window);

            myride.dom_q.map.overlays.trip_points[i].ShowWindow =
            new (function() {

                var self = this;

                this.pt = myride.dom_q.map.overlays.trip_points[i];

                this.func = function(e) {

                    var window_already_open =
                    top_self.showSelectedInfoWindow("planner", self.pt, e);

                    if (window_already_open) { return true; }

                    if (e) {
                        //Digest not being called despite planner index changing
                        generalServiceUtilities.forceDigest();
                    }

                };

            });

            top_self.addMarkerClickAndCloseListeners("trip_points", i);

        }

        if (i === orig_legs_count) {

            legs.pop();

        }

        var best_zoom_and_center = self.
        findBestZoomAndCenter(all_path_coords_divided);

        myride.dom_q.map.inst.setZoom(best_zoom_and_center.zoom);
        myride.dom_q.map.inst.setCenter(best_zoom_and_center.center);

    };

    this.decodePath = function(encoded) {

        var len = encoded.length;
        var index = 0;
        var array = [];
        var lat = 0;
        var lng = 0;

        encoded = encoded.replace(/\\/g,"\\");
        while (index < len) {
            var b;
            var shift = 0;
            var result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } 
            while (b >= 0x20);

            var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;

            do 
            {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } 
            while (b >= 0x20);

            var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            array.push([lat * 1e-5, lng * 1e-5]);
        }

        return array;
    };

}]);

BCTAppServices.service('tripPlannerService', [ '$http', '$q',
'generalServiceUtilities', 'unitConversionAndDataReporting',
'trip_planner_constants',
function($http, $q, generalServiceUtilities, unitConversionAndDataReporting,
trip_planner_constants) {

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
        var coord_objs = [start, finish];

        if (trip_opts.datetarg === "arrive_by") {
            arrdep = true;
        }
        for (mode in trip_opts.modeswitch) {
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
                UserId: 777,
                Action: "GET",
                "Favorite": null
            },
            transformResponse: function(res) {

                return generalServiceUtilities.
                tryParsingResponse(res, "downloadUserFavorites");

            }
        });

    };

    this.addRouteStopToFavorites = function(route, stop) {

        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitAPI/Favorites',
            data: {
                UserId: 777,
                Action: "ADD",
                Favorite: {
                    UserId: 777,
                    AgencyId: "BCT",
                    RouteId: route,
                    StopId: stop
                }
            }
        });

    };

    this.deleteFavoriteRouteStop = function(route, stop) {

       return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitAPI/Favorites',
            data: {
                UserId: 777,
                Action: "DELETE",
                "Favorite": {
                    UserId: 777,
                    AgencyId: "BCT",
                    RouteId: route,
                    StopId: stop
                }
            }
        });

    };

    this.checkIfRouteStopFavorited = function(route, stop) {

        var favorites = favorites_data.arr;

        for (var i=0;i<favorites.length;i++) {

            if (favorites[i].RouteId === "route" &&
                favorites[i].StopId === "stop") {

                return true;

            }

        }

        return false;

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
'locationService', 'latest_location', 'filterHelpers',
function(nearestStopsService, locationService, latest_location, filterHelpers) {

    return {

        RouteAndStopFilterMaker: function(
            filter_type,
            use_minimum_length
        ) {

            var self = this;

            if (filter_type === "stop") {

                this.property_name = "Name";
                this.id_or_code = "Code";

            }

            else if (filter_type === "route") {

                this.property_name = "LName";
                this.id_or_code = "Id";

            }

            else if (filter_type === "landmark") {

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
                items,
                search_string,
                sort_bstops_by_distance
            ) {

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

BCTAppServices.service('linkFunctions', [ '$compile',

function($compile) {

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

                scope.cur_route = scope.routes[data_id];

                scope.top_scope.filtered_sub_routes_arr = 
                scope.top_scope.route_stop_list =
                scope.cur_route.bstop_refs;

            }

            else if (type === "stop") {

                data_id = element[0].childNodes[0].getAttribute("id");

                scope.cur_stop = scope.stops[data_id];

                scope.top_scope.filtered_sub_stops_arr = 
                scope.top_scope.stop_route_list =
                scope.cur_stop.route_refs;

            }

            else if (type === "landmark") {

                var landmark_id = element[0].childNodes[0].getAttribute("id");

                for (var lmk_idx=0;lmk_idx<scope.landmarks.length;lmk_idx++) {

                    if (scope.landmarks[lmk_idx].Id === landmark_id) {
                        break;
                    }

                }

                scope.cur_landmark = scope.landmarks[lmk_idx];

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
'googleMapUtilities',

function(nearestStopsService, googleMapUtilities) {

    this.showNearestStopsFromMapCoords = function(
        coords,
        full_bstop_list,
        bus_stop_dictionary
    ) {

        var nearest_stops_to_map_point = nearestStopsService.findNearestStops(
            coords,
            full_bstop_list,
            bus_stop_dictionary,
            true,
            true
        );

        googleMapUtilities.clearMap(true);

        googleMapUtilities.displayNearestMapStops(
            nearest_stops_to_map_point,
            bus_stop_dictionary
        );

        return nearest_stops_to_map_point;

    };

}]);