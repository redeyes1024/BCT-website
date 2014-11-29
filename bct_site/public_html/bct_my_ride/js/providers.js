var BCTAppProviders = angular.module('BCTAppProviders', []);

BCTAppProviders.provider('scrolling_animation_constants', [ function() {

    var return_obj = {};

    return_obj.message_display_time = 4000;
    return_obj.message_transition_out_time = 500;

    return_obj.keyframes = {

        hidden_left: "alert-header-message-hidden-left",
        hidden_right: "alert-header-message-hidden-right",
        hidden_no_transition: "alert-header-message-hidden-no-transition"

    };

    return_obj.keyframe_setups = {

        displayed_in_middle: {

            hidden_right: false,
            hidden_left: false,
            hidden_no_transition: false

        },

        hidden_on_left: {

            hidden_right: false,
            hidden_left: true,
            hidden_no_transition: false

        },

        hidden_on_right: {

            hidden_right: true,
            hidden_left: false,
            hidden_no_transition: false

        },

        hidden_on_right_no_transition: {

            hidden_right: true,
            hidden_left: false,
            hidden_no_transition: true

        },

        hidden_on_left_no_transition: {

            hidden_right: false,
            hidden_left: true,
            hidden_no_transition: true

        }

    };

    /*
        animation_configs
    
        These arrays of configuration objects are used to create a simple
        list of animation 'frames' for each direction (forward and reverse)
        Frame counts are calculated and set below
    */
    return_obj.animation_configs = [

        [

            {

                keyframe_setup_name: "displayed_in_middle",
                duration: return_obj.message_display_time,
                number_of_frames: 0

            },

            {

                keyframe_setup_name: "hidden_on_left",
                duration: return_obj.message_transition_out_time,
                number_of_frames: 0

            },

            {

                keyframe_setup_name: "hidden_on_right_no_transition",
                duration: return_obj.message_transition_out_time,
                number_of_frames: 0

            }

        ],

        [

            {

                keyframe_setup_name: "displayed_in_middle",
                duration: return_obj.message_display_time,
                number_of_frames: 0

            },

            {

                keyframe_setup_name: "hidden_on_right",
                duration: return_obj.message_transition_out_time,
                number_of_frames: 0

            },

            {

                keyframe_setup_name: "hidden_on_left_no_transition",
                duration: return_obj.message_transition_out_time,
                number_of_frames: 0

            }

        ]

    ];

    return {
        "$get": function() { return return_obj; }
    };

}]);

BCTAppProviders.provider('legend_icon_list', function() {

    var provider = {};

    provider.$get = [ 'agency_filter_icons' , function(agency_filter_icons) {

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

    }];

    return provider;

});