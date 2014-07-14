var BCTAppServices = angular.module('BCTAppServices', []);

var BCTAppValues = angular.module('BCTAppValues', []);

BCTAppValues.value('scheduleWebSocket', new WebSocket("ws://echo.websocket.org"));

BCTAppValues.value('latest_location', {
    LatLng: {
        Latitude: 0,
        Longitude: 0
    }
});

BCTAppValues.value('location_icons', {
    nearest_bstops: {
        regular_icon:
        "show_nearest_bstops_location_icon",
        spinning_icon:
        "show_nearest_bstops_location_icon_with_spin"
    },
    trip_planner: {
        regular_icon:
        "show_planner_location_icon",
        spinning_icon:
        "show_planner_location_icon_with_spin"
    },
    nearest_results_bstops: {
        regular_icon: 
        "show_nearest_results_bstops_location_icon",
        spinning_icon: 
        "show_nearest_results_bstops_location_icon_with_spin"
    }
});

BCTAppServices.service('scheduleSocketService', ['$q', 'scheduleWebSocket',
    function($q, scheduleWebSocket) {

    var self = this;
    var currentCallbackId = 0;
    //this.callbacks = {};

    this.sendRequest = function(request) {
        //var callbackId = self.getCallbackId();

        //request.callback_id = callbackId;
        console.log('Sending request', request);
        scheduleWebSocket.send(request);
    };
    this.listener = function(data) {
        var messageObj = data;
        console.log("Received data from websocket: ", messageObj);
        if(callbacks.hasOwnProperty(messageObj.callback_id)) {
            console.log(callbacks[messageObj.callback_id]);
            $rootScope.$apply(self.callbacks[messageObj.callback_id].cb.resolve(messageObj.data));
            delete self.callbacks[messageObj.callbackID];
        }
    };
//    this.getCallbackId = function() {
//        currentCallbackId += 1;
//        if(currentCallbackId > 10000) {
//            currentCallbackId = 0;
//        }
//        return currentCallbackId;
//    };
    this.echo = function(request) {
        self.sendRequest(request);
    };
}]);

BCTAppServices.service('miniScheduleService', [ function() {

    var self = this;

    this.convertToTime = function(time_int) {
        var int_arr = String(time_int).split("")
        int_arr.splice(-2,0,":");

        return int_arr.join("");
    };

    this.mini_schedule_quantity_defaults = {
        before_times: 1,
        after_times: 3
    };

    this.mini_schedule_quantity_defaults.total_times =
        this.mini_schedule_quantity_defaults.before_times +
        this.mini_schedule_quantity_defaults.after_times;

    this.makeMiniScheduleLoadingTemplate = function() {
        var mini_schedule_loading_template = [];

        for (var i=0;i<self.mini_schedule_quantity_defaults.total_times;i++) {
            var time_holder = {
                time: "Loading...",
                diff: ""
            };
            mini_schedule_loading_template.push(time_holder);
        }

        return mini_schedule_loading_template;
    };

    this.getNearestTimes = function(time, times, bef, aft) {
        if (!bef) {
            var bef = self.mini_schedule_quantity_defaults.before_times;
            var aft = self.mini_schedule_quantity_defaults.after_times;
        }
        else if (!aft) {
            var aft = self.mini_schedule_quantity_defaults.after_times;
        }
        
        var times_int = times.map(function(a) { return parseInt(a.replace(/:/,"")) })
        var now_int = parseInt(time.replace(/:/,""));
        var nearest = {
            prev_times: [],
            next_times: []
        };

        times_int.push(now_int);
        times_int.sort((function(a,b) { return (a-b); }));

        var int_index = times_int.indexOf(now_int);

        for (var b=0;b<bef;b++) {
            if (!times_int[int_index - (1 + b)]) { break; }
            nearest.prev_times.push(times_int[int_index - (1 + b)]);
        }
        for (var a=0;a<aft;a++) {
            if (!times_int[int_index + (1 + a)]) { break; }
            nearest.next_times.push(times_int[int_index + (1 + a)]);
        }

        nearest.prev_times = nearest.prev_times.map(self.convertToTime);
        nearest.next_times = nearest.next_times.map(self.convertToTime);

        return nearest;
    };

}]);

