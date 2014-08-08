var BCTAppValues = angular.module('BCTAppValues', []);

BCTAppValues.value('scheduleWebSocket', new WebSocket("ws://echo.websocket.org"));

BCTAppValues.value('legend_icon_list', [

    {
        fa_name: "fa-crosshairs",
        filename: "",
        legend: {
            module: "Variable",
            desc: "Retrieve current location and use with associated " +
            "module."
        }
    },
    {
        fa_name: "fa-exchange",
        filename: "",
        legend: {
            module: "Trip Planner",
            desc: "Swap trip planner start and finish entries."
        }
    },
    {
        fa_name: "fa-cog",
        filename: "",
        legend: {
            module: "Trip Planner",
            desc: "Display trip planner options."
        }
    }

]);

BCTAppValues.value('filter_buffer_data', {
    search_string_buffer: [],
    results_exist_counter: 0
});

BCTAppValues.value('map_navigation_marker_indices', {
    planner: 0,
    schedule: 0,
    schedule_named: ""
});

BCTAppValues.value('results_exist', {
    main: false,
    sub: false
});

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

BCTAppValues.value('agency_filter_icons', {
    broward: {
        agency: "broward",
        icon_filename: "broward_100px.png",
        selection_class: ""
    },
    miami: {
        agency: "miami",
        icon_filename: "miami_dade_100px.png",
        selection_class: ""
    },
    palm: {
        agency: "palm",
        icon_filename: "palm_100px.png",
        selection_class: ""
    }
});