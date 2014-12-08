//Constants associated with templates
ISR.templates.data = {};

//Associate template data object with each template
(function() {

    for (var template_group_name in ISR.templates) {

        if (template_group_name === "data") { continue; }

        var template_group_data = ISR.templates.data[template_group_name] = {};

        var template_group = ISR.templates[template_group_name];

        for (var template_name in template_group) {

            template_group_data[template_name] = {};

        }

    }

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

ISR.templates.data.agency_icons = {

    broward: {
        agency: "broward-county",
        icon_filename: "bct_logo.svg",
        selection_class: ""
    },

    miami: {
        agency: "miami-dade",
        icon_filename: "miami_dade_logo.svg",
        selection_class: ""
    },

    palm: {
        agency: "palm-beach",
        icon_filename: "palm_tran_logo.svg",
        selection_class: ""
    }

};

ISR.utils.generateAlertDateTimeBarHTML = function(target) {

    var date_time_bar_template =
    ISR.utils.templating.generateAlertFullDateTimeSelector();

    target.parentNode.childNodes[3].innerHTML += date_time_bar_template;

};

ISR.utils.addBusRouteStopAlert = function() {
    ISR.utils.generateAlertDateTimeBarHTML();
};

ISR.utils.addFavoriteAgencySelectors = function(target) {

    var template_data = ISR.templates.data.agency_icons;

    for (var t in template_data) {

        var agency_selector_template =
        ISR.utils.templating.generateFavoriteAgencySelector(template_data[t]);

        target.innerHTML += agency_selector_template;

    }

};

ISR.utils.addFavoriteRouteStopPanel = function(target) {

    var template_data = ISR.templates.data.
    profile_page["favorites-container-route-stop-panel"].favorites_list;

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

    function getAgencyIconPath(agency_icon_data) {
        return  ISR.directories.site_roots.active +
                ISR.directories.paths.icons +
                'css/ico/' +
                agency_icon_data.icon_filename;
    }

    function getAgencyName(agency_icon_data) {
        return agency_icon_data.agency;
    };

    /* START Favorite Route Panel */

    function getRouteStopPanelAgency(route_stop_panel_data) {
        return route_stop_panel_data.AgencyId;
    }

    function getRouteStopPanelRoute(route_stop_panel_data) {
        return route_stop_panel_data.RouteId;
    }

    function getRouteStopPanelStopId(route_stop_panel_data) {
        return route_stop_panel_data.StopId;
    }
    function getRouteStopPanelStopName(route_stop_panel_data) {
        return ISR.data.stops_info[route_stop_panel_data.StopId];
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
    ISR.utils.templating.generateFavoriteAgencySelector = function(
        current_agency_icon_data
    ) {

        return generateTemplateFromBase(

            ISR.templates.
            profile_page["favorites-container-agency-bar-item"],

            current_agency_icon_data

        );

    };
    
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
            profile_page["favorites-container-route-stop-panel"],

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

        "{{ PATH_TO_AGENCY_ICON }}": getAgencyIconPath,
        "{{ AGENCY_NAME }}": getAgencyName,

        "{{ ROUTE_STOP_PANEL_AGENCY }}": getRouteStopPanelAgency,
        "{{ ROUTE_STOP_PANEL_ROUTE }}": getRouteStopPanelRoute,
        "{{ ROUTE_STOP_PANEL_STOP_ID }}": getRouteStopPanelStopId,
        "{{ ROUTE_STOP_PANEL_STOP_NAME }}": getRouteStopPanelStopName,

        "{{ ALERT_DAY_OF_WEEK }}": getAlertDay,
        "{{ ALERT_START_TIME_RANGE }}": generateAlertTimeSelection,
        "{{ ALERT_END_TIME_RANGE }}": generateAlertTimeSelection,
        "{{ TIME_LABEL }}": getTimeLabel,
        "{{ SELECTED_TIME }}": getFirstTime,
        "{{ TIME_DROP_DOWN_ITEMS }}": generateDropDownTimes

    };

    ISR.utils.templating.addFavoriteRouteStopPanelsToContainer = function() {

        var favorites_main_panel_container =
        document.getElementById("favorites-container-main-panels");

        ISR.utils.addFavoriteRouteStopPanel(favorites_main_panel_container);

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

                if (!populator) {
                    throw new Error(
                        'Missing populator function for placeholder text ' +
                        template_placeholders[i] + '.'
                    );
                }

                template = template.replace(
                    template_placeholders[i],
                    populator(placeholder_data)
                );

            }

        }

        return template;

    }

}());

ISR.dom.post_templating = {};

ISR.dom.post_templating.dom = {};

ISR.dom.post_templating.methods = {};

//Initial templating operations
ISR.utils.init.templating = {};

ISR.utils.init.templating.addFavoriteAgencySelectorsToContainer = function() {

    var favorites_agency_bar_container =
    document.getElementById("favorites-container-agency-bar");

    ISR.utils.addFavoriteAgencySelectors(favorites_agency_bar_container);

    ISR.dom.post_templating.methods.getAgencySelectorPanels();

    ISR.utils.changeAgency("broward-county");

};

ISR.utils.init.templating.addAlertDayLabelsAndTimeRanges = function() {

    var alert_time_ranges_container =
    document.getElementById("alerts-container-all-date-ranges");

    ISR.utils.addAlertDateRangeSelector(alert_time_ranges_container);

    ISR.utils.selectFirstTimeRange();

};

ISR.dom.post_templating.methods.getAgencySelectorPanels = function() {

    ISR.dom.header_panels.agencies = {};

    var agency_header_panels =
    document.getElementsByClassName("favorites-container-agency-bar-item");

    ISR.dom.header_panels.agencies.broward_county =
    agency_header_panels[0];
    
    ISR.dom.header_panels.agencies.miami_dade =
    agency_header_panels[1];

    ISR.dom.header_panels.agencies.palm_beach =
    agency_header_panels[2];

};

ISR.utils.selectFirstTimeRange = function() {

    ISR.dom.post_templating.dom["alerts-container-time-range"] = 
    document.getElementsByClassName("alerts-container-time-range");

    var first_time_range =
    ISR.dom.post_templating.dom["alerts-container-time-range"][0];

    var first_time_range_input =
    first_time_range.getElementsByTagName("input")[0];

    first_time_range_input.checked = true;

    ISR.utils.highlightselectedtimerange(first_time_range_input);

};