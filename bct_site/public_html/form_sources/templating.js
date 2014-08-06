//Namespace for additional behavior
//Company name
ISR = {};

//Stored DOM queries
ISR.dom = {};

//Container for all base HTML template strings
ISR.templates = {};

ISR.templates.login_form = {};

ISR.templates.profile_page = {};

ISR.templates.profile_page["favorite-route-stop-panel"] = '' +

    '<div class="favorite-route-stop-panel">' +

        '<div class="favorite-route-stop-panel-property-container">' +

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

            '<a href="" onclick="">' +
                'View in BCT MyRide' +
            '</a>' +

        '</span>' +

'</div>';

ISR.templates.profile_page["bct-drop-down-item"] = '' +
'<span class="bct-drop-down-item" ' +
'onclick="ISR.utils.selectDropDownOption(this)">' +
    '<span class="bct-drop-down-item-text">{{ DAY_OR_TIME_LABEL }}</span>' +
'</span>';

ISR.templates.profile_page["favorites-alert-day-time-selection"] = '' +
    '<span class="bct-drop-down {{ DROP_DOWN_CLASS }} no-hightlight ptr">' +
        '<span class="bct-drop-down-selected-item no-highlight ptr">' +
            '{{ SELECTED_DAY_OR_TIME }}' +
        '</span>' +
        '<span class="bct-drop-down-item-holder-container">' +
            '<span class="bct-drop-down-item-holder no-highlight ptr">' +
                '{{ DAY_AND_TIME_DROP_DOWN_ITEMS }}' +
            '</span>' +
        '</span>' +
    '</span>';

ISR.templates.profile_page["favorites-full-item-full-date-time"] = '' +
    '<div class="favorites-full-item-full-date-time">' +
        '<div class="favorites-alert-day-selection">' +
            '{{ FAVORITES_ALERT_DAY_SELECTION }}' +
        '</div>' +
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
        route: "<route_number> <route_name>",
        stop: "<stop_number> <stop_name>"
    }

    In this version, the property strings must be concatenated beforehand.

*/

ISR.templates.data.
profile_page["favorite-route-stop-panel"].favorites_list = [

    {
        route: "BCT101 US1 Breeze",
        stop: "17 US1/DANIA BEACH B"
    },
    {
        route: "BCT01",
        stop: "100 US1/THOMAS ST"
    },
    {
        route: "BCT02",
        stop: "135 UNIVERSITY D/FRENCH VILLA"
    }

];

ISR.templates.data.
profile_page["favorites-full-item-full-date-time"].day_list = [

    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
    "Sunday", "Weekdays", "Weekends"

];

ISR.templates.data.
profile_page["favorites-full-item-full-date-time"].time_list = [

    "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00"

];

//Utility functions
ISR.utils = {};

ISR.utils.selectDropDownOption = function(target) {

    var target_text = target.textContent.trim();

    var selection_holder = target.parentNode.parentNode.parentNode.children[0];

    selection_holder.textContent = target_text;

};

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
    profile_page["favorite-route-stop-panel"].favorites_list

    for (var i=0;i<template_data.length;i++) {

        var date_time_bar_template =
        ISR.utils.templating.generateFavoriteRouteStopPanel(template_data[i]);

        target.innerHTML += date_time_bar_template;

    }
};

//Utility functions run successively after module is loaded
ISR.utils.init = {};

ISR.utils.init.addFavoriteRouteStopPanelsToContainer = function() {

    var favorites_container = document.getElementById("favorites-container");

    ISR.utils.addFavoriteRouteStopPanel(favorites_container);

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

    function getRouteStopPanelRoute(route_stop_panel_data) {
        return route_stop_panel_data.route;
    }

    function getRouteStopPanelStop(route_stop_panel_data) {
        return route_stop_panel_data.stop;
    }

    /* END Favorite Route Panel */

    function getDayOrTimeLabel(day_or_time_label) {
        return day_or_time_label;
    }

    function generateMultipleDropDownItemsHTML(label_list) {

        var drop_down_item_list = [];

        for (var i=0;i<label_list.length;i++) {
            var drop_down_item = generateDropDownItemHTML(label_list[i]);

            drop_down_item_list.push(drop_down_item);
        }

        return drop_down_item_list.join("");

    }

    function selectDropDownClass(day_or_time_selection_list) {

        var drop_down_class = "";

        if (day_or_time_selection_list[0].match(/[0-9]/) ) {
            drop_down_class = "bct-time-drop-down";
        } else {
            drop_down_class = "bct-day-drop-down";
        }

        return drop_down_class;

    }

    function getFirstDayOrTime(day_or_time_selection_list) {
        return day_or_time_selection_list[0];
    }

    function generateAlertDaySelection(full_item_date_time_data) {
        return generateAlertDayTimeSelection(
            full_item_date_time_data.day_list
        );
    }

    function generateAlertTimeSelection(full_item_date_time_data) {
        return generateAlertDayTimeSelection(
            full_item_date_time_data.time_list
        );
    }

    function generateDropDownItemHTML(day_or_time_label) {
        return generateTemplateFromBase(
            ISR.templates.profile_page["bct-drop-down-item"],
            day_or_time_label
        );
    }

    function generateAlertDayTimeSelection(day_or_time_selection_list) {
        return generateTemplateFromBase(
            ISR.templates.profile_page["favorites-alert-day-time-selection"],
            day_or_time_selection_list
        );
    }

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

    ISR.utils.templating.placeholderPopulators = {

        "{{ ROUTE_STOP_PANEL_ROUTE }}": getRouteStopPanelRoute,
        "{{ ROUTE_STOP_PANEL_STOP }}": getRouteStopPanelStop,

        "{{ DAY_OR_TIME_LABEL }}": getDayOrTimeLabel,
        "{{ SELECTED_DAY_OR_TIME }}": getFirstDayOrTime,
        "{{ DAY_AND_TIME_DROP_DOWN_ITEMS }}": generateMultipleDropDownItemsHTML,
        "{{ DROP_DOWN_CLASS }}": selectDropDownClass,
        "{{ FAVORITES_ALERT_DAY_SELECTION }}": generateAlertDaySelection,
        "{{ FAVORITES_ALERT_START_TIME }}": generateAlertTimeSelection,
        "{{ FAVORITES_ALERT_END_TIME }}": generateAlertTimeSelection

    };

    //Main templating function, where the above templating functions are passed
    //as callbacks. Some above functions' references to it prevent it from
    //being garbage collected, despite it being defined in this closure.
    function generateTemplateFromBase(
            base_template, placeholder_data
        ) {

        var template = base_template;

        var template_placeholders = base_template.match(/{{.*?}}/g);

        for (var i=0;i<template_placeholders.length;i++) {

            var populator =
            ISR.utils.templating.
            placeholderPopulators[template_placeholders[i]];

            template = template.replace(
                template_placeholders[i],
                populator(placeholder_data)
            );

        }

        return template;

    }

}());
