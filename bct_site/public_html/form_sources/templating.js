//Container for all base HTML template strings
ISR.templates = {};

ISR.templates.login_form = {};

ISR.templates.profile_page = {};

ISR.templates.profile_page["favorite-route-stop-panel"] = '' +

    '<div class="favorite-route-stop-panel">' +

        '<div class="favorite-route-stop-panel-property-container">' +

            '<span class="favorite-route-stop-panel-property ' +
            'favorite-route-stop-panel-agency">' +

                '<span class="favorite-route-stop-panel-property-name">' +
                    'Agency:' +
                '</span>' +

                '<span class="favorite-route-stop-panel-property-content">' +
                    '{{ ROUTE_STOP_PANEL_AGENCY }}' +
                '</span>' +

            '</span>' +

            '<span class="favorite-route-stop-panel-property ' +
            'favorite-route-stop-panel-route">' +

                '<span class="favorite-route-stop-panel-property-name">' +
                    'Route:' +
                '</span>' +

                '<span class="favorite-route-stop-panel-property-content">' +
                    '{{ ROUTE_STOP_PANEL_ROUTE }}' +
                '</span>' +

            '</span>' +

            '<span class="favorite-route-stop-panel-property ' +
            'favorite-route-stop-panel-stop">' +

                '<span class="favorite-route-stop-panel-property-name">' +
                    'Stop:' +
                '</span>' +

                '<span class="favorite-route-stop-panel-property-content">' +
                    '{{ ROUTE_STOP_PANEL_STOP }}' +
                '</span>' +

            '</span>' +

        '</div>' +

        '<span class="favorite-route-stop-panel-property ' +
        'favorite-route-stop-panel-myride-link">' +

            '<a href="#" onclick="ISR.utils.goToMyRideSchedule(' +
                '\'{{ ROUTE_STOP_PANEL_ROUTE }}\', ' + 
                '\'{{ ROUTE_STOP_PANEL_STOP }}\'' +
            ');">' + 
                'Search for stop in My Ride' +
            '</a>' +

        '</span>' +

        '<span class="favorite-route-stop-panel-delete-button ' +
        'link-icon no-highlight ptr"' + 
        'onclick="ISR.utils.deleteFavoriteRouteStop(' +
            '\'{{ ROUTE_STOP_PANEL_ROUTE }}\', ' + 
            '\'{{ ROUTE_STOP_PANEL_STOP }}\', ' +
            'this' +
        ');">' + 

            '<i class="fa fa-times-circle"></i>' +

        '</span>' +

    '</div>';

ISR.templates.profile_page["alerts-container-all-date-ranges"] = '' +

    '<div class="alerts-container-row alerts-container-time-range ' +
    'alerts-container-time-range-deselected">' +

        '<div class="alerts-container-radio-button">' +

            '<input type="radio" name="alerts_time_range_type"' + 
            'onchange="ISR.utils.highlightselectedtimerange(this);">' +

        '</div>' +

        '<div class="alerts-container-time-range-content ' +
        'alerts-container-time-range-type-label">' +

            '{{ ALERT_DAY_OF_WEEK }}' +

        '</div>' +

        '<div class="alerts-container-time-range-content ' +
        'alerts-container-time-range-start">' +

            '<span class="alerts-container-time-range-label">' +

                'Time 1' +

            '</span>' +

            '<span class="alerts-container-time-range-times">' +

                '{{ ALERT_START_TIME_RANGE }}' +

            '</span>' +

            '-' +

            '<span class="alerts-container-time-range-times">' +

                '{{ ALERT_END_TIME_RANGE }}' +

            '</span>' +

        '</div>' +

        '<div class="alerts-container-time-range-content ' +
        'alerts-container-time-range-end">' +

            '<span class="alerts-container-time-range-label">' +

                'Time 2' +

            '</span>' +

            '<span class="alerts-container-time-range-times">' +

                '{{ ALERT_START_TIME_RANGE }}' +

            '</span>' +

            '-' +

            '<span class="alerts-container-time-range-times">' +

                '{{ ALERT_END_TIME_RANGE }}' +

            '</span>' +

        '</div>' +

    '</div>';

ISR.templates.profile_page["bct-drop-down-item"] = '' +

    '<span class="bct-drop-down-item" ' +
    'onclick="ISR.utils.selectDropDownOption(this);">' +

        '<span class="bct-drop-down-item-text">{{ TIME_LABEL }}</span>' +

    '</span>';

