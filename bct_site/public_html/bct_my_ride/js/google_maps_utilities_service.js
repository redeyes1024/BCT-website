BCTAppServices.service('googleMapsUtilities', [ '$compile', '$q',
'scheduleDownloadAndTransformation', 'unitConversionAndDataReporting',
'locationService', 'map_navigation_marker_indices',
'generalServiceUtilities', 'svg_icon_paths', 'map_clusterer',
'marker_icon_options', 'marker_click_memory', 'selected_nearest_map_stop',
'nearest_map_stop_distances', 'full_route_data', 'full_bstop_data',
'map_palette', 'clusterer_options', 'map_zoom_span_breakpoints',

function($compile, $q, scheduleDownloadAndTransformation,
unitConversionAndDataReporting, locationService,
map_navigation_marker_indices, generalServiceUtilities,
svg_icon_paths, map_clusterer, marker_icon_options, marker_click_memory,
selected_nearest_map_stop, nearest_map_stop_distances, full_route_data,
full_bstop_data, map_palette, clusterer_options, map_zoom_span_breakpoints) {

    var self = this;

    var top_self = this;

    this.initializeMarkerClusterer = function() {

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

    this.displayRoute = function(route) {

        var route_coords = self.decodePath(full_route_data.dict[route].Shp);
        var route_coords_cor = [];

        for (var i=0;i<route_coords.length;i++) {

            var coords_obj = { lat: "", lng: "" };

            coords_obj.lat = route_coords[i][0];
            coords_obj.lng = route_coords[i][1];

            route_coords_cor.push(coords_obj);

        }

        var route_color = "#" + full_route_data.dict[route].Color;

        myride.dom_q.map.overlays.pline = new google.maps.Polyline({
            map: myride.dom_q.map.inst,
            path: route_coords_cor,
            strokeColor: route_color,
            strokeWeight: map_palette.weights.lines.mid
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
            content: "<span>Stop: First</span>",
            is_dummy: true
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

            var open_info_window_exists =
            typeof myride.dom_q.map.overlays["open_info"][0][id_type_name] !==
            "undefined";

            var cur_info_window_opened = point.info[id_type_name] ===
            myride.dom_q.map.overlays["open_info"][0][id_type_name];

            if (open_info_window_exists && cur_info_window_opened) {

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

                var icon_options = marker_icon_options.schedule_map.default;

                icon_options.fillColor =
                myride.dom_q.map.overlays.points[open_window.marker_label].
                marker.getIcon().fillColor;

                myride.dom_q.map.overlays.points[open_window.marker_label].
                marker.setOptions({
                    icon: icon_options
                });

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

            var icon_options = marker_icon_options.schedule_map.mouseover;

            icon_options.fillColor =
            myride.dom_q.map.overlays.points[point_name].
            marker.getIcon().fillColor;

            myride.dom_q.map.overlays.points[point_name].
            marker.setOptions({
                icon: icon_options
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
                    info_opener.open("click", false);

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
                    marker.setOptions({
                        icon: icon_options
                    });

                    myride.dom_q.map.overlays[marker_list_name][marker_id].
                    info_opener.open(null, true);

                }

            );

            google.maps.event.addListener(

                myride.dom_q.map.overlays[marker_list_name][marker_id].marker,

                'mouseout',

                function() {

                    var marker_was_clicked =
                    myride.dom_q.map.overlays[marker_list_name][marker_id].
                    info.clicked;

                    if (!marker_was_clicked) {

                        myride.dom_q.map.overlays[marker_list_name][marker_id].
                        info.close();

                        self.createDummyInfoWindow(marker_list_name, true);

                        var icon_options =
                        marker_icon_options.schedule_map.default;

                        icon_options.fillColor =
                        myride.dom_q.map.overlays[marker_list_name][marker_id].
                        marker.getIcon().fillColor;

                        myride.dom_q.map.overlays[marker_list_name][marker_id].
                        marker.setOptions({
                            icon: icon_options
                        });

                    }

                }

            );

        }
        
        else if (marker_list_name === "trip_points") {
        
            google.maps.event.addListener(

                myride.dom_q.map.overlays[marker_list_name][marker_id].marker,

                'click',

                myride.dom_q.map.overlays[marker_list_name][marker_id].
                info_opener.open

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

    this.displayInfoWindowSchedule = function(res, marker) {

        if (!res.data.Today) {

            console.log("Problem communicating with server: InfoBox schedule.");

            return true;

        }

        var nearest_schedule =
        scheduleDownloadAndTransformation.
        transformSchedule(
            "nearest", res.data.Today
        );

        angular.element(document).ready(function() {

            try {

                var schedule_el_cont =
                marker.info.div_.getElementsByClassName(
                    "schedule-map-info-window-schedule-contents"
                )[0];

                var nearest_times =
                nearest_schedule.nearest.next_times;

                var converted_nearest_times = [];

                for (var i=0;i<nearest_times.length;i++) {

                    converted_nearest_times.push(
                        unitConversionAndDataReporting.convertToTwelveHourTime(
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

                console.log(
                    "A Google Maps infowindow was closed before next " +
                    "times were fully loaded."
                );

            }

        });

    };

    this.ScheduleMapInfoWindowOpener = function(
        stop_id,
        route_id,
        route_icons_template
    ) {

        var self = this;

        this.stop_id = stop_id;

        this.route_id = route_id;

        this.marker = myride.dom_q.map.overlays.points[stop_id];

        this.route_icons_template = route_icons_template;

        this.schedule_template = '' +

            '<span class="schedule-map-info-window-schedule-contents">' +
                'Loading Schedule...' +
            '</span>';

        this.open = function(e, hovered) {

            var window_already_open = top_self.showSelectedInfoWindow(
                "schedule",
                self.marker,
                e,
                self.stop_id,
                hovered
            );

            if (window_already_open) { return true; }

            google.maps.event.addListenerOnce(
                self.marker.info,
                'domready',
                function() {

                    var scope = generalServiceUtilities.top_level_scope;

                    angular.element(document).ready(function() {

                        try {

                            var route_icons_el = self.marker.info.div_.
                            getElementsByClassName(
                                "info-window-associated-routes"
                            )[0];

                            var schedule_el = self.marker.info.div_.
                            getElementsByClassName(
                                "schedule-map-info-window-schedule"
                            )[0];

                            schedule_el.style.display = "none";

                            var route_icons_el_ang_obj =
                            angular.element(route_icons_el);

                            var schedule_el_ang_obj =
                            angular.element(schedule_el);

                            route_icons_el_ang_obj.append(
                                $compile(self.route_icons_template)(scope)
                            );

                            schedule_el_ang_obj.append(
                                $compile(self.schedule_template)(scope)
                            );

                            if (hovered) {

                                schedule_el.parentNode.parentNode.parentNode.
                                style.zIndex = 1;

                            }

                        }

                        catch(e) {

                            console.log(
                                "Info box closed too quickly to load graphics."
                            );

                        }

                    });

                    if (!hovered) {

                        self.marker.info.clicked = true;

                        angular.element(document).ready(function() {

                            var schedule_el =
                            self.marker.info.div_.getElementsByClassName(
                                "schedule-map-info-window-schedule"
                            )[0];

                            schedule_el.style.display = "block";

                        });

                        scope.show_info_window_schedule = true;

                        scheduleDownloadAndTransformation.downloadSchedule(
                            self.route_id,
                            self.stop_id
                        ).
                        then(function(res) {

                            top_self.displayInfoWindowSchedule(
                                res, self.marker
                            );

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
                                self.stop_id
                            );

                        }

                    }

                );

            });

        };

    };

    this.TripPlannerInfoWindowOpener = function(trip_point) {

        var self = this;

        this.marker = trip_point;

        this.open = function(e) {

            var window_already_open =
            top_self.showSelectedInfoWindow("planner", self.marker, e);

            if (window_already_open) { return true; }

            if (e) {
                //Digest needs to be called manually
                generalServiceUtilities.forceDigest();
            }

        };

    };

    this.displayStopsForRoute = function(route_id) {

        var stops = full_bstop_data.dict;
        var routes = full_route_data.dict;

        var cur_route = routes[route_id];
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

            var coords = new google.maps.LatLng(lat, lng);

            var route_color = "#" + routes[route_id].Color;

            var icon_options = marker_icon_options.schedule_map.default;

            icon_options.fillColor = route_color;

            var marker = new google.maps.Marker({
                map: myride.dom_q.map.inst,
                position: coords,
                title: route_id + ' ' + bstops_names[i],
                icon: icon_options
            });

            var associated_routes = stops[bstops_names[i]].Routes;

            //Put current route as the first element (CSS pseudo-element
            //will handle highlighting)
            associated_routes.splice(associated_routes.indexOf(route_id), 1);

            associated_routes.splice(0, 0, route_id);

            var associated_routes_icons = '';

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
                                " - " +
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
                    height: -127

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

            myride.dom_q.map.overlays.points[bstops_names[i]].info_opener =
            new top_self.ScheduleMapInfoWindowOpener(
                bstops_names[i],
                route_id,
                associated_routes_icons
            );

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

                icon_options.fillColor = map_palette.colors.blue;

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

                    icon_options.fillColor = map_palette.colors.red;

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

                    icon_options.fillColor = map_palette.colors.red;

                    old_point.marker.setOptions( {
                        icon: icon_options
                    });

                }

                marker_click_memory.nearest = cur_point_id;

                icon_options =
                marker_icon_options.schedule_map.mouseover;

                icon_options.fillColor = map_palette.colors.blue;

                cur_point.marker.setOptions(
                    {
                        icon: icon_options
                    }
                );

                selected_nearest_map_stop.stop_id = cur_point_id;

            }
    );

    };

    this.displayNearestMapStops = function(nearest_stops) {

        for (var i=0; i<nearest_stops.length;i++) {

            var marker_coords = { 
                lat: nearest_stops[i].LatLng.Latitude,
                lng: nearest_stops[i].LatLng.Longitude
            };

            var marker_options = marker_icon_options.schedule_map.default;

            marker_options.fillColor = map_palette.colors.red;

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
                cur_point, nearest_stops[i].Id
            );

        }

    };

    //TODO: Request API modification to return GTFS route colors directly
    this.formatTransitModeResult = function(mode_field, route_field) {

        var leg_color = "";
        var route_text = "";
        var label = "";

        switch (mode_field) {

            case "BUS":

                var route_dict = full_route_data.dict;

                leg_color = "#" + route_dict["BCT" + route_field].Color;
                route_text = "BCT" + route_field;
                label = "Bus route";

                break;

            case "WALK":

                leg_color = map_palette.colors.black;
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

        /* 
            Force zoom level break points manually via the
            map_zoom_span_breakpoints array in values.js
        */

        /*
            Calculate zoom level break points automatically
            Assumes log(2) relationship between breakpoints and zoom levels
        */

        //Start of breakpoint calculation with lowest zoom (16 in this case)
        //Increase this slightly if you need more room on edges of plan path
        var ZOOM_16_BREAKPOINT = 0.01200;

        for (var i=0;i<map_zoom_span_breakpoints.length;i++) {

            var power = i;

            map_zoom_span_breakpoints[i].calculated_breakpoint =
            ZOOM_16_BREAKPOINT * (2 << (power - 1));

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

        for (var j=0;j<map_zoom_span_breakpoints.length;j++) {

            var old_breakpoint =
            map_zoom_span_breakpoints[j].calculated_breakpoint;

            map_zoom_span_breakpoints[j].calculated_breakpoint =
            old_breakpoint * map_width_calibration_ratio;

        }

        //Use manual breakpoint if one was chosen, otherwise use calculated
        for (var i=0;i<map_zoom_span_breakpoints.length;i++) {

            var cur_zoom_breakpoint =
            map_zoom_span_breakpoints[i].manual_breakpoint ||
            map_zoom_span_breakpoints[i].calculated_breakpoint;

            if (max_coord_span <= cur_zoom_breakpoint) {

                return map_zoom_span_breakpoints[i].needed_zoom;

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
                    strokeWeight: map_palette.weights.lines.mid,
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
                    strokeWeight: map_palette.weights.lines.mid
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

            var start_date;
            var end_date;

            var start_date_day;

            switch (legs[i].modeField) {

                case "WALK":

                    start_date = legs[i].startTimeField.slice(0,10);
                    end_date = legs[i].endTimeField.slice(0,10);

                    start_date_day = Number(start_date.slice(8,10));

                    icon_svg_path = walking_svg;

                    icon_offset_coord1 = 32;
                    icon_offset_coord2 = 57;

                    icon_color = "#017AC2";

                    break;

                case "BUS":

                    start_date = legs[i].startTimeField.slice(0,10);
                    end_date = legs[i].endTimeField.slice(0,10);

                    start_date_day = Number(start_date.slice(8,10));

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

            var start_seperate_span = "";
            var end_seperate_span = "";
            var close_seperate_span = "";

            var cur_date_num = (new Date).getDate();

            var reported_start_date = "";
            var reported_end_date = "";

            if (legs[i].modeField !== "DEST" &&
                start_date_day !== cur_date_num) {

                reported_start_date = "(" + start_date + ")";
                reported_end_date = "(" +  end_date + ")";

                start_seperate_span =
                "<span class='trip-marker-info-window-start-time-top'>";

                end_seperate_span =
                "<span class='trip-marker-info-window-start-time-bottom'>";

                close_seperate_span = "</span>";

            }

            var trip_marker_info_window_bottom_contents;

                if (legs[i].modeField !== "DEST") {

                    trip_marker_info_window_bottom_contents = '' +

                    "<span>" +

                        reported_distance +
                        " " +
                        reported_distance_unit +

                    "</span>" +

                    "<span>" +

                        start_seperate_span +

                            reported_start_date + " " +

                            unitConversionAndDataReporting.
                            convertToTwelveHourTime(
                                legs[i].startTimeField.slice(11,16)
                            ) +

                            " - " +

                        close_seperate_span +

                        end_seperate_span +

                            reported_end_date + " " +

                            unitConversionAndDataReporting.
                            convertToTwelveHourTime(
                                legs[i].endTimeField.slice(11,16)
                            ) +

                        close_seperate_span +

                    "</span>" +

                    "<span>" +

                        "(" +
                            unitConversionAndDataReporting.
                            splitHoursMinutes(
                                (legs[i].durationField / 1000 / 60).
                                toFixed(0)
                            ) +
                        ")" +

                    "</span>" +

                "</span>";

            }

            else {

                trip_marker_info_window_bottom_contents = '' +
                "<span class='trip-marker-info-window-dest'>" +

                    "Arrived at destination." +

                "<span>";

            }

            trip_planner_info_box_contents = '' +
                '<div class="trip-marker-info-window">' +

                    "<span class='trip-marker-info-window-top'>" +

                        "<span class='trip-marker-info-window-number'>" +

                            "<span class=" +
                            "'trip-marker-info-window-number-contents'>" +

                                (i+1) +

                            "</span>" +

                        "</span>" +

                        "<span class='trip-marker-info-window-title'>" +
                            label + " " + route_text +
                        "</span>" +

                    "</span>" +

                    "<span class='trip-marker-info-window-bottom'>" +

                        trip_marker_info_window_bottom_contents +

                '</div>';


            var info_window =
            new InfoBox({

                content: trip_planner_info_box_contents,
                boxClass: "trip-planner-info-box",
                pixelOffset: {

                    width: -99,
                    height: -120

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

            var trip_points = myride.dom_q.map.overlays.trip_points;

            trip_points.push(trip_marker_window);

            trip_points[i].info_opener =
            new top_self.TripPlannerInfoWindowOpener(trip_points[i]);

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

            do {

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