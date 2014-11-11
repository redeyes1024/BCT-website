var BCTAppValues = angular.module('BCTAppValues', []);

//For later use with real-time data
//BCTAppValues.value('scheduleWebSocket',
//new WebSocket("ws://echo.websocket.org"));

BCTAppValues.value('map_zoom_span_breakpoints', [

    {
        needed_zoom: 16,
        manual_breakpoint: null
    },

    {
        needed_zoom: 15,
        manual_breakpoint: null
    },

    {
        needed_zoom: 14,
        manual_breakpoint: null
    },

    {
        needed_zoom: 13,
        manual_breakpoint: null
    },

    {
        needed_zoom: 12,
        manual_breakpoint: null
    },

    {
        needed_zoom: 11,
        manual_breakpoint: null
    },

    {
        needed_zoom: 10,
        manual_breakpoint: null
    },

    {
        needed_zoom: 9,
        manual_breakpoint: null
    }

]);

BCTAppValues.value('clusterer_options', {

    styles: [

        {
            url: window.myride.directories.site_roots.active +
            window.myride.directories.paths.active +
            'css/ico/' +
            "button_green.svg",
            width: 50,
            height: 50,
            textColor: "#FFFFFF",
            textSize: 18
        },

        {
            url: window.myride.directories.site_roots.active +
            window.myride.directories.paths.active +
            'css/ico/' +
            "button_yellow.svg",
            width: 50,
            height: 50,
            textColor: "#FFFFFF",
            textSize: 16
        },

        {
            url: window.myride.directories.site_roots.active +
            window.myride.directories.paths.active +
            'css/ico/' +
            "button_red.svg",
            width: 50,
            height: 50,
            textColor: "#FFFFFF",
            textSize: 14
        }

    ],

    maxZoom: 14

});

BCTAppValues.value('map_palette', {

    colors: {
        blue: "#017AC2",
        red: "#C14E4E",
        black: "#000000"
    },

    weights: {

        markers: {
            thick: 8,
            mid: 7,
            thin: 6
        },

        lines: {
            thick: 5,
            mid: 4,
            thin: 3
        }

    },

    scales: {

        markers: {
            big: 10,
            mid: 5,
            small: 3
        }

    }

});

BCTAppValues.value('nearest_map_stops_instructions', {

    default: "Select anywhere on the map to set the location pin.",

    clicked: "Select a stop or drag the location pin to a different " +
    "location on the map.",

    selected: ""

});

BCTAppValues.value('full_schedule_availabilities', {

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

});

BCTAppValues.value('recently_viewed_items', {

    schedule_map: [],
    trip_planner: []

});

BCTAppValues.value('full_schedule_category_with_datepicker', [

    {

        id: "full-schedule-accordion-choose-date",
        title: "Choose Date",
        hours: []

    }

]);

BCTAppValues.value('full_schedule_categories', [

    {
        id: "full-schedule-accordion-weekdays",
        title: "Weekdays",
        hours: {}

    },

    {

        id: "full-schedule-accordion-choose-saturday",
        title: "Saturday",
        hours: {}

    },

    {

        id: "full-schedule-accordion-choose-sunday",
        title: "Sunday",
        hours: {}

    }

]);

BCTAppValues.value('base_marker_sizes', {

    scaling_weight: 16,

    default: {
        scale: 7,
        strokeWeight: 2
    },

    mouseover: {
        scale: 11,
        strokeWeight: 3
    }

});

BCTAppValues.value('favorites_data', {

    obj: {},
    arr: []

});

BCTAppValues.value('selected_nearest_map_stop', {

    stop_id: ""

});

BCTAppValues.value('nearest_map_stop_distances', {

    stop_dists: []

});

BCTAppValues.value('marker_click_memory', {

    nearest: ""

});

BCTAppValues.value('out_of_region_cutoff_coords', {

    lat: {
        max: 27,
        min: 25
    },

    lng: {
        max: -80.0,
        min: -80.5
    }

});

