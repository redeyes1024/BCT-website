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
    this.downloadRouteInfo= function() {
        return $http({
            
            method: 'POST',
            url: 'http://174.94.153.48:7778/TransitApi/BusRoutes/',
            data: { 
                "AgencyId":"STM",
                "RouteType":"3"
            },
            transformResponse: function(res) {
                if (localStorage) {
                    localStorage.setItem('route_data', res);
                }
                return JSON.parse(res);
            }
        });
    };
    this.downloadStopInfo= function() {
        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7778/TransitApi/BusStop/',
            data: { 
                "AgencyId": "STM",

                "Direction":"0",
                "Date":"20140610"
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

BCTAppServices.service('googleMapUtilities', [ function() {
    this.mapMaker = function(name, container, lat, lng) {
        //Default location is near Broward County
        if (!lat) { lat =  26.103277; lng = -80.399114; }
        var map_options = {
            center: new google.maps.LatLng(lat, lng),
            zoom: 10
        };
        isr.dom_q.maps[name] = new google.maps.Map(container,
            map_options);
    };
//        isr.dom_q.pline = new google.maps.Polyline({ map: isr.dom_q.map} );
//        var pline = isr.dom_q.pline;
//        window.path_coords = [];
//        var service = new google.maps.DirectionsService;
//
//        service.route({
//            origin: "26.11,-80.41",
//            destination: "26.12,-80.42",
//            travelMode: google.maps.DirectionsTravelMode.DRIVING,
//            waypoints: [
//                { location: "26.1167365, -80.3943407" }
//            ]
//        }, function(result, status) {
//            var res_coords = result.routes[0].overview_path;
//            for (var i=0; i<res_coords.length; i++) {
//                var lat = res_coords[i].k;
//                var lng = res_coords[i].A;
//                var lat_lng = {};
//
//                lat_lng.lat = lat;
//                lat_lng.lng = lng;
//
//                path_coords.push(lat_lng);
//            }
//        });
//        google.maps.event.addListenerOnce(isr.dom_q.map, 'idle', function() {
//            scope.map_schedule_toggle = false;
//            scope.show_loading_screen = false;
//            scope.$apply();
//        });
}]);