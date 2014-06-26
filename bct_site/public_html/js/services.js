var BCTAppServices = angular.module('BCTAppServices', []);

BCTAppServices.value('scheduleWebSocket', new WebSocket("ws://echo.websocket.org"));

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

BCTAppServices.service('nearestTimeService', [ function() {
    var self = this;
    this.convertToTime = function(time_int) {
        var int_arr = String(time_int).split("")
        int_arr.splice(-2,0,":");

        return int_arr.join("");
    };
    this.getNearestTimes = function(time, times, bef, aft) {
        if (!bef) {
            var bef = 1;
            var aft = 3;
        }
        else if (!aft) {
            var aft = 3;
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

BCTAppServices.service('scheduleDownloadService', ['$http', '$q', 'nearestTimeService',
    function($http, $q, nearestTimeService) {
    //TO DO: Backend will create "booking version" string for all data sets;
    //It will be requested and compared to see if and what data needs to be updated
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
    
    this.transformSchedule = function(output_type, s_data) {
        var date_time = new Date;
        var now = date_time.toTimeString().slice(0,5);
        var s_times = s_data.Today;
        var departures = [];
        var schedule_output = {};

        for (var i=0;i<s_times.length;i++) {
            departures.push(s_times[i].DepartureTime);
        }
        switch (output_type) {
            case "nearest":
                schedule_output.nearest = nearestTimeService.getNearestTimes(
                    now, departures);
                schedule_output.nearest.all = schedule_output.nearest.
                    prev_times.concat(schedule_output.nearest.next_times);
                break;
            case "datepick":
                schedule_output.date_pick = departures.slice();
                break;
        }
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

    this.addTimeDiffMessages = function(diff_arr) {
        var message_arr = [];

        for (var i=0;i<diff_arr.length;i++) {
            var time_diff_message = "";
            var start_text = "";
            var end_text = "";
            var number_of_minutes = "";
            var time_unit = " minute";
            var plural_modifier = "s";

            if (diff_arr[i] < 0) {
                number_of_minutes = diff_arr[i] * -1;
                end_text = " ago";
            }
            else if (diff_arr[i] > 0) {
                number_of_minutes = diff_arr[i];
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

            time_diff_message += start_text + number_of_minutes +
                time_unit + plural_modifier + end_text;

            message_arr.push(time_diff_message);
        }
        return message_arr;
    };

    this.updateTimeDifferences = function(nearest) {
        var new_nearest_full = [];
        var nearest_times = [];

        for (var i=0;i<nearest.length;i++) {
            nearest_times.push(nearest[i].time);
        }

        var new_diffs = self.calculateTimeDifference(nearest_times);
        var new_diff_msgs = self.addTimeDiffMessages(new_diffs);

        for (var j=0;j<nearest.length;j++) {
            var new_nearest_time_diff = {
                time: nearest_times[j],
                diff: new_diff_msgs[j]
            };

            new_nearest_full.push(new_nearest_time_diff);
        }

        return new_nearest_full;
    };
}]);

BCTAppServices.service('googleMapUtilities', [ 'scheduleDownloadService',
    function(scheduleDownloadService) {
    var self = this;

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
            strokeColor: "#017AC2",
            strokeWeight: 5
        });
    };

    this.displayStops = function(route, routes, stops) {
        var cur_route = routes[route];
        var bstops_names = cur_route.Stops;
        var stop_coords = [];

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
                    scale: 10,
                    strokeColor: "#C14E4E",
                    strokeWeight: 4
                }
            });

            var info_cts = '' +
                '<div class="marker-info-window">' +
                    '<span> Route: ' + route + '</span>' +
                    '<span> Stop: ' + bstops_names[i] + '</span>' +
                    '<span> Name: ' + stops[bstops_names[i]].Name + '</span>' +
                    '<span> Other Routes: ' + stops[bstops_names[i]].Routes.join(", ") + '</span>' +
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

            isr.dom_q.map.overlays.points[bstops_names[i]].ShowWindow = new (function() {
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

                    scheduleDownloadService.downloadSchedule(route, self.s_id).then(function(res) {
                        var nearest_schedule = scheduleDownloadService.transformSchedule("nearest", res.data);
                        angular.element(document).ready(function() {
                            document.getElementById("stop-window-times-" + self.s_id).
                            innerHTML = nearest_schedule.nearest.next_times.join(", ");
                        });
                    });
                };
            });

            google.maps.event.addListener(
                isr.dom_q.map.overlays.points[bstops_names[i]].marker,
                'click',
                isr.dom_q.map.overlays.points[bstops_names[i]].ShowWindow.func);
        }
    };

    this.displayPath = function(line_data) {
        self.clearMap();

        var legs = line_data;

        for (var i=0;i<legs.length;i++) {
            var path_coords_raw = self.decodePath(legs[i].legGeometryField.pointsField);
            var path_coords = [];

            for (var j=0;j<path_coords_raw.length;j++) {
                var LatLng = {};

                LatLng.lat = path_coords_raw[j][0];
                LatLng.lng = path_coords_raw[j][1];

                path_coords.push(LatLng);
            }

            var leg_color = "";
            var route_text = "";

            switch (legs[i].modeField) {
                case "BUS":
                    leg_color = "#017AC2";
                    route_text = "BCT" + legs[i].routeField;
                    label = "Bus route";
                    break;
                case "WALK":
                    leg_color = "#000000";
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
                    "Invalid transit mode setting: " + legs[i].modeField;
            }

            var leg_pline = new google.maps.Polyline({
                map: isr.dom_q.map.inst,
                path: path_coords,
                strokeColor: leg_color,
                strokeWeight: 4
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
                    scale: 10,
                    strokeColor: "#C14E4E",
                    strokeWeight: 4
                }
            });

            var reported_distance = 0;
            var reported_distance_unit = "";

            var d_in_yards = legs[i].distanceField * 1.0936133;

            if (d_in_yards >= 880) {
                var d_in_miles = d_in_yards / 1760;
                reported_distance = d_in_miles.toFixed(1);
                reported_distance_unit = "miles";
            }
            else {
                reported_distance = d_in_yards.toFixed(0);
                reported_distance_unit = "yards";
            }

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

//        google.maps.event.addListenerOnce(isr.dom_q.map, 'idle', function() {
//            scope.map_schedule_toggle = false;
//            scope.show_loading_screen = false;
//            scope.$apply();
//        });
    
BCTAppServices.service('tripPlannerService', [ '$http', '$q',
    function($http, $q) {

    var self = this;

    this.getLatLon = function(start, finish) {
        var head = "https://maps.googleapis.com/maps/api/geocode/json?address=";
        var api_key = "AIzaSyCXxtwuyy3k9Ot5d44hgjHQt4kkg5KZ5Hw";
        var region = "Broward+County";
        var state = "FL";

        var tail = ",+" + region + ",+" + state + "&key" + api_key;

        start = start.split(" ").join("+");
        finish = finish.split(" ").join("+");

        url_s = head + start + tail;
        url_f = head + finish + tail;

        return $q.all([
            $http({
                method: 'GET',
                url: url_s
            }),
            $http({
                method: 'GET',
                url: url_f
            })
        ]);
    };

    this.getTripPlanPromise = function(trip_opts, start, finish) {
        trip_opts.datepick = new Date;
        
        var arrdep = false;
        var date = trip_opts.datepick.toISOString().slice(0,10).replace(/-/g,"");
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

        for (var i=0;i<coord_objs.length;i++) {
            coord_objs[i]["Latitude"] = coord_objs[i]["lat"];
            coord_objs[i]["Longitude"] = coord_objs[i]["lng"];

            delete coord_objs[i]["lat"];
            delete coord_objs[i]["lng"];
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