ISR.templates.profile_page["alert-time-selection"] = '' +

    '<span class="bct-drop-down bct-time-drop-down no-hightlight ptr">' +

        '<span class="bct-drop-down-selected-item no-highlight ptr">' +

            '{{ SELECTED_TIME }}' +

        '</span>' +

        '<span class="bct-drop-down-item-holder-container">' +

            '<span class="bct-drop-down-item-holder no-highlight ptr">' +

                '{{ TIME_DROP_DOWN_ITEMS }}' +

            '</span>' +

        '</span>' +

    '</span>';

ISR.templates.profile_page["favorites-full-item-full-date-time"] = '' +

    '<div class="favorites-full-item-full-date-time">' +

        '<div class="favorites-alert-start-time">' +

            '{{ FAVORITES_ALERT_START_TIME }}' +

        '</div>' +

        '<div class="favorites-alert-end-time">' +

            '{{ FAVORITES_ALERT_END_TIME }}' +

        '</div>' +

    '</div>';

//Constants associated with templates
ISR.templates.data = {};

//Associate template data object with each template
(function() {

    for (template_group_name in ISR.templates) {

        if (template_group_name === "data") { continue; }

        var template_group_data = ISR.templates.data[template_group_name] = {};

        var template_group = ISR.templates[template_group_name];

        for (template_name in template_group) {

            template_group_data[template_name] = {};

        }

    }

}());

/*

    Favorite route/stop combinations should be added to this array
    It currently contains three demo favorites.

    The format for addition of new favorites is as follows:

    {
        agency: "<agency_name>",
        route: "<route_number> <route_name>",
        stop: "<stop_number> <stop_name>"
    }

    In this version, the property strings must be concatenated beforehand.

*/

(function() {

    try {
        var favorites_list = JSON.parse(localStorage.my_bct_fav);
    }

    catch(e) {

        ISR.templates.data.
        profile_page["favorite-route-stop-panel"].favorites_list = [];

        return true;

    }

    var formatted_favorites_list = [];

    for (var i=0;i<favorites_list.length;i++) {

        var agency = favorites_list[i].agency;
        var route_id = favorites_list[i].fav_route.Id;
        var stop_id = favorites_list[i].fav_stop.Id;

        var formatted_favorite_item = {

            agency: agency,
            route: route_id,
            stop: stop_id

        };

        formatted_favorites_list.push(formatted_favorite_item);

    }

    ISR.templates.data.
    profile_page["favorite-route-stop-panel"].favorites_list =
    formatted_favorites_list;

}());

//TODO: Combine days and times into one data structure
//Each day should contain a reference to the time array
ISR.templates.data.
profile_page["alerts-container-all-date-ranges"].day_list = [

    "Full week", "Weekdays", "Weekends"

];

ISR.templates.data.
profile_page["alerts-container-all-date-ranges"].time_list = [

    "5:00", "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00"

];

ISR.utils.generateAlertDateTimeBarHTML = function(target) {

    var date_time_bar_template =
    ISR.utils.templating.generateAlertFullDateTimeSelector();

    target.parentNode.childNodes[3].innerHTML += date_time_bar_template;

};

ISR.utils.addBusRouteStopAlert = function() {
    ISR.utils.generateAlertDateTimeBarHTML();
};

ISR.utils.addFavoriteRouteStopPanel = function(target) {

    var template_data = ISR.templates.data.
    profile_page["favorite-route-stop-panel"].favorites_list;

    for (var i=0;i<template_data.length;i++) {

        var date_time_bar_template =
        ISR.utils.templating.generateFavoriteRouteStopPanel(template_data[i]);

        target.innerHTML += date_time_bar_template;

    }

};

ISR.utils.addAlertDateRangeSelector = function(target) {

    var template_data = ISR.templates.data.
    profile_page["alerts-container-all-date-ranges"].day_list;

    for (var i=0;i<template_data.length;i++) {

        var date_time_bar_template =
        ISR.utils.templating.generateAlertDateRangeRow(template_data[i]);

        target.innerHTML += date_time_bar_template;

    }

};

//Template component generation
ISR.utils.templating = {};

/*
 
    N.B. The following closure defines a series of callbacks required for
    templating. The purpose of this closure is only to keep the global
    namespace clean, since the garbage collector will not free the memory 
    allocated to these functions; direct and indirect references to them are
    stored in the global ISR.utils.templating.placeholderPopulators.

    The callbacks can also be defined directly and anonymously in the
    placeholderPopulators property, but the current method allows for more
    cleanly seperated function definitions, and the names (though temporary),
    if well chosen, should self-document the purpose of each callback.
 
 */

