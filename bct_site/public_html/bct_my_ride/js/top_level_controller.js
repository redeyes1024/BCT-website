var BCTAppTopController = angular.module('BCTAppTopController', []);

BCTAppTopController.controller('BCTController', [

    '$scope', '$timeout', //'scheduleWebSocket', 'scheduleSocketService',
    'scheduleDownloadAndTransformation', 'googleMapUtilities', '$q',
    '$interval', 'unitConversionAndDataReporting', 'miniScheduleService',
    'placeholderService', 'locationService', 'location_icons',
    'agency_filter_icons', 'results_exist', 'map_navigation_marker_indices',
    'legend_icon_list', 'all_alerts',
    'profilePageService',

function (

    $scope, $timeout, //scheduleWebSocket, scheduleSocketService,
    scheduleDownloadAndTransformation, googleMapUtilities, $q, $interval,
    unitConversionAndDataReporting, miniScheduleService, placeholderService,
    locationService, location_icons, agency_filter_icons, results_exist,
    map_navigation_marker_indices, legend_icon_list, all_alerts,
    profilePageService

) {

    //For ease of debugging
    window.main_scope = $scope;

    $scope.top_scope = $scope;

    /* START CSS class expressions to be used to ng-class, with defaults */

    /* 
        N.B.: Using the ng-class directive, the positioning of map-related DOM 
        elements is altered significantly, in order for only one map only to be
        loaded throughout the life of the app.
    */

    $scope.schedule_map_styles = {
        "hide-scroll": true,
    };

    $scope.trip_planner_styles = {
        "trip-planner-module-active": false
    };

    $scope.planner_dialog_styles = {
        "trip-planner-dialog-start": false,
        "trip-planner-dialog-finish": false,
        "trip-planner-dialog-centered": false,
        "trip-planner-dialog-faded-in": false,
        "trip-planner-dialog-faded-out": true
    };

    $scope.itinerary_selector_styles = {
        "trip-planner-itinerary-selector-pushed": false
    };

    $scope.itinerary_selector_panel_styles = {
        "trip-planner-itinerary-panel-smaller": false
    };

    $scope.itinerary_selector_modal_styles = {
        "trip-planner-itinerary-selector-modal-smaller": false
    };

    $scope.main_module_styles = {
        "page-planner-inserted": false
    };

    $scope.map_canvas_styles = {
        "map-canvas-full-screen": false
    };

    $scope.schedule_map_styles = {
        "schedule-map-full-screen": false
    };

    $scope.global_alert_message_styles_1 = {
        "alert-header-message-hidden-left": false,
        "alert-header-message-hidden-right": false
    };

    $scope.global_alert_message_styles_2 = {
        "alert-header-message-hidden": false
    };

    $scope.schedule_map_alert_message_styles_1 = {
        "alert-header-message-hidden-left": false,
        "alert-header-message-hidden-right": false
    };

    $scope.schedule_map_alert_message_styles_2 = {
        "alert-header-message-hidden": false
    };

    /* END CSS class expressions to be used to ng-class, with defaults */

    /* START Overlay Display Controls */

    $scope.show_icon_legend_overlay = false;

    $scope.show_empty_result_message_search_too_short = false;
    $scope.show_empty_result_message_no_results = false;
    $scope.show_schedule_results_result_panels = false;

    $scope.show_index_nearest_stops_panels = false;

    $scope.show_map_overlay_module = false;
    $scope.show_schedule_map_loading_modal = false;

    $scope.show_schedule_result_top_bar = false;
    $scope.show_schedule_result_top_info_bar = true;
    $scope.show_schedule_result_top_alert_bar = true;

    $scope.show_schedule_map_info_bar = true;

    $scope.show_full_schedule_module = false;

    $scope.show_index_title_normal = true;
    $scope.show_index_title_with_back_function = false;

    $scope.show_trip_planner_title = false;
    $scope.show_trip_planner_options = false;

    $scope.show_geocoder_error_dialog = false;

    $scope.show_trip_planner_itinerary_selector = false;
    $scope.show_trip_planner_itinerary_labels = false;

    $scope.show_schedule_results_module_title_normal = true;
    $scope.show_schedule_results_module_title_with_back_function = false;

    $scope.show_schedule_result_date_pick_row_loading = false;

    $scope.show_trip_planner_step_navigation_bar = false;

    $scope.show_schedule_map_navigation_bar_activation_button = true;
    $scope.show_schedule_map_navigation_bar_loading = false;
    $scope.show_schedule_map_stop_navigation_bar_contents = false;
    $scope.show_schedule_map_stop_navigation_bar = false;

    $scope.show_map_full_screen_button = true;
    $scope.show_map_full_screen_return_button = false;
    $scope.show_map_full_screen_modal = false;
    $scope.show_trip_planner_step_navigation_bar = false;

    $scope.show_trip_planner_itinerary_transit_type_icon_selectable = false;
    $scope.show_trip_planner_itinerary_transit_type_icon_non_selectable = false;

    $scope.show_map_canvas = true;

    (function() {

        for (icon in location_icons) {
            $scope[location_icons[icon].regular_icon] = true;
            $scope[location_icons[icon].spinning_icon] = false;
        }

    }());

    /* END Overlay Display Controls */

    /* START Custom Watchers */

    $scope.results_exist = results_exist;

    $scope.$watch("query_data.schedule_search", function(new_val, old_val) {
        if (new_val !== old_val) {

            if (!$scope.rs_scope_loaded) { return true; }

            if ($scope.query_data.schedule_search.length < 3) {
                $scope.show_empty_result_message_search_too_short = true;
                $scope.show_empty_result_message_no_results = false;
                $scope.show_schedule_results_result_panels = false;
            }
            else {
                $scope.show_empty_result_message_search_too_short = false;

                $scope.displayResultsIfExist();
            }

        }
    });

    $scope.$watch("results_exist.main", function(new_val, old_val) {
        if (new_val < old_val) {
            $scope.show_empty_result_message_no_results = true;
            $scope.show_schedule_results_result_panels = false;
        }
        else if (new_val > old_val) {
            $scope.show_empty_result_message_no_results = false;
            $scope.show_schedule_results_result_panels = true;
        }
    });

    $scope.$watch("show_schedule_result_top_bar", function(new_val, old_val) {

        if (new_val > old_val) {
            $scope.show_schedule_map_stop_navigation_bar = true;

            $scope.map_full_screen_return_button_message =
            $scope.map_full_screen_return_button_messages.schedule;
        }

        else if (new_val < old_val) {
            $scope.resetScheduleMapNavigationBar();

            $timeout.cancel($scope.schedule_update_timer);

            $scope.schedule_map_navigation_bar_same_stop_open = false;
        }

    });

    $scope.$watch("show_full_schedule_module", function(new_val, old_val) {

        if (new_val > old_val) {

            $scope.show_map_canvas = false;
            $scope.show_schedule_map_stop_navigation_bar = false;

        }

        else if (new_val < old_val) {

            $scope.show_map_canvas = true;
            $scope.show_schedule_map_stop_navigation_bar = true;

        }

    });

    $scope.full_schedule_loading_placeholder =
        placeholderService.createLoadingPlaceholder(20, " ");

    angular.element(document).ready(function() {

        $scope.$watch("full_schedule_date", function(new_val, old_val) {

            if (new_val !== old_val) {

                $scope.schedule.date_pick =
                $scope.full_schedule_loading_placeholder;

                $scope.show_schedule_result_date_pick_row_loading = true;

                scheduleDownloadAndTransformation.downloadSchedule(

                    $scope.map_schedule_info.route,
                    $scope.map_schedule_info.stop,
                    $scope.full_schedule_date

                ).
                then(function(res) {

                    $scope.show_schedule_result_date_pick_row_loading = false;

                    var t_schedule = scheduleDownloadAndTransformation.
                    transformSchedule("datepick", res.data.Today);

                    $scope.schedule.date_pick = t_schedule.date_pick;

                });

            }

        });

    });

    //Itinerary selector's initial appearance and hiding associated with planner
    $scope.$watch("show_trip_planner_title", function(new_val, old_val) {

        //If trip planner is activating
        if (new_val > old_val) {

            $scope.map_full_screen_return_button_message =
            $scope.map_full_screen_return_button_messages.planner;

            $scope.show_full_schedule_module = false;

        }

        //If trip planner is deactivating
        else if (new_val < old_val) {

            $scope.show_trip_planner_step_navigation_bar = false;

            $scope.show_trip_planner_itinerary_selector = false;

        }

    });

    //Trip planner option menu pushes and compresses itinerary selector
    $scope.$watch("show_trip_planner_options", function(new_val, old_val) {

        if (new_val > old_val) {

            $scope.itinerary_selector_modal_styles["trip-planner-itinerary-selector-modal-smaller"] = true;
            $scope.itinerary_selector_styles["trip-planner-itinerary-selector-pushed"] = true;
            $scope.itinerary_selector_panel_styles["trip-planner-itinerary-panel-smaller"] = true;

        }

        else if (new_val < old_val) {

            $scope.itinerary_selector_modal_styles["trip-planner-itinerary-selector-modal-smaller"] = false;
            $scope.itinerary_selector_styles["trip-planner-itinerary-selector-pushed"] = false;
            $scope.itinerary_selector_panel_styles["trip-planner-itinerary-panel-smaller"] = false;

        }

    });

    $scope.$watch("map_navigation_marker_indices.planner",
    function(new_val, old_val) {

        if (new_val !== old_val) {

            $scope.current_trip_plan_data_selection.legsField[new_val].styles =
            "trip-planner-itinerary-step-highlighted";

            $scope.current_trip_plan_data_selection.legsField[old_val].styles =
            "";

        }

    });

    $scope.$watch("show_trip_planner_itinerary_selector",
    function(new_val, old_val) {

        if (new_val > old_val) {

            $scope.
            show_trip_planner_itinerary_transit_type_icon_selectable =
            false;

            $scope.
            show_trip_planner_itinerary_transit_type_icon_non_selectable =
            true;

        }

        else if (new_val < old_val) {

            $scope.
            show_trip_planner_itinerary_transit_type_icon_selectable =
            true;

            $scope.
            show_trip_planner_itinerary_transit_type_icon_non_selectable =
            false;

        }

    });

    $scope.$watch("show_schedule_map_stop_navigation_bar_contents",
    function(new_val, old_val) {

        if (new_val > old_val) {
            $scope.show_schedule_map_info_bar = false;
        }

        else if (new_val < old_val) {
            $scope.show_schedule_map_info_bar = true;
        }
    });

    $scope.$watch("show_map_full_screen_modal",
    function(new_val, old_val) {

        if (new_val > old_val) {
            $scope.schedule_map_styles["schedule-map-full-screen"] = true;
        }

        else if (new_val < old_val) {
            $scope.schedule_map_styles["schedule-map-full-screen"] = false;
        }
    });

    /* END Custom Watchers */

    /* START Data Object Templates */

    $scope.initial_schedule_map_data = {
        coords: {},
        route_id: "",
        bstop_id: ""
    };

    $scope.current_route_alerts = [
        "Bus route will change to include Data Ave. starting in January",
        "Bus route will change to include Picard Ave. starting in February",
        "Bus route will change to include Riker Ave. starting in March"
    ];

    $scope.query_data = {
        schedule_search: ""
    };

    $scope.map_schedule_info = {
        route: "",
        stop: ""
    };

    $scope.schedule = {
        nearest: {},
        planned: {
            weekdays: [],
            saturday: [],
            sunday: []
        },
        date_pick: []
    };

    $scope.all_days = [
        "Weekdays",
        "Saturday",
        "Sunday"
    ];

    $scope.routeFilter = { f: "" };
    $scope.bstopFilter = { f: "" };

    $scope.full_schedule_date = new Date;

    //Defaults are for demonstration purposes only
    $scope.trip_inputs = {
        start: "14791 Miramar Pkwy",
        finish: "12400 Pembroke Rd"
    };

    $scope.schedule_map_navigation_bar_activation_messages = {
        inactive: "Activate Stop Seeker",
        activating: "Activating Stop Seeker..."
    };

    $scope.map_full_screen_return_button_messages = {
        planner: "Return to Trip Planner",
        schedule: "Return to Schedule Map"
    };

    $scope.schedule_date_range = {
        start: "2014/06/08",
        end: "2014/09/13"
    };

    /* END Data Object Templates */    

    $scope.global_alerts = all_alerts.global;
    $scope.schedule_map_alerts = all_alerts.schedule_map;

    (function() {

        /* START Animation settings */

        var MESSAGE_DISPLAY_TIME = 4000;
        var MESSAGE_TRANSITION_OUT_TIME = 500;

        var message_hidden_time =
        MESSAGE_DISPLAY_TIME - MESSAGE_TRANSITION_OUT_TIME;

        var keyframes = {

            hidden_left: "alert-header-message-hidden-left",
            hidden_right: "alert-header-message-hidden-right"

        };

        var keyframe_setups = {

            displayed_in_middle: {

                hidden_right: false,
                hidden_left: false

            },

            hidden_on_left: {

                hidden_right: false,
                hidden_left: true

            },

            hidden_on_right: {

                hidden_right: true,
                hidden_left: false

            }

        };

        //Frame counts are calculated and set below
        var animation_config = [

            {

                keyframe_setup_name: "displayed_in_middle",
                duration: MESSAGE_DISPLAY_TIME,
                number_of_frames: 0

            },

            {

                keyframe_setup_name: "hidden_on_left",
                duration: MESSAGE_TRANSITION_OUT_TIME,
                number_of_frames: 0

            },

            {

                keyframe_setup_name: "hidden_on_right",
                duration: message_hidden_time,
                number_of_frames: 0

            }

        ];

        /* END Animation Settings */

        var alert_message_indices = {

            global: {
                "leader": 0,
                "follower": -1
            },

            schedule_map: {
                "leader": 0,
                "follower": -1
            }

        };

        function cycleThroughAlertFrames(old_index) {

            var new_index = old_index;

            if (old_index > number_of_steps - 1) {

                new_index = 0;

            }

            return new_index;

        }

        function cycleThroughAlertMessages(module, old_index) {

            var new_index = old_index;

            var number_of_messages = all_alerts[module].length;

            if (old_index > number_of_messages) {

                new_index = 1;

            }

            else if (old_index > number_of_messages - 1) {

                new_index = 0;

            }

            return new_index;

        }

        $scope.global_alerts_index = alert_message_indices.global;
        $scope.schedule_map_alerts_index = alert_message_indices.schedule_map;

        function changeAlertMessage(module, message) {

            var cur_indices = alert_message_indices[module];

            cur_indices[message] += 2;

            cur_indices[message] =
            cycleThroughAlertMessages(module, cur_indices[message]);

        }

        var prev_stylings = {

            global: {

                "leader": "",
                "follower": ""

            },

            schedule_map: {

                "leader": "",
                "follower": ""

            }

        };

        function setKeyframeStyle(
            module, message, current_styling, keyframe_setup
        ) {

            var cur_keyframe_setup = keyframe_setups[keyframe_setup];

            for (var setting in cur_keyframe_setup) {

                var new_style_setting = cur_keyframe_setup[setting];

                var style_name = keyframes[setting];

                current_styling[style_name] = new_style_setting;

            }

            if (prev_stylings[module][message] === "hidden_on_left" &&
                keyframe_setup === "hidden_on_right") {

                changeAlertMessage(module, message);

            }

            prev_stylings[module][message] = keyframe_setup;

        }

        function ScrollingMessage(module, type) {

            var self = this;

            this.type = type;

            this.module = module;

            if (self.type === "leader") {

                this.step = 0;

                this.message_index = 0;

                if (self.module === "global") {

                    this.current_styling =
                    $scope.global_alert_message_styles_1;

                    this.follower_message = global_follower_message;

                }

                if (self.module === "schedule_map") {

                    this.current_styling =
                    $scope.schedule_map_alert_message_styles_1;

                    this.follower_message = schedule_map_follower_message;

                }

            }

            else if (self.type === "follower") {

                this.step = 8;

                this.message_index = 0;

                if (self.module === "global") {

                    this.current_styling =
                    $scope.global_alert_message_styles_2;

                }

                if (self.module === "schedule_map") {

                    this.current_styling =
                    $scope.schedule_map_alert_message_styles_2;

                }

            }

            this.goToNextStep = function() {

                setKeyframeStyle(
                    self.module,
                    type,
                    self.current_styling,
                    steps_list[self.step].keyframe_setup
                );

                self.step++;

                self.step = cycleThroughAlertFrames(self.step);

                if (self.follower_message) {

                    //General case: called on an array of followers in sequence
                    self.follower_message.goToNextStep();

                }

            };

        }

        var global_follower_message =
        new ScrollingMessage("global", "follower");

        var global_leader_message =
        new ScrollingMessage("global", "leader");

        var schedule_map_follower_message =
        new ScrollingMessage("schedule_map", "follower");

        var schedule_map_leader_message =
        new ScrollingMessage("schedule_map", "leader");

        //General case: the minimum in an array of animation times
        var shortest_animation_time = MESSAGE_TRANSITION_OUT_TIME;

        for (var i=0;i<animation_config.length;i++) {

            var number_of_frames =
            animation_config[i].duration / shortest_animation_time;

            animation_config[i].number_of_frames = number_of_frames;

        }

        //General case: the sum of all animation steps
        var number_of_steps =
        (MESSAGE_DISPLAY_TIME * 2) / shortest_animation_time;

        var steps_list = new Array(number_of_steps);

        var steps_counter = 0;

        for (var j=0;j<animation_config.length;j++) {

            var cur_length = animation_config[j].number_of_frames;

            for (var k=0;k<cur_length;k++) {

                var cur_step = {

                    keyframe_setup: animation_config[j].keyframe_setup_name

                };

                steps_list[steps_counter] = cur_step;

                steps_counter++;

            }

        }

        function runMessageScrollingAnimations() {
        
            $timeout(function() {

                global_leader_message.goToNextStep();

                schedule_map_leader_message.goToNextStep();

                runMessageScrollingAnimations();

            }, shortest_animation_time);

        }

        runMessageScrollingAnimations();

    }());

    $scope.base_myride_url =
    window.myride.directories.site_roots.active +
    window.myride.directories.paths.active;

    $scope.submitRouteStopSearch = function(e) {

        $scope.query_data.schedule_search =
        myride.dom_q.inputs.elements.rs_search_input.value;

        //Only the 'click' event calls the $apply automatically (from ng-click)
        if (e === 'enter') {
            $scope.$apply();
        }

    };

    $scope.legend_icon_list = legend_icon_list;

    $scope.uncoverSelectedStepIcon = function(step_index) {

        var uncover_this_step = false;

        if ($scope.map_navigation_marker_indices.planner === step_index) {

            uncover_this_step = true;

        }

        return uncover_this_step;

    };

    $scope.toggleIconLegendOverlay = function() {

        if ($scope.show_icon_legend_overlay) {
            $scope.show_icon_legend_overlay = false;
        }

        else {
            $scope.show_icon_legend_overlay = true;
        }

    };

    $scope.map_full_screen_return_button_message = "";

    $scope.goToFirstStep = function(map_type) {

        var point = {};

        if (map_type === "planner") {
            point = myride.dom_q.map.overlays.trip_points[0];
        }
        else if (map_type === "schedule") {
            point = myride.dom_q.map.overlays.
            points[$scope.initial_schedule_map_data.bstop_id];
        }

        var point_coords = point.marker.getPosition();

        myride.dom_q.map.inst.setCenter({
            lat: point_coords.lat(),
            lng: point_coords.lng()
        });

        point.ShowWindow.func(true);

    };

    $scope.toggleMapFullScreen = function() {

        var full_screen_on =
        $scope.map_canvas_styles["map-canvas-full-screen"];

        $scope.map_canvas_styles["map-canvas-full-screen"] = !full_screen_on;

        $scope.show_map_full_screen_button = full_screen_on;
        $scope.show_map_full_screen_return_button = !full_screen_on;
        $scope.show_map_full_screen_modal = !full_screen_on;

        $scope.show_trip_planner_step_navigation_bar =
        full_screen_on && $scope.show_trip_planner_title;

        var map_ready_promise = googleMapUtilities.touchMap();

        var map_type = "";

        if ($scope.show_trip_planner_title) {
            map_type = "planner";
        }
        else if ($scope.show_schedule_result_top_bar) {
            map_type = "schedule";
        }

        map_ready_promise.then(function() {
            $scope.goToFirstStep(map_type);
        });

    };

    $scope.map_navigation_marker_indices = map_navigation_marker_indices;

    $scope.resetTripStepIconHighlighting = function() {

        var itinerary_steps = $scope.current_trip_plan_data_selection.legsField;

        for (var j=0;j<itinerary_steps.length;j++) {
            itinerary_steps[j].styles = "";
        }

    };

    $scope.returnToInitialBusStop = function() {

        $scope.resetCenter();

        var bstop_id =
        map_navigation_marker_indices.schedule_named =
        $scope.initial_schedule_map_data.bstop_id;

        map_navigation_marker_indices.schedule = 
        myride.dom_q.map.overlays.ordered_stop_list.indexOf(bstop_id);

        myride.dom_q.map.overlays.points[bstop_id].ShowWindow.func();

    };

    $scope.schedule_map_navigation_bar_loading_in_progress = false;

    $scope.current_schedule_map_navigation_bar_activation_message =
    $scope.schedule_map_navigation_bar_activation_messages.inactive; 

    $scope.resetScheduleMapNavigationBar = function() {

        $scope.show_schedule_map_navigation_bar_loading = false;
        $scope.show_schedule_map_stop_navigation_bar_contents = false;
        $scope.show_schedule_map_stop_navigation_bar = false;

        $scope.show_schedule_map_navigation_bar_activation_button = true;

        $scope.current_schedule_map_navigation_bar_activation_message =
        $scope.schedule_map_navigation_bar_activation_messages.inactive;

    };

    $scope.activateScheduleMapStopNavigation = function() {

        $scope.schedule_map_navigation_bar_same_stop_open = true;

        $scope.show_schedule_map_navigation_bar_loading = true;
        $scope.show_schedule_map_stop_navigation_bar_contents = false;

        $scope.current_schedule_map_navigation_bar_activation_message =
        $scope.schedule_map_navigation_bar_activation_messages.activating; 

        var cur_route = $scope.initial_schedule_map_data.route_id;

        googleMapUtilities.getOrderedStopListForCurrentRoute(cur_route).
        then(function(stop_list) {

            if (!$scope.schedule_map_navigation_bar_same_stop_open) {
                return true;
            }

            $scope.schedule_map_navigation_bar_same_stop_open = false;

            myride.dom_q.map.overlays.ordered_stop_list = stop_list;

            $scope.returnToInitialBusStop();

            $scope.show_schedule_map_navigation_bar_activation_button = false;

            $scope.show_schedule_map_navigation_bar_loading = false;
            $scope.show_schedule_map_stop_navigation_bar_contents = true;

        });

    };

    $scope.cycleMarkerInfoWindows = function(
        original_index,
        counter_name
    ) {

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

    $scope.openMarkerInfoWindow = function(map_type, marker_index) {

        var marker_instances = "";
        var marker_position = {};

        if (map_type === "planner") {

            marker_instances = "trip_points";

            //Wrap around available trip planner steps if needed
            marker_index = $scope.cycleMarkerInfoWindows(
                marker_index,
                "planner"
            );

        }
        else if (map_type === "schedule") {

            marker_instances = "points";

            //Wrap around available schedule stops if needed
            marker_index = $scope.cycleMarkerInfoWindows(
                marker_index,
                "schedule"
            );

            //Get named index (needed for stop markers) from numeric index
            marker_index = myride.dom_q.map.overlays.
            ordered_stop_list[marker_index];

        }

        var marker_instance = myride.dom_q.map.
        overlays[marker_instances][marker_index];

        marker_instance.ShowWindow.func();

        var marker_position = marker_instance.marker.getPosition();

        myride.dom_q.map.inst.setCenter({
            lat: marker_position.lat(),
            lng: marker_position.lng()
        });
    };


    //The navigator should be unreachable in the UI until it is loaded
    //Thus the following error handling function is just a precaution
    $scope.checkIfScheduleMapNavigatorLoaded = function() {

        if (!myride.dom_q.map.overlays.ordered_stop_list[0]) {
            console.log("Schedule stop navigator not yet loaded.");

            return false;
        }

    };

    $scope.goToNextInfoWindow = function(map_type) {

        if (map_type === "planner") {
            map_navigation_marker_indices.planner++;

            $scope.openMarkerInfoWindow(
                map_type, map_navigation_marker_indices.planner
            );

        }
        else if (map_type === "schedule") {
            if (!$scope.checkIfScheduleMapNavigatorLoaded) { return false; }

            map_navigation_marker_indices.schedule++;

            $scope.openMarkerInfoWindow(
                map_type, map_navigation_marker_indices.schedule
            );
        }

    };

    $scope.goToPrevInfoWindow = function(map_type) {

        if (map_type === "planner") {
            map_navigation_marker_indices.planner--;

            $scope.openMarkerInfoWindow(
                map_type, map_navigation_marker_indices.planner
            );

        }
        else if (map_type === "schedule") {
            if (!$scope.checkIfScheduleMapNavigatorLoaded) { return false; }

            map_navigation_marker_indices.schedule--;

            $scope.openMarkerInfoWindow(
                map_type, map_navigation_marker_indices.schedule
            );
        }

    };

    $scope.goToMarkerInfoWindow = function(map_type, point_choice, new_index) {

        switch (point_choice) {
            case "next":
                $scope.goToNextInfoWindow(map_type);
                break;
            case "prev":
                $scope.goToPrevInfoWindow(map_type);
                break;
            //Trip planner only; not currently useful for schedule map stops
            case "planner_step":
                map_navigation_marker_indices.planner = new_index;

                $scope.openMarkerInfoWindow(
                    map_type,
                    new_index
                );
        }

    };

    $scope.SCHEDULE_RESULTS_MESSAGE_TEXT_SEARCH_TOO_SHORT = '' +
        'Please enter a search term at least 3 characters long. ' +
        'For example, if you are looking for ' +
        'BCT route 10, try looking for ' +
        '"BCT10" instead of just "10"';

    $scope.SCHEDULE_RESULTS_MESSAGE_TEXT_NO_RESULTS = '' +
        'Sorry, there are no results for your entry. ' +
        'Check for typos or try broadening your search ' +
        'by typing in fewer characters.';

    $scope.switchRoutes = function(new_route, bstop_id) {

        map_navigation_marker_indices.schedule_named = bstop_id;

        $scope.schedule_map_navigation_bar_same_stop_open = false;

        $scope.resetScheduleMapNavigationBar();
        $scope.show_schedule_map_stop_navigation_bar = true;

        googleMapUtilities.createDummyInfoWindow();

        $timeout.cancel($scope.schedule_update_timer);

        $scope.populateScheduleMapTimes(new_route, bstop_id);

        $scope.populateScheduleMap(new_route, bstop_id);

        myride.dom_q.map.overlays.points[bstop_id].ShowWindow.func();

    };

    $scope.displayResultsIfExist = function() {

        if ($scope.results_exist.main) {
            $scope.top_scope.show_empty_result_message_no_results = false;
            $scope.top_scope.show_schedule_results_result_panels = true;
        }
        else {
            $scope.top_scope.show_empty_result_message_no_results = true;
            $scope.top_scope.show_schedule_results_result_panels = false;
        }

    };

    $scope.rs_scope_loaded = false;

    $scope.getIconPath = unitConversionAndDataReporting.getIconPath;

    $scope.setLocationSpinnerAnimation = function(context, new_state) {

        switch (new_state) {
            case "active":
                $scope[location_icons[context].spinning_icon] = true;
                $scope[location_icons[context].regular_icon] = false;
                break;
            case "inactive":
                $scope[location_icons[context].spinning_icon] = false;
                $scope[location_icons[context].regular_icon]= true;
                break;
        }

    };

    $scope.addRouteStopToFavorites = function(route, stop) {

        profilePageService.addRouteStopToFavorites(
            $scope.routes, $scope.stops, route, stop
        );

    };

    $scope.addRouteStopToTripPlanner = function(stop) {

        var bstop_coords = $scope.stops[stop].LatLng;
        var bstop_coords_str = "";

        bstop_coords_str += bstop_coords.Latitude + ",";
        bstop_coords_str += bstop_coords.Longitude;

        $scope.trip_inputs.start = bstop_coords_str;

    };

    $scope.schedule.weekdays = $scope.full_schedule_loading_placeholder;
    $scope.schedule.saturday = $scope.full_schedule_loading_placeholder;
    $scope.schedule.sunday = $scope.full_schedule_loading_placeholder;

    $scope.disableMapToggleOnTitles = function() {
        $scope.show_index_title_normal = true;
        $scope.show_schedule_results_module_title_normal = true;

        $scope.show_index_title_with_back_function = false;
        $scope.show_schedule_results_module_title_with_back_function = false;
    };

    $scope.enableMapToggleOnTitles = function() {
        $scope.show_index_title_normal = false;
        $scope.show_schedule_results_module_title_normal = false;

        $scope.show_index_title_with_back_function = true;
        $scope.show_schedule_results_module_title_with_back_function = true;
    };

    $scope.showAllRoutes = function(starting_page) {

        $scope.query_data["schedule_search"] = "all routes";

        if (starting_page === "index") {

            $scope.changeURLHash('#routeschedules', 'schedule_search');

        }

    };

    $scope.clearSearch = function(model) {

        $scope.query_data[model] = "";

        if (myride.dom_q.inputs.elements.rs_search_input) {

            myride.dom_q.inputs.elements.rs_search_input.value = "";

        }

    };

    $scope.mini_schedule_loading_template = miniScheduleService.
        makeMiniScheduleLoadingTemplate();

    $scope.schedule.nearest.times_and_diffs = $scope.mini_schedule_loading_template;

    $scope.updateAndPushSchedule = function (transformed_schedule) {

        var reprocessed_schedule = scheduleDownloadAndTransformation.
        transformSchedule("nearest", transformed_schedule.raw);

        $scope.schedule.nearest = reprocessed_schedule.nearest;

        var nearest_full = {
            times_and_diffs: []
        };

        var nearest_times = reprocessed_schedule.nearest.all;

        var diffs = scheduleDownloadAndTransformation.
        calculateTimeDifference(nearest_times);

        var diff_msgs = unitConversionAndDataReporting.
        addTimeDiffMessages(diffs);

        for (var i=0;i<nearest_times.length;i++) {
            var time_and_diff = {
                time: nearest_times[i],
                diff: diff_msgs[i]
            };
            nearest_full.times_and_diffs.push(time_and_diff);
        }

        $scope.schedule.nearest.times_and_diffs = nearest_full.times_and_diffs;

        $scope.schedule_update_timer = $timeout(function() {
            $scope.updateAndPushSchedule(reprocessed_schedule);
        }, 20000);

    };

    $scope.populateScheduleMap = function(route, stop) {

        $scope.map_schedule_info.route = route;
        $scope.map_schedule_info.stop = stop;

        $scope.initial_schedule_map_data.route_id = route;
        $scope.initial_schedule_map_data.bstop_id = stop;

        googleMapUtilities.clearMap();
        googleMapUtilities.setMapPosition(stop);
        googleMapUtilities.displayRoute(route, $scope.routes);
        googleMapUtilities.displayStops(route, $scope.routes, $scope.stops);

    };

    $scope.populateScheduleMapTimes = function(route, stop) {

        $scope.schedule.nearest.times_and_diffs =
        $scope.mini_schedule_loading_template;

        scheduleDownloadAndTransformation.downloadSchedule(route, stop).
        then(function(res) {
            if (!res.data.Today) {
                console.log("Schedule loading error.");
                return false;
            }

            var t_schedule = scheduleDownloadAndTransformation.
            transformSchedule("nearest", res.data.Today);

            $scope.updateAndPushSchedule(t_schedule);
        });

    };

    $scope.openMapSchedule = function(route, stop) {

        map_navigation_marker_indices.schedule_named = stop;

        $scope.show_map_overlay_module =  true;

        $scope.enableMapToggleOnTitles();

        $scope.populateScheduleMapTimes(route, stop);

        $scope.populateScheduleMap(route, stop);

        $scope.show_schedule_result_top_bar = true;
        $scope.show_schedule_result_top_info_bar = true;
        $scope.show_schedule_result_top_alert_bar = true;
        $scope.show_trip_planner_title = false;

    };

    $scope.openTripPlannerMap = function() {

        $scope.show_map_overlay_module =  true;

        $scope.enableMapToggleOnTitles();

        googleMapUtilities.setMapPosition(null, 10);

        $scope.show_schedule_result_top_bar = false;
        $scope.show_trip_planner_title = true;

    };

    $scope.closeMapSchedule = function() {

        $scope.disableMapToggleOnTitles();

        $scope.show_map_overlay_module = false;
        $scope.show_full_schedule_module = false;

    };
    
    $scope.closeTripPlannerMap = function() {

        $scope.closeMapSchedule();

        $scope.trip_inputs.start = "";
        $scope.trip_inputs.finish = "";

        $scope.trip_planner_styles["trip-planner-module-active"] = false;

    };

    $scope.toggleMapSchedule = function(from_trip_planner, route, stop) {

        if ($scope.show_map_overlay_module) {
            if (from_trip_planner) {
                $scope.closeTripPlannerMap();
            }
            else {
                $scope.closeMapSchedule();
            }
        }

        else {
            if (from_trip_planner) {
                $scope.openTripPlannerMap(route, stop);
            }
            else {
                $scope.openMapSchedule(route, stop);
            }
        }

    };

    $scope.resetCenter = function() {

        var cur_center = {};

//        if (module === "schedule") {
            cur_center = $scope.initial_schedule_map_data.coords;
//        }
//        else if (module === "planner") {
//            cur_center = $scope.initial_schedule_map_data.coords;
//        }
        
        myride.dom_q.map.inst.setZoom(18);
        myride.dom_q.map.inst.setCenter(cur_center);

    };

    $scope.hideMiniScheduleAndAlertBars = function() {
        $scope.show_schedule_result_top_info_bar = false;
        $scope.show_schedule_result_top_alert_bar = false;
    };

    $scope.showMiniScheduleAndAlertBars = function() {
        $scope.show_schedule_result_top_info_bar = true;
        $scope.show_schedule_result_top_alert_bar = true;
    };

    $scope.toggleFullSchedule = function() {

        /* Closing full schedule overlay */

        if ($scope.show_full_schedule_module) {

            $scope.show_full_schedule_module = false;
            $scope.schedule_map_styles["hide-scroll"] = false;
            googleMapUtilities.touchMap();

            $scope.showMiniScheduleAndAlertBars();

        }

        /* Opening full schedule module */

        else {

            $scope.full_schedule_date = new Date;
            $scope.show_full_schedule_module = true;
            $scope.schedule_map_styles["hide-scroll"] = true;

            $scope.hideMiniScheduleAndAlertBars();

        }

    };

    $scope.clearFilters = function() {
        $scope.bstopFilter.f = "";
        $scope.routeFilter.f = "";
    };

    $scope.getCurrentLocationAndDisplayData = locationService.
    getCurrentLocationAndDisplayData;

    $scope.foldOptions = function(event) {

        var c_buttons = document.getElementsByClassName("collapse-button");

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
        $scope.clearFilters();

    };

    function transformRoutes() {
        var routes = $scope.routes = {};

        for (var r_i=0;r_i<$scope.route_data.length;r_i++) {
            var cur_route = $scope.route_data[r_i];
            var full_route_id = cur_route.Id;

            routes[full_route_id] = cur_route;
        }
    }

    function transformStops() {
        var bstops = $scope.stops = {};

        for (var s_i=0;s_i<$scope.bstop_data.length;s_i++) {
            var cur_bstop = $scope.bstop_data[s_i];
            var full_stop_id = cur_bstop.Id;

            bstops[full_stop_id] = cur_bstop;
        }
    }

    //N.B. "catch" mathod is not used with the dot operator due to
    //YUI Compressor (Rhino Engine) reserving the word for try/catch statement

    var fullDataDownloadPromise= $q.all([
        scheduleDownloadAndTransformation.downloadRouteInfo().
        then(function(res) {
            $scope.route_data = res.data;
            transformRoutes();
        })["catch"](function() {
            console.log("There was an error retrieving the transit data.");
        }),
        scheduleDownloadAndTransformation.downloadStopInfo().
        then(function(res) {
            $scope.bstop_data= res.data;
            transformStops();
        })["catch"](function() {
            console.log("There was an error retrieving the transit data.");
        })
    ]);

    var route_props = ["Id", "LName"];
    var bstop_props = ["Id", "Name"];

    $scope.goToScheduleFromProfilePage = function() {

        var url = window.location.toString();

        var params = url.match('\\?.*');

        if (!params) { return true; }

        var params_list = params[0].slice(1).split("&");

        for (var i=0;i<params_list.length;i++) {

            if (params_list[i].match('route')) {

                var route = params_list[i].slice(6);

            }

            else if (params_list[i].match('stop')) {

                var stop = params_list[i].slice(5);

            }

        }

        $scope.query_data.schedule_search =
        stop + " " + $scope.stops[stop].Name;

    };

    //Creates a partial link between the routes and stops data objects
    //in the form of a numerically indexed array
    fullDataDownloadPromise.then(function() {

        var all_stops = $scope.stops;
        var all_routes = $scope.routes;

        var all_stops_arr = [];
        var all_routes_arr = [];

        for (var route in all_routes) {

            all_routes[route].bstop_refs = [];

            var bstops = all_routes[route].Stops;

            for (var bstop in bstops) {

                var s_res = {};

                for (var i=0;i<bstop_props.length;i++) {

                    s_res[bstop_props[i]] =
                    all_stops[bstops[bstop]][bstop_props[i]];

                }

                all_routes[route].bstop_refs.push(s_res);

            }

            all_routes_arr.push(all_routes[route]);

        }

        for (var bstop in all_stops) {

            //Temporary placeholder bus stop-specific alert messages
            all_stops[bstop].alert = ["Sample alert for stop " + bstop + "."];

            all_stops[bstop].route_refs = [];

            var routes = all_stops[bstop].Routes;

            for (var route in routes) {

                var r_res = {};

                for (var i=0;i<route_props.length;i++) {

                    r_res[route_props[i]] =
                    all_routes[routes[route]][route_props[i]];

                }

                all_stops[bstop].route_refs.push(r_res);

            }

            all_stops_arr.push(all_stops[bstop]);

        }

        $scope.routes_arr = all_routes_arr;
        $scope.stops_arr = all_stops_arr;

        $scope.goToScheduleFromProfilePage();

    });

    $scope.swapTripInputs = function() {
        var old_start = $scope.trip_inputs.start.slice();
        var old_finish = $scope.trip_inputs.finish.slice();

        $scope.trip_inputs.start = old_finish;
        $scope.trip_inputs.finish = old_start;
    };

    $scope.clearFilters = function() {
        $scope.bstopFilter.f = "";
        $scope.routeFilter.f = "";
    };

    $scope.agency_filter_icons = agency_filter_icons;

    $scope.enableAgencyFilter = function(agency) {
        var new_class = "";

        if ($scope.agency_filter_icons[agency].selection_class ===
            "agency-filter-icon-selected") {
            new_class = "";
        }
        else {
            new_class = "agency-filter-icon-selected";
        }
        $scope.agency_filter_icons[agency].selection_class = new_class;
    };

    $scope.changeURLHash = function(new_hash, model) {

        if (model) {

            var input_str = $scope.query_data[model];
            if (!input_str || input_str.trim() === "") {
                if (input_str !== "") {
                    $scope.query_data[model] = "";
                }
                return true;
            }
        }

        window.location.hash = new_hash;

    };

    /*

    The following is a workaround for the third-party containing site using a
    site-wide form element that is intercepting all "return" key events and
    causing them to refresh the page.

    */

    (function() {

        //The following are return key press handlers for each input.
        //The names are not used directly and are for descriptive purposes only
        function indexSearchInputEnter() {

            $scope.changeURLHash('#routeschedules', 'schedule_search');

            return true;

        }

        function recentStopFilterEnter() {
            return true;
        }

        function recentTripFilterEnter() {
            return true;
        }

        function subBusStopFilterEnter() {
            return true;
        }

        function routeStopSearchInputEnter() {

            $scope.submitRouteStopSearch('enter');

            return true;

        }

        function subRouteFilterEnter() {
            return true;
        }

        function tripPlannerStartEnter() {

            $scope.trip_scope.submitTrip();

            $scope.$apply();

            return true;

        }

        function tripPlannerFinishEnter() {

            $scope.trip_scope.submitTrip();

            $scope.$apply();

            return true;

        }

        window.myride.dom_q.inputs.input_labels = {
            "index-search-input": indexSearchInputEnter,
            "recent-stop-filter": recentStopFilterEnter,
            "recent-trip-filter": recentTripFilterEnter,
            "sub-bus-stop-filter": subBusStopFilterEnter,
            "sub-route-filter": subRouteFilterEnter,
            "route-stop-search-input": routeStopSearchInputEnter,
            "trip-planner-start": tripPlannerStartEnter,
            "trip-planner-finish": tripPlannerFinishEnter
        };

        function handleAppTextInputs(event) {

            var input_handled_by_app = false;

            var current_input_name = event.target.getAttribute("id");

            var input_names = window.myride.dom_q.inputs.input_labels;

            for (name in input_names) {

                if (name === current_input_name) {

                    input_handled_by_app = true;

                    //Allow this function to continue if there is an error with
                    //one of the callbacks, preventing page change and
                    //allowing the callbacks to be debugged more easily
                    try {
                        input_names[name]();
                    }
                    catch(e) {
                        console.error(e);
                    }

                }

            }

            return input_handled_by_app;

        }

        function captureEnterKey(event) {

            if ((event.keyCode === 13) && handleAppTextInputs(event)) {

                //Input is on embedded app and is handled appropriately, so
                //prevent site-wide form from submitting
                return false;

            }
        }

        document.onkeypress = captureEnterKey;

    }());

}]).
    
config(function($routeProvider) {

    var site_root = window.myride.directories.site_roots.active;
    var cur_path = window.myride.directories.paths.active;

    $routeProvider.when('/routeschedules', {
        templateUrl: site_root + cur_path + 'partials/route_schedules.html',
        controller: 'routeSchedulesController'
    }).when('/bctappindex', {
        templateUrl: site_root + cur_path + 'partials/bct_app_index.html',
        controller: 'indexController'
    });

});

//.config(['$routeProvider', '$sceDelegateProvider',
//    function ($routeProvider, $sceDelegateProvider) {
//
//    var whitelist_url_regexp =
//    '.*';
//
//    $sceDelegateProvider.resourceUrlWhitelist([
//        'self',
//        whitelist_url_regexp
//    ]);
//
//}]);