BCTAppValues.value('marker_icon_options', {

    schedule_map: {

        default: {
            path: google.maps.SymbolPath.CIRCLE,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
            scale: 8,
            fillColor: "",
            fillOpacity: 1
        },

        mouseover: {
            path: google.maps.SymbolPath.CIRCLE,
            strokeWeight: 4,
            strokeColor: "#FFFFFF",
            scale: 12,
            fillColor: "",
            fillOpacity: 1
        }

    }

});

BCTAppValues.value('trip_planner_constants', {

    trip_duration_cutoff_hours: 4,
    trip_walking_cutoff_meters: 2000

});

BCTAppValues.value('map_clusterer', {

    clusterer: {}

});
BCTAppValues.value('warning_messages', {

    main_search: {

        search_too_short:
            'Enter a search term with at least 3 characters. ' +
            'For example, if you are searching for “BCT Route 10” ' +
            'enter "BCT10" instead of "10"',

        no_results:
            'Sorry, there are no results for your entry. Check spelling ' +
            'or broaden your search by entering fewer characters.'

    },

    schedule_map: {

        no_error_data:
        "Schedule Map error: Problem communicating with server.",

        stop_seeker:
        "There was a problem with the Stop Seeker. Please try again later.",

        main_schedule:
        "There was a problem downloading the main schedule. " +
        "Please try again later."

    },

    full_schedule: {

        no_error_data:
        "Full Schedule error: Problem communicating with server."

    },

    trip_planner: {

        no_error_data: "There was a problem retrieving your trip plan. " +
        "Please try again later.",

        TRIP_PLANNER_ERROR_TEXT_NO_PLAN_FOUND: "No trip plan found.",

        departure_time_passed: "Please try setting a later departure time.",

        all_trips_filtered_out: "No suitable trip plans found. " +
        "Please try different trip planner settings."

    },

    geocoder: {
        
        not_found:
        "Location not found.",

        over_request_limit:
        "Application Busy. Try again."

    }

});