(function() {

    /* START Favorite Route Panel */

    function getRouteStopPanelAgency(route_stop_panel_data) {
        return route_stop_panel_data.agency;
    }

    function getRouteStopPanelRoute(route_stop_panel_data) {
        return route_stop_panel_data.route;
    }

    function getRouteStopPanelStop(route_stop_panel_data) {
        return route_stop_panel_data.stop;
    }

    /* END Favorite Route Panel */

    function getTimeLabel(time_label) {
        return time_label;
    }

    function generateDropDownTimes() {

        var drop_down_item_list = [];

        var label_list = ISR.templates.data.
        profile_page["alerts-container-all-date-ranges"].time_list;

        for (var i=0;i<label_list.length;i++) {

            var drop_down_item = generateDropDownTimeItem(label_list[i]);

            drop_down_item_list.push(drop_down_item);

        }

        return drop_down_item_list.join("");

    }

    function getFirstTime(time_selection_list) {
        return ISR.templates.data.
        profile_page["alerts-container-all-date-ranges"].time_list[0];
    }

    function generateDropDownTimeItem(time_label) {
        return generateTemplateFromBase(
            ISR.templates.profile_page["bct-drop-down-item"],
            time_label
        );
    }

    function generateAlertTimeSelection(time_selection_list) {
        return generateTemplateFromBase(
            ISR.templates.profile_page["alert-time-selection"],
            time_selection_list
        );
    }

    function getAlertDay(alert_day_of_week) {
        return alert_day_of_week;
    };

    //These functions will be globally referenced because they are at the top
    //level of the template generator, and thus are called directly
    ISR.utils.templating.generateAlertFullDateTimeSelector = function() {

        return generateTemplateFromBase(
            ISR.templates.
            profile_page["favorites-full-item-full-date-time"],

            ISR.templates.data.
            profile_page["favorites-full-item-full-date-time"]
        );

    };

    ISR.utils.templating.generateFavoriteRouteStopPanel = function(
        current_panel_data
    ) {

        return generateTemplateFromBase(

            ISR.templates.
            profile_page["favorite-route-stop-panel"],

            current_panel_data

        );

    };

    ISR.utils.templating.generateAlertDateRangeRow = function(
        current_row_data
    ) {

        return generateTemplateFromBase(

            ISR.templates.
            profile_page["alerts-container-all-date-ranges"],

            current_row_data

        );

    };

    ISR.utils.templating.placeholderPopulators = {

        "{{ ROUTE_STOP_PANEL_AGENCY }}": getRouteStopPanelAgency,
        "{{ ROUTE_STOP_PANEL_ROUTE }}": getRouteStopPanelRoute,
        "{{ ROUTE_STOP_PANEL_STOP }}": getRouteStopPanelStop,

        "{{ ALERT_DAY_OF_WEEK }}": getAlertDay,
        "{{ ALERT_START_TIME_RANGE }}": generateAlertTimeSelection,
        "{{ ALERT_END_TIME_RANGE }}": generateAlertTimeSelection,
        "{{ TIME_LABEL }}": getTimeLabel,
        "{{ SELECTED_TIME }}": getFirstTime,
        "{{ TIME_DROP_DOWN_ITEMS }}": generateDropDownTimes

    };

    //Main templating function, where the above templating functions are passed
    //as callbacks. Some above functions' references to it prevent it from
    //being garbage collected, despite it being defined in this closure.
    function generateTemplateFromBase(
            base_template, placeholder_data
        ) {

        var template = base_template;

        var template_placeholders = base_template.match(/{{.*?}}/g);
        
        if (template_placeholders) {

            for (var i=0;i<template_placeholders.length;i++) {

                var populator =
                ISR.utils.templating.
                placeholderPopulators[template_placeholders[i]];

                template = template.replace(
                    template_placeholders[i],
                    populator(placeholder_data)
                );

            }

        }

        return template;

    }

}());

//Initial templating operations
ISR.utils.init.templating = {};

ISR.dom.post_templating = {};

ISR.utils.init.templating.addFavoriteRouteStopPanelsToContainer = function() {

    var favorites_container =
    document.getElementById("favorites-container-main-panels");

    ISR.utils.addFavoriteRouteStopPanel(favorites_container);

};

ISR.utils.init.templating.addAlertDayLabelsAndTimeRanges = function() {

    var alert_time_ranges_container =
    document.getElementById("alerts-container-all-date-ranges");

    ISR.utils.addAlertDateRangeSelector(alert_time_ranges_container);

    ISR.utils.selectFirstTimeRange();

};

ISR.utils.selectFirstTimeRange = function() {

    ISR.dom.post_templating["alerts-container-time-range"] = 
    document.getElementsByClassName("alerts-container-time-range");

    var first_time_range =
    ISR.dom.post_templating["alerts-container-time-range"][0];

    var first_time_range_input =
    first_time_range.getElementsByTagName("input")[0];

    first_time_range_input.checked = true;

    ISR.utils.highlightselectedtimerange(first_time_range_input);

};