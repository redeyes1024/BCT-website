var BCTAppValues = angular.module('BCTAppValues', []);

//For later use with real-time data
//BCTAppValues.value('scheduleWebSocket',
//new WebSocket("ws://echo.websocket.org"));

//TODO: When paths are finalized, break into smaller lines
BCTAppValues.value('svg_icon_paths', {

    //Path derived from Openclipart.org, found off the clipartist.info site
    //http://clipartist.info/openclipart.org/SVG/
    walking: "m 36.755043,67.587975 c -0.685125,-0.808811 -1.370251,-1.617622 -2.055376,-2.426433 -0.32315,-1.830325 -0.586032,-3.672227 -1.021733,-5.480517 -0.0375,-0.328957 -0.383897,-1.082752 0.158199,-0.618477 0.55848,0.281985 0.643513,1.020014 0.991926,1.504959 0.216685,0.576932 0.785275,1.527236 1.452794,0.851272 0.35316,-0.411344 -0.02028,-0.863533 -0.206714,-1.248639 -0.310168,-0.584073 -0.609065,-1.174686 -0.926224,-1.754702 -0.362439,-0.363652 -0.863048,-0.550254 -1.294862,-0.823706 -0.523645,-0.279984 -1.018783,-0.619588 -1.564014,-0.854511 -0.833398,-0.281571 -1.683038,0.351337 -1.960411,1.120947 -0.377376,0.759531 -0.754752,1.519062 -1.132127,2.278593 -0.685176,0.146972 -1.384782,0.241359 -2.059986,0.424657 -0.641089,0.293374 -0.326674,1.390404 0.398936,1.210114 0.773007,-0.160991 1.556412,-0.283274 2.322746,-0.469104 0.390571,-0.150369 0.460045,-0.61495 0.661061,-0.93893 0.09002,-0.181165 0.180043,-0.362331 0.270064,-0.543497 0.136046,0.644334 0.272212,1.288643 0.4081,1.93301 -0.666082,0.724598 -1.375951,1.41418 -2.011465,2.163792 -0.19107,0.399331 -0.07712,0.858654 -0.108182,1.28743 0.01013,1.081772 -0.0205,2.166137 0.01576,3.246249 0.09596,0.613312 0.977813,0.83367 1.348694,0.33428 0.28911,-0.380054 0.139146,-0.881038 0.176602,-1.322758 0,-0.832832 0,-1.665664 0,-2.498496 0.629663,-0.65985 1.255999,-1.322868 1.885995,-1.9824 0.155123,0.81125 0.252506,1.63727 0.446627,2.43874 0.348117,0.550808 0.834715,1.007358 1.236625,1.521385 0.505086,0.579328 0.978045,1.189736 1.503321,1.749594 0.486816,0.430691 1.334147,-0.02724 1.242998,-0.670563 -0.01275,-0.158273 -0.07666,-0.311271 -0.179355,-0.432289 z M 31.317255,56.315223 c 0.696207,0 1.263873,-0.565133 1.263873,-1.263873 0,-0.700006 -0.567666,-1.267672 -1.263873,-1.267672 -0.698739,0 -1.266406,0.567666 -1.266406,1.267672 0,0.698581 0.567509,1.263873 1.266406,1.263873 z",

    //Path derived from Font-Awesome icon pack SVG source
    //http://fortawesome.github.io/Font-Awesome/
    bus: "m 0.06370115,24.346545 c 0,1.775805 0,3.55161 0,5.327417 0.37695395,2e-6 0.75390757,-1e-6 1.13086125,1e-6 0.044437,0.585789 -0.1273212,1.225868 0.1863604,1.756203 0.4481089,0.750874 1.6937176,0.628467 1.9925357,-0.191332 0.1510186,-0.505059 0.056148,-1.043689 0.082825,-1.564871 2.2617218,0 4.5234437,0 6.7851665,0 0.04444,0.585789 -0.127324,1.225868 0.186359,1.756203 0.448109,0.750874 1.693718,0.628467 1.992535,-0.191332 0.15102,-0.505059 0.05614,-1.043689 0.08283,-1.564871 0.376957,1e-6 0.753909,-1e-6 1.130864,0 -0.01186,-1.981555 0.02525,-3.964247 -0.02159,-5.944995 C 13.481829,22.331548 13.068065,20.981996 12.78573,19.610776 12.631817,19.0332 12.567571,18.42586 12.344778,17.872117 11.690725,16.85783 10.404718,16.534102 9.2931645,16.306554 7.2365974,15.977753 5.0772508,16.002935 3.0837476,16.649628 2.243562,16.952502 1.2572201,17.494443 1.1663809,18.487245 0.83047891,20.017788 0.42134603,21.533935 0.14308667,23.075844 0.087647,23.496959 0.0637434,23.921906 0.06371182,24.346545 z M 3.5976435,17.941278 c 0.042896,-0.557063 0.6668915,-0.402451 1.0496334,-0.424073 1.6762478,-1e-6 3.3524962,0 5.0287446,0 0.3756415,-0.0048 0.4530505,0.270584 0.4527835,0.469747 -3.17e-4,0.234481 -0.1938266,0.391204 -0.8281214,0.378398 -1.7596554,0 -3.5193113,0 -5.278968,0 C 3.79511,18.37415 3.5888718,18.167883 3.5976435,17.941278 z m -1.9966773,5.406927 c 0.2250551,-1.162349 0.4228279,-2.331317 0.6650982,-3.489487 0.2178927,-0.520799 0.8388074,-0.324291 1.2782804,-0.362505 2.4859868,0.0053 4.9728386,-0.01066 7.4582862,0.008 0.565415,0.124919 0.479988,0.793503 0.604055,1.230211 0.161748,0.914727 0.361909,1.82455 0.49892,2.742437 -0.02291,0.572155 -0.643446,0.567059 -1.065882,0.542791 -2.9607206,0 -5.9214411,0 -8.8821625,0 C 1.8132728,24.034962 1.5294139,23.68105 1.6009662,23.348203 z M 1.1945624,26.846809 C 1.1421029,25.930749 2.3628086,25.351486 3.0400119,25.969607 3.7844428,26.51115 3.4591978,27.820905 2.5509887,27.956964 1.8739823,28.112477 1.1716178,27.54303 1.1945624,26.846809 z m 9.0468886,0 c -0.05245,-0.91606 1.168246,-1.495323 1.845449,-0.877202 0.744433,0.541543 0.419186,1.851298 -0.489021,1.987357 -0.677009,0.155513 -1.379373,-0.413934 -1.356428,-1.110155 z",

    //Provisional flag icon made in-house
    dest: "M 0.4375 0.375 L 0.4375 8.75 L 0.4375 15.5 L 0.8125 15.5 L 0.8125 8.75 L 15.59375 8.75 L 15.59375 0.375 L 0.8125 0.375 L 0.4375 0.375 z"

});

BCTAppValues.value('default_demo_coords', {
    LatLng: {
        Latitude: 25.977301,
        Longitude: -80.12027
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
            "schedule."
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
            desc: "Indicates that a page or module is currently loading."
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