//TODO: When paths are finalized, break into smaller lines
BCTAppValues.value('svg_icon_paths', {

    //Path derived from Openclipart.org, found off the clipartist.info site
    //http://clipartist.info/openclipart.org/SVG/
    walking: "m 26.975839,67.587975 c 0.685125,-0.808811 1.370251,-1.617622 2.055376,-2.426433 0.32315,-1.830325 0.586032,-3.672227 1.021733,-5.480517 0.0375,-0.328957 0.383897,-1.082752 -0.158199,-0.618477 -0.55848,0.281985 -0.643513,1.020014 -0.991926,1.504959 -0.216685,0.576932 -0.785275,1.527236 -1.452794,0.851272 -0.35316,-0.411344 0.02028,-0.863533 0.206714,-1.248639 0.310168,-0.584073 0.609065,-1.174686 0.926224,-1.754702 0.362439,-0.363652 0.863048,-0.550254 1.294862,-0.823706 0.523645,-0.279984 1.018783,-0.619588 1.564014,-0.854511 0.833398,-0.281571 1.683038,0.351337 1.960411,1.120947 0.377376,0.759531 0.754752,1.519062 1.132127,2.278593 0.685176,0.146972 1.384782,0.241359 2.059986,0.424657 0.641089,0.293374 0.326674,1.390404 -0.398936,1.210114 -0.773007,-0.160991 -1.556412,-0.283274 -2.322746,-0.469104 -0.390571,-0.150369 -0.460045,-0.61495 -0.661061,-0.93893 -0.09002,-0.181165 -0.180043,-0.362331 -0.270064,-0.543497 -0.136046,0.644334 -0.272212,1.288643 -0.4081,1.93301 0.666082,0.724598 1.375951,1.41418 2.011465,2.163792 0.19107,0.399331 0.07712,0.858654 0.108182,1.28743 -0.01013,1.081772 0.0205,2.166137 -0.01576,3.246249 -0.09596,0.613312 -0.977813,0.83367 -1.348694,0.33428 -0.28911,-0.380054 -0.139146,-0.881038 -0.176602,-1.322758 0,-0.832832 0,-1.665664 0,-2.498496 -0.629663,-0.65985 -1.255999,-1.322868 -1.885995,-1.9824 -0.155123,0.81125 -0.252506,1.63727 -0.446627,2.43874 -0.348117,0.550808 -0.834715,1.007358 -1.236625,1.521385 -0.505086,0.579328 -0.978045,1.189736 -1.503321,1.749594 -0.486816,0.430691 -1.334147,-0.02724 -1.242998,-0.670563 0.01275,-0.158273 0.07666,-0.311271 0.179355,-0.432289 z m 5.437788,-11.272752 c -0.696207,0 -1.263873,-0.565133 -1.263873,-1.263873 0,-0.700006 0.567666,-1.267672 1.263873,-1.267672 0.698739,0 1.266406,0.567666 1.266406,1.267672 0,0.698581 -0.567509,1.263873 -1.266406,1.263873 z",
    //Path modified from Font-Awesome icon pack SVG source
    //http://fortawesome.github.io/Font-Awesome/
    bus: "m 0.06970115,29.673962 c 0.41549423,0 0.83098845,1e-6 1.24648265,1e-6 0.043684,0.706498 -0.2158895,1.625549 0.5632843,2.087625 0.9254031,0.540081 1.9850764,-0.178987 1.9327331,-1.102418 0.00182,-0.676887 -0.017715,-1.011459 0.4141664,-0.985207 2.3538916,0 4.3979412,0.01289 6.7518334,0.01289 0.684495,0.01044 0.01661,1.579514 0.873125,2.074736 0.593945,0.274917 1.886027,0.395545 1.877875,-1.102418 0.03804,-0.56627 -0.08662,-1.065807 0.553375,-1.071144 0.01126,-0.0046 0.19728,-0.0036 0.744345,-0.007 -0.01691,-3.672517 0.05477,-7.611895 -0.269295,-10.771311 -0.183333,-1.78173 -2.53064,-2.04178 -3.573756,-2.30523 C 8.745545,15.956 6.1328814,15.940568 3.7086959,16.562756 2.6723017,16.841258 0.56130684,17.082629 0.46595712,18.422064 0.21579251,22.675599 0.07502422,25.043632 0.06970115,29.673962 z M 5.5391307,17.216783 c 1.5392306,0.0061 3.0794544,-0.0093 4.6183803,0.0035 0.863263,0.0092 0.972708,0.175791 0.955832,0.424819 -0.01575,0.309443 -0.326491,0.409295 -1.047684,0.419867 -1.877756,0 -3.7555122,0 -5.6332684,0 -0.4200308,-0.07316 -0.4806322,-0.237784 -0.4672245,-0.400008 0.021908,-0.265073 0.2320533,-0.471453 1.5739646,-0.448178 z M 1.117382,19.791339 c 0.2182869,-1.092665 0.00555,-1.299016 0.7185471,-1.330483 1.0740086,8.93e-4 4.8065608,0.03192 5.8805753,0.031 1.4521957,-0.0012 4.3529626,-0.0039 5.8051296,0.006 0.770324,-0.05194 0.853753,1.79338 0.874785,2.591265 0.04236,1.606976 0.10932,2.406334 0.08471,3.115629 -0.05114,1.218801 0.05107,2.089454 -0.725509,2.130106 -4.0825014,0.05313 -8.2572558,0.04385 -12.2353932,0.0099 C 0.48812273,26.299606 0.85684305,24.252452 0.78479401,23.841899 0.86210931,22.47442 0.9721924,21.134185 1.117382,19.791339 z m 0.1991846,8.055293 C 1.229581,26.70291 3.200221,26.272848 3.6914382,27.34227 4.2240111,28.260048 3.0119041,29.389802 2.0040152,28.857442 1.5946647,28.668954 1.2976128,28.270172 1.3165666,27.846632 z m 9.9714774,0 c -0.08698,-1.143719 1.883652,-1.573785 2.374871,-0.504362 0.532574,0.917779 -0.679534,2.047533 -1.687423,1.515172 -0.409351,-0.188488 -0.706403,-0.58727 -0.687448,-1.01081 z",

    //Flag icon made in-house
    dest: "m 2.887,1.072 0.012,14.002 c -10e-4,0.172 -0.181,0.313 -0.405,0.315 l 0,0 c -0.221,0 -0.403,-0.144 -0.404,-0.315 L 2.079,1.072 M 3.15,1.126 c 0,0 2.37,-0.25 4.208,0.334 1.839,0.583 4.738,0.486 5.839,0.232 0.005,3.91 0.005,7.188 0.005,7.188 0,0 -2.159,0.683 -3.902,0.101 C 7.557,8.401 4.087,7.726 3.159,8.168 3.157,6.008 3.15,1.126 3.15,1.126 z"

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

        "This is the first test alert for routes. This alert is short.",

        "This is the second test alert for routes. This alert is longer, to " +
        "test different ways to display longer alert text. Lorem ipsum dolor " +
        "sit amet."

    ]

});

