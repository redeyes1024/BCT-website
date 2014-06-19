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

BCTAppServices.service('scheduleDownloadService', ['$http',
    function($http) {
    //TO DO: Backend will create "booking version" string for all data sets;
    //It will be requested and compared to see if and what data needs to be updated
    this.downloadRouteInfo = function() {
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
        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitApi/Stops/',
            data: { 
                "AgencyId": "BCT"
            },
            transformResponse: function(res) {
                if (localStorage) {
                    localStorage.setItem('route_data', res);
                }
                return JSON.parse(res);
            }
        });
    };
    this.downloadSchedule = function(route, stop) {
        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitApi/Schedules/',
            data: { 
                "AgencyId": "BCT",
                "RouteId": route,
		"StopId": stop,	
		"Direction":"1",
		"Date":"20140630"

            },
            transformResponse: function(res) {
                if (localStorage) {
                    localStorage.setItem('route_data', res);
                }
                return JSON.parse(res);
            }
        });
    };
}]);

BCTAppServices.service('decodeData', [ function() {
    this.decodeLine = function(encoded) {
        var len = encoded.length;
        var index = 0;
        var array = [];
        var lat = 0;
        var lng = 0;

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

BCTAppServices.service('googleMapUtilities', [ function() {
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
            var zoom = 14;
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

    this.displayPath = function(line_data) {
        if (isr.dom_q.map.overlays.pline) {
            isr.dom_q.map.overlays.pline.setMap(null);
        }

        var path_coords = [];
        var legs = line_data;

        for (var i=0;i<legs.length;i++) {
            var from_coord = {
                lat: legs[i].fromField.latField,
                lng: legs[i].fromField.lonField
            };
            var to_coord = {
                lat: legs[i].toField.latField,
                lng: legs[i].toField.lonField
            };
            path_coords.push(from_coord, to_coord);
        }

        isr.dom_q.map.overlays.pline = new google.maps.Polyline({
            map: isr.dom_q.map.inst,
            path: path_coords
        });

//        var marker;
//
//        for (var j=0;j<path_coords.length;j++) {
//            marker = new google.maps.marker({
//                map: isr.dom_q.map.inst,
//                
//            });
//            isr.dom_q.map.overlays.point.push(marker);
//        }
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

        if (modearr.length === 1) {
            modearr.push("BUS");
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