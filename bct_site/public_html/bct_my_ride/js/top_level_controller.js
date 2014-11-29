var BCTAppTopController = angular.module('BCTAppTopController', []);

BCTAppTopController.controller('BCTController', [

    '$scope', '$timeout', 'full_bstop_data', 'full_route_data', 'all_alerts',
    'full_landmark_data', '$compile', 'scrollingAlertsService',
    //'scheduleWebSocket', 'scheduleSocketService',
    'scheduleDownloadAndTransformation', 'googleMapsUtilities', '$q',
    'unitConversionAndDataReporting', 'miniScheduleService',
    'placeholderService', 'locationService', 'location_icons',
    'agency_filter_icons', 'results_exist', 'map_navigation_marker_indices',
    'legend_icon_list', 'profilePageService',
    'routeAndStopFilters', 'warning_messages', 'selected_nearest_map_stop',
    'nearest_map_stop_distances', 'landmarkInfoService', 'favorites_data',
    'svg_icon_paths', 'full_schedule_categories',
    'full_schedule_category_with_datepicker', 'recentlyViewedService',
    'full_schedule_availabilities', 'generalUIUtilities',
    'routeStopLandmarkTransformationService', 'generalServiceUtilities',

function (

    $scope, $timeout, full_bstop_data, full_route_data, all_alerts,
    full_landmark_data, $compile, scrollingAlertsService,
    //scheduleWebSocket, scheduleSocketService,
    scheduleDownloadAndTransformation, googleMapsUtilities, $q,
    unitConversionAndDataReporting, miniScheduleService, placeholderService,
    locationService, location_icons, agency_filter_icons, results_exist,
    map_navigation_marker_indices, legend_icon_list,
    profilePageService, routeAndStopFilters, warning_messages,
    selected_nearest_map_stop, nearest_map_stop_distances, landmarkInfoService,
    favorites_data, svg_icon_paths, full_schedule_categories,
    full_schedule_category_with_datepicker, recentlyViewedService,
    full_schedule_availabilities, generalUIUtilities,
    routeStopLandmarkTransformationService, generalServiceUtilities

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

    $scope.map_canvas_styles = {
        "map-canvas-full-screen": false
    };

    $scope.schedule_map_styles = {
        "schedule-map-full-screen": false
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

    $scope.global_alert_area_styles = {

        left: {
            "alert-area-highlighted": false
        },

        right: {
            "alert-area-highlighted": false
        },

        pause: {
            "alert-area-highlighted": false
        }

    };

    $scope.nearest_map_stops_title_styles = {
        
    };

    $scope.nearest_map_stops_info_container_styles = {
        
    };

    /* END CSS class expressions to be used to ng-class, with defaults */

    /* START Overlay Display Controls */

    $scope.show_main_loading_modal = true;

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
    $scope.show_schedule_result_date_pick_row_no_data = false;

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

    $scope.show_schedule_map_mini_schedule_no_data = true;

    $scope.show_route_alert_overlay = false;

    $scope.show_nearest_map_stops_title = false;
    $scope.show_nearest_map_stops_title_header = true;
    $scope.show_nearest_map_stops_title_with_back_function = false;

    $scope.show_nearest_map_stops_info_container = false;

    $scope.show_full_schedule_category_panel_loading_modal = false;
    $scope.show_full_schedule_category_loading_modal_datepick = false;

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
                $scope.query_data.schedule_search,
                false
            );

            $scope.filtered_stops_arr = $scope.stopFilterFunc(
                $scope.query_data.schedule_search,
                $scope.sort_bstops_by_distance
            );

            $scope.filtered_landmarks_arr = $scope.landmarkFilterFunc(
                $scope.query_data.schedule_search,
                false
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

            $scope.show_schedule_map_error_dialog = false;

            $timeout.cancel($scope.schedule_map_error_dialog_timeout);

            $scope.show_route_alert_overlay = false;

        }

        else if (new_val < old_val) {

            $scope.show_map_canvas = true;
            $scope.show_schedule_map_stop_navigation_bar = true;

        }

    });

    $scope.full_schedule_loading_placeholder =
    placeholderService.createLoadingPlaceholder(20, " ");

    $scope.$watch("full_schedule_date.datepick",
    function(new_val, old_val) {

        if (new_val !== old_val) {

            $scope.schedule.date_pick =
            $scope.full_schedule_loading_placeholder;

            $scope.show_full_schedule_category_loading_modal_datepick =
            true;

            $scope.show_schedule_result_date_pick_row_no_data = false;

            scheduleDownloadAndTransformation.downloadSchedule(

                $scope.map_schedule_info.route,
                $scope.map_schedule_info.stop,
                $scope.full_schedule_date.datepick

            ).
            then(function(res) {

                $scope.show_full_schedule_category_loading_modal_datepick =
                false;

                if (res.data.Today) {

                    var t_schedule = scheduleDownloadAndTransformation.
                    transformSchedule("datepick", res.data.Today);

                    $scope.schedule.date_pick = t_schedule.date_pick;

                }

                else {

                    $scope.show_schedule_result_date_pick_row_no_data =
                    true;

                    $scope.alertUserToFullScheduleErrors();

                }

            })["catch"](function() {

                console.log("Server communication error: full schedule.");

                $scope.alertUserToFullScheduleErrors();

                $scope.show_full_schedule_category_loading_modal_datepick =
                false;

            });

        }

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

            $scope.show_route_alert_overlay = false;

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
                $scope.bstopFilter.f,
                false,
                $scope.route_stop_list
            );

        }

    });

    $scope.$watch("landmarkBstopFilter.f",
    function(new_val, old_val) {
        
        if (new_val !== old_val) {

            $scope.filtered_sub_landmarks_arr = $scope.stopSubFilterFunc(
                $scope.landmarkBstopFilter.f,
                false,
                $scope.landmark_stop_list
            );

        }

    });

    $scope.$watch("routeFilter.f",
    function(new_val, old_val) {
        
        if (new_val !== old_val) {

            $scope.filtered_sub_stops_arr = $scope.routeSubFilterFunc(
                $scope.routeFilter.f,
                false,
                $scope.stop_route_list
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
    $scope.landmarkBstopFilter = { f: "" };

    $scope.full_schedule_date = {
        datepick: new Date
    };

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
    $scope.full_schedule_availabilities = full_schedule_availabilities;

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

    $scope.compileTemplateWithTopScope = function(target_el, template) {

        var target_el_obj = angular.element(target_el);

        target_el_obj.append($compile(template)($scope));

    };

    $scope.showInfoWindowSchedule = function() {

        $scope.show_info_window_schedule = true;

    };

    $scope.warning_messages = warning_messages;

    recentlyViewedService.loadRecentlyViewedList();

    $scope.full_schedule_categories = full_schedule_categories;

    $scope.full_schedule_category_with_datepicker =
    full_schedule_category_with_datepicker;

    $scope.cur_def_dir = myride.directories.site_roots.active;
    $scope.cur_def_path = myride.directories.paths.active;

    $scope.svg_icon_paths = svg_icon_paths;

    $scope.nearest_map_stop_distances = nearest_map_stop_distances;

    $scope.selected_nearest_map_stop = selected_nearest_map_stop;

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

        var url_base = "http://www.broward.org/BCT/Schedules/Documents/";
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

    $scope.checkIfRouteStopFavorited =
    profilePageService.checkIfRouteStopFavorited;

    $scope.routeFilterFunc =
    (new routeAndStopFilters.RouteAndStopFilterMaker("route", true)).filter;

    $scope.stopFilterFunc =
    (new routeAndStopFilters.RouteAndStopFilterMaker("stop", true)).filter;

    $scope.landmarkFilterFunc =
    (new routeAndStopFilters.RouteAndStopFilterMaker("landmark", true)).filter;

    $scope.routeSubFilterFunc =
    (new routeAndStopFilters.RouteAndStopFilterMaker("route", false)).filter;

    $scope.stopSubFilterFunc =
    (new routeAndStopFilters.RouteAndStopFilterMaker("stop", false)).filter;

    $scope.schedule_map_alerts = all_alerts.schedule_map;

    $scope.toggleRouteAlertOverlay = function() {

        if (!$scope.show_route_alert_overlay) {

            $scope.current_route_alert_index = 0;

        }

        $scope.show_route_alert_overlay = !$scope.show_route_alert_overlay;

    };

    $scope.cycleThroughRouteAlerts = function(old_index) {

        var number_of_alerts =
        full_route_data.dict[$scope.map_schedule_info.route].alerts.length;

        var new_index = old_index;

        if (old_index > number_of_alerts - 1) {

            new_index = 0;

        }

        else if (old_index < 0) {

            new_index = number_of_alerts - 1;

        }

        return new_index;

    };

    $scope.changeRouteAlert = function(direction) {

        var cur_route_index = $scope.current_route_alert_index;

        if (direction === "next") {

            cur_route_index++;

        }

        else if (direction === "prev") {

            cur_route_index--;

        }

        $scope.current_route_alert_index =
        $scope.cycleThroughRouteAlerts(cur_route_index);

    };

    $scope.current_global_alerts_message = "";

    $scope.changeGlobalAlertsBarHighlighting = function(cur_direction) {

        var button_styles_list = $scope.global_alert_area_styles;

        var highlight_class = "alert-area-highlighted";

        for (var direction in button_styles_list) {

            if (direction === cur_direction) {

                button_styles_list[direction][highlight_class] = true;

            }

            else {

                button_styles_list[direction][highlight_class] = false;

            }

        }

    };

    $scope.goToGlobalAlertMessage =
    scrollingAlertsService.goToGlobalAlertMessage;

    $scope.pauseGlobalAlertMessageScrolling =
    scrollingAlertsService.pauseGlobalAlertMessageScrolling;

    $scope.base_myride_url =
    window.myride.directories.site_roots.active +
    window.myride.directories.paths.active;

    $scope.submitRouteStopSearch = function(
        e, input, externally_specified_stop
    ) {

        var input_el;

        var new_input_value;

        if (input === "index") {

            input_el = myride.dom_q.inputs.elements.index_search_input;

            new_input_value = input_el.value.trim();

        }

        else if (input === "results") {

            input_el = myride.dom_q.inputs.elements.rs_search_input;

            new_input_value = input_el.value.trim();

        }

        else if (input === "specified") {

            input_el = myride.dom_q.inputs.elements.rs_search_input;

            new_input_value =
            full_bstop_data.dict[externally_specified_stop].Name;

        }

        input_el.value = new_input_value;

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

            googleMapsUtilities.createDummyInfoWindow(marker_list_name);

        }

        point.info_opener.open(true);

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
        Boolean($scope.current_trip_plan_data_selection) &&
        //TODO: "Stress test" this line (in case of server API issues)
        Boolean($scope.current_trip_plan_data_selection.legsField[0]);

        var map_ready_promise = googleMapsUtilities.touchMap();

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

        googleMapsUtilities.setMapPosition(
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

        myride.dom_q.map.overlays.points[bstop_id].info.clicked = true;
        myride.dom_q.map.overlays.points[bstop_id].info_opener.open();

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

        var disable_full_schedule_error_dialog = false;

        if ($scope.full_schedule_error_dialog_hide_in_progress ||
            dialog_styles["error-dialog-faded-in"] ||
            !$scope.show_map_overlay_module ||
            !$scope.show_full_schedule_module) {

            disable_full_schedule_error_dialog = true;

        }

        return disable_full_schedule_error_dialog;

    };

    $scope.selectFullScheduleErrorMessage = function(error_field) {

        var full_schedule_error_dialog_text = "";

        if (!error_field) {

            full_schedule_error_dialog_text =
            warning_messages.full_schedule.no_error_data;

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
            warning_messages.schedule_map.no_error_data;

            console.log(
                "Schedule Map error: problem communicating with server"
            );

        }

        else if (error_field === "stop_seeker") {

            schedule_map_error_dialog_text =
            warning_messages.schedule_map.stop_seeker;

            console.log(
                "Schedule Map error: Stop Seeker."
            );

        }

        else if (error_field === "main_schedule") {

            schedule_map_error_dialog_text =
            warning_messages.schedule_map.main_schedule;

            console.log(
                "Schedule Map error: Main Schedule."
            );

        }

        return schedule_map_error_dialog_text;

    };

    $scope.checkIfShouldDisableScheduleMapErrorDialog = function(
        dialog_styles
    ) {

        var disable_schedule_map_error_dialog = false;

        if ($scope.full_schedule_error_dialog_hide_in_progress ||
            dialog_styles["error-dialog-faded-in"] ||
            !$scope.show_map_overlay_module ||
            $scope.show_full_schedule_module) {

            disable_schedule_map_error_dialog = true;

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
    warning_messages.schedule_map.stop_seeker;

    $scope.SCHEDULE_MAP_ERROR_MAIN_SCHEDULE =
    warning_messages.schedule_map.main_schedule;

    $scope.full_schedule_error_dialog_hide_in_progress = false;

    $scope.activateScheduleMapStopNavigation = function() {

        $scope.schedule_map_navigation_bar_same_stop_open = true;

        $scope.show_schedule_map_navigation_bar_loading = true;
        $scope.show_schedule_map_stop_navigation_bar_contents = false;

        $scope.current_schedule_map_navigation_bar_activation_message =
        $scope.schedule_map_navigation_bar_activation_messages.activating; 

        var cur_route = $scope.initial_schedule_map_data.route_id;

        googleMapsUtilities.getOrderedStopListForCurrentRoute(cur_route).
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

    $scope.cycleMarkerInfoWindows = generalUIUtilities.cycleMarkerInfoWindows;

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

        myride.dom_q.map.overlays[marker_instances][marker_index].
        info.clicked = true;

        if (map_type === "schedule") {

            google.maps.event.addListenerOnce(
                myride.dom_q.map.inst,
                'idle',
                function() {

                    marker_instance.info_opener.open();

                }
            );

        }

        else {

            marker_instance.info_opener.open();

        }

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

            //Trip planner only
            case "planner_step":

                map_navigation_marker_indices.planner = new_index;

                $scope.openMarkerInfoWindow(
                    map_type,
                    new_index
                );

            break;

        }

    };

    $scope.switchRoutes = function(new_route, bstop_id) {

        map_navigation_marker_indices.schedule_named = bstop_id;

        $scope.schedule_map_navigation_bar_same_stop_open = false;

        $scope.resetScheduleMapNavigationBar();
        $scope.show_schedule_map_stop_navigation_bar = true;

        googleMapsUtilities.createDummyInfoWindow("points", false);

        $timeout.cancel($scope.schedule_update_timer);

        $scope.populateScheduleMapTimes(new_route, bstop_id);

        var map_ready_promise = $scope.populateScheduleMap(new_route, bstop_id);

        map_ready_promise.then(function() {

            myride.dom_q.map.overlays.points[bstop_id].info.clicked = true;
            myride.dom_q.map.overlays.points[bstop_id].info_opener.open();

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

    $scope.addAndRecordFavoriteRouteStop =
    profilePageService.addAndRecordFavoriteRouteStop;

    $scope.deleteAndRecordFavoriteRouteStop =
    profilePageService.addAndRecordFavoriteRouteStop;

    $scope.addRouteStopToTripPlanner = function(stop) {

        var bstop_coords = full_bstop_data.dict[stop].LatLng;
        var bstop_coords_str = "";

        bstop_coords_str += bstop_coords.Latitude + ",";
        bstop_coords_str += bstop_coords.Longitude;

        $scope.trip_inputs.start = bstop_coords_str;

    };

    (function() {

        for (var i=0;i<full_schedule_categories.length;i++) {

            var full_schedule_category_title =
            full_schedule_categories[i].title;

            $scope.schedule[full_schedule_category_title] =
            $scope.full_schedule_loading_placeholder;

        }

    })();

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

            $scope.changeURLHash('routeschedules', 'schedule_search');

        }

        else if (starting_page === "schedule_search") {

            myride.dom_q.inputs.elements.rs_search_input.value =
            $scope.query_data["schedule_search"];

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

    $scope.mini_schedule_loading_error_template =
    miniScheduleService.makeMiniScheduleLoadingTemplate(true);

    $scope.schedule.nearest.times_and_diffs =
    $scope.mini_schedule_loading_template;

    $scope.MINI_SCHEDULE_UPDATE_TIME_INTERVAL = 20000;

    $scope.updateAndPushSchedule = function (transformed_schedule) {

        var reprocessed_schedule = scheduleDownloadAndTransformation.
        transformSchedule("nearest", transformed_schedule.raw);

        $scope.schedule.nearest = reprocessed_schedule.nearest;

        $scope.schedule.nearest.times_and_diffs =
        unitConversionAndDataReporting.
        formatTimeDifferences(reprocessed_schedule);

        $scope.schedule_update_timer = $timeout(function() {
            $scope.updateAndPushSchedule(reprocessed_schedule);
        }, $scope.MINI_SCHEDULE_UPDATE_TIME_INTERVAL);

    };

    $scope.populateScheduleMap = function(route_id, stop) {

        $scope.map_schedule_info.route = route_id;
        $scope.map_schedule_info.stop = stop;

        $scope.initial_schedule_map_data.route_id = route_id;
        $scope.initial_schedule_map_data.bstop_id = stop;

        var coords = {
            lat: full_bstop_data.dict[stop].LatLng.Latitude,
            lng:  full_bstop_data.dict[stop].LatLng.Longitude
        };

        $scope.initial_schedule_map_data.coords = coords;

        googleMapsUtilities.clearMap();

        $scope.cur_route_path =
        googleMapsUtilities.displayRoute(route_id);

        googleMapsUtilities.displayStopsForRoute(route_id);

        return googleMapsUtilities.setMapPosition(coords);

    };

    $scope.populateScheduleMapTimes = function(route, stop) {

        $scope.schedule.nearest.times_and_diffs =
        $scope.mini_schedule_loading_template;

        scheduleDownloadAndTransformation.downloadSchedule(route, stop).
        then(function(res) {

            if (!res.data.Today || res.data.Today.length < 1) {

                console.log("Schedule loading error.");

                $scope.alertUserToScheduleMapErrors("main_schedule");

                $scope.schedule.nearest.times_and_diffs =
                $scope.mini_schedule_loading_error_template;

                $scope.show_schedule_map_mini_schedule_no_data = true;

                return false;

            }

            $scope.show_schedule_map_mini_schedule_no_data = false;

            var t_schedule = scheduleDownloadAndTransformation.
            transformSchedule("nearest", res.data.Today);

            $scope.updateAndPushSchedule(t_schedule);

        });

    };

    $scope.openMapSchedule = function(route, stop) {

        recentlyViewedService.saveRecentlyViewedItem("schedule_map", {
            route: route,
            stop: stop
        });

        map_navigation_marker_indices.schedule_named = stop;

        $scope.show_map_overlay_module =  true;

        $scope.enableMapToggleOnTitles();

        $scope.populateScheduleMapTimes(route, stop);

        $scope.populateScheduleMap(route, stop).then(function() {

            google.maps.event.addListenerOnce(
                myride.dom_q.map.inst,
                'idle',
                function() {

                    myride.dom_q.map.overlays.points[stop].info.clicked = true;
                    myride.dom_q.map.overlays.points[stop].info_opener.open();

                }
            );

        });

        $scope.show_schedule_result_top_bar = true;
        $scope.show_schedule_result_top_info_bar = true;
        $scope.show_schedule_result_top_alert_bar = true;
        $scope.show_trip_planner_title = false;

    };

    $scope.openTripPlannerMap = function() {

        $scope.show_map_overlay_module =  true;

        $scope.enableMapToggleOnTitles();

        googleMapsUtilities.setMapPosition(null, 10);

        $scope.show_schedule_result_top_bar = false;
        $scope.show_trip_planner_title = true;

    };

    $scope.goToMyRideSchedule = function(route, stop) {

        window.location =
        generalUIUtilities.addRouteAndStopParamsToUrl(route, stop);

        $scope.goToScheduleFromProfilePage();

    };

    $scope.openNearestMapStops = function() {

        $scope.show_map_overlay_module =  true;

        $scope.show_trip_planner_title = false;
        $scope.show_nearest_map_stops_title = true;

        $scope.show_map_full_screen_button = false;

        $scope.show_nearest_map_stops_title_with_back_function = true;

        googleMapsUtilities.setMapPosition(null, 10);

        myride.dom_q.map.overlays.nearest_map_draggable.default = {};

    };

    $scope.closeMapSchedule = function() {

        $scope.disableMapToggleOnTitles();

        $scope.show_map_overlay_module = false;
        $scope.show_full_schedule_module = false;

        $scope.show_route_alert_overlay = false;

        $scope.show_nearest_map_stops_title_with_back_function = false;

    };
    
    $scope.closeTripPlannerMap = function() {

        $scope.closeMapSchedule();

        $scope.trip_inputs.start = "";
        $scope.trip_inputs.finish = "";

        $scope.trip_planner_styles["trip-planner-module-active"] = false;

    };

    $scope.closeNearestMapStops = function() {

        $scope.show_nearest_map_stops_title = false;

        $scope.show_map_overlay_module = false;

        $scope.show_map_full_screen_button = true;

    };

    $scope.toggleMapSchedule = function(originating_module, route, stop) {

        if ($scope.show_map_overlay_module) {

            if (originating_module === "planner") {
                $scope.closeTripPlannerMap();
            }

            else if (originating_module === "schedule") {
                $scope.closeMapSchedule();
            }

            else if (originating_module === "nearest") {
                $scope.closeNearestMapStops();
            }

        }

        else {

            if (originating_module === "planner") {
                $scope.openTripPlannerMap(route, stop);
            }

            else if (originating_module === "schedule") {
                $scope.openMapSchedule(route, stop);
            }

            else if (originating_module === "nearest") {
                $scope.openNearestMapStops();
            }

        }

    };

    $scope.resetCenter = function() {

        var cur_center = {};

        cur_center = $scope.initial_schedule_map_data.coords;
        
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
            googleMapsUtilities.touchMap();

            $scope.showMiniScheduleAndAlertBars();

        }

        /* Opening full schedule module */

        else {

            $scope.full_schedule_date.datepick = new Date;
            $scope.show_full_schedule_module = true;
            $scope.schedule_map_styles["hide-scroll"] = true;

            $scope.hideMiniScheduleAndAlertBars();

        }

    };

    $scope.clearFilters = function() {

        $scope.bstopFilter.f = "";
        $scope.routeFilter.f = "";
        $scope.landmarkBstopFilter.f = "";

    };

    $scope.getCurrentLocationAndDisplayData = locationService.
    getCurrentLocationAndDisplayData;

    $scope.setAccordionPlusMinusIcons = function(
        event, main_container, optional_class_label
    ) {

        generalUIUtilities.setAccordionPlusMinusIcons(
            event, main_container, optional_class_label
        );

        $scope.clearFilters();

    };

    var fullDataDownloadPromise;

    (function() {

        /*
            N.B. "catch" mathod is not used with the dot operator due to
            YUI Compressor (Rhino Engine) reserving the word for try/catch
            statement
        */

        fullDataDownloadPromise = $q.all([

            profilePageService.downloadUserFavorites().
            then(function(res) {

                favorites_data.favorites = res.data;

            })["catch"](function() {

                console.log(
                    "There was an error retrieving the favorites data."
                );

            }),

            landmarkInfoService.downloadLandmarkInfo().
            then(function(res) {

                full_landmark_data.orig = res.data;

            })["catch"](function() {

                console.log("There was an error retrieving the landmark data.");

            }),

            scheduleDownloadAndTransformation.downloadRouteInfo().
            then(function(res) {

                full_route_data.list = res.data;

            })["catch"](function() {

                console.log("There was an error retrieving the route data.");

            }),

            scheduleDownloadAndTransformation.downloadStopInfo().
            then(function(res) {

                full_bstop_data.list = res.data;

            })["catch"](function() {

                console.log("There was an error retrieving the stop data.");

            })
        ]);

    })();

    $scope.route_schedules_module_loaded_deferred = $q.defer();

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

        $scope.route_schedules_module_loaded_deferred.promise.then(function() {

            $scope.query_data.schedule_search =
            full_bstop_data.dict[stop].Name;

            if (myride.dom_q.inputs.elements.rs_search_input) {

                myride.dom_q.inputs.elements.rs_search_input.value =
                $scope.query_data.schedule_search;

            }

        });

    };

    fullDataDownloadPromise.then(function() {

        routeStopLandmarkTransformationService.linkRouteAndStopReferences();

        $scope.goToScheduleFromProfilePage();

        $scope.stops = full_bstop_data.dict;
        $scope.routes = full_route_data.dict;

        $scope.show_main_loading_modal = false;

    });

    $scope.swapTripInputs = function() {

        var old_start = $scope.trip_inputs.start.slice();
        var old_finish = $scope.trip_inputs.finish.slice();

        $scope.trip_inputs.start = old_finish;
        $scope.trip_inputs.finish = old_start;

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

        window.location.hash = "/" + new_hash;

    };

    $scope.submitSpecifiedTrip = function(start, finish) {

        $scope.trip_inputs.start = start;
        $scope.trip_inputs.finish = finish;

        $scope.trip_scope.submitTrip();

    };

    //See generalServiceUtilities for usage information
    generalServiceUtilities.passTopScopePropRefsToGenUtils({

        "compileTemplateWithTopScope": $scope.compileTemplateWithTopScope,

        "showInfoWindowSchedule": $scope.showInfoWindowSchedule,

        "changeGlobalAlertsBarHighlighting":
        $scope.changeGlobalAlertsBarHighlighting

    });

    $scope.global_alerts_ready_deferred = $q.defer();

    $scope.global_alerts_ready_deferred.promise.then(function() {

        //Start scrolling animation (default: forward direction)
        $scope.goToGlobalAlertMessage('forward');

    });

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

        function landmarkSubBusStopFilterEnter() {
            return true;
        }

        function routeStopSearchIndexInputEnter() {

            $scope.submitRouteStopSearch('enter', 'index');

            $scope.changeURLHash('routeschedules', 'schedule_search');

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
            "landmark-sub-bus-stop-filter": subBusStopFilterEnter,
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

config( [ '$routeProvider', function($routeProvider) {

    var site_root = window.myride.directories.site_roots.active;
    var cur_path = window.myride.directories.paths.active;

    $routeProvider.when('/routeschedules', {
        templateUrl: site_root + cur_path + 'partials/route_schedules.html',
        controller: 'routeSchedulesController'
    }).when('/bctappindex', {
        templateUrl: site_root + cur_path + 'partials/bct_app_index.html',
        controller: 'indexController'
    }).when('/nearestmapstops', {
        templateUrl: site_root + cur_path + 
        'partials/nearest_map_stops.html',
        controller: 'nearestMapStopsController'
    });

}]);

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