BCTAppValues.value('agency_filter_icons', {

    broward: {
        agency: "broward",
        icon_filename: "bct_logo.svg",
        selection_class: "",
        name: "Broward County"
    },

    miami: {
        agency: "miami",
        icon_filename: "miami_dade_logo.svg",
        selection_class: "",
        name: "Miami-Dade"
    },

    palm: {
        agency: "palm",
        icon_filename: "palm_tran_logo.svg",
        selection_class: "",
        name: "Palm Beach"
    }

});

BCTAppValues.provider('legend_icon_list',

function() {

    var provider = {};

    provider.$get = function(agency_filter_icons) {

        return [

            {
                fa_name: "fa-chevron-left",
                filename: "",
                legend: {
                    module: "Top Alerts",
                    desc: "View global alerts in reverse order and skip to " +
                    "the previous global alert in the list."
                }
            },

            {
                fa_name: "fa-chevron-right",
                filename: "",
                legend: {
                    module: "Top Alerts",
                    desc: "View global alerts in forward order and skip to " +
                    "the next global alert in the list."
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
                    desc: "Displays trip planner options. Here you can " +
                    "configure your trip for transit types, set your " +
                    "arrival/departure times, and optimize it for time, " +
                    "fares or transfers."
                }
            },

            {
                fa_name: "",
                filename: "walking.svg",
                legend: {
                    module: "Trip Planner",
                    desc: "Indicates a walking portion of a Trip Planner " +
                    "result."
                }
            },

            {
                fa_name: "",
                filename: "fa_bus.svg",
                legend: {
                    module: "Trip Planner",
                    desc: "Indicates a bussing portion of a Trip Planner " +
                    "result."
                }
            },

            {
                fa_name: "",
                filename: "solid_flag_2_plain.svg",
                legend: {
                    module: "Trip Planner",
                    desc: "Indicates the destination of a Trip Planner result."
                }
            },

            {
                fa_name: "fa-search",
                filename: "",
                legend: {
                    module: "Sched. Search",
                    desc: "Submits search for bus stops and routes. " +
                    "Alternatively, you can press enter while focused on " +
                    "the search input box."
                }
            },

            {
                fa_name: "fa-list-alt",
                filename: "",
                legend: {
                    module: "Sched. Search",
                    desc: "Displays all routes on the Schedule Results page. " +
                    "You can also submit the phrase 'all routes' from the " +
                    "search bar."
                }
            },

            {
                fa_name: "fa-times-circle",
                filename: "",
                legend: {
                    module: "Sched. Search",
                    desc: "Clears search input for bus stops and routes. " +
                    "Also clears previous search results."
                }
            },

            {
                fa_name: "",
                filename: agency_filter_icons.broward.icon_filename,
                legend: {
                    module: "Sched. Search",
                    desc: "Filters bus stop and route results depending on " +
                    "the selected transit agency."
                }
            },

            {
                fa_name: "fa-plus-circle",
                filename: "",
                legend: {
                    module: "Sched. Results",
                    desc: "Opens a panel containing all associated stops " +
                    "(when a route is selected) or routes (when a stop is " +
                    "selected), as well as display and other options."
                }
            },

            {
                fa_name: "fa-star-o",
                filename: "",
                legend: {
                    module: "Sched. Results",
                    desc: "Adds a route/stop combination to your favorites " +
                    "on My BCT."
                }
            },

            {
                fa_name: "fa-map-marker",
                filename: "",
                legend: {
                    module: "Sched. Results",
                    desc: "Adds the GPS coordinates of the current stop " +
                    "to the 'start' field of the trip planner."
                }
            },

            {
                fa_name: "fa-chevron-right",
                filename: "",
                legend: {
                    module: "Sched. Search",
                    desc: "Goes to the Map Schedule, which contains a " +
                    "schedule and interactive map for the selected " +
                    "route/stop combination. It also contains an option to " +
                    "view the full weekly schedule."
                }
            },

            {
                fa_name: "fa-exclamation-circle",
                filename: "",
                legend: {
                    module: "Map Schedule",
                    desc: "View alerts associated with the currently " +
                    "viewed route."
                }
            },

            {
                fa_name: "",
                filename: "button_yellow.svg",
                legend: {
                    module: "Map Schedule",
                    desc: "A map marker cluster. Represents the " +
                    "indicated number of stops. Stop markers become visible " +
                    "again when zoomed in sufficiently."
                }
            },

            {
                fa_name: "fa-calendar",
                filename: "",
                legend: {
                    module: "Map Schedule",
                    desc: "Opens the full schedule view. There you can view " +
                    "the full weekly schedule or a schedule for a future " +
                    "date of your choice."
                }
            },

            {
                fa_name: "",
                filename: "fa_bus.svg",
                legend: {
                    module: "Map Schedule",
                    desc: "Select a different route going through the " +
                    "clicked stop. The ID of the alternate route is embedded " +
                    "in this icon. The larger, yellow icon indicates the " +
                    "currently viewed route."
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
                    desc: "Closes the full schedule view and returns to " +
                    "the Map schedule."
                }
            },

            {
                fa_name: "fa-crosshairs",
                filename: "",
                legend: {
                    module: "Variable",
                    desc: "Retrieve current location and use with " +
                    "associated module. Rotation indicates the associated " +
                    "module is loading location data or awaiting user " +
                    "location sharing confirmation."
                }
            },

            {
                fa_name: "fa-spinner",
                filename: "",
                legend: {
                    module: "Variable",
                    desc: "Indicates that a page or module is currently " +
                    "loading."
                }
            }


        ];

    };

    return provider;

});

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

        regular_icon: "show_nearest_bstops_location_icon",
        spinning_icon: "show_nearest_bstops_location_icon_with_spin"

    },

    trip_planner: {

        regular_icon: "show_planner_location_icon",
        spinning_icon: "show_planner_location_icon_with_spin"

    },

    nearest_results_bstops: {

        regular_icon: "show_nearest_results_bstops_location_icon",
        spinning_icon: "show_nearest_results_bstops_location_icon_with_spin"

    }

});

BCTAppValues.value('bct_routes_alt_names', {

    "US1 Breeze": "101",
    "University Breeze": "102",
    "441 Breeze": "441"

});

BCTAppValues.value('full_bstop_data', {

    list: [],
    dict: {}

});

BCTAppValues.value('full_route_data', {

    list: [],
    dict: {}

});

BCTAppValues.value('full_landmark_data', {

    orig: [],
    list: []

});