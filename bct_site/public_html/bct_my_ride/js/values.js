var BCTAppValues = angular.module('BCTAppValues', []);

//For later use with real-time data
BCTAppValues.value('scheduleWebSocket',
new WebSocket("ws://echo.websocket.org"));

BCTAppValues.value('all_alerts_indices', {

    global: {
        "1": 0,
        "2": 1
    },

    schedule_map: {
        "1": 0,
        "2": 1
    }

});

BCTAppValues.value('all_alerts', {
    
    global: [
        "The first alert",
        "The second alert",
        "The third alert",
        "The fourth alert"
    ],

    schedule_map: [
        "The first route alert",
        "The second route alert"
    ]

});


BCTAppValues.value('legend_icon_list', [

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
            desc: "Displays trip planner options. Here you can configure " +
            "your trip for transit types, set your arrival/departure times, " +
            "and optimize it for time, fares or transfers."
        }
    },
    {
        fa_name: "",
        filename: "walk.png",
        legend: {
            module: "Trip Planner",
            desc: "Indicates a walking portion of a Trip Planner result."
        }
    },
    {
        fa_name: "",
        filename: "bus.png",
        legend: {
            module: "Trip Planner",
            desc: "Indicates a bussing portion of a Trip Planner result."
        }
    },
    {
        fa_name: "fa-search",
        filename: "",
        legend: {
            module: "Sched. Search",
            desc: "Submits search for bus stops and routes. Alternatively, " +
            "you can press enter while focused on the search input box."
        }
    },
    {
        fa_name: "fa-list-alt",
        filename: "",
        legend: {
            module: "Sched. Search",
            desc: "Displays all routes on the Schedule Results page. You " +
            "can also submit the phrase 'all routes' from the search bar."
        }
    },
    {
        fa_name: "fa-times-circle",
        filename: "",
        legend: {
            module: "Sched. Search",
            desc: "Clears search input for bus stops and routes. Also clears " +
            "previous search results."
        }
    },
    {
        fa_name: "",
        filename: "broward_100px.png",
        legend: {
            module: "Sched. Search",
            desc: "Filters bus stop and route results depending on the "+
            "selected transit agency."
        }
    },
    {
        fa_name: "fa-plus-circle",
        filename: "",
        legend: {
            module: "Sched. Results",
            desc: "Opens a panel containing all associated stops (when " +
            "a route is selected) or routes (when a stop is selected), as " +
            "well as display and other options."
        }
    },
    {
        fa_name: "fa-star-o",
        filename: "",
        legend: {
            module: "Sched. Results",
            desc: "Adds a route/stop combination to your favorites on My BCT."
        }
    },
    {
        fa_name: "fa-map-marker",
        filename: "",
        legend: {
            module: "Sched. Results",
            desc: "Adds the GPS coordinates of the current stop to the " +
            "'start' field of the trip planner."
        }
    },
    {
        fa_name: "fa-chevron-right",
        filename: "",
        legend: {
            module: "Sched. Search",
            desc: "Goes to the Map Schedule, which contains a schedule and " +
            "interactive map for the selected route/stop combination. It " +
            "also contains an option to view the full weekly schedule."
        }
    },
    {
        fa_name: "fa-calendar",
        filename: "",
        legend: {
            module: "Map Schedule",
            desc: "Opens the full schedule view. There you can view the full " +
            "weekly schedule or a schedule for a future date of your choice."
        }
    },
    {
        fa_name: "fa-file-pdf-o",
        filename: "",
        legend: {
            module: "Full Schedule",
            desc: "Downloads a PDF of the current full schedule."
        }
    },
    {
        fa_name: "fa-times",
        filename: "",
        legend: {
            module: "Full Schedule",
            desc: "Closes the full schedule view and returns to the Map " +
            "schedule"
        }
    },
    {
        fa_name: "fa-crosshairs",
        filename: "",
        legend: {
            module: "Variable",
            desc: "Retrieve current location and use with associated " +
            "module. Rotation indicates the associated module is loading " +
            "location data or awaiting user location sharing confirmation."
        }
    },
    {
        fa_name: "fa-spinner",
        filename: "",
        legend: {
            module: "Variable",
            desc: "Indicates that a page or module is currently loading. " +
            "This icon rotates in all loading cases."
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