BCTAppServices.service('locationService', [ '$timeout', 'latest_location',
function($timeout, latest_location) {

    var self = this;

    this.OUT_OF_REGION_CUTOFF_COORDS = {
        lat: {
            max: 27,
            min: 25
        },
        lng: {
            max: -81,
            min: -82
        }
    };

    this.DEFAULT_DEMO_LOCATION_COORDS = {
        LatLng: {
            Latitude: 25.977301,
            Longitude: -80.12027
        }
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
            current_location = self.DEFAULT_DEMO_LOCATION_COORDS;
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
    this.MAXIMUM_DISTANCE = 500 / 111111;

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
        
        if (distance > 0) {
            var distance_in_meters = distance_in_degrees * 111111;
            var distance_in_yards = distance_in_meters * 1.09361;

            //Because distances were converted roughly to and from degrees
            //latitude and longitude, rounding is extensive
            var rounded_distance = distance_in_yards.toFixed(-1);

            reported_distance = rounded_distance + " " + units;
        }
        else if (distance === 0) {
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
            var distance = self.computeLinearDistance(
                current_location.LatLng,
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
        bus_stop_dictionary
    ) {

        current_location =
        locationService.
        changeToDefaultLocationIfOutsideOfFlorida(current_location);

        var full_bstop_list_ids_coords = [];

        for (var i=0;i<full_bstop_list.length;i++) {
            full_bstop_list_ids_coords.push({
                Id: full_bstop_list[i].Id,
                LatLng: full_bstop_list[i].LatLng
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

        var nearest_bstops = stops_below_cutoff.
        slice(0, self.MAXIMUM_REPORTED_STOPS);

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

BCTAppServices.service('scheduleDownloadAndTransformation', ['$http', '$q',
    'miniScheduleService',
    function($http, $q, miniScheduleService) {
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
                return JSON.parse(res);
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
                return JSON.parse(res);
            }
        });
    };

    this.downloadSchedule = function(route, stop, date) {
        if (!date) {
            var date = new Date;
        }
        var iso_date = date.toISOString().slice(0,10).replace(/-/g,"");

        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitApi/Schedules/',
            data: { 
                "AgencyId": "BCT",
                "RouteId": route,
		"StopId": stop,	
		"Direction": "1",
		"Date": iso_date

            },
            transformResponse: function(res) {
//                if (localStorage) {
//                    localStorage.setItem('route_data', res);
//                }
                return JSON.parse(res);
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
                schedule_output.nearest = miniScheduleService.getNearestTimes(
                    now, departures);
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
        var t2_h = Number(t2.split(":")[0]);
        var t2_m = Number(t2.split(":")[1]);
        var min_t2 = t2_h * 60 + t2_m;

        for (var i=0;i<times_arr.length;i++) {
            var t1 = times_arr[i];
            var t1_h = Number(t1.split(":")[0]);
            var t1_m = Number(t1.split(":")[1]);
            var min_t1 = t1_h * 60 + t1_m;

            var diff = min_t1 - min_t2;
            diff_arr.push(diff);
        }
        return diff_arr;
    };
}]);

BCTAppServices.service('unitConversionAndDataReporting', [ function() {

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

        if (Number(minutes_count) > 59) {
            hours_count = String(parseInt(minutes_count / 60));
            minutes_count = String(minutes_count % 60);

            hours_label = " hour";
        }
        else {
            hours_plural = "";
            divider = "";
        }

        if (minutes_count === "1") {
            mins_plural = "";
        }
        if (hours_count === "1") {
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
                time_unit = "";
                plural_modifier = "";
                start_text = "about now";
            }

            if(Math.abs(diff_arr[i]) === 1) {
                plural_modifier = "";
            }

            var time_diff_message = start_text + time_difference + end_text;

            message_arr.push(time_diff_message);
        }
        return message_arr;
    };

    this.formatReportedDate = function(raw_date) {
        var current_date_ISO = (new Date).toISOString();

        var input_date_time = raw_date.slice(11, 16);

        var input_date_yymmdd = raw_date.slice(0, 10);
        var current_date_yymmdd = current_date_ISO.slice(0, 10);

        var start = "";
        //var start = input_date_yymmdd;

        if (input_date_yymmdd === current_date_yymmdd) {
            start = "";
        }

        var formatted_date = start + " " + input_date_time;

        return formatted_date;
    };

}]);

BCTAppServices.service('googleMapUtilities', [
    'scheduleDownloadAndTransformation', 'unitConversionAndDataReporting',
    function(scheduleDownloadAndTransformation,
    unitConversionAndDataReporting) {

    var self = this;

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

    this.mapMaker = function(container, lat, lng) {
        //Default location is near Broward County
        if (!lat) { lat =  26.103277; lng = -80.399114; }
        var map_options = {
            center: new google.maps.LatLng(lat, lng),
            zoom: 10
        };
        isr.dom_q.map.inst = new google.maps.Map(container,
            map_options);
    };

    this.touchMap = function() {
        angular.element(document).ready(function() {
            google.maps.event.trigger(
                isr.dom_q.map.inst, "resize"
            );
        });
    };

    this.setMapPosition = function(coords, zoom) {
        if (!zoom) {
            var zoom = 18;
        }
        if (!coords) {
            var coords = {
                lat: 26.103277,
                lng: -80.399114
            };
        }
        else if (coords.Latitude) {
            coords.lat = coords.Latitude;
            coords.lng = coords.Longitude;
            delete coords.Latitude;
            delete coords.Longitude;
        }

        //Map intance is re-centered before re-showing the map...
        isr.dom_q.map.inst.setZoom(zoom);
        isr.dom_q.map.inst.setCenter(coords);
        self.touchMap();
        angular.element(document).ready(function() {
            //...but it must be re-centered once more in case a resize
            //occured since the map instance was last hidden.
            //N.B. the event.trigger method does not have a callback arg
            //triggered upon resize, so second re-centering is always attempted
            isr.dom_q.map.inst.setZoom(zoom);
            isr.dom_q.map.inst.setCenter(coords);
        });
    };

    this.clearMap = function() {
        var points = isr.dom_q.map.overlays.points;
        var pline =  isr.dom_q.map.overlays.pline;
        var trip_plines = isr.dom_q.map.overlays.trip_plines;
        var trip_points = isr.dom_q.map.overlays.trip_points;

        for (var mk=0;mk<trip_points.length;mk++) {
            trip_points[mk].marker.setMap(null);
        }

        trip_markers = isr.dom_q.map.overlays.trip_points = [];

        for (var pl=0;pl<trip_plines.length;pl++) {
            trip_plines[pl].setMap(null);
        }

        isr.dom_q.map.overlays.plines = [];

        for (p in points) {
            points[p].marker.setMap(null);
        }

        isr.dom_q.map.overlays.points = {};

        if (pline) {
            isr.dom_q.map.overlays.pline.setMap(null);
        }
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

        isr.dom_q.map.overlays.pline = new google.maps.Polyline({
            map: isr.dom_q.map.inst,
            path: route_coords_cor,
            strokeColor: self.palette.colors.blue,
            strokeWeight: self.palette.weights.lines.mid
        });
    };

    this.displayStops = function(route, routes, stops) {
        var cur_route = routes[route];
        var bstops_names = cur_route.Stops;

        for (var i=0;i<bstops_names.length;i++) {
            if (!stops[bstops_names[i]].LatLng.Latitude) { continue; }
            var lat = stops[bstops_names[i]].LatLng.Latitude;
            var lng = stops[bstops_names[i]].LatLng.Longitude;

            var coords = new google.maps.LatLng(lat, lng);
            var marker = new google.maps.Marker({
                map: isr.dom_q.map.inst,
                position: coords,
                title: route + ' ' + bstops_names[i],
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: self.palette.scales.markers.small,
                    strokeColor: self.palette.colors.red,
                    strokeWeight: self.palette.weights.markers.thin
                }
            });

            var info_cts = '' +
                '<div class="marker-info-window">' +
                    '<span> Route: ' + route + '</span>' +
                    '<span> Stop: ' + bstops_names[i] + '</span>' +
                    '<span> Name: ' + stops[bstops_names[i]].Name + '</span>' +
                    '<span> Other Routes: ' +
                    stops[bstops_names[i]].Routes.join(", ") + 
                    '</span>' +
                    '<span>' +
                        'Next departures: ' +
                        '<span id="stop-window-times-' + bstops_names[i] + '">' +
                        'Loading...</span>' +
                    '</span>' +
                '</div>';

            var info_window = new google.maps.InfoWindow({ content: info_cts });

            isr.dom_q.map.overlays.points[bstops_names[i]] = {
                marker: marker,
                info: info_window
            };

            isr.dom_q.map.overlays.points[bstops_names[i]].ShowWindow =
            new (function() {
                var self = this;
                this.s_id = bstops_names[i];
                this.pt = isr.dom_q.map.overlays.points[bstops_names[i]];
                this.func = function() {
                    var open_info_stop = isr.dom_q.map.overlays.open_info[0].
                        content.match(/Stop: .*?<\/span>/)[0].slice(6,-7);
                    //Do nothing if the target info window is already open
                    //unless a different info window is being triggered
                    if (self.s_id === open_info_stop) { return true; }
                    self.pt.info.open(
                    isr.dom_q.map.inst,
                    self.pt.marker);

                    //Store a reference to the latest opened info window
                    //so it can be closed when another is opened
                    isr.dom_q.map.overlays.open_info[0].close();
                    isr.dom_q.map.overlays.open_info.pop();
                    isr.dom_q.map.overlays.open_info.push(self.pt.info);

                    scheduleDownloadAndTransformation.
                    downloadSchedule(route, self.s_id).then(function(res) {
                        var nearest_schedule = scheduleDownloadAndTransformation.
                        transformSchedule("nearest", res.data.Today);
                        angular.element(document).ready(function() {
                            try {
                                document.getElementById(
                                    "stop-window-times-" +self.s_id
                                ).
                                innerHTML = nearest_schedule.
                                nearest.next_times.join(", ");
                            } catch(e) { 
                                console.log("A Google Maps infowindow was " +
                                "closed before next times were fully loaded.");
                            }
                        });
                    });
                };
            });

            google.maps.event.addListener(
                isr.dom_q.map.overlays.points[bstops_names[i]].info,
                'closeclick',
                function() {
                    isr.dom_q.map.overlays.open_info = [{
                        close: function() {},
                        content: "<span>Stop: First</span>"
                    }];
                }
            );

            google.maps.event.addListener(
                isr.dom_q.map.overlays.points[bstops_names[i]].marker,
                'click',
                isr.dom_q.map.overlays.points[bstops_names[i]].ShowWindow.func);
        }
    };

    this.formatTransitModeResult = function(mode_field, route_field) {
        var leg_color = "";
        var route_text = "";

        switch (mode_field) {
            case "BUS":
                leg_color = self.palette.colors.blue;
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
            default:
                throw (new Error).message = "" +
                "Invalid transit mode setting: " + lmode_field;
        }

        return {
            leg_color: leg_color,
            route_text: route_text
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

        var map_width = isr.dom_q.map.cont.clientWidth;
        var map_width_calibration_ratio = Number(
            map_width / ZOOM_14_SPAN_0_5_MAP_WIDTH).
            toFixed(1);

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

    this.displayTripPath = function(line_data) {
        self.clearMap();

        var legs = line_data;
        var all_path_coords_divided = {
            lats: [],
            lngs: []
        };

        for (var i=0;i<legs.length;i++) {
            var path_coords_raw = self.decodePath(
                legs[i].legGeometryField.pointsField
            );
            var path_coords = [];

            for (var j=0;j<path_coords_raw.length;j++) {
                var LatLng = {};

                LatLng.lat = path_coords_raw[j][0];
                LatLng.lng = path_coords_raw[j][1];

                all_path_coords_divided.lats.push(path_coords_raw[j][0]);
                all_path_coords_divided.lngs.push(path_coords_raw[j][1]);

                path_coords.push(LatLng);
            }

            var formattedModeResult = self.formatTransitModeResult(
                    legs[i].modeField, legs[i].routeField);
            var leg_color = formattedModeResult.leg_color;
            var route_text = formattedModeResult.route_text;

            var leg_pline = new google.maps.Polyline({
                map: isr.dom_q.map.inst,
                path: path_coords,
                strokeColor: leg_color,
                strokeWeight: self.palette.weights.lines.mid
            });

            isr.dom_q.map.overlays.trip_plines.push(leg_pline);

            var marker_coords = {
                lat: legs[i].fromField.latField,
                lng: legs[i].fromField.lonField
            };

            var marker = new google.maps.Marker({
                map: isr.dom_q.map.inst,
                position: marker_coords,
                //title: route + ' ' + bstops_names[i],
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: self.palette.scales.markers.small,
                    strokeColor: self.palette.colors.red,
                    strokeWeight: self.palette.weights.markers.thin
                }
            });

            var formattedDistance = unitConversionAndDataReporting.
                formatReportedDistance(legs[i].distanceField);
            var reported_distance = formattedDistance.reported_distance;
            var reported_distance_unit = formattedDistance.
            reported_distance_unit;

            var info_cts = '' +
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
                        "<em> Time (approx): </em>" +
                        (legs[i].durationField / 1000 / 60).toFixed(1) +
                        " minutes" +
                    "</span>";
                '</div>';

            var info_window = new google.maps.InfoWindow({ content: info_cts });
            info_window.set("trip_marker_window_id", i);
            
            var trip_marker_window = {
                marker: marker,
                info: info_window
            };

            isr.dom_q.map.overlays.trip_points.push(trip_marker_window);

            isr.dom_q.map.overlays.trip_points[i].ShowWindow = new (function() {
                var self = this;
                this.pt = isr.dom_q.map.overlays.trip_points[i];
                this.func = function() {
                    //Do nothing if the target info window is already open
                    //unless a different info window is being triggered
                    var open_window = isr.dom_q.map.overlays.trip_open_info[0];
                    if (self.pt.info.trip_marker_window_id ===
                        open_window.trip_marker_window_id)
                        { return true; }

                    self.pt.info.open(
                        isr.dom_q.map.inst,
                        self.pt.marker);

                    //Store a reference to the latest opened info window
                    //so it can be closed when another is opened
                    isr.dom_q.map.overlays.trip_open_info[0].close();
                    isr.dom_q.map.overlays.trip_open_info.pop();
                    isr.dom_q.map.overlays.trip_open_info.push(self.pt.info);
                };
            });

            google.maps.event.addListener(
                isr.dom_q.map.overlays.trip_points[i].marker,
                'click',
                isr.dom_q.map.overlays.trip_points[i].ShowWindow.func);
        }

        var best_zoom_and_center = self.
        findBestZoomAndCenter(all_path_coords_divided);

        isr.dom_q.map.inst.setZoom(best_zoom_and_center.zoom);
        isr.dom_q.map.inst.setCenter(best_zoom_and_center.center);
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
    function($http, $q) {

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
        trip_opts.datepick = new Date;
        
        var arrdep = false;
        var date = trip_opts.datepick.toISOString().slice(0,10).
        replace(/-/g,"");
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
}]);

BCTAppServices.factory('routeAndStopFilters', [ 'nearestStopsService',
'locationService', 'latest_location', 
function(nearestStopsService, locationService, latest_location) {
    return {

        RouteAndStopFilterMaker: function(non_id_property, use_minimum_length) {

            var self = this;

            this.property_name = non_id_property;

            if (use_minimum_length) {
                this.filter_condition = function(input_string_length) {
                    if (input_string_length < 3) {
                        return false;
                    }
                    return true;
                };
            }
            else {
                this.filter_condition = function() {
                    return true;
                };
            }

            this.filter = function(
                items,
                search_string,
                sort_bstops_by_distance
            ) {

                var filtered = [];
                var input_lower = search_string.toLowerCase();

                if (!self.filter_condition(search_string.length)) { 
                    return true; 
                }

                if (search_string.length === 0) {
                    return items;
                };

                for (var i=0;i<items.length;i++) {
                    var search_str_cased = items[i].Id + " " +
                    items[i][self.property_name];
                    var search_str = search_str_cased.toLowerCase();

                    if (search_str.match(input_lower)) {
                        filtered.push(items[i]);
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

                return filtered;
            };
        }

    };

}]);