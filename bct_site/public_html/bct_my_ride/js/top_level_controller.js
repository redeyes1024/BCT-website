var BCTAppTopController = angular.module('BCTAppTopController', []);

BCTAppTopController.controller('BCTController', [

    '$scope', '$timeout', //'scheduleWebSocket', 'scheduleSocketService',
    'scheduleDownloadAndTransformation', 'googleMapUtilities', '$q',
    '$interval', 'unitConversionAndDataReporting', 'miniScheduleService',
    'placeholderService', 'locationService', 'location_icons',
    'agency_filter_icons', 'results_exist', 'map_navigation_marker_indices',
    'legend_icon_list', 'all_alerts', 'profilePageService',
    'routeAndStopFilters', 'module_error_messages',

function (

    $scope, $timeout, //scheduleWebSocket, scheduleSocketService,
    scheduleDownloadAndTransformation, googleMapUtilities, $q, $interval,
    unitConversionAndDataReporting, miniScheduleService, placeholderService,
    locationService, location_icons, agency_filter_icons, results_exist,
    map_navigation_marker_indices, legend_icon_list, all_alerts,
    profilePageService, routeAndStopFilters, module_error_messages

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
        "hide-scroll": true
    };

    $scope.trip_planner_styles = {
        "trip-planner-module-active": false
    };

    $scope.planner_dialog_styles = {
        "trip-planner-dialog-start": false,
        "trip-planner-dialog-finish": false,
        "trip-planner-dialog-centered": false,
        "error-dialog-centered": false,
        "error-dialog-faded-in": false,
        "error-dialog-faded-out": true
    };

    $scope.schedule_map_error_dialog_styles = {
        "error-dialog-centered": false,
        "error-dialog-faded-in": false,
        "error-dialog-faded-out": true
    };

    $scope.full_schedule_error_dialog_styles = {
        "error-dialog-centered": false,
        "error-dialog-faded-in": false,
        "error-dialog-faded-out": true
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

    $scope.trip_planner_itinerary_step_container_size_0 = {
        "trip-planner-itinerary-step-container-le-6": false,
        "trip-planner-itinerary-step-container-le-8": false,
        "trip-planner-itinerary-step-container-le-10": false
    };

    $scope.trip_planner_itinerary_step_container_size_1 = {
        "trip-planner-itinerary-step-container-le-6": false,
        "trip-planner-itinerary-step-container-le-8": false,
        "trip-planner-itinerary-step-container-le-10": false
    };

    $scope.trip_planner_itinerary_step_container_size_2 = {
        "trip-planner-itinerary-step-container-le-6": false,
        "trip-planner-itinerary-step-container-le-8": false,
        "trip-planner-itinerary-step-container-le-10": false
    };

    $scope.trip_planner_title_header_style = {
        "myride-title-shadow": true
    };

    $scope.trip_planner_module_map_title_styles = {
        "trip-planner-module-map-title-extra-padding": false
    };

    $scope.map_full_screen_activate_button_styles = {
        "map-full-screen-activate-button-schedule-map": true
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
    $scope.show_schedule_map_alerts_header_contents = true;

    $scope.show_schedule_map_info_bar = true;

    $scope.show_full_schedule_module = false;

    $scope.show_index_title_normal = true;
    $scope.show_index_title_with_back_function = false;

    $scope.show_trip_planner_title = false;
    $scope.show_trip_planner_options = false;

    $scope.show_geocoder_error_dialog = false;

    $scope.show_trip_planner_itinerary_selector = false;
    $scope.show_trip_planner_itinerary_labels = false;

    $scope.show_schedule_map_error_dialog = false;
    $scope.show_full_schedule_error_dialog = false;

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
    $scope.show_trip_planner_title_header = true;

    $scope.show_trip_planner_itinerary_transit_type_icon_selectable = false;
    $scope.show_trip_planner_itinerary_transit_type_icon_non_selectable = false;

    $scope.show_map_canvas = true;

    $scope.show_schedule_full_result_pdf_selector = false;

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

            $scope.filtered_routes_arr = $scope.routeFilterFunc(
                $scope.routes_arr,
                $scope.query_data.schedule_search,
                false
            );

            $scope.filtered_stops_arr = $scope.stopFilterFunc(
                $scope.stops_arr,
                $scope.query_data.schedule_search,
                $scope.sort_bstops_by_distance
            );

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

            $timeout.cancel($scope.schedule_map_error_dialog_timeout);

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

                    $scope.show_schedule_result_date_pick_row_loading =
                    false;

                    if (res.data.Today) {

                        var t_schedule = scheduleDownloadAndTransformation.
                        transformSchedule("datepick", res.data.Today);

                        $scope.schedule.date_pick = t_schedule.date_pick;

                    }

                    else {

                        console.log(
                            "Server communication error: full schedule."
                        );

                        $scope.schedule.date_pick = "Error.";

                    }

                })["catch"](function() {

                    console.log("Server communication error: full schedule.");

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

            $scope.map_full_screen_activate_button_styles
            ["map-full-screen-activate-button-schedule-map"] = false;

        }

        //If trip planner is deactivating
        else if (new_val < old_val) {

            $scope.show_trip_planner_step_navigation_bar = false;

            $scope.show_trip_planner_itinerary_selector = false;

            $scope.map_full_screen_activate_button_styles
            ["map-full-screen-activate-button-schedule-map"] = true;

        }

    });

    //Trip planner option menu pushes and compresses itinerary selector
    $scope.$watch("show_trip_planner_options", function(new_val, old_val) {

        if (new_val > old_val) {

            $scope.itinerary_selector_modal_styles
            ["trip-planner-itinerary-selector-modal-smaller"] = true;

            if ($scope.current_trip_plan_data &&
                $scope.current_trip_plan_data.length > 2) {

                $scope.itinerary_selector_styles
                ["trip-planner-itinerary-selector-pushed"] = true;

                $scope.itinerary_selector_panel_styles
                ["trip-planner-itinerary-panel-smaller"] = true;

            }

            $scope.
            trip_planner_title_header_style["myride-title-shadow"] = false;

        }

        else if (new_val < old_val) {

            $scope.itinerary_selector_modal_styles
            ["trip-planner-itinerary-selector-modal-smaller"] = false;

            $scope.itinerary_selector_styles
            ["trip-planner-itinerary-selector-pushed"] = false;

            $scope.itinerary_selector_panel_styles
            ["trip-planner-itinerary-panel-smaller"] = false;

            $scope.
            trip_planner_title_header_style["myride-title-shadow"] = true;

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

    $scope.$watch("bstopFilter.f",
    function(new_val, old_val) {
        
        if (new_val !== old_val) {

            $scope.filtered_sub_routes_arr = $scope.stopSubFilterFunc(
                $scope.route_stop_list,
                $scope.bstopFilter.f,
                false
            );

        }

    });

    $scope.$watch("routeFilter.f",
    function(new_val, old_val) {
        
        if (new_val !== old_val) {

            $scope.filtered_sub_stops_arr = $scope.routeSubFilterFunc(
                $scope.stop_route_list,
                $scope.routeFilter.f,
                false
            );

        }

    });

    $scope.trip_date_changed = { value: false };

    $scope.removeTripOptsDateWatch = $scope.$watch("trip_opts.datepick",
    function(new_val, old_val) {

        if (new_val !== old_val) {

            $scope.watchCalendarForUserChangeOnce(
                $scope.trip_opts.datepick,
                $scope.trip_date_changed,
                $scope.removeTripOptsDateWatch
            );

        }

    });

    $scope.$watch("show_trip_planner_step_navigation_bar",
    function(new_val, old_val) {

        if (new_val > old_val) {

            $scope.trip_planner_module_map_title_styles
            ["trip-planner-module-map-title-extra-padding"] = true;

        }

        if (new_val < old_val) {

            $scope.trip_planner_module_map_title_styles
            ["trip-planner-module-map-title-extra-padding"] = false;

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
        inactive: "Show more stops",
        activating: "Showing more stops..."
    };

    $scope.map_full_screen_return_button_messages = {
        planner: "Return to Trip Planner",
        schedule: "Return to Schedule Map"
    };

    $scope.schedule_date_range = {
        start: "2014/06/08",
        end: "2014/09/13"
    };

    //Values taken from BCT site on 14/09/19 12:20 PM EST
    $scope.full_schedule_availabilities = {

        one_file: [4, 5, 7, 9, 12, 14, 15, 16, 18, 19, 20, 23, 30, 31, 34, 36,
        40, 42, 48, 50, 55, 56, 60, 62, 72, 81, 83, 88],

        two_files: [1, 2, 6, 10, 11, 22, 28],

        breeze: {

            101: 1,
            102: 2,
            441: 441

        },

        express: {

            110: "595X110",
            112: "595X112",
            114: "595X114",
            106: "95X106",
            107: "95X107",
            108: "95X108",
            109: "95X109"

        }

    };

    (function() {

        $scope.breeze_sched_listed = [];

        for (var b in $scope.full_schedule_availabilities.breeze) {

            $scope.breeze_sched_listed.push(b);

        }

        $scope.express_sched_listed = [];

        for (var e in $scope.full_schedule_availabilities.express) {

            $scope.express_sched_listed.push(e);

        }

    })();

    /* END Data Object Templates */

    $scope.selectBCTSiteFullSchedule = function() {

        var route_id_short =
        $scope.map_schedule_info.route.match(/[0-9][0-9]*/)[0].
        replace(/^0*/,"");

        var one_page_sched_listed =
        $scope.full_schedule_availabilities.one_file;

        var two_page_sched_listed =
        $scope.full_schedule_availabilities.two_files;

        if (two_page_sched_listed.indexOf(Number(route_id_short)) !== -1) {

            $scope.show_schedule_full_result_pdf_selector = true;

            return true;

        }

        else if (one_page_sched_listed.indexOf(Number(route_id_short)) !== -1) {

            $scope.goToBCTSiteFullSchedule("one_page", route_id_short);

        }

        else if ($scope.breeze_sched_listed.indexOf(route_id_short) !== -1) {

            var breeze_bus_list_index =
            $scope.breeze_sched_listed.indexOf(route_id_short);

            var breeze_bus_index =
            $scope.breeze_sched_listed[breeze_bus_list_index];

            route_id_short =
            $scope.full_schedule_availabilities.breeze[breeze_bus_index];

            $scope.goToBCTSiteFullSchedule("breeze", route_id_short);

        }

        else if ($scope.express_sched_listed.indexOf(route_id_short) !== -1) {

            var express_bus_list_index =
            $scope.express_sched_listed.indexOf(route_id_short);

            var express_bus_index =
            $scope.express_sched_listed[express_bus_list_index];

            route_id_short =
            $scope.full_schedule_availabilities.express[express_bus_index];

            $scope.goToBCTSiteFullSchedule("express", route_id_short);

        }

        else {

            console.log("Route not found: " + route_id_short);

            return false;

        }

    };

    $scope.goToBCTSiteFullSchedule = function(
        schedule_layout, route_id_short, schedule_type
    ) {

        var url_base = "http://www.broward.org/BCT/MapsAndSchedules/Documents/";
        var file_prefix = "rt";
        var file_middle = "web";
        var file_ext = ".pdf";

        var file_middle_prefix;

        if (schedule_layout === "one_page") {

            file_middle_prefix = "";

        }

        else if (schedule_layout === "two_page") {

            if (schedule_type === "weekday") {

                file_middle_prefix = "w";

            }

            else if (schedule_type === "weekend") {

                file_middle_prefix = "ss";

            }

            else {

                console.error("Schedule type unspecified.");

            }

        }

        else if (schedule_layout === "breeze") {

            file_middle_prefix = "breeze";

        }

        else if (schedule_layout === "express") {

            file_prefix = "";

            file_middle_prefix = "";

        }

        if (route_id_short === "on_page") {

            var route_id_short =
            $scope.map_schedule_info.route.match(/[0-9][0-9]*/)[0].
            replace(/^0*/,"");

        }

        var full_url =
        url_base + file_prefix + route_id_short + file_middle_prefix +
        file_middle + file_ext;

        window.open(full_url);

        $scope.show_schedule_full_result_pdf_selector = false;

    };

    $scope.watchCalendarForUserChangeOnce = function(
        calendar_model, date_time_changed_flag, deregisterWatch
    ) {

        var current_date = new Date;

        var current_time =
        current_date.toISOString().split('T')[1].slice(0,5);

        var set_calendar_time =
        calendar_model.toISOString().split('T')[1].slice(0,5);

        if (set_calendar_time !== current_time) {

            date_time_changed_flag.value = true;

            deregisterWatch();

        }

    };

    $scope.checkIfRouteStopFavorited = function(route, stop) {

        return profilePageService.checkIfRouteStopFavorited(route, stop);

    };

    $scope.routeFilterFunc =
    (new routeAndStopFilters.RouteAndStopFilterMaker("route", true)).
    filter;

    $scope.stopFilterFunc =
    (new routeAndStopFilters.RouteAndStopFilterMaker("stop", true)).
    filter;

    $scope.routeSubFilterFunc =
    (new routeAndStopFilters.RouteAndStopFilterMaker("route", false)).
    filter;

    $scope.stopSubFilterFunc =
    (new routeAndStopFilters.RouteAndStopFilterMaker("stop", false)).
    filter;

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

        //These arrays of configuration objects are used to create a simple
        //list of animation 'frames' for each direction (forward and reverse)
        //Frame counts are calculated and set below
        var animation_config_forward = [

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

        var animation_config_reverse = [

            {

                keyframe_setup_name: "displayed_in_middle",
                duration: MESSAGE_DISPLAY_TIME,
                number_of_frames: 0

            },

            {

                keyframe_setup_name: "hidden_on_right",
                duration: MESSAGE_TRANSITION_OUT_TIME,
                number_of_frames: 0

            },

            {

                keyframe_setup_name: "hidden_on_left",
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

            else if (old_index < 0) {

                new_index = number_of_steps - 1;

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

            else if (old_index === -3) {

                new_index = number_of_messages - 3;

            }

            else if (old_index === -2) {

                new_index = number_of_messages - 2;

            }

            else if (old_index === -1) {

                new_index = number_of_messages - 1;

            }

            return new_index;

        }

        $scope.global_alerts_index = alert_message_indices.global;
        $scope.schedule_map_alerts_index = alert_message_indices.schedule_map;

        function changeAlertMessage(module, message, direction) {

            var message_iterator_amount;

            if (direction === "prev") {

                message_iterator_amount = -2;

            }

            else if (direction === "next") {

                message_iterator_amount = 2;

            }

            var cur_indices = alert_message_indices[module];

            cur_indices[message] += message_iterator_amount;

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
            module,
            message,
            current_styling,
            keyframe_setup,
            direction
        ) {

            var cur_keyframe_setup = keyframe_setups[keyframe_setup];

            for (var setting in cur_keyframe_setup) {

                var new_style_setting = cur_keyframe_setup[setting];

                var style_name = keyframes[setting];

                current_styling[style_name] = new_style_setting;

            }

            if (prev_stylings[module][message] === "hidden_on_left" &&
                keyframe_setup === "hidden_on_right") {

                changeAlertMessage(module, message, direction);

            }

            else if (prev_stylings[module][message] === "hidden_on_right" &&
                keyframe_setup === "hidden_on_left") {

                changeAlertMessage(module, message, direction);

            }

            prev_stylings[module][message] = keyframe_setup;

        }

        function ScrollingMessage(module, type) {

            var self = this;

            this.type = type;

            this.module = module;

            if (self.type === "leader") {

                this.step_forward = 0;
                this.step_reverse = 1;

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

                this.step_forward = 8;
                this.step_reverse = 9;

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
                    steps_list_forward[self.step_forward].keyframe_setup,
                    "next"
                );

                self.step_forward++;

                self.step_forward = cycleThroughAlertFrames(self.step_forward);

                if (self.follower_message) {

                    //General case: called on an array of followers in sequence
                    self.follower_message.goToNextStep();

                }

            };

            this.goToPrevStep = function() {

                setKeyframeStyle(
                    self.module,
                    type,
                    self.current_styling,
                    steps_list_reverse[self.step_reverse].keyframe_setup,
                    "prev"
                );

                self.step_reverse++;

                self.step_reverse = cycleThroughAlertFrames(self.step_reverse);

                if (self.follower_message) {

                    //General case: called on an array of followers in sequence
                    self.follower_message.goToPrevStep();

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

        var animation_configs = [
            animation_config_forward, animation_config_reverse
        ];

        for (var i=0;i<animation_configs.length;i++) {

            for (var j=0;j<animation_configs[i].length;j++) {

                var number_of_frames =
                animation_configs[i][j].duration / shortest_animation_time;

                animation_configs[i][j].number_of_frames = number_of_frames;

            }

        }

        //General case: the sum of all animation steps
        var number_of_steps =
        (MESSAGE_DISPLAY_TIME * 2) / shortest_animation_time;

        var steps_list_forward = new Array(number_of_steps);
        var steps_list_reverse = new Array(number_of_steps);

        var steps_counter_forward = 0;
        var steps_counter_reverse = 0;

        var steps_list;
        var steps_counter;

        for (var k=0;k<animation_configs.length;k++) {

            //k === 0, i.e., the forward direction for the scrolling animation
            if (k === 0) {

                steps_list = steps_list_forward;
                steps_counter = steps_counter_forward;

            }

            //k === 1, i.e., the reverse direction for the scrolling animation
            else if (k === 1) {

                steps_list = steps_list_reverse;
                steps_counter = steps_counter_reverse;

            }

            for (var l=0;l<animation_configs[k].length;l++) {

                var cur_length = animation_configs[k][l].number_of_frames;

                for (var m=0;m<cur_length;m++) {

                    var cur_step = {

                        keyframe_setup: animation_configs[k][l].
                        keyframe_setup_name

                    };

                    steps_list[steps_counter] = cur_step;

                    steps_counter++;

                }

            }

        }

        function runMessageScrollingAnimations() {
        
            $timeout(function() {

                global_leader_message.goToNextStep();

                schedule_map_leader_message.goToNextStep();

                runMessageScrollingAnimations();

            }, shortest_animation_time);

        }

        //runMessageScrollingAnimations();

        var frames_to_skip = animation_configs[0][0].number_of_frames;

        $scope.goToNextGlobalAlertMessage = function() {

            for (var i=0;i<frames_to_skip;i++) {

                global_leader_message.goToNextStep();

                schedule_map_leader_message.goToNextStep();

            }

        };

        $scope.goToPrevGlobalAlertMessage = function() {

            for (var i=0;i<frames_to_skip;i++) {

                global_leader_message.goToPrevStep();

                schedule_map_leader_message.goToPrevStep();

            }

        };

        $scope.goToNextGlobalAlertMessage();

    }());

    $scope.base_myride_url =
    window.myride.directories.site_roots.active +
    window.myride.directories.paths.active;

    $scope.submitRouteStopSearch = function(e, input) {

        var input_el;

        if (input === "index") {

            input_el = myride.dom_q.inputs.elements.index_search_input;

        }

        else if (input === "results") {

            input_el = myride.dom_q.inputs.elements.rs_search_input;

        }

        input_el.value = input_el.value.trim();

        $scope.query_data.schedule_search =
        input_el.value;

        //Only the 'click' event calls the $apply automatically (from ng-click)
        if (e === 'enter') {
            $scope.$apply();
        }

    };

    $scope.legend_icon_list = legend_icon_list;

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

        var marker_list_name = "";

        var open_info_name = "";

        var id_type_name = "";

        if (map_type === "planner") {

            point = myride.dom_q.map.overlays.trip_points[0];

            marker_list_name = "trip_points";

            open_info_name = "trip_open_info";
            id_type_name = "trip_marker_window_id";

        }
        else if (map_type === "schedule") {

            point = myride.dom_q.map.overlays.
            points[$scope.initial_schedule_map_data.bstop_id];

            marker_list_name = "points";

            open_info_name = "open_info";
            id_type_name = "schedule_marker_window_id";

        }

        if (!point) { return true; }

        var point_coords = point.marker.getPosition();

        myride.dom_q.map.inst.setCenter({
            lat: point_coords.lat(),
            lng: point_coords.lng()
        });

        //Closing Info Window/Box before attemping opening is for positioning
        if (point.info[id_type_name] ===
            myride.dom_q.map.overlays[open_info_name][0][id_type_name]) {

            point.info.close();

            googleMapUtilities.createDummyInfoWindow(marker_list_name);

        }

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
        full_screen_on &&
        $scope.show_trip_planner_title &&
        $scope.current_trip_plan_data_selection &&
        //TODO: "Stress test" this line (in case of server API issues)
        $scope.current_trip_plan_data_selection.legsField[0];

        var map_ready_promise = googleMapUtilities.touchMap();

        var map_type = "";

        var first_stop_or_step_coords;

        var new_zoom;

        if ($scope.show_trip_planner_title) {

            map_type = "planner";

            first_stop_or_step_coords = null;

            new_zoom = 10;

            $scope.show_trip_planner_title_header = full_screen_on;

            if ($scope.current_trip_plan_summary &&
                $scope.current_trip_plan_summary.first_LatLng) {

                first_stop_or_step_coords =
                $scope.current_trip_plan_summary.first_LatLng;

                new_zoom = $scope.current_trip_plan_summary.zoom;

            }

        }

        else if ($scope.show_schedule_result_top_bar) {

            map_type = "schedule";
            
            first_stop_or_step_coords = $scope.initial_schedule_map_data.coords;

            new_zoom = null;

            $scope.show_schedule_map_stop_navigation_bar = full_screen_on;
            $scope.show_schedule_map_alerts_header_contents = full_screen_on;
            $scope.show_schedule_result_top_info_bar = full_screen_on;
            $scope.show_schedule_map_info_bar = full_screen_on;

        }

        googleMapUtilities.setMapPosition(
            first_stop_or_step_coords, new_zoom
        );

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

    $scope.alertUserToMainModuleError = function(
        error_field,
        dialog_styles,
        disableErrorAlert,
        ng_show_flag_name,
        dialog_timeout_name,
        hide_in_progress_flag_name,
        display_time,
        display_text_name,
        displayTextSelector
    ) {

        if (disableErrorAlert(dialog_styles)) { return false; }

        dialog_styles["error-dialog-centered"] = true;

        $scope[ng_show_flag_name] = true;

        $timeout(function() {

            dialog_styles["error-dialog-faded-out"] = false;
            dialog_styles["error-dialog-faded-in"] = true;

        }, 200);

        $scope[dialog_timeout_name] = $timeout(function() {

            dialog_styles["error-dialog-faded-in"] = false;
            dialog_styles["error-dialog-faded-out"] = true;

            $scope[hide_in_progress_flag_name] = true;

            $timeout(function() {

                $scope[ng_show_flag_name] = false;
                $scope[hide_in_progress_flag_name] = false;

            }, 1000);

        }, display_time);

        $scope[display_text_name] =
        displayTextSelector(error_field);

    };

    $scope.full_schedule_error_dialog_text = "Default Dialog Text";

    $scope.checkIfShouldDisableFullScheduleErrorDialog = function(
        dialog_styles
    ) {

        var disable_full_schedule_error_dialog = true;

        if ($scope.full_schedule_error_dialog_hide_in_progress ||
            dialog_styles["error-dialog-faded-in"] ||
            !$scope.show_map_overlay_module ||
            !$scope.show_full_schedule_module) {

            disable_full_schedule_error_dialog = false;

        }

        return disable_full_schedule_error_dialog;

    };

    $scope.selectFullScheduleErrorMessage = function(error_field) {

        var full_schedule_error_dialog_text = "";

        if (!error_field) {

            full_schedule_error_dialog_text  =
            module_error_messages.schedule_map.
            FULL_SCHEDULE_ERROR_NO_DATA_ERROR_MESSAGE;

            console.log(
                "Full Schedule error: problem communicating with server."
            );

        }

        return full_schedule_error_dialog_text;

    };

    $scope.full_schedule_error_dialog_hide_in_progress = false;

    $scope.alertUserToFullScheduleErrors = function(error_field) {

        var dialog_styles = $scope.full_schedule_error_dialog_styles;

        var disableErrorAlert =
        $scope.checkIfShouldDisableFullScheduleErrorDialog;

        var ng_show_flag_name = "show_full_schedule_error_dialog";

        var dialog_timeout_name = "full_schedule_error_dialog_timeout";

        var hide_in_progress_flag_name =
        "full_schedule_error_dialog_hide_in_progress";

        var display_time = 3000;

        var display_text_name = "full_schedule_error_dialog_text";

        var displayTextSelector = $scope.selectFullScheduleErrorMessage;

        $scope.alertUserToMainModuleError(
            error_field,
            dialog_styles,
            disableErrorAlert,
            ng_show_flag_name,
            dialog_timeout_name,
            hide_in_progress_flag_name,
            display_time,
            display_text_name,
            displayTextSelector
        );

    };

    $scope.schedule_map_error_dialog_text = "Default Dialog Text";

    $scope.selectScheduleMapErrorMessage = function(error_field) {

        var schedule_map_error_dialog_text = "";

        if (!error_field) {

            schedule_map_error_dialog_text =
            module_error_messages.schedule_map.
            SCHEDULE_MAP_ERROR_NO_DATA_ERROR_MESSAGE;

            console.log(
                "Schedule Map error: problem communicating with server"
            );

        }

        else if (error_field === "stop_seeker") {

            schedule_map_error_dialog_text =
            module_error_messages.schedule_map.
            SCHEDULE_MAP_ERROR_STOP_SEEKER ;

            console.log(
                "Schedule Map error: Stop Seeker."
            );

        }

        else if (error_field === "main_schedule") {

            schedule_map_error_dialog_text =
            module_error_messages.schedule_map.
            SCHEDULE_MAP_ERROR_MAIN_SCHEDULE;

            console.log(
                "Schedule Map error: Main Schedule."
            );

        }

        return schedule_map_error_dialog_text;

    };

    $scope.checkIfShouldDisableScheduleMapErrorDialog = function(
        dialog_styles
    ) {

        var disable_schedule_map_error_dialog = true;

        if ($scope.full_schedule_error_dialog_hide_in_progress ||
            dialog_styles["error-dialog-faded-in"] ||
            !$scope.show_map_overlay_module ||
            $scope.show_full_schedule_module) {

            disable_schedule_map_error_dialog = false;

        }

        return disable_schedule_map_error_dialog;

    };

    $scope.schedule_map_error_dialog_hide_in_progress = false;

    $scope.alertUserToScheduleMapErrors = function(error_field) {

        var dialog_styles = $scope.schedule_map_error_dialog_styles;

        var disableErrorAlert =
        $scope.checkIfShouldDisableScheduleMapErrorDialog;

        var ng_show_flag_name = "show_schedule_map_error_dialog";

        var dialog_timeout_name = "schedule_map_error_dialog_timeout";

        var hide_in_progress_flag_name =
        "schedule_map_error_dialog_hide_in_progress";

        var display_time = 3000;

        var display_text_name = "schedule_map_error_dialog_text";

        var displayTextSelector = $scope.selectScheduleMapErrorMessage;

        $scope.alertUserToMainModuleError(
            error_field,
            dialog_styles,
            disableErrorAlert,
            ng_show_flag_name,
            dialog_timeout_name,
            hide_in_progress_flag_name,
            display_time,
            display_text_name,
            displayTextSelector
        );

    };

    $scope.full_schedule_error_dialog_text = "Default Dialog Text";

    $scope.full_schedule_error_dialog_hide_in_progress = false;

    $scope.SCHEDULE_MAP_ERROR_STOP_SEEKER =
    "There was a problem with the Stop Seeker. Please try again later.";

    $scope.SCHEDULE_MAP_ERROR_MAIN_SCHEDULE =
    "There was a problem downloading the main schedule. " +
    "Please try again later.";

    $scope.full_schedule_error_dialog_hide_in_progress = false;

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

        })["catch"](function() {

            $scope.alertUserToScheduleMapErrors("stop_seeker");

            $scope.current_schedule_map_navigation_bar_activation_message =
            $scope.schedule_map_navigation_bar_activation_messages.inactive; 

            $scope.show_schedule_map_navigation_bar_loading = false;

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

        var map_ready_promise = $scope.populateScheduleMap(new_route, bstop_id);

        map_ready_promise.then(function() {

            myride.dom_q.map.overlays.points[bstop_id].ShowWindow.func();

        });

    };

    $scope.displayResultsIfExist = function() {

        if ($scope.results_exist.main) {
            $scope.show_empty_result_message_no_results = false;
            $scope.show_schedule_results_result_panels = true;
        }
        else {
            $scope.show_empty_result_message_no_results = true;
            $scope.show_schedule_results_result_panels = false;
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

    $scope.deleteFavoriteRouteStop = function(route, stop) {
        
        profilePageService.deleteFavoriteRouteStop(
            route, stop
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

        var coords = {
            lat: $scope.stops[stop].LatLng.Latitude,
            lng:  $scope.stops[stop].LatLng.Longitude
        };

        $scope.initial_schedule_map_data.coords = coords;

        googleMapUtilities.clearMap();

        $scope.cur_route_path =
        googleMapUtilities.displayRoute(route, $scope.routes);

        googleMapUtilities.displayStops(
            route, $scope.routes, $scope.stops, $scope.cur_route_path
        );

        var projected_coords = 
        googleMapUtilities.mapStopsToRoutePath(coords, $scope.cur_route_path);

        return googleMapUtilities.setMapPosition(projected_coords)

    };

    $scope.populateScheduleMapTimes = function(route, stop) {

        $scope.schedule.nearest.times_and_diffs =
        $scope.mini_schedule_loading_template;

        scheduleDownloadAndTransformation.downloadSchedule(route, stop).
        then(function(res) {

            if (!res.data.Today) {

                console.log("Schedule loading error.");

                $scope.alertUserToScheduleMapErrors("main_schedule");

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
    var bstop_props = ["Id", "Name", "Code"];

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

        angular.element(document).ready(function() {

            $scope.query_data.schedule_search =
            stop + " " + $scope.stops[stop].Name;

        });

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
        function recentStopFilterEnter() {
            return true;
        }

        function recentTripFilterEnter() {
            return true;
        }

        function subBusStopFilterEnter() {
            return true;
        }

        function routeStopSearchIndexInputEnter() {

            $scope.submitRouteStopSearch('enter', 'index');

            $scope.changeURLHash('#routeschedules', 'schedule_search');

            return true;

        }

        function routeStopSearchInputEnter() {

            $scope.submitRouteStopSearch('enter', 'results');

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
            "recent-stop-filter": recentStopFilterEnter,
            "recent-trip-filter": recentTripFilterEnter,
            "sub-bus-stop-filter": subBusStopFilterEnter,
            "sub-route-filter": subRouteFilterEnter,
            "route-stop-search-input": routeStopSearchInputEnter,
            "route-stop-search-index-input": routeStopSearchIndexInputEnter,
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