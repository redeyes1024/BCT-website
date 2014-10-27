
//Namespace for additional behavior
//Company name
ISR = {};

//Stored DOM queries
ISR.dom = {};

ISR.directories = {

    site_roots: {
        local: '',
        remote: 'http://www.isrtransit.com/files/bct/webapp/',
        active: ''
    },
    paths: {
        none: '',
        form_sources: 'form_sources/',
        active: ''
    }

};

ISR.directories.site_roots.active =
ISR.directories.site_roots.remote;

ISR.directories.paths.active =
ISR.directories.paths.form_sources;

ISR.directories.paths.icons = 'bct_my_ride/';

//Utility functions
ISR.utils = {};

ISR.utils.changePage = function(selected_page) {

    var selected_panel_name = "";
    var selected_module_name = "";

    switch (selected_page) {

        case "favorites":

            selected_panel_name = "favorites_page_button";
            selected_module_name = "favorites_module";

            break;

        case "alerts":

            selected_panel_name = "alerts_page_button";
            selected_module_name = "alerts_module";

            break;

    }

    ISR.utils.styling.highlightHeaderPanel(
        "main", selected_panel_name
    );

    ISR.utils.styling.switchModule("main", selected_module_name);

};

ISR.utils.changeAgency = function(selected_agency) {

    var selected_button_name = "";
    var selected_sub_page_name = "";

    switch (selected_agency) {

        case "broward-county":

            selected_button_name = "broward_county";
            selected_sub_page_name = "broward_county_favorites";

            break;

        case "miami-dade":

            selected_button_name = "miami_dade";
            selected_sub_page_name = "miami_dade_favorites";

            break;
            
        case "palm-beach":

            selected_button_name = "palm_beach";
            selected_sub_page_name = "palm_beach_favorites";

            break;

    }

    ISR.utils.styling.highlightHeaderPanel(
        "agencies", selected_button_name
    );

    ISR.utils.styling.switchModule("agencies", selected_sub_page_name);

};

ISR.utils.selectDropDownOption = function(target) {

    var target_text = target.textContent.trim();

    var selection_holder = target.parentNode.parentNode.parentNode.children[0];

    selection_holder.textContent = target_text;

};

ISR.utils.deleteFavoriteRouteStop = function(route, stop, element) {

    element.parentNode.parentNode.removeChild(element.parentNode);

    var old_favorites = JSON.parse(localStorage.my_bct_fav);

    for (var i=0;i<old_favorites.length;i++) {

        if (old_favorites[i].fav_route.Id === route &&
            old_favorites[i].fav_stop.Id === stop) {

            old_favorites.splice(i, 1);

            break;

        }

    }

    var new_favorites_stringified = JSON.stringify(old_favorites);

    localStorage.setItem('my_bct_fav', new_favorites_stringified);

};

ISR.utils.highlightselectedtimerange = function(element) {

    var panel_selected = "alerts-container-time-range-selected";

    var time_ranges =
    ISR.dom.post_templating.dom["alerts-container-time-range"];

    for (var i=0;i<time_ranges.length;i++) {

        if (time_ranges[i].classList.contains("alerts-container-sub-table")) {

            time_ranges[i].classList.
            remove("alerts-container-sub-table-selected");

        }

        time_ranges[i].classList.remove(panel_selected);

    }

    if (element.parentNode.parentNode.classList.
        contains("alerts-container-sub-table")) {

        element.parentNode.parentNode.classList.
        add("alerts-container-sub-table-selected");

    }

    element.parentNode.parentNode.classList.add(panel_selected);

};

ISR.utils.goToMyRideSchedule = function(route, stop) {

    var location_prefix;

//    if (window.location.toString().
//        match(/\/index.html/)) {

        location_prefix = "index.html";
//
//    }
//
//    else if(window.location.toString().
//            match(/\/default.aspx/)) {
//
//        location_prefix = "default.aspx";
//
//    }
//
//    else if(window.location.toString().
//            match(/\/myride_deployment_sample.html/)) {
//
//        location_prefix = "myride_deployment_sample.html";
//
//    }

    window.location =
    location_prefix + "#routeschedules?route=" + route + "&" +
    "stop=" + stop;

};

//Utility functions run successively after module is loaded
ISR.utils.init = {};

//General init functions
ISR.utils.init.general = {};

ISR.utils.init.general.startingDomQueries = function() {

    /* Modules */

    ISR.dom.modules = {};

    ISR.dom.modules.main = {};

    ISR.dom.modules.main.favorites_module =
    document.getElementById("favorites-container");

    ISR.dom.modules.main.alerts_module =
    document.getElementById("alerts-container");

    ISR.dom.modules.agencies = {};

    ISR.dom.modules.agencies.broward_county_favorites =
    document.getElementById("broward-county-favorites");

    ISR.dom.modules.agencies.miami_dade_favorites =
    document.getElementById("miami-dade-favorites");

    ISR.dom.modules.agencies.palm_beach_favorites =
    document.getElementById("palm-beach-favorites");

    /* Header Panels */

    ISR.dom.header_panels = {};

    ISR.dom.header_panels.main = {};

    var module_header_panels =
    document.getElementsByClassName("profile-page-section-title-sub-container");

    ISR.dom.header_panels.main.favorites_page_button =
    module_header_panels[0];
    
    ISR.dom.header_panels.main.alerts_page_button =
    module_header_panels[1];

};

ISR.utils.init.general.addDefaultDynamicStyles = function() {

    ISR.utils.changePage("favorites");

};

//Dynamic CSS class manipulation
ISR.utils.styling = {};

//Dynamic styling functions
ISR.utils.styling.functions = {};

//Dynamic styling configutation
ISR.utils.styling.config = {};

ISR.utils.styling.config.header_activated_styles = {};

ISR.utils.styling.config.header_activated_styles.main = {

    favorites_page_button: 
    "profile-page-section-title-sub-container-main-activated",

    alerts_page_button: 
    "profile-page-section-title-sub-container-main-activated"

};

ISR.utils.styling.config.header_activated_styles.agencies = {

    broward_county: 
    "profile-page-section-title-sub-container-sub-activated",

    miami_dade: 
    "profile-page-section-title-sub-container-sub-activated",

    palm_beach:
    "profile-page-section-title-sub-container-sub-activated"

};

ISR.utils.styling.highlightHeaderPanel = function(
    panel_list_name, selected_panel_name
) {

    var panel_list = ISR.dom.header_panels[panel_list_name];

    for (var cur_panel_name in panel_list) {

        var current_panel = panel_list[cur_panel_name];

        var panel_activated_style = ISR.utils.styling.config.
        header_activated_styles[panel_list_name][cur_panel_name];

        if (cur_panel_name === selected_panel_name) {

            current_panel.classList.add(panel_activated_style);

        }

        else {

            current_panel.classList.remove(panel_activated_style);

        }

    }


};

ISR.utils.styling.switchModule = function(module_list, selected_module_name) {

    var modules = ISR.dom.modules[module_list];

    for (var cur_module_name in modules) {

        var cur_module = modules[cur_module_name];

        if (cur_module_name === selected_module_name) {

            cur_module.classList.remove("module-hidden");

        }
        
        else {

            cur_module.classList.add("module-hidden");

        }

    }

};

window.onload = function() {

    function callInitFunctions() {

        var init_func_groups = ISR.utils.init;

        for (var func_group in init_func_groups) {

            var init_func_group = init_func_groups[func_group];

            for (var func in init_func_group) {

                init_func_group[func]();

            }

        }

    }

    //Module Importer
    function getAndAppendModuleHTML(container_id, filename, append_target) {

        var template_container = document.getElementById(container_id);

        if (!template_container) {
            return true;
        }

        var template_request = new XMLHttpRequest;

        var url = ISR.directories.site_roots.active + 
        ISR.directories.paths.active + filename;

        template_request.open('GET', url, true);
        template_request.responseType = 'document';
        template_request.onload = function(e) {

            template_container.innerHTML = "";

            var template;

            var target_container;

            if (e.target.response) {

                template = e.target.response;

                target_container =
                template.getElementById(append_target);

            }

            //IE 9 Compatibility
            else {

                target_container = document.createElement("div");

                target_container.innerHTML += e.target.responseText;

            }

            template_container.appendChild(target_container);

            callInitFunctions();

        };

        template_request.send();

    };

    getAndAppendModuleHTML(
        'bct-profile-page',
        'bct_profile_page_template.html',
        'profile-container'
    );

};

//Container for all base HTML template strings
ISR.templates = {};

ISR.templates.login_form = {};

ISR.templates.profile_page = {};

ISR.templates.profile_page["favorites-container-agency-bar-item"] = '' +

    '<span class="favorites-container-agency-bar-item ptr no-highlight" ' +
    'onclick="ISR.utils.changeAgency(\'{{ AGENCY_NAME }}\');">' +

        '<img class="favorites-container-agency-bar-item-image" ' +
        'alt="Select Agency" title="Select Agency" ' +
        'src="{{ PATH_TO_AGENCY_ICON }}">' +

    '</span>';

ISR.templates.profile_page["favorites-container-route-stop-panel"] = '' +

    '<div class="favorites-container-route-stop-panel">' +

        '<div class="favorites-container-route-stop-panel-item ' +
        'favorites-container-route-stop-panel-myride ' +
        'link-icon no-highlight ptr"\n\
        onclick="ISR.utils.goToMyRideSchedule(' +
            '\'{{ ROUTE_STOP_PANEL_ROUTE }}\', ' + 
            '\'{{ ROUTE_STOP_PANEL_STOP_ID }}\'' +
        ');">' +

            '<i class="fa fa-search"></i>' +

        '</div>' +

        '<div class="favorites-container-route-stop-panel-item ' +
        'favorites-container-route-stop-panel-route">' +

            '{{ ROUTE_STOP_PANEL_ROUTE }}' +

        '</div>' +

        '<div class="favorites-container-route-stop-panel-item ' +
        'favorites-container-route-stop-panel-stop">' +

            '{{ ROUTE_STOP_PANEL_STOP_ID }}' + ' - ' +
            '{{ ROUTE_STOP_PANEL_STOP_NAME }}' +

        '</div>' +

        '<div class="favorites-container-route-stop-panel-item ' +
        'favorites-container-route-stop-panel-delete ' +
        'link-icon no-highlight ptr"' + 
        'onclick="ISR.utils.deleteFavoriteRouteStop(' +
            '\'{{ ROUTE_STOP_PANEL_ROUTE }}\', ' + 
            '\'{{ ROUTE_STOP_PANEL_STOP_ID }}\', ' +
            'this' +
        ');">' + 

            '<i class="fa fa-times-circle"></i>' +

        '</div>' +

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

                //'Time 1' +

            '</span>' +

            '<span class="alerts-container-time-range-times">' +

                '{{ ALERT_START_TIME_RANGE }}' +

            '</span>' +

            '<span class="alerts-container-time-range-divider">to</span>' +

            '<span class="alerts-container-time-range-times">' +

                '{{ ALERT_END_TIME_RANGE }}' +

            '</span>' +

        '</div>' +

        '<div class="alerts-container-time-range-content ' +
        'alerts-container-time-range-end">' +

            '<span class="alerts-container-time-range-label">' +

                //'Time 2' +

            '</span>' +

            '<span class="alerts-container-time-range-times">' +

                '{{ ALERT_START_TIME_RANGE }}' +

            '</span>' +

            '<span class="alerts-container-time-range-divider">to</span>' +

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
        profile_page["favorites-container-route-stop-panel"].favorites_list = [];

        return true;

    }

    var formatted_favorites_list = [];

    for (var i=0;i<favorites_list.length;i++) {

        var agency = favorites_list[i].agency;
        var route_id = favorites_list[i].fav_route.Id;
        var stop_id = favorites_list[i].fav_stop.Id;
        var stop_name = favorites_list[i].fav_stop.Name;

        var formatted_favorite_item = {

            agency: agency,
            route: route_id,
            stop_id: stop_id,
            stop_name: stop_name

        };

        formatted_favorites_list.push(formatted_favorite_item);

    }

    ISR.templates.data.
    profile_page["favorites-container-route-stop-panel"].favorites_list =
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

ISR.templates.data.agency_icons = {

    broward: {
        agency: "broward-county",
        icon_filename: "broward_100px.png",
        selection_class: ""
    },

    miami: {
        agency: "miami-dade",
        icon_filename: "miami_dade_100px.png",
        selection_class: ""
    },

    palm: {
        agency: "palm-beach",
        icon_filename: "palm_100px.png",
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
        return route_stop_panel_data.agency;
    }

    function getRouteStopPanelRoute(route_stop_panel_data) {
        return route_stop_panel_data.route;
    }

    function getRouteStopPanelStopId(route_stop_panel_data) {
        return route_stop_panel_data.stop_id;
    }
    function getRouteStopPanelStopName(route_stop_panel_data) {
        return route_stop_panel_data.stop_name;
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

ISR.utils.init.templating.addFavoriteRouteStopPanelsToContainer = function() {

    var favorites_main_panel_container =
    document.getElementById("favorites-container-main-panels");

    ISR.utils.addFavoriteRouteStopPanel(favorites_main_panel_container);

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

/*
 AngularJS v1.2.16
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(O,U,s){'use strict';function t(b){return function(){var a=arguments[0],c,a="["+(b?b+":":"")+a+"] http://errors.angularjs.org/1.2.16/"+(b?b+"/":"")+a;for(c=1;c<arguments.length;c++)a=a+(1==c?"?":"&")+"p"+(c-1)+"="+encodeURIComponent("function"==typeof arguments[c]?arguments[c].toString().replace(/ \{[\s\S]*$/,""):"undefined"==typeof arguments[c]?"undefined":"string"!=typeof arguments[c]?JSON.stringify(arguments[c]):arguments[c]);return Error(a)}}function ab(b){if(null==b||Ca(b))return!1;
var a=b.length;return 1===b.nodeType&&a?!0:w(b)||M(b)||0===a||"number"===typeof a&&0<a&&a-1 in b}function q(b,a,c){var d;if(b)if(P(b))for(d in b)"prototype"==d||("length"==d||"name"==d||b.hasOwnProperty&&!b.hasOwnProperty(d))||a.call(c,b[d],d);else if(b.forEach&&b.forEach!==q)b.forEach(a,c);else if(ab(b))for(d=0;d<b.length;d++)a.call(c,b[d],d);else for(d in b)b.hasOwnProperty(d)&&a.call(c,b[d],d);return b}function Qb(b){var a=[],c;for(c in b)b.hasOwnProperty(c)&&a.push(c);return a.sort()}function Sc(b,
a,c){for(var d=Qb(b),e=0;e<d.length;e++)a.call(c,b[d[e]],d[e]);return d}function Rb(b){return function(a,c){b(c,a)}}function bb(){for(var b=ka.length,a;b;){b--;a=ka[b].charCodeAt(0);if(57==a)return ka[b]="A",ka.join("");if(90==a)ka[b]="0";else return ka[b]=String.fromCharCode(a+1),ka.join("")}ka.unshift("0");return ka.join("")}function Sb(b,a){a?b.$$hashKey=a:delete b.$$hashKey}function D(b){var a=b.$$hashKey;q(arguments,function(a){a!==b&&q(a,function(a,c){b[c]=a})});Sb(b,a);return b}function Y(b){return parseInt(b,
10)}function Tb(b,a){return D(new (D(function(){},{prototype:b})),a)}function C(){}function Da(b){return b}function aa(b){return function(){return b}}function E(b){return"undefined"===typeof b}function B(b){return"undefined"!==typeof b}function X(b){return null!=b&&"object"===typeof b}function w(b){return"string"===typeof b}function vb(b){return"number"===typeof b}function Na(b){return"[object Date]"===wa.call(b)}function M(b){return"[object Array]"===wa.call(b)}function P(b){return"function"===typeof b}
function cb(b){return"[object RegExp]"===wa.call(b)}function Ca(b){return b&&b.document&&b.location&&b.alert&&b.setInterval}function Tc(b){return!(!b||!(b.nodeName||b.prop&&b.attr&&b.find))}function Uc(b,a,c){var d=[];q(b,function(b,g,f){d.push(a.call(c,b,g,f))});return d}function db(b,a){if(b.indexOf)return b.indexOf(a);for(var c=0;c<b.length;c++)if(a===b[c])return c;return-1}function Oa(b,a){var c=db(b,a);0<=c&&b.splice(c,1);return a}function ba(b,a){if(Ca(b)||b&&b.$evalAsync&&b.$watch)throw Pa("cpws");
if(a){if(b===a)throw Pa("cpi");if(M(b))for(var c=a.length=0;c<b.length;c++)a.push(ba(b[c]));else{c=a.$$hashKey;q(a,function(b,c){delete a[c]});for(var d in b)a[d]=ba(b[d]);Sb(a,c)}}else(a=b)&&(M(b)?a=ba(b,[]):Na(b)?a=new Date(b.getTime()):cb(b)?a=RegExp(b.source):X(b)&&(a=ba(b,{})));return a}function Ub(b,a){a=a||{};for(var c in b)!b.hasOwnProperty(c)||"$"===c.charAt(0)&&"$"===c.charAt(1)||(a[c]=b[c]);return a}function xa(b,a){if(b===a)return!0;if(null===b||null===a)return!1;if(b!==b&&a!==a)return!0;
var c=typeof b,d;if(c==typeof a&&"object"==c)if(M(b)){if(!M(a))return!1;if((c=b.length)==a.length){for(d=0;d<c;d++)if(!xa(b[d],a[d]))return!1;return!0}}else{if(Na(b))return Na(a)&&b.getTime()==a.getTime();if(cb(b)&&cb(a))return b.toString()==a.toString();if(b&&b.$evalAsync&&b.$watch||a&&a.$evalAsync&&a.$watch||Ca(b)||Ca(a)||M(a))return!1;c={};for(d in b)if("$"!==d.charAt(0)&&!P(b[d])){if(!xa(b[d],a[d]))return!1;c[d]=!0}for(d in a)if(!c.hasOwnProperty(d)&&"$"!==d.charAt(0)&&a[d]!==s&&!P(a[d]))return!1;
return!0}return!1}function Vb(){return U.securityPolicy&&U.securityPolicy.isActive||U.querySelector&&!(!U.querySelector("[ng-csp]")&&!U.querySelector("[data-ng-csp]"))}function eb(b,a){var c=2<arguments.length?ya.call(arguments,2):[];return!P(a)||a instanceof RegExp?a:c.length?function(){return arguments.length?a.apply(b,c.concat(ya.call(arguments,0))):a.apply(b,c)}:function(){return arguments.length?a.apply(b,arguments):a.call(b)}}function Vc(b,a){var c=a;"string"===typeof b&&"$"===b.charAt(0)?c=
s:Ca(a)?c="$WINDOW":a&&U===a?c="$DOCUMENT":a&&(a.$evalAsync&&a.$watch)&&(c="$SCOPE");return c}function qa(b,a){return"undefined"===typeof b?s:JSON.stringify(b,Vc,a?"  ":null)}function Wb(b){return w(b)?JSON.parse(b):b}function Qa(b){"function"===typeof b?b=!0:b&&0!==b.length?(b=K(""+b),b=!("f"==b||"0"==b||"false"==b||"no"==b||"n"==b||"[]"==b)):b=!1;return b}function ha(b){b=y(b).clone();try{b.empty()}catch(a){}var c=y("<div>").append(b).html();try{return 3===b[0].nodeType?K(c):c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,
function(a,b){return"<"+K(b)})}catch(d){return K(c)}}function Xb(b){try{return decodeURIComponent(b)}catch(a){}}function Yb(b){var a={},c,d;q((b||"").split("&"),function(b){b&&(c=b.split("="),d=Xb(c[0]),B(d)&&(b=B(c[1])?Xb(c[1]):!0,a[d]?M(a[d])?a[d].push(b):a[d]=[a[d],b]:a[d]=b))});return a}function Zb(b){var a=[];q(b,function(b,d){M(b)?q(b,function(b){a.push(za(d,!0)+(!0===b?"":"="+za(b,!0)))}):a.push(za(d,!0)+(!0===b?"":"="+za(b,!0)))});return a.length?a.join("&"):""}function wb(b){return za(b,
!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function za(b,a){return encodeURIComponent(b).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,a?"%20":"+")}function Wc(b,a){function c(a){a&&d.push(a)}var d=[b],e,g,f=["ng:app","ng-app","x-ng-app","data-ng-app"],h=/\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;q(f,function(a){f[a]=!0;c(U.getElementById(a));a=a.replace(":","\\:");b.querySelectorAll&&(q(b.querySelectorAll("."+a),c),q(b.querySelectorAll("."+
a+"\\:"),c),q(b.querySelectorAll("["+a+"]"),c))});q(d,function(a){if(!e){var b=h.exec(" "+a.className+" ");b?(e=a,g=(b[2]||"").replace(/\s+/g,",")):q(a.attributes,function(b){!e&&f[b.name]&&(e=a,g=b.value)})}});e&&a(e,g?[g]:[])}function $b(b,a){var c=function(){b=y(b);if(b.injector()){var c=b[0]===U?"document":ha(b);throw Pa("btstrpd",c);}a=a||[];a.unshift(["$provide",function(a){a.value("$rootElement",b)}]);a.unshift("ng");c=ac(a);c.invoke(["$rootScope","$rootElement","$compile","$injector","$animate",
function(a,b,c,d,e){a.$apply(function(){b.data("$injector",d);c(b)(a)})}]);return c},d=/^NG_DEFER_BOOTSTRAP!/;if(O&&!d.test(O.name))return c();O.name=O.name.replace(d,"");Ea.resumeBootstrap=function(b){q(b,function(b){a.push(b)});c()}}function fb(b,a){a=a||"_";return b.replace(Xc,function(b,d){return(d?a:"")+b.toLowerCase()})}function xb(b,a,c){if(!b)throw Pa("areq",a||"?",c||"required");return b}function Ra(b,a,c){c&&M(b)&&(b=b[b.length-1]);xb(P(b),a,"not a function, got "+(b&&"object"==typeof b?
b.constructor.name||"Object":typeof b));return b}function Aa(b,a){if("hasOwnProperty"===b)throw Pa("badname",a);}function bc(b,a,c){if(!a)return b;a=a.split(".");for(var d,e=b,g=a.length,f=0;f<g;f++)d=a[f],b&&(b=(e=b)[d]);return!c&&P(b)?eb(e,b):b}function yb(b){var a=b[0];b=b[b.length-1];if(a===b)return y(a);var c=[a];do{a=a.nextSibling;if(!a)break;c.push(a)}while(a!==b);return y(c)}function Yc(b){var a=t("$injector"),c=t("ng");b=b.angular||(b.angular={});b.$$minErr=b.$$minErr||t;return b.module||
(b.module=function(){var b={};return function(e,g,f){if("hasOwnProperty"===e)throw c("badname","module");g&&b.hasOwnProperty(e)&&(b[e]=null);return b[e]||(b[e]=function(){function b(a,d,e){return function(){c[e||"push"]([a,d,arguments]);return n}}if(!g)throw a("nomod",e);var c=[],d=[],m=b("$injector","invoke"),n={_invokeQueue:c,_runBlocks:d,requires:g,name:e,provider:b("$provide","provider"),factory:b("$provide","factory"),service:b("$provide","service"),value:b("$provide","value"),constant:b("$provide",
"constant","unshift"),animation:b("$animateProvider","register"),filter:b("$filterProvider","register"),controller:b("$controllerProvider","register"),directive:b("$compileProvider","directive"),config:m,run:function(a){d.push(a);return this}};f&&m(f);return n}())}}())}function Zc(b){D(b,{bootstrap:$b,copy:ba,extend:D,equals:xa,element:y,forEach:q,injector:ac,noop:C,bind:eb,toJson:qa,fromJson:Wb,identity:Da,isUndefined:E,isDefined:B,isString:w,isFunction:P,isObject:X,isNumber:vb,isElement:Tc,isArray:M,
version:$c,isDate:Na,lowercase:K,uppercase:Fa,callbacks:{counter:0},$$minErr:t,$$csp:Vb});Sa=Yc(O);try{Sa("ngLocale")}catch(a){Sa("ngLocale",[]).provider("$locale",ad)}Sa("ng",["ngLocale"],["$provide",function(a){a.provider({$$sanitizeUri:bd});a.provider("$compile",cc).directive({a:cd,input:dc,textarea:dc,form:dd,script:ed,select:fd,style:gd,option:hd,ngBind:id,ngBindHtml:jd,ngBindTemplate:kd,ngClass:ld,ngClassEven:md,ngClassOdd:nd,ngCloak:od,ngController:pd,ngForm:qd,ngHide:rd,ngIf:sd,ngInclude:td,
ngInit:ud,ngNonBindable:vd,ngPluralize:wd,ngRepeat:xd,ngShow:yd,ngStyle:zd,ngSwitch:Ad,ngSwitchWhen:Bd,ngSwitchDefault:Cd,ngOptions:Dd,ngTransclude:Ed,ngModel:Fd,ngList:Gd,ngChange:Hd,required:ec,ngRequired:ec,ngValue:Id}).directive({ngInclude:Jd}).directive(zb).directive(fc);a.provider({$anchorScroll:Kd,$animate:Ld,$browser:Md,$cacheFactory:Nd,$controller:Od,$document:Pd,$exceptionHandler:Qd,$filter:gc,$interpolate:Rd,$interval:Sd,$http:Td,$httpBackend:Ud,$location:Vd,$log:Wd,$parse:Xd,$rootScope:Yd,
$q:Zd,$sce:$d,$sceDelegate:ae,$sniffer:be,$templateCache:ce,$timeout:de,$window:ee,$$rAF:fe,$$asyncCallback:ge})}])}function Ta(b){return b.replace(he,function(a,b,d,e){return e?d.toUpperCase():d}).replace(ie,"Moz$1")}function Ab(b,a,c,d){function e(b){var e=c&&b?[this.filter(b)]:[this],l=a,k,m,n,p,r,z;if(!d||null!=b)for(;e.length;)for(k=e.shift(),m=0,n=k.length;m<n;m++)for(p=y(k[m]),l?p.triggerHandler("$destroy"):l=!l,r=0,p=(z=p.children()).length;r<p;r++)e.push(Ga(z[r]));return g.apply(this,arguments)}
var g=Ga.fn[b],g=g.$original||g;e.$original=g;Ga.fn[b]=e}function N(b){if(b instanceof N)return b;w(b)&&(b=ca(b));if(!(this instanceof N)){if(w(b)&&"<"!=b.charAt(0))throw Bb("nosel");return new N(b)}if(w(b)){var a=b;b=U;var c;if(c=je.exec(a))b=[b.createElement(c[1])];else{var d=b,e;b=d.createDocumentFragment();c=[];if(Cb.test(a)){d=b.appendChild(d.createElement("div"));e=(ke.exec(a)||["",""])[1].toLowerCase();e=ea[e]||ea._default;d.innerHTML="<div>&#160;</div>"+e[1]+a.replace(le,"<$1></$2>")+e[2];
d.removeChild(d.firstChild);for(a=e[0];a--;)d=d.lastChild;a=0;for(e=d.childNodes.length;a<e;++a)c.push(d.childNodes[a]);d=b.firstChild;d.textContent=""}else c.push(d.createTextNode(a));b.textContent="";b.innerHTML="";b=c}Db(this,b);y(U.createDocumentFragment()).append(this)}else Db(this,b)}function Eb(b){return b.cloneNode(!0)}function Ha(b){hc(b);var a=0;for(b=b.childNodes||[];a<b.length;a++)Ha(b[a])}function ic(b,a,c,d){if(B(d))throw Bb("offargs");var e=la(b,"events");la(b,"handle")&&(E(a)?q(e,
function(a,c){Fb(b,c,a);delete e[c]}):q(a.split(" "),function(a){E(c)?(Fb(b,a,e[a]),delete e[a]):Oa(e[a]||[],c)}))}function hc(b,a){var c=b[gb],d=Ua[c];d&&(a?delete Ua[c].data[a]:(d.handle&&(d.events.$destroy&&d.handle({},"$destroy"),ic(b)),delete Ua[c],b[gb]=s))}function la(b,a,c){var d=b[gb],d=Ua[d||-1];if(B(c))d||(b[gb]=d=++me,d=Ua[d]={}),d[a]=c;else return d&&d[a]}function jc(b,a,c){var d=la(b,"data"),e=B(c),g=!e&&B(a),f=g&&!X(a);d||f||la(b,"data",d={});if(e)d[a]=c;else if(g){if(f)return d&&d[a];
D(d,a)}else return d}function Gb(b,a){return b.getAttribute?-1<(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").indexOf(" "+a+" "):!1}function hb(b,a){a&&b.setAttribute&&q(a.split(" "),function(a){b.setAttribute("class",ca((" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").replace(" "+ca(a)+" "," ")))})}function ib(b,a){if(a&&b.setAttribute){var c=(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ");q(a.split(" "),function(a){a=ca(a);-1===c.indexOf(" "+a+" ")&&
(c+=a+" ")});b.setAttribute("class",ca(c))}}function Db(b,a){if(a){a=a.nodeName||!B(a.length)||Ca(a)?[a]:a;for(var c=0;c<a.length;c++)b.push(a[c])}}function kc(b,a){return jb(b,"$"+(a||"ngController")+"Controller")}function jb(b,a,c){b=y(b);9==b[0].nodeType&&(b=b.find("html"));for(a=M(a)?a:[a];b.length;){for(var d=b[0],e=0,g=a.length;e<g;e++)if((c=b.data(a[e]))!==s)return c;b=y(d.parentNode||11===d.nodeType&&d.host)}}function lc(b){for(var a=0,c=b.childNodes;a<c.length;a++)Ha(c[a]);for(;b.firstChild;)b.removeChild(b.firstChild)}
function mc(b,a){var c=kb[a.toLowerCase()];return c&&nc[b.nodeName]&&c}function ne(b,a){var c=function(c,e){c.preventDefault||(c.preventDefault=function(){c.returnValue=!1});c.stopPropagation||(c.stopPropagation=function(){c.cancelBubble=!0});c.target||(c.target=c.srcElement||U);if(E(c.defaultPrevented)){var g=c.preventDefault;c.preventDefault=function(){c.defaultPrevented=!0;g.call(c)};c.defaultPrevented=!1}c.isDefaultPrevented=function(){return c.defaultPrevented||!1===c.returnValue};var f=Ub(a[e||
c.type]||[]);q(f,function(a){a.call(b,c)});8>=S?(c.preventDefault=null,c.stopPropagation=null,c.isDefaultPrevented=null):(delete c.preventDefault,delete c.stopPropagation,delete c.isDefaultPrevented)};c.elem=b;return c}function Ia(b){var a=typeof b,c;"object"==a&&null!==b?"function"==typeof(c=b.$$hashKey)?c=b.$$hashKey():c===s&&(c=b.$$hashKey=bb()):c=b;return a+":"+c}function Va(b){q(b,this.put,this)}function oc(b){var a,c;"function"==typeof b?(a=b.$inject)||(a=[],b.length&&(c=b.toString().replace(oe,
""),c=c.match(pe),q(c[1].split(qe),function(b){b.replace(re,function(b,c,d){a.push(d)})})),b.$inject=a):M(b)?(c=b.length-1,Ra(b[c],"fn"),a=b.slice(0,c)):Ra(b,"fn",!0);return a}function ac(b){function a(a){return function(b,c){if(X(b))q(b,Rb(a));else return a(b,c)}}function c(a,b){Aa(a,"service");if(P(b)||M(b))b=n.instantiate(b);if(!b.$get)throw Wa("pget",a);return m[a+h]=b}function d(a,b){return c(a,{$get:b})}function e(a){var b=[],c,d,g,h;q(a,function(a){if(!k.get(a)){k.put(a,!0);try{if(w(a))for(c=
Sa(a),b=b.concat(e(c.requires)).concat(c._runBlocks),d=c._invokeQueue,g=0,h=d.length;g<h;g++){var f=d[g],l=n.get(f[0]);l[f[1]].apply(l,f[2])}else P(a)?b.push(n.invoke(a)):M(a)?b.push(n.invoke(a)):Ra(a,"module")}catch(m){throw M(a)&&(a=a[a.length-1]),m.message&&(m.stack&&-1==m.stack.indexOf(m.message))&&(m=m.message+"\n"+m.stack),Wa("modulerr",a,m.stack||m.message||m);}}});return b}function g(a,b){function c(d){if(a.hasOwnProperty(d)){if(a[d]===f)throw Wa("cdep",l.join(" <- "));return a[d]}try{return l.unshift(d),
a[d]=f,a[d]=b(d)}catch(e){throw a[d]===f&&delete a[d],e;}finally{l.shift()}}function d(a,b,e){var g=[],h=oc(a),f,l,k;l=0;for(f=h.length;l<f;l++){k=h[l];if("string"!==typeof k)throw Wa("itkn",k);g.push(e&&e.hasOwnProperty(k)?e[k]:c(k))}a.$inject||(a=a[f]);return a.apply(b,g)}return{invoke:d,instantiate:function(a,b){var c=function(){},e;c.prototype=(M(a)?a[a.length-1]:a).prototype;c=new c;e=d(a,c,b);return X(e)||P(e)?e:c},get:c,annotate:oc,has:function(b){return m.hasOwnProperty(b+h)||a.hasOwnProperty(b)}}}
var f={},h="Provider",l=[],k=new Va,m={$provide:{provider:a(c),factory:a(d),service:a(function(a,b){return d(a,["$injector",function(a){return a.instantiate(b)}])}),value:a(function(a,b){return d(a,aa(b))}),constant:a(function(a,b){Aa(a,"constant");m[a]=b;p[a]=b}),decorator:function(a,b){var c=n.get(a+h),d=c.$get;c.$get=function(){var a=r.invoke(d,c);return r.invoke(b,null,{$delegate:a})}}}},n=m.$injector=g(m,function(){throw Wa("unpr",l.join(" <- "));}),p={},r=p.$injector=g(p,function(a){a=n.get(a+
h);return r.invoke(a.$get,a)});q(e(b),function(a){r.invoke(a||C)});return r}function Kd(){var b=!0;this.disableAutoScrolling=function(){b=!1};this.$get=["$window","$location","$rootScope",function(a,c,d){function e(a){var b=null;q(a,function(a){b||"a"!==K(a.nodeName)||(b=a)});return b}function g(){var b=c.hash(),d;b?(d=f.getElementById(b))?d.scrollIntoView():(d=e(f.getElementsByName(b)))?d.scrollIntoView():"top"===b&&a.scrollTo(0,0):a.scrollTo(0,0)}var f=a.document;b&&d.$watch(function(){return c.hash()},
function(){d.$evalAsync(g)});return g}]}function ge(){this.$get=["$$rAF","$timeout",function(b,a){return b.supported?function(a){return b(a)}:function(b){return a(b,0,!1)}}]}function se(b,a,c,d){function e(a){try{a.apply(null,ya.call(arguments,1))}finally{if(z--,0===z)for(;u.length;)try{u.pop()()}catch(b){c.error(b)}}}function g(a,b){(function T(){q(F,function(a){a()});v=b(T,a)})()}function f(){x=null;J!=h.url()&&(J=h.url(),q(ma,function(a){a(h.url())}))}var h=this,l=a[0],k=b.location,m=b.history,
n=b.setTimeout,p=b.clearTimeout,r={};h.isMock=!1;var z=0,u=[];h.$$completeOutstandingRequest=e;h.$$incOutstandingRequestCount=function(){z++};h.notifyWhenNoOutstandingRequests=function(a){q(F,function(a){a()});0===z?a():u.push(a)};var F=[],v;h.addPollFn=function(a){E(v)&&g(100,n);F.push(a);return a};var J=k.href,A=a.find("base"),x=null;h.url=function(a,c){k!==b.location&&(k=b.location);m!==b.history&&(m=b.history);if(a){if(J!=a)return J=a,d.history?c?m.replaceState(null,"",a):(m.pushState(null,"",
a),A.attr("href",A.attr("href"))):(x=a,c?k.replace(a):k.href=a),h}else return x||k.href.replace(/%27/g,"'")};var ma=[],L=!1;h.onUrlChange=function(a){if(!L){if(d.history)y(b).on("popstate",f);if(d.hashchange)y(b).on("hashchange",f);else h.addPollFn(f);L=!0}ma.push(a);return a};h.baseHref=function(){var a=A.attr("href");return a?a.replace(/^(https?\:)?\/\/[^\/]*/,""):""};var Q={},da="",H=h.baseHref();h.cookies=function(a,b){var d,e,g,h;if(a)b===s?l.cookie=escape(a)+"=;path="+H+";expires=Thu, 01 Jan 1970 00:00:00 GMT":
w(b)&&(d=(l.cookie=escape(a)+"="+escape(b)+";path="+H).length+1,4096<d&&c.warn("Cookie '"+a+"' possibly not set or overflowed because it was too large ("+d+" > 4096 bytes)!"));else{if(l.cookie!==da)for(da=l.cookie,d=da.split("; "),Q={},g=0;g<d.length;g++)e=d[g],h=e.indexOf("="),0<h&&(a=unescape(e.substring(0,h)),Q[a]===s&&(Q[a]=unescape(e.substring(h+1))));return Q}};h.defer=function(a,b){var c;z++;c=n(function(){delete r[c];e(a)},b||0);r[c]=!0;return c};h.defer.cancel=function(a){return r[a]?(delete r[a],
p(a),e(C),!0):!1}}function Md(){this.$get=["$window","$log","$sniffer","$document",function(b,a,c,d){return new se(b,d,a,c)}]}function Nd(){this.$get=function(){function b(b,d){function e(a){a!=n&&(p?p==a&&(p=a.n):p=a,g(a.n,a.p),g(a,n),n=a,n.n=null)}function g(a,b){a!=b&&(a&&(a.p=b),b&&(b.n=a))}if(b in a)throw t("$cacheFactory")("iid",b);var f=0,h=D({},d,{id:b}),l={},k=d&&d.capacity||Number.MAX_VALUE,m={},n=null,p=null;return a[b]={put:function(a,b){if(k<Number.MAX_VALUE){var c=m[a]||(m[a]={key:a});
e(c)}if(!E(b))return a in l||f++,l[a]=b,f>k&&this.remove(p.key),b},get:function(a){if(k<Number.MAX_VALUE){var b=m[a];if(!b)return;e(b)}return l[a]},remove:function(a){if(k<Number.MAX_VALUE){var b=m[a];if(!b)return;b==n&&(n=b.p);b==p&&(p=b.n);g(b.n,b.p);delete m[a]}delete l[a];f--},removeAll:function(){l={};f=0;m={};n=p=null},destroy:function(){m=h=l=null;delete a[b]},info:function(){return D({},h,{size:f})}}}var a={};b.info=function(){var b={};q(a,function(a,e){b[e]=a.info()});return b};b.get=function(b){return a[b]};
return b}}function ce(){this.$get=["$cacheFactory",function(b){return b("templates")}]}function cc(b,a){var c={},d="Directive",e=/^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/,g=/(([\d\w\-_]+)(?:\:([^;]+))?;?)/,f=/^(on[a-z]+|formaction)$/;this.directive=function l(a,e){Aa(a,"directive");w(a)?(xb(e,"directiveFactory"),c.hasOwnProperty(a)||(c[a]=[],b.factory(a+d,["$injector","$exceptionHandler",function(b,d){var e=[];q(c[a],function(c,g){try{var f=b.invoke(c);P(f)?f={compile:aa(f)}:!f.compile&&f.link&&(f.compile=
aa(f.link));f.priority=f.priority||0;f.index=g;f.name=f.name||a;f.require=f.require||f.controller&&f.name;f.restrict=f.restrict||"A";e.push(f)}catch(l){d(l)}});return e}])),c[a].push(e)):q(a,Rb(l));return this};this.aHrefSanitizationWhitelist=function(b){return B(b)?(a.aHrefSanitizationWhitelist(b),this):a.aHrefSanitizationWhitelist()};this.imgSrcSanitizationWhitelist=function(b){return B(b)?(a.imgSrcSanitizationWhitelist(b),this):a.imgSrcSanitizationWhitelist()};this.$get=["$injector","$interpolate",
"$exceptionHandler","$http","$templateCache","$parse","$controller","$rootScope","$document","$sce","$animate","$$sanitizeUri",function(a,b,m,n,p,r,z,u,F,v,J,A){function x(a,b,c,d,e){a instanceof y||(a=y(a));q(a,function(b,c){3==b.nodeType&&b.nodeValue.match(/\S+/)&&(a[c]=y(b).wrap("<span></span>").parent()[0])});var g=L(a,b,a,c,d,e);ma(a,"ng-scope");return function(b,c,d){xb(b,"scope");var e=c?Ja.clone.call(a):a;q(d,function(a,b){e.data("$"+b+"Controller",a)});d=0;for(var f=e.length;d<f;d++){var l=
e[d].nodeType;1!==l&&9!==l||e.eq(d).data("$scope",b)}c&&c(e,b);g&&g(b,e,e);return e}}function ma(a,b){try{a.addClass(b)}catch(c){}}function L(a,b,c,d,e,g){function f(a,c,d,e){var g,k,m,r,n,p,z;g=c.length;var I=Array(g);for(n=0;n<g;n++)I[n]=c[n];z=n=0;for(p=l.length;n<p;z++)k=I[z],c=l[n++],g=l[n++],m=y(k),c?(c.scope?(r=a.$new(),m.data("$scope",r)):r=a,(m=c.transclude)||!e&&b?c(g,r,k,d,Q(a,m||b)):c(g,r,k,d,e)):g&&g(a,k.childNodes,s,e)}for(var l=[],k,m,r,n,p=0;p<a.length;p++)k=new Hb,m=da(a[p],[],k,
0===p?d:s,e),(g=m.length?ia(m,a[p],k,b,c,null,[],[],g):null)&&g.scope&&ma(y(a[p]),"ng-scope"),k=g&&g.terminal||!(r=a[p].childNodes)||!r.length?null:L(r,g?g.transclude:b),l.push(g,k),n=n||g||k,g=null;return n?f:null}function Q(a,b){return function(c,d,e){var g=!1;c||(c=a.$new(),g=c.$$transcluded=!0);d=b(c,d,e);if(g)d.on("$destroy",eb(c,c.$destroy));return d}}function da(a,b,c,d,f){var k=c.$attr,l;switch(a.nodeType){case 1:T(b,na(Ka(a).toLowerCase()),"E",d,f);var m,r,n;l=a.attributes;for(var p=0,z=
l&&l.length;p<z;p++){var u=!1,F=!1;m=l[p];if(!S||8<=S||m.specified){r=m.name;n=na(r);W.test(n)&&(r=fb(n.substr(6),"-"));var J=n.replace(/(Start|End)$/,"");n===J+"Start"&&(u=r,F=r.substr(0,r.length-5)+"end",r=r.substr(0,r.length-6));n=na(r.toLowerCase());k[n]=r;c[n]=m=ca(m.value);mc(a,n)&&(c[n]=!0);N(a,b,m,n);T(b,n,"A",d,f,u,F)}}a=a.className;if(w(a)&&""!==a)for(;l=g.exec(a);)n=na(l[2]),T(b,n,"C",d,f)&&(c[n]=ca(l[3])),a=a.substr(l.index+l[0].length);break;case 3:t(b,a.nodeValue);break;case 8:try{if(l=
e.exec(a.nodeValue))n=na(l[1]),T(b,n,"M",d,f)&&(c[n]=ca(l[2]))}catch(x){}}b.sort(E);return b}function H(a,b,c){var d=[],e=0;if(b&&a.hasAttribute&&a.hasAttribute(b)){do{if(!a)throw ja("uterdir",b,c);1==a.nodeType&&(a.hasAttribute(b)&&e++,a.hasAttribute(c)&&e--);d.push(a);a=a.nextSibling}while(0<e)}else d.push(a);return y(d)}function R(a,b,c){return function(d,e,g,f,l){e=H(e[0],b,c);return a(d,e,g,f,l)}}function ia(a,c,d,e,g,f,l,n,p){function u(a,b,c,d){if(a){c&&(a=R(a,c,d));a.require=G.require;if(Q===
G||G.$$isolateScope)a=qc(a,{isolateScope:!0});l.push(a)}if(b){c&&(b=R(b,c,d));b.require=G.require;if(Q===G||G.$$isolateScope)b=qc(b,{isolateScope:!0});n.push(b)}}function F(a,b,c){var d,e="data",g=!1;if(w(a)){for(;"^"==(d=a.charAt(0))||"?"==d;)a=a.substr(1),"^"==d&&(e="inheritedData"),g=g||"?"==d;d=null;c&&"data"===e&&(d=c[a]);d=d||b[e]("$"+a+"Controller");if(!d&&!g)throw ja("ctreq",a,t);}else M(a)&&(d=[],q(a,function(a){d.push(F(a,b,c))}));return d}function J(a,e,g,f,p){function u(a,b){var c;2>arguments.length&&
(b=a,a=s);D&&(c=lb);return p(a,b,c)}var I,x,v,A,R,H,lb={},da;I=c===g?d:Ub(d,new Hb(y(g),d.$attr));x=I.$$element;if(Q){var T=/^\s*([@=&])(\??)\s*(\w*)\s*$/;f=y(g);H=e.$new(!0);ia&&ia===Q.$$originalDirective?f.data("$isolateScope",H):f.data("$isolateScopeNoTemplate",H);ma(f,"ng-isolate-scope");q(Q.scope,function(a,c){var d=a.match(T)||[],g=d[3]||c,f="?"==d[2],d=d[1],l,m,n,p;H.$$isolateBindings[c]=d+g;switch(d){case "@":I.$observe(g,function(a){H[c]=a});I.$$observers[g].$$scope=e;I[g]&&(H[c]=b(I[g])(e));
break;case "=":if(f&&!I[g])break;m=r(I[g]);p=m.literal?xa:function(a,b){return a===b};n=m.assign||function(){l=H[c]=m(e);throw ja("nonassign",I[g],Q.name);};l=H[c]=m(e);H.$watch(function(){var a=m(e);p(a,H[c])||(p(a,l)?n(e,a=H[c]):H[c]=a);return l=a},null,m.literal);break;case "&":m=r(I[g]);H[c]=function(a){return m(e,a)};break;default:throw ja("iscp",Q.name,c,a);}})}da=p&&u;L&&q(L,function(a){var b={$scope:a===Q||a.$$isolateScope?H:e,$element:x,$attrs:I,$transclude:da},c;R=a.controller;"@"==R&&(R=
I[a.name]);c=z(R,b);lb[a.name]=c;D||x.data("$"+a.name+"Controller",c);a.controllerAs&&(b.$scope[a.controllerAs]=c)});f=0;for(v=l.length;f<v;f++)try{A=l[f],A(A.isolateScope?H:e,x,I,A.require&&F(A.require,x,lb),da)}catch(G){m(G,ha(x))}f=e;Q&&(Q.template||null===Q.templateUrl)&&(f=H);a&&a(f,g.childNodes,s,p);for(f=n.length-1;0<=f;f--)try{A=n[f],A(A.isolateScope?H:e,x,I,A.require&&F(A.require,x,lb),da)}catch(B){m(B,ha(x))}}p=p||{};for(var v=-Number.MAX_VALUE,A,L=p.controllerDirectives,Q=p.newIsolateScopeDirective,
ia=p.templateDirective,T=p.nonTlbTranscludeDirective,E=!1,D=p.hasElementTranscludeDirective,Z=d.$$element=y(c),G,t,V,Xa=e,O,N=0,S=a.length;N<S;N++){G=a[N];var ra=G.$$start,W=G.$$end;ra&&(Z=H(c,ra,W));V=s;if(v>G.priority)break;if(V=G.scope)A=A||G,G.templateUrl||(K("new/isolated scope",Q,G,Z),X(V)&&(Q=G));t=G.name;!G.templateUrl&&G.controller&&(V=G.controller,L=L||{},K("'"+t+"' controller",L[t],G,Z),L[t]=G);if(V=G.transclude)E=!0,G.$$tlb||(K("transclusion",T,G,Z),T=G),"element"==V?(D=!0,v=G.priority,
V=H(c,ra,W),Z=d.$$element=y(U.createComment(" "+t+": "+d[t]+" ")),c=Z[0],mb(g,y(ya.call(V,0)),c),Xa=x(V,e,v,f&&f.name,{nonTlbTranscludeDirective:T})):(V=y(Eb(c)).contents(),Z.empty(),Xa=x(V,e));if(G.template)if(K("template",ia,G,Z),ia=G,V=P(G.template)?G.template(Z,d):G.template,V=Y(V),G.replace){f=G;V=Cb.test(V)?y(V):[];c=V[0];if(1!=V.length||1!==c.nodeType)throw ja("tplrt",t,"");mb(g,Z,c);S={$attr:{}};V=da(c,[],S);var $=a.splice(N+1,a.length-(N+1));Q&&pc(V);a=a.concat(V).concat($);B(d,S);S=a.length}else Z.html(V);
if(G.templateUrl)K("template",ia,G,Z),ia=G,G.replace&&(f=G),J=C(a.splice(N,a.length-N),Z,d,g,Xa,l,n,{controllerDirectives:L,newIsolateScopeDirective:Q,templateDirective:ia,nonTlbTranscludeDirective:T}),S=a.length;else if(G.compile)try{O=G.compile(Z,d,Xa),P(O)?u(null,O,ra,W):O&&u(O.pre,O.post,ra,W)}catch(aa){m(aa,ha(Z))}G.terminal&&(J.terminal=!0,v=Math.max(v,G.priority))}J.scope=A&&!0===A.scope;J.transclude=E&&Xa;p.hasElementTranscludeDirective=D;return J}function pc(a){for(var b=0,c=a.length;b<c;b++)a[b]=
Tb(a[b],{$$isolateScope:!0})}function T(b,e,g,f,k,n,r){if(e===k)return null;k=null;if(c.hasOwnProperty(e)){var p;e=a.get(e+d);for(var z=0,u=e.length;z<u;z++)try{p=e[z],(f===s||f>p.priority)&&-1!=p.restrict.indexOf(g)&&(n&&(p=Tb(p,{$$start:n,$$end:r})),b.push(p),k=p)}catch(F){m(F)}}return k}function B(a,b){var c=b.$attr,d=a.$attr,e=a.$$element;q(a,function(d,e){"$"!=e.charAt(0)&&(b[e]&&(d+=("style"===e?";":" ")+b[e]),a.$set(e,d,!0,c[e]))});q(b,function(b,g){"class"==g?(ma(e,b),a["class"]=(a["class"]?
a["class"]+" ":"")+b):"style"==g?(e.attr("style",e.attr("style")+";"+b),a.style=(a.style?a.style+";":"")+b):"$"==g.charAt(0)||a.hasOwnProperty(g)||(a[g]=b,d[g]=c[g])})}function C(a,b,c,d,e,g,f,l){var k=[],m,r,z=b[0],u=a.shift(),F=D({},u,{templateUrl:null,transclude:null,replace:null,$$originalDirective:u}),x=P(u.templateUrl)?u.templateUrl(b,c):u.templateUrl;b.empty();n.get(v.getTrustedResourceUrl(x),{cache:p}).success(function(n){var p,J;n=Y(n);if(u.replace){n=Cb.test(n)?y(n):[];p=n[0];if(1!=n.length||
1!==p.nodeType)throw ja("tplrt",u.name,x);n={$attr:{}};mb(d,b,p);var v=da(p,[],n);X(u.scope)&&pc(v);a=v.concat(a);B(c,n)}else p=z,b.html(n);a.unshift(F);m=ia(a,p,c,e,b,u,g,f,l);q(d,function(a,c){a==p&&(d[c]=b[0])});for(r=L(b[0].childNodes,e);k.length;){n=k.shift();J=k.shift();var A=k.shift(),R=k.shift(),v=b[0];if(J!==z){var H=J.className;l.hasElementTranscludeDirective&&u.replace||(v=Eb(p));mb(A,y(J),v);ma(y(v),H)}J=m.transclude?Q(n,m.transclude):R;m(r,n,v,d,J)}k=null}).error(function(a,b,c,d){throw ja("tpload",
d.url);});return function(a,b,c,d,e){k?(k.push(b),k.push(c),k.push(d),k.push(e)):m(r,b,c,d,e)}}function E(a,b){var c=b.priority-a.priority;return 0!==c?c:a.name!==b.name?a.name<b.name?-1:1:a.index-b.index}function K(a,b,c,d){if(b)throw ja("multidir",b.name,c.name,a,ha(d));}function t(a,c){var d=b(c,!0);d&&a.push({priority:0,compile:aa(function(a,b){var c=b.parent(),e=c.data("$binding")||[];e.push(d);ma(c.data("$binding",e),"ng-binding");a.$watch(d,function(a){b[0].nodeValue=a})})})}function O(a,b){if("srcdoc"==
b)return v.HTML;var c=Ka(a);if("xlinkHref"==b||"FORM"==c&&"action"==b||"IMG"!=c&&("src"==b||"ngSrc"==b))return v.RESOURCE_URL}function N(a,c,d,e){var g=b(d,!0);if(g){if("multiple"===e&&"SELECT"===Ka(a))throw ja("selmulti",ha(a));c.push({priority:100,compile:function(){return{pre:function(c,d,l){d=l.$$observers||(l.$$observers={});if(f.test(e))throw ja("nodomevents");if(g=b(l[e],!0,O(a,e)))l[e]=g(c),(d[e]||(d[e]=[])).$$inter=!0,(l.$$observers&&l.$$observers[e].$$scope||c).$watch(g,function(a,b){"class"===
e&&a!=b?l.$updateClass(a,b):l.$set(e,a)})}}}})}}function mb(a,b,c){var d=b[0],e=b.length,g=d.parentNode,f,l;if(a)for(f=0,l=a.length;f<l;f++)if(a[f]==d){a[f++]=c;l=f+e-1;for(var k=a.length;f<k;f++,l++)l<k?a[f]=a[l]:delete a[f];a.length-=e-1;break}g&&g.replaceChild(c,d);a=U.createDocumentFragment();a.appendChild(d);c[y.expando]=d[y.expando];d=1;for(e=b.length;d<e;d++)g=b[d],y(g).remove(),a.appendChild(g),delete b[d];b[0]=c;b.length=1}function qc(a,b){return D(function(){return a.apply(null,arguments)},
a,b)}var Hb=function(a,b){this.$$element=a;this.$attr=b||{}};Hb.prototype={$normalize:na,$addClass:function(a){a&&0<a.length&&J.addClass(this.$$element,a)},$removeClass:function(a){a&&0<a.length&&J.removeClass(this.$$element,a)},$updateClass:function(a,b){var c=rc(a,b),d=rc(b,a);0===c.length?J.removeClass(this.$$element,d):0===d.length?J.addClass(this.$$element,c):J.setClass(this.$$element,c,d)},$set:function(a,b,c,d){var e=mc(this.$$element[0],a);e&&(this.$$element.prop(a,b),d=e);this[a]=b;d?this.$attr[a]=
d:(d=this.$attr[a])||(this.$attr[a]=d=fb(a,"-"));e=Ka(this.$$element);if("A"===e&&"href"===a||"IMG"===e&&"src"===a)this[a]=b=A(b,"src"===a);!1!==c&&(null===b||b===s?this.$$element.removeAttr(d):this.$$element.attr(d,b));(c=this.$$observers)&&q(c[a],function(a){try{a(b)}catch(c){m(c)}})},$observe:function(a,b){var c=this,d=c.$$observers||(c.$$observers={}),e=d[a]||(d[a]=[]);e.push(b);u.$evalAsync(function(){e.$$inter||b(c[a])});return b}};var Z=b.startSymbol(),ra=b.endSymbol(),Y="{{"==Z||"}}"==ra?
Da:function(a){return a.replace(/\{\{/g,Z).replace(/}}/g,ra)},W=/^ngAttr[A-Z]/;return x}]}function na(b){return Ta(b.replace(te,""))}function rc(b,a){var c="",d=b.split(/\s+/),e=a.split(/\s+/),g=0;a:for(;g<d.length;g++){for(var f=d[g],h=0;h<e.length;h++)if(f==e[h])continue a;c+=(0<c.length?" ":"")+f}return c}function Od(){var b={},a=/^(\S+)(\s+as\s+(\w+))?$/;this.register=function(a,d){Aa(a,"controller");X(a)?D(b,a):b[a]=d};this.$get=["$injector","$window",function(c,d){return function(e,g){var f,
h,l;w(e)&&(f=e.match(a),h=f[1],l=f[3],e=b.hasOwnProperty(h)?b[h]:bc(g.$scope,h,!0)||bc(d,h,!0),Ra(e,h,!0));f=c.instantiate(e,g);if(l){if(!g||"object"!=typeof g.$scope)throw t("$controller")("noscp",h||e.name,l);g.$scope[l]=f}return f}}]}function Pd(){this.$get=["$window",function(b){return y(b.document)}]}function Qd(){this.$get=["$log",function(b){return function(a,c){b.error.apply(b,arguments)}}]}function sc(b){var a={},c,d,e;if(!b)return a;q(b.split("\n"),function(b){e=b.indexOf(":");c=K(ca(b.substr(0,
e)));d=ca(b.substr(e+1));c&&(a[c]=a[c]?a[c]+(", "+d):d)});return a}function tc(b){var a=X(b)?b:s;return function(c){a||(a=sc(b));return c?a[K(c)]||null:a}}function uc(b,a,c){if(P(c))return c(b,a);q(c,function(c){b=c(b,a)});return b}function Td(){var b=/^\s*(\[|\{[^\{])/,a=/[\}\]]\s*$/,c=/^\)\]\}',?\n/,d={"Content-Type":"application/json;charset=utf-8"},e=this.defaults={transformResponse:[function(d){w(d)&&(d=d.replace(c,""),b.test(d)&&a.test(d)&&(d=Wb(d)));return d}],transformRequest:[function(a){return X(a)&&
"[object File]"!==wa.call(a)&&"[object Blob]"!==wa.call(a)?qa(a):a}],headers:{common:{Accept:"application/json, text/plain, */*"},post:ba(d),put:ba(d),patch:ba(d)},xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN"},g=this.interceptors=[],f=this.responseInterceptors=[];this.$get=["$httpBackend","$browser","$cacheFactory","$rootScope","$q","$injector",function(a,b,c,d,n,p){function r(a){function c(a){var b=D({},a,{data:uc(a.data,a.headers,d.transformResponse)});return 200<=a.status&&300>a.status?
b:n.reject(b)}var d={method:"get",transformRequest:e.transformRequest,transformResponse:e.transformResponse},g=function(a){function b(a){var c;q(a,function(b,d){P(b)&&(c=b(),null!=c?a[d]=c:delete a[d])})}var c=e.headers,d=D({},a.headers),g,f,c=D({},c.common,c[K(a.method)]);b(c);b(d);a:for(g in c){a=K(g);for(f in d)if(K(f)===a)continue a;d[g]=c[g]}return d}(a);D(d,a);d.headers=g;d.method=Fa(d.method);(a=Ib(d.url)?b.cookies()[d.xsrfCookieName||e.xsrfCookieName]:s)&&(g[d.xsrfHeaderName||e.xsrfHeaderName]=
a);var f=[function(a){g=a.headers;var b=uc(a.data,tc(g),a.transformRequest);E(a.data)&&q(g,function(a,b){"content-type"===K(b)&&delete g[b]});E(a.withCredentials)&&!E(e.withCredentials)&&(a.withCredentials=e.withCredentials);return z(a,b,g).then(c,c)},s],h=n.when(d);for(q(v,function(a){(a.request||a.requestError)&&f.unshift(a.request,a.requestError);(a.response||a.responseError)&&f.push(a.response,a.responseError)});f.length;){a=f.shift();var k=f.shift(),h=h.then(a,k)}h.success=function(a){h.then(function(b){a(b.data,
b.status,b.headers,d)});return h};h.error=function(a){h.then(null,function(b){a(b.data,b.status,b.headers,d)});return h};return h}function z(b,c,g){function f(a,b,c,e){v&&(200<=a&&300>a?v.put(s,[a,b,sc(c),e]):v.remove(s));l(b,a,c,e);d.$$phase||d.$apply()}function l(a,c,d,e){c=Math.max(c,0);(200<=c&&300>c?p.resolve:p.reject)({data:a,status:c,headers:tc(d),config:b,statusText:e})}function k(){var a=db(r.pendingRequests,b);-1!==a&&r.pendingRequests.splice(a,1)}var p=n.defer(),z=p.promise,v,q,s=u(b.url,
b.params);r.pendingRequests.push(b);z.then(k,k);(b.cache||e.cache)&&(!1!==b.cache&&"GET"==b.method)&&(v=X(b.cache)?b.cache:X(e.cache)?e.cache:F);if(v)if(q=v.get(s),B(q)){if(q.then)return q.then(k,k),q;M(q)?l(q[1],q[0],ba(q[2]),q[3]):l(q,200,{},"OK")}else v.put(s,z);E(q)&&a(b.method,s,c,f,g,b.timeout,b.withCredentials,b.responseType);return z}function u(a,b){if(!b)return a;var c=[];Sc(b,function(a,b){null===a||E(a)||(M(a)||(a=[a]),q(a,function(a){X(a)&&(a=qa(a));c.push(za(b)+"="+za(a))}))});0<c.length&&
(a+=(-1==a.indexOf("?")?"?":"&")+c.join("&"));return a}var F=c("$http"),v=[];q(g,function(a){v.unshift(w(a)?p.get(a):p.invoke(a))});q(f,function(a,b){var c=w(a)?p.get(a):p.invoke(a);v.splice(b,0,{response:function(a){return c(n.when(a))},responseError:function(a){return c(n.reject(a))}})});r.pendingRequests=[];(function(a){q(arguments,function(a){r[a]=function(b,c){return r(D(c||{},{method:a,url:b}))}})})("get","delete","head","jsonp");(function(a){q(arguments,function(a){r[a]=function(b,c,d){return r(D(d||
{},{method:a,url:b,data:c}))}})})("post","put");r.defaults=e;return r}]}function ue(b){if(8>=S&&(!b.match(/^(get|post|head|put|delete|options)$/i)||!O.XMLHttpRequest))return new O.ActiveXObject("Microsoft.XMLHTTP");if(O.XMLHttpRequest)return new O.XMLHttpRequest;throw t("$httpBackend")("noxhr");}function Ud(){this.$get=["$browser","$window","$document",function(b,a,c){return ve(b,ue,b.defer,a.angular.callbacks,c[0])}]}function ve(b,a,c,d,e){function g(a,b){var c=e.createElement("script"),d=function(){c.onreadystatechange=
c.onload=c.onerror=null;e.body.removeChild(c);b&&b()};c.type="text/javascript";c.src=a;S&&8>=S?c.onreadystatechange=function(){/loaded|complete/.test(c.readyState)&&d()}:c.onload=c.onerror=function(){d()};e.body.appendChild(c);return d}var f=-1;return function(e,l,k,m,n,p,r,z){function u(){v=f;A&&A();x&&x.abort()}function F(a,d,e,g,f){L&&c.cancel(L);A=x=null;0===d&&(d=e?200:"file"==sa(l).protocol?404:0);a(1223===d?204:d,e,g,f||"");b.$$completeOutstandingRequest(C)}var v;b.$$incOutstandingRequestCount();
l=l||b.url();if("jsonp"==K(e)){var J="_"+(d.counter++).toString(36);d[J]=function(a){d[J].data=a};var A=g(l.replace("JSON_CALLBACK","angular.callbacks."+J),function(){d[J].data?F(m,200,d[J].data):F(m,v||-2);d[J]=Ea.noop})}else{var x=a(e);x.open(e,l,!0);q(n,function(a,b){B(a)&&x.setRequestHeader(b,a)});x.onreadystatechange=function(){if(x&&4==x.readyState){var a=null,b=null;v!==f&&(a=x.getAllResponseHeaders(),b="response"in x?x.response:x.responseText);F(m,v||x.status,b,a,x.statusText||"")}};r&&(x.withCredentials=
!0);if(z)try{x.responseType=z}catch(s){if("json"!==z)throw s;}x.send(k||null)}if(0<p)var L=c(u,p);else p&&p.then&&p.then(u)}}function Rd(){var b="{{",a="}}";this.startSymbol=function(a){return a?(b=a,this):b};this.endSymbol=function(b){return b?(a=b,this):a};this.$get=["$parse","$exceptionHandler","$sce",function(c,d,e){function g(g,k,m){for(var n,p,r=0,z=[],u=g.length,F=!1,v=[];r<u;)-1!=(n=g.indexOf(b,r))&&-1!=(p=g.indexOf(a,n+f))?(r!=n&&z.push(g.substring(r,n)),z.push(r=c(F=g.substring(n+f,p))),
r.exp=F,r=p+h,F=!0):(r!=u&&z.push(g.substring(r)),r=u);(u=z.length)||(z.push(""),u=1);if(m&&1<z.length)throw vc("noconcat",g);if(!k||F)return v.length=u,r=function(a){try{for(var b=0,c=u,f;b<c;b++)"function"==typeof(f=z[b])&&(f=f(a),f=m?e.getTrusted(m,f):e.valueOf(f),null===f||E(f)?f="":"string"!=typeof f&&(f=qa(f))),v[b]=f;return v.join("")}catch(h){a=vc("interr",g,h.toString()),d(a)}},r.exp=g,r.parts=z,r}var f=b.length,h=a.length;g.startSymbol=function(){return b};g.endSymbol=function(){return a};
return g}]}function Sd(){this.$get=["$rootScope","$window","$q",function(b,a,c){function d(d,f,h,l){var k=a.setInterval,m=a.clearInterval,n=c.defer(),p=n.promise,r=0,z=B(l)&&!l;h=B(h)?h:0;p.then(null,null,d);p.$$intervalId=k(function(){n.notify(r++);0<h&&r>=h&&(n.resolve(r),m(p.$$intervalId),delete e[p.$$intervalId]);z||b.$apply()},f);e[p.$$intervalId]=n;return p}var e={};d.cancel=function(a){return a&&a.$$intervalId in e?(e[a.$$intervalId].reject("canceled"),clearInterval(a.$$intervalId),delete e[a.$$intervalId],
!0):!1};return d}]}function ad(){this.$get=function(){return{id:"en-us",NUMBER_FORMATS:{DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{minInt:1,minFrac:0,maxFrac:3,posPre:"",posSuf:"",negPre:"-",negSuf:"",gSize:3,lgSize:3},{minInt:1,minFrac:2,maxFrac:2,posPre:"\u00a4",posSuf:"",negPre:"(\u00a4",negSuf:")",gSize:3,lgSize:3}],CURRENCY_SYM:"$"},DATETIME_FORMATS:{MONTH:"January February March April May June July August September October November December".split(" "),SHORTMONTH:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
DAY:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),SHORTDAY:"Sun Mon Tue Wed Thu Fri Sat".split(" "),AMPMS:["AM","PM"],medium:"MMM d, y h:mm:ss a","short":"M/d/yy h:mm a",fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",mediumDate:"MMM d, y",shortDate:"M/d/yy",mediumTime:"h:mm:ss a",shortTime:"h:mm a"},pluralCat:function(b){return 1===b?"one":"other"}}}}function wc(b){b=b.split("/");for(var a=b.length;a--;)b[a]=wb(b[a]);return b.join("/")}function xc(b,a,c){b=sa(b,c);a.$$protocol=
b.protocol;a.$$host=b.hostname;a.$$port=Y(b.port)||we[b.protocol]||null}function yc(b,a,c){var d="/"!==b.charAt(0);d&&(b="/"+b);b=sa(b,c);a.$$path=decodeURIComponent(d&&"/"===b.pathname.charAt(0)?b.pathname.substring(1):b.pathname);a.$$search=Yb(b.search);a.$$hash=decodeURIComponent(b.hash);a.$$path&&"/"!=a.$$path.charAt(0)&&(a.$$path="/"+a.$$path)}function oa(b,a){if(0===a.indexOf(b))return a.substr(b.length)}function Ya(b){var a=b.indexOf("#");return-1==a?b:b.substr(0,a)}function Jb(b){return b.substr(0,
Ya(b).lastIndexOf("/")+1)}function zc(b,a){this.$$html5=!0;a=a||"";var c=Jb(b);xc(b,this,b);this.$$parse=function(a){var e=oa(c,a);if(!w(e))throw Kb("ipthprfx",a,c);yc(e,this,b);this.$$path||(this.$$path="/");this.$$compose()};this.$$compose=function(){var a=Zb(this.$$search),b=this.$$hash?"#"+wb(this.$$hash):"";this.$$url=wc(this.$$path)+(a?"?"+a:"")+b;this.$$absUrl=c+this.$$url.substr(1)};this.$$rewrite=function(d){var e;if((e=oa(b,d))!==s)return d=e,(e=oa(a,e))!==s?c+(oa("/",e)||e):b+d;if((e=oa(c,
d))!==s)return c+e;if(c==d+"/")return c}}function Lb(b,a){var c=Jb(b);xc(b,this,b);this.$$parse=function(d){var e=oa(b,d)||oa(c,d),e="#"==e.charAt(0)?oa(a,e):this.$$html5?e:"";if(!w(e))throw Kb("ihshprfx",d,a);yc(e,this,b);d=this.$$path;var g=/^\/?.*?:(\/.*)/;0===e.indexOf(b)&&(e=e.replace(b,""));g.exec(e)||(d=(e=g.exec(d))?e[1]:d);this.$$path=d;this.$$compose()};this.$$compose=function(){var c=Zb(this.$$search),e=this.$$hash?"#"+wb(this.$$hash):"";this.$$url=wc(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=
b+(this.$$url?a+this.$$url:"")};this.$$rewrite=function(a){if(Ya(b)==Ya(a))return a}}function Ac(b,a){this.$$html5=!0;Lb.apply(this,arguments);var c=Jb(b);this.$$rewrite=function(d){var e;if(b==Ya(d))return d;if(e=oa(c,d))return b+a+e;if(c===d+"/")return c}}function nb(b){return function(){return this[b]}}function Bc(b,a){return function(c){if(E(c))return this[b];this[b]=a(c);this.$$compose();return this}}function Vd(){var b="",a=!1;this.hashPrefix=function(a){return B(a)?(b=a,this):b};this.html5Mode=
function(b){return B(b)?(a=b,this):a};this.$get=["$rootScope","$browser","$sniffer","$rootElement",function(c,d,e,g){function f(a){c.$broadcast("$locationChangeSuccess",h.absUrl(),a)}var h,l=d.baseHref(),k=d.url();a?(l=k.substring(0,k.indexOf("/",k.indexOf("//")+2))+(l||"/"),e=e.history?zc:Ac):(l=Ya(k),e=Lb);h=new e(l,"#"+b);h.$$parse(h.$$rewrite(k));g.on("click",function(a){if(!a.ctrlKey&&!a.metaKey&&2!=a.which){for(var b=y(a.target);"a"!==K(b[0].nodeName);)if(b[0]===g[0]||!(b=b.parent())[0])return;
var e=b.prop("href");X(e)&&"[object SVGAnimatedString]"===e.toString()&&(e=sa(e.animVal).href);var f=h.$$rewrite(e);e&&(!b.attr("target")&&f&&!a.isDefaultPrevented())&&(a.preventDefault(),f!=d.url()&&(h.$$parse(f),c.$apply(),O.angular["ff-684208-preventDefault"]=!0))}});h.absUrl()!=k&&d.url(h.absUrl(),!0);d.onUrlChange(function(a){h.absUrl()!=a&&(c.$evalAsync(function(){var b=h.absUrl();h.$$parse(a);c.$broadcast("$locationChangeStart",a,b).defaultPrevented?(h.$$parse(b),d.url(b)):f(b)}),c.$$phase||
c.$digest())});var m=0;c.$watch(function(){var a=d.url(),b=h.$$replace;m&&a==h.absUrl()||(m++,c.$evalAsync(function(){c.$broadcast("$locationChangeStart",h.absUrl(),a).defaultPrevented?h.$$parse(a):(d.url(h.absUrl(),b),f(a))}));h.$$replace=!1;return m});return h}]}function Wd(){var b=!0,a=this;this.debugEnabled=function(a){return B(a)?(b=a,this):b};this.$get=["$window",function(c){function d(a){a instanceof Error&&(a.stack?a=a.message&&-1===a.stack.indexOf(a.message)?"Error: "+a.message+"\n"+a.stack:
a.stack:a.sourceURL&&(a=a.message+"\n"+a.sourceURL+":"+a.line));return a}function e(a){var b=c.console||{},e=b[a]||b.log||C;a=!1;try{a=!!e.apply}catch(l){}return a?function(){var a=[];q(arguments,function(b){a.push(d(b))});return e.apply(b,a)}:function(a,b){e(a,null==b?"":b)}}return{log:e("log"),info:e("info"),warn:e("warn"),error:e("error"),debug:function(){var c=e("debug");return function(){b&&c.apply(a,arguments)}}()}}]}function fa(b,a){if("constructor"===b)throw Ba("isecfld",a);return b}function Za(b,
a){if(b){if(b.constructor===b)throw Ba("isecfn",a);if(b.document&&b.location&&b.alert&&b.setInterval)throw Ba("isecwindow",a);if(b.children&&(b.nodeName||b.prop&&b.attr&&b.find))throw Ba("isecdom",a);}return b}function ob(b,a,c,d,e){e=e||{};a=a.split(".");for(var g,f=0;1<a.length;f++){g=fa(a.shift(),d);var h=b[g];h||(h={},b[g]=h);b=h;b.then&&e.unwrapPromises&&(ta(d),"$$v"in b||function(a){a.then(function(b){a.$$v=b})}(b),b.$$v===s&&(b.$$v={}),b=b.$$v)}g=fa(a.shift(),d);return b[g]=c}function Cc(b,
a,c,d,e,g,f){fa(b,g);fa(a,g);fa(c,g);fa(d,g);fa(e,g);return f.unwrapPromises?function(f,l){var k=l&&l.hasOwnProperty(b)?l:f,m;if(null==k)return k;(k=k[b])&&k.then&&(ta(g),"$$v"in k||(m=k,m.$$v=s,m.then(function(a){m.$$v=a})),k=k.$$v);if(!a)return k;if(null==k)return s;(k=k[a])&&k.then&&(ta(g),"$$v"in k||(m=k,m.$$v=s,m.then(function(a){m.$$v=a})),k=k.$$v);if(!c)return k;if(null==k)return s;(k=k[c])&&k.then&&(ta(g),"$$v"in k||(m=k,m.$$v=s,m.then(function(a){m.$$v=a})),k=k.$$v);if(!d)return k;if(null==
k)return s;(k=k[d])&&k.then&&(ta(g),"$$v"in k||(m=k,m.$$v=s,m.then(function(a){m.$$v=a})),k=k.$$v);if(!e)return k;if(null==k)return s;(k=k[e])&&k.then&&(ta(g),"$$v"in k||(m=k,m.$$v=s,m.then(function(a){m.$$v=a})),k=k.$$v);return k}:function(g,f){var k=f&&f.hasOwnProperty(b)?f:g;if(null==k)return k;k=k[b];if(!a)return k;if(null==k)return s;k=k[a];if(!c)return k;if(null==k)return s;k=k[c];if(!d)return k;if(null==k)return s;k=k[d];return e?null==k?s:k=k[e]:k}}function xe(b,a){fa(b,a);return function(a,
d){return null==a?s:(d&&d.hasOwnProperty(b)?d:a)[b]}}function ye(b,a,c){fa(b,c);fa(a,c);return function(c,e){if(null==c)return s;c=(e&&e.hasOwnProperty(b)?e:c)[b];return null==c?s:c[a]}}function Dc(b,a,c){if(Mb.hasOwnProperty(b))return Mb[b];var d=b.split("."),e=d.length,g;if(a.unwrapPromises||1!==e)if(a.unwrapPromises||2!==e)if(a.csp)g=6>e?Cc(d[0],d[1],d[2],d[3],d[4],c,a):function(b,g){var f=0,h;do h=Cc(d[f++],d[f++],d[f++],d[f++],d[f++],c,a)(b,g),g=s,b=h;while(f<e);return h};else{var f="var p;\n";
q(d,function(b,d){fa(b,c);f+="if(s == null) return undefined;\ns="+(d?"s":'((k&&k.hasOwnProperty("'+b+'"))?k:s)')+'["'+b+'"];\n'+(a.unwrapPromises?'if (s && s.then) {\n pw("'+c.replace(/(["\r\n])/g,"\\$1")+'");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=v;});\n}\n s=s.$$v\n}\n':"")});var f=f+"return s;",h=new Function("s","k","pw",f);h.toString=aa(f);g=a.unwrapPromises?function(a,b){return h(a,b,ta)}:h}else g=ye(d[0],d[1],c);else g=xe(d[0],c);"hasOwnProperty"!==
b&&(Mb[b]=g);return g}function Xd(){var b={},a={csp:!1,unwrapPromises:!1,logPromiseWarnings:!0};this.unwrapPromises=function(b){return B(b)?(a.unwrapPromises=!!b,this):a.unwrapPromises};this.logPromiseWarnings=function(b){return B(b)?(a.logPromiseWarnings=b,this):a.logPromiseWarnings};this.$get=["$filter","$sniffer","$log",function(c,d,e){a.csp=d.csp;ta=function(b){a.logPromiseWarnings&&!Ec.hasOwnProperty(b)&&(Ec[b]=!0,e.warn("[$parse] Promise found in the expression `"+b+"`. Automatic unwrapping of promises in Angular expressions is deprecated."))};
return function(d){var e;switch(typeof d){case "string":if(b.hasOwnProperty(d))return b[d];e=new Nb(a);e=(new $a(e,c,a)).parse(d,!1);"hasOwnProperty"!==d&&(b[d]=e);return e;case "function":return d;default:return C}}}]}function Zd(){this.$get=["$rootScope","$exceptionHandler",function(b,a){return ze(function(a){b.$evalAsync(a)},a)}]}function ze(b,a){function c(a){return a}function d(a){return f(a)}var e=function(){var f=[],k,m;return m={resolve:function(a){if(f){var c=f;f=s;k=g(a);c.length&&b(function(){for(var a,
b=0,d=c.length;b<d;b++)a=c[b],k.then(a[0],a[1],a[2])})}},reject:function(a){m.resolve(h(a))},notify:function(a){if(f){var c=f;f.length&&b(function(){for(var b,d=0,e=c.length;d<e;d++)b=c[d],b[2](a)})}},promise:{then:function(b,g,h){var m=e(),u=function(d){try{m.resolve((P(b)?b:c)(d))}catch(e){m.reject(e),a(e)}},F=function(b){try{m.resolve((P(g)?g:d)(b))}catch(c){m.reject(c),a(c)}},v=function(b){try{m.notify((P(h)?h:c)(b))}catch(d){a(d)}};f?f.push([u,F,v]):k.then(u,F,v);return m.promise},"catch":function(a){return this.then(null,
a)},"finally":function(a){function b(a,c){var d=e();c?d.resolve(a):d.reject(a);return d.promise}function d(e,g){var f=null;try{f=(a||c)()}catch(h){return b(h,!1)}return f&&P(f.then)?f.then(function(){return b(e,g)},function(a){return b(a,!1)}):b(e,g)}return this.then(function(a){return d(a,!0)},function(a){return d(a,!1)})}}}},g=function(a){return a&&P(a.then)?a:{then:function(c){var d=e();b(function(){d.resolve(c(a))});return d.promise}}},f=function(a){var b=e();b.reject(a);return b.promise},h=function(c){return{then:function(g,
f){var h=e();b(function(){try{h.resolve((P(f)?f:d)(c))}catch(b){h.reject(b),a(b)}});return h.promise}}};return{defer:e,reject:f,when:function(h,k,m,n){var p=e(),r,z=function(b){try{return(P(k)?k:c)(b)}catch(d){return a(d),f(d)}},u=function(b){try{return(P(m)?m:d)(b)}catch(c){return a(c),f(c)}},F=function(b){try{return(P(n)?n:c)(b)}catch(d){a(d)}};b(function(){g(h).then(function(a){r||(r=!0,p.resolve(g(a).then(z,u,F)))},function(a){r||(r=!0,p.resolve(u(a)))},function(a){r||p.notify(F(a))})});return p.promise},
all:function(a){var b=e(),c=0,d=M(a)?[]:{};q(a,function(a,e){c++;g(a).then(function(a){d.hasOwnProperty(e)||(d[e]=a,--c||b.resolve(d))},function(a){d.hasOwnProperty(e)||b.reject(a)})});0===c&&b.resolve(d);return b.promise}}}function fe(){this.$get=["$window","$timeout",function(b,a){var c=b.requestAnimationFrame||b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame,d=b.cancelAnimationFrame||b.webkitCancelAnimationFrame||b.mozCancelAnimationFrame||b.webkitCancelRequestAnimationFrame,e=!!c,g=e?
function(a){var b=c(a);return function(){d(b)}}:function(b){var c=a(b,16.66,!1);return function(){a.cancel(c)}};g.supported=e;return g}]}function Yd(){var b=10,a=t("$rootScope"),c=null;this.digestTtl=function(a){arguments.length&&(b=a);return b};this.$get=["$injector","$exceptionHandler","$parse","$browser",function(d,e,g,f){function h(){this.$id=bb();this.$$phase=this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null;this["this"]=this.$root=this;
this.$$destroyed=!1;this.$$asyncQueue=[];this.$$postDigestQueue=[];this.$$listeners={};this.$$listenerCount={};this.$$isolateBindings={}}function l(b){if(p.$$phase)throw a("inprog",p.$$phase);p.$$phase=b}function k(a,b){var c=g(a);Ra(c,b);return c}function m(a,b,c){do a.$$listenerCount[c]-=b,0===a.$$listenerCount[c]&&delete a.$$listenerCount[c];while(a=a.$parent)}function n(){}h.prototype={constructor:h,$new:function(a){a?(a=new h,a.$root=this.$root,a.$$asyncQueue=this.$$asyncQueue,a.$$postDigestQueue=
this.$$postDigestQueue):(a=function(){},a.prototype=this,a=new a,a.$id=bb());a["this"]=a;a.$$listeners={};a.$$listenerCount={};a.$parent=this;a.$$watchers=a.$$nextSibling=a.$$childHead=a.$$childTail=null;a.$$prevSibling=this.$$childTail;this.$$childHead?this.$$childTail=this.$$childTail.$$nextSibling=a:this.$$childHead=this.$$childTail=a;return a},$watch:function(a,b,d){var e=k(a,"watch"),g=this.$$watchers,f={fn:b,last:n,get:e,exp:a,eq:!!d};c=null;if(!P(b)){var h=k(b||C,"listener");f.fn=function(a,
b,c){h(c)}}if("string"==typeof a&&e.constant){var l=f.fn;f.fn=function(a,b,c){l.call(this,a,b,c);Oa(g,f)}}g||(g=this.$$watchers=[]);g.unshift(f);return function(){Oa(g,f);c=null}},$watchCollection:function(a,b){var c=this,d,e,f,h=1<b.length,l=0,k=g(a),m=[],n={},p=!0,q=0;return this.$watch(function(){d=k(c);var a,b;if(X(d))if(ab(d))for(e!==m&&(e=m,q=e.length=0,l++),a=d.length,q!==a&&(l++,e.length=q=a),b=0;b<a;b++)e[b]!==e[b]&&d[b]!==d[b]||e[b]===d[b]||(l++,e[b]=d[b]);else{e!==n&&(e=n={},q=0,l++);a=
0;for(b in d)d.hasOwnProperty(b)&&(a++,e.hasOwnProperty(b)?e[b]!==d[b]&&(l++,e[b]=d[b]):(q++,e[b]=d[b],l++));if(q>a)for(b in l++,e)e.hasOwnProperty(b)&&!d.hasOwnProperty(b)&&(q--,delete e[b])}else e!==d&&(e=d,l++);return l},function(){p?(p=!1,b(d,d,c)):b(d,f,c);if(h)if(X(d))if(ab(d)){f=Array(d.length);for(var a=0;a<d.length;a++)f[a]=d[a]}else for(a in f={},d)Fc.call(d,a)&&(f[a]=d[a]);else f=d})},$digest:function(){var d,g,f,h,k=this.$$asyncQueue,m=this.$$postDigestQueue,q,x,s=b,L,Q=[],y,H,R;l("$digest");
c=null;do{x=!1;for(L=this;k.length;){try{R=k.shift(),R.scope.$eval(R.expression)}catch(B){p.$$phase=null,e(B)}c=null}a:do{if(h=L.$$watchers)for(q=h.length;q--;)try{if(d=h[q])if((g=d.get(L))!==(f=d.last)&&!(d.eq?xa(g,f):"number"==typeof g&&"number"==typeof f&&isNaN(g)&&isNaN(f)))x=!0,c=d,d.last=d.eq?ba(g):g,d.fn(g,f===n?g:f,L),5>s&&(y=4-s,Q[y]||(Q[y]=[]),H=P(d.exp)?"fn: "+(d.exp.name||d.exp.toString()):d.exp,H+="; newVal: "+qa(g)+"; oldVal: "+qa(f),Q[y].push(H));else if(d===c){x=!1;break a}}catch(w){p.$$phase=
null,e(w)}if(!(h=L.$$childHead||L!==this&&L.$$nextSibling))for(;L!==this&&!(h=L.$$nextSibling);)L=L.$parent}while(L=h);if((x||k.length)&&!s--)throw p.$$phase=null,a("infdig",b,qa(Q));}while(x||k.length);for(p.$$phase=null;m.length;)try{m.shift()()}catch(T){e(T)}},$destroy:function(){if(!this.$$destroyed){var a=this.$parent;this.$broadcast("$destroy");this.$$destroyed=!0;this!==p&&(q(this.$$listenerCount,eb(null,m,this)),a.$$childHead==this&&(a.$$childHead=this.$$nextSibling),a.$$childTail==this&&
(a.$$childTail=this.$$prevSibling),this.$$prevSibling&&(this.$$prevSibling.$$nextSibling=this.$$nextSibling),this.$$nextSibling&&(this.$$nextSibling.$$prevSibling=this.$$prevSibling),this.$parent=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=this.$root=null,this.$$listeners={},this.$$watchers=this.$$asyncQueue=this.$$postDigestQueue=[],this.$destroy=this.$digest=this.$apply=C,this.$on=this.$watch=function(){return C})}},$eval:function(a,b){return g(a)(this,b)},$evalAsync:function(a){p.$$phase||
p.$$asyncQueue.length||f.defer(function(){p.$$asyncQueue.length&&p.$digest()});this.$$asyncQueue.push({scope:this,expression:a})},$$postDigest:function(a){this.$$postDigestQueue.push(a)},$apply:function(a){try{return l("$apply"),this.$eval(a)}catch(b){e(b)}finally{p.$$phase=null;try{p.$digest()}catch(c){throw e(c),c;}}},$on:function(a,b){var c=this.$$listeners[a];c||(this.$$listeners[a]=c=[]);c.push(b);var d=this;do d.$$listenerCount[a]||(d.$$listenerCount[a]=0),d.$$listenerCount[a]++;while(d=d.$parent);
var e=this;return function(){c[db(c,b)]=null;m(e,1,a)}},$emit:function(a,b){var c=[],d,g=this,f=!1,h={name:a,targetScope:g,stopPropagation:function(){f=!0},preventDefault:function(){h.defaultPrevented=!0},defaultPrevented:!1},l=[h].concat(ya.call(arguments,1)),k,m;do{d=g.$$listeners[a]||c;h.currentScope=g;k=0;for(m=d.length;k<m;k++)if(d[k])try{d[k].apply(null,l)}catch(n){e(n)}else d.splice(k,1),k--,m--;if(f)break;g=g.$parent}while(g);return h},$broadcast:function(a,b){for(var c=this,d=this,g={name:a,
targetScope:this,preventDefault:function(){g.defaultPrevented=!0},defaultPrevented:!1},f=[g].concat(ya.call(arguments,1)),h,k;c=d;){g.currentScope=c;d=c.$$listeners[a]||[];h=0;for(k=d.length;h<k;h++)if(d[h])try{d[h].apply(null,f)}catch(l){e(l)}else d.splice(h,1),h--,k--;if(!(d=c.$$listenerCount[a]&&c.$$childHead||c!==this&&c.$$nextSibling))for(;c!==this&&!(d=c.$$nextSibling);)c=c.$parent}return g}};var p=new h;return p}]}function bd(){var b=/^\s*(https?|ftp|mailto|tel|file):/,a=/^\s*(https?|ftp|file):|data:image\//;
this.aHrefSanitizationWhitelist=function(a){return B(a)?(b=a,this):b};this.imgSrcSanitizationWhitelist=function(b){return B(b)?(a=b,this):a};this.$get=function(){return function(c,d){var e=d?a:b,g;if(!S||8<=S)if(g=sa(c).href,""!==g&&!g.match(e))return"unsafe:"+g;return c}}}function Ae(b){if("self"===b)return b;if(w(b)){if(-1<b.indexOf("***"))throw ua("iwcard",b);b=b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08").replace("\\*\\*",".*").replace("\\*","[^:/.?&;]*");return RegExp("^"+
b+"$")}if(cb(b))return RegExp("^"+b.source+"$");throw ua("imatcher");}function Gc(b){var a=[];B(b)&&q(b,function(b){a.push(Ae(b))});return a}function ae(){this.SCE_CONTEXTS=ga;var b=["self"],a=[];this.resourceUrlWhitelist=function(a){arguments.length&&(b=Gc(a));return b};this.resourceUrlBlacklist=function(b){arguments.length&&(a=Gc(b));return a};this.$get=["$injector",function(c){function d(a){var b=function(a){this.$$unwrapTrustedValue=function(){return a}};a&&(b.prototype=new a);b.prototype.valueOf=
function(){return this.$$unwrapTrustedValue()};b.prototype.toString=function(){return this.$$unwrapTrustedValue().toString()};return b}var e=function(a){throw ua("unsafe");};c.has("$sanitize")&&(e=c.get("$sanitize"));var g=d(),f={};f[ga.HTML]=d(g);f[ga.CSS]=d(g);f[ga.URL]=d(g);f[ga.JS]=d(g);f[ga.RESOURCE_URL]=d(f[ga.URL]);return{trustAs:function(a,b){var c=f.hasOwnProperty(a)?f[a]:null;if(!c)throw ua("icontext",a,b);if(null===b||b===s||""===b)return b;if("string"!==typeof b)throw ua("itype",a);return new c(b)},
getTrusted:function(c,d){if(null===d||d===s||""===d)return d;var g=f.hasOwnProperty(c)?f[c]:null;if(g&&d instanceof g)return d.$$unwrapTrustedValue();if(c===ga.RESOURCE_URL){var g=sa(d.toString()),m,n,p=!1;m=0;for(n=b.length;m<n;m++)if("self"===b[m]?Ib(g):b[m].exec(g.href)){p=!0;break}if(p)for(m=0,n=a.length;m<n;m++)if("self"===a[m]?Ib(g):a[m].exec(g.href)){p=!1;break}if(p)return d;throw ua("insecurl",d.toString());}if(c===ga.HTML)return e(d);throw ua("unsafe");},valueOf:function(a){return a instanceof
g?a.$$unwrapTrustedValue():a}}}]}function $d(){var b=!0;this.enabled=function(a){arguments.length&&(b=!!a);return b};this.$get=["$parse","$sniffer","$sceDelegate",function(a,c,d){if(b&&c.msie&&8>c.msieDocumentMode)throw ua("iequirks");var e=ba(ga);e.isEnabled=function(){return b};e.trustAs=d.trustAs;e.getTrusted=d.getTrusted;e.valueOf=d.valueOf;b||(e.trustAs=e.getTrusted=function(a,b){return b},e.valueOf=Da);e.parseAs=function(b,c){var d=a(c);return d.literal&&d.constant?d:function(a,c){return e.getTrusted(b,
d(a,c))}};var g=e.parseAs,f=e.getTrusted,h=e.trustAs;q(ga,function(a,b){var c=K(b);e[Ta("parse_as_"+c)]=function(b){return g(a,b)};e[Ta("get_trusted_"+c)]=function(b){return f(a,b)};e[Ta("trust_as_"+c)]=function(b){return h(a,b)}});return e}]}function be(){this.$get=["$window","$document",function(b,a){var c={},d=Y((/android (\d+)/.exec(K((b.navigator||{}).userAgent))||[])[1]),e=/Boxee/i.test((b.navigator||{}).userAgent),g=a[0]||{},f=g.documentMode,h,l=/^(Moz|webkit|O|ms)(?=[A-Z])/,k=g.body&&g.body.style,
m=!1,n=!1;if(k){for(var p in k)if(m=l.exec(p)){h=m[0];h=h.substr(0,1).toUpperCase()+h.substr(1);break}h||(h="WebkitOpacity"in k&&"webkit");m=!!("transition"in k||h+"Transition"in k);n=!!("animation"in k||h+"Animation"in k);!d||m&&n||(m=w(g.body.style.webkitTransition),n=w(g.body.style.webkitAnimation))}return{history:!(!b.history||!b.history.pushState||4>d||e),hashchange:"onhashchange"in b&&(!f||7<f),hasEvent:function(a){if("input"==a&&9==S)return!1;if(E(c[a])){var b=g.createElement("div");c[a]="on"+
a in b}return c[a]},csp:Vb(),vendorPrefix:h,transitions:m,animations:n,android:d,msie:S,msieDocumentMode:f}}]}function de(){this.$get=["$rootScope","$browser","$q","$exceptionHandler",function(b,a,c,d){function e(e,h,l){var k=c.defer(),m=k.promise,n=B(l)&&!l;h=a.defer(function(){try{k.resolve(e())}catch(a){k.reject(a),d(a)}finally{delete g[m.$$timeoutId]}n||b.$apply()},h);m.$$timeoutId=h;g[h]=k;return m}var g={};e.cancel=function(b){return b&&b.$$timeoutId in g?(g[b.$$timeoutId].reject("canceled"),
delete g[b.$$timeoutId],a.defer.cancel(b.$$timeoutId)):!1};return e}]}function sa(b,a){var c=b;S&&(W.setAttribute("href",c),c=W.href);W.setAttribute("href",c);return{href:W.href,protocol:W.protocol?W.protocol.replace(/:$/,""):"",host:W.host,search:W.search?W.search.replace(/^\?/,""):"",hash:W.hash?W.hash.replace(/^#/,""):"",hostname:W.hostname,port:W.port,pathname:"/"===W.pathname.charAt(0)?W.pathname:"/"+W.pathname}}function Ib(b){b=w(b)?sa(b):b;return b.protocol===Hc.protocol&&b.host===Hc.host}
function ee(){this.$get=aa(O)}function gc(b){function a(d,e){if(X(d)){var g={};q(d,function(b,c){g[c]=a(c,b)});return g}return b.factory(d+c,e)}var c="Filter";this.register=a;this.$get=["$injector",function(a){return function(b){return a.get(b+c)}}];a("currency",Ic);a("date",Jc);a("filter",Be);a("json",Ce);a("limitTo",De);a("lowercase",Ee);a("number",Kc);a("orderBy",Lc);a("uppercase",Fe)}function Be(){return function(b,a,c){if(!M(b))return b;var d=typeof c,e=[];e.check=function(a){for(var b=0;b<e.length;b++)if(!e[b](a))return!1;
return!0};"function"!==d&&(c="boolean"===d&&c?function(a,b){return Ea.equals(a,b)}:function(a,b){if(a&&b&&"object"===typeof a&&"object"===typeof b){for(var d in a)if("$"!==d.charAt(0)&&Fc.call(a,d)&&c(a[d],b[d]))return!0;return!1}b=(""+b).toLowerCase();return-1<(""+a).toLowerCase().indexOf(b)});var g=function(a,b){if("string"==typeof b&&"!"===b.charAt(0))return!g(a,b.substr(1));switch(typeof a){case "boolean":case "number":case "string":return c(a,b);case "object":switch(typeof b){case "object":return c(a,
b);default:for(var d in a)if("$"!==d.charAt(0)&&g(a[d],b))return!0}return!1;case "array":for(d=0;d<a.length;d++)if(g(a[d],b))return!0;return!1;default:return!1}};switch(typeof a){case "boolean":case "number":case "string":a={$:a};case "object":for(var f in a)(function(b){"undefined"!=typeof a[b]&&e.push(function(c){return g("$"==b?c:c&&c[b],a[b])})})(f);break;case "function":e.push(a);break;default:return b}d=[];for(f=0;f<b.length;f++){var h=b[f];e.check(h)&&d.push(h)}return d}}function Ic(b){var a=
b.NUMBER_FORMATS;return function(b,d){E(d)&&(d=a.CURRENCY_SYM);return Mc(b,a.PATTERNS[1],a.GROUP_SEP,a.DECIMAL_SEP,2).replace(/\u00A4/g,d)}}function Kc(b){var a=b.NUMBER_FORMATS;return function(b,d){return Mc(b,a.PATTERNS[0],a.GROUP_SEP,a.DECIMAL_SEP,d)}}function Mc(b,a,c,d,e){if(null==b||!isFinite(b)||X(b))return"";var g=0>b;b=Math.abs(b);var f=b+"",h="",l=[],k=!1;if(-1!==f.indexOf("e")){var m=f.match(/([\d\.]+)e(-?)(\d+)/);m&&"-"==m[2]&&m[3]>e+1?f="0":(h=f,k=!0)}if(k)0<e&&(-1<b&&1>b)&&(h=b.toFixed(e));
else{f=(f.split(Nc)[1]||"").length;E(e)&&(e=Math.min(Math.max(a.minFrac,f),a.maxFrac));f=Math.pow(10,e);b=Math.round(b*f)/f;b=(""+b).split(Nc);f=b[0];b=b[1]||"";var m=0,n=a.lgSize,p=a.gSize;if(f.length>=n+p)for(m=f.length-n,k=0;k<m;k++)0===(m-k)%p&&0!==k&&(h+=c),h+=f.charAt(k);for(k=m;k<f.length;k++)0===(f.length-k)%n&&0!==k&&(h+=c),h+=f.charAt(k);for(;b.length<e;)b+="0";e&&"0"!==e&&(h+=d+b.substr(0,e))}l.push(g?a.negPre:a.posPre);l.push(h);l.push(g?a.negSuf:a.posSuf);return l.join("")}function Ob(b,
a,c){var d="";0>b&&(d="-",b=-b);for(b=""+b;b.length<a;)b="0"+b;c&&(b=b.substr(b.length-a));return d+b}function $(b,a,c,d){c=c||0;return function(e){e=e["get"+b]();if(0<c||e>-c)e+=c;0===e&&-12==c&&(e=12);return Ob(e,a,d)}}function pb(b,a){return function(c,d){var e=c["get"+b](),g=Fa(a?"SHORT"+b:b);return d[g][e]}}function Jc(b){function a(a){var b;if(b=a.match(c)){a=new Date(0);var g=0,f=0,h=b[8]?a.setUTCFullYear:a.setFullYear,l=b[8]?a.setUTCHours:a.setHours;b[9]&&(g=Y(b[9]+b[10]),f=Y(b[9]+b[11]));
h.call(a,Y(b[1]),Y(b[2])-1,Y(b[3]));g=Y(b[4]||0)-g;f=Y(b[5]||0)-f;h=Y(b[6]||0);b=Math.round(1E3*parseFloat("0."+(b[7]||0)));l.call(a,g,f,h,b)}return a}var c=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;return function(c,e){var g="",f=[],h,l;e=e||"mediumDate";e=b.DATETIME_FORMATS[e]||e;w(c)&&(c=Ge.test(c)?Y(c):a(c));vb(c)&&(c=new Date(c));if(!Na(c))return c;for(;e;)(l=He.exec(e))?(f=f.concat(ya.call(l,1)),e=f.pop()):(f.push(e),e=null);q(f,function(a){h=
Ie[a];g+=h?h(c,b.DATETIME_FORMATS):a.replace(/(^'|'$)/g,"").replace(/''/g,"'")});return g}}function Ce(){return function(b){return qa(b,!0)}}function De(){return function(b,a){if(!M(b)&&!w(b))return b;a=Y(a);if(w(b))return a?0<=a?b.slice(0,a):b.slice(a,b.length):"";var c=[],d,e;a>b.length?a=b.length:a<-b.length&&(a=-b.length);0<a?(d=0,e=a):(d=b.length+a,e=b.length);for(;d<e;d++)c.push(b[d]);return c}}function Lc(b){return function(a,c,d){function e(a,b){return Qa(b)?function(b,c){return a(c,b)}:a}
function g(a,b){var c=typeof a,d=typeof b;return c==d?("string"==c&&(a=a.toLowerCase(),b=b.toLowerCase()),a===b?0:a<b?-1:1):c<d?-1:1}if(!M(a)||!c)return a;c=M(c)?c:[c];c=Uc(c,function(a){var c=!1,d=a||Da;if(w(a)){if("+"==a.charAt(0)||"-"==a.charAt(0))c="-"==a.charAt(0),a=a.substring(1);d=b(a);if(d.constant){var f=d();return e(function(a,b){return g(a[f],b[f])},c)}}return e(function(a,b){return g(d(a),d(b))},c)});for(var f=[],h=0;h<a.length;h++)f.push(a[h]);return f.sort(e(function(a,b){for(var d=
0;d<c.length;d++){var e=c[d](a,b);if(0!==e)return e}return 0},d))}}function va(b){P(b)&&(b={link:b});b.restrict=b.restrict||"AC";return aa(b)}function Oc(b,a,c,d){function e(a,c){c=c?"-"+fb(c,"-"):"";d.removeClass(b,(a?qb:rb)+c);d.addClass(b,(a?rb:qb)+c)}var g=this,f=b.parent().controller("form")||sb,h=0,l=g.$error={},k=[];g.$name=a.name||a.ngForm;g.$dirty=!1;g.$pristine=!0;g.$valid=!0;g.$invalid=!1;f.$addControl(g);b.addClass(La);e(!0);g.$addControl=function(a){Aa(a.$name,"input");k.push(a);a.$name&&
(g[a.$name]=a)};g.$removeControl=function(a){a.$name&&g[a.$name]===a&&delete g[a.$name];q(l,function(b,c){g.$setValidity(c,!0,a)});Oa(k,a)};g.$setValidity=function(a,b,c){var d=l[a];if(b)d&&(Oa(d,c),d.length||(h--,h||(e(b),g.$valid=!0,g.$invalid=!1),l[a]=!1,e(!0,a),f.$setValidity(a,!0,g)));else{h||e(b);if(d){if(-1!=db(d,c))return}else l[a]=d=[],h++,e(!1,a),f.$setValidity(a,!1,g);d.push(c);g.$valid=!1;g.$invalid=!0}};g.$setDirty=function(){d.removeClass(b,La);d.addClass(b,tb);g.$dirty=!0;g.$pristine=
!1;f.$setDirty()};g.$setPristine=function(){d.removeClass(b,tb);d.addClass(b,La);g.$dirty=!1;g.$pristine=!0;q(k,function(a){a.$setPristine()})}}function pa(b,a,c,d){b.$setValidity(a,c);return c?d:s}function Je(b,a,c){var d=c.prop("validity");X(d)&&b.$parsers.push(function(c){if(b.$error[a]||!(d.badInput||d.customError||d.typeMismatch)||d.valueMissing)return c;b.$setValidity(a,!1)})}function ub(b,a,c,d,e,g){var f=a.prop("validity");if(!e.android){var h=!1;a.on("compositionstart",function(a){h=!0});
a.on("compositionend",function(){h=!1;l()})}var l=function(){if(!h){var e=a.val();Qa(c.ngTrim||"T")&&(e=ca(e));if(d.$viewValue!==e||f&&""===e&&!f.valueMissing)b.$$phase?d.$setViewValue(e):b.$apply(function(){d.$setViewValue(e)})}};if(e.hasEvent("input"))a.on("input",l);else{var k,m=function(){k||(k=g.defer(function(){l();k=null}))};a.on("keydown",function(a){a=a.keyCode;91===a||(15<a&&19>a||37<=a&&40>=a)||m()});if(e.hasEvent("paste"))a.on("paste cut",m)}a.on("change",l);d.$render=function(){a.val(d.$isEmpty(d.$viewValue)?
"":d.$viewValue)};var n=c.ngPattern;n&&((e=n.match(/^\/(.*)\/([gim]*)$/))?(n=RegExp(e[1],e[2]),e=function(a){return pa(d,"pattern",d.$isEmpty(a)||n.test(a),a)}):e=function(c){var e=b.$eval(n);if(!e||!e.test)throw t("ngPattern")("noregexp",n,e,ha(a));return pa(d,"pattern",d.$isEmpty(c)||e.test(c),c)},d.$formatters.push(e),d.$parsers.push(e));if(c.ngMinlength){var p=Y(c.ngMinlength);e=function(a){return pa(d,"minlength",d.$isEmpty(a)||a.length>=p,a)};d.$parsers.push(e);d.$formatters.push(e)}if(c.ngMaxlength){var r=
Y(c.ngMaxlength);e=function(a){return pa(d,"maxlength",d.$isEmpty(a)||a.length<=r,a)};d.$parsers.push(e);d.$formatters.push(e)}}function Pb(b,a){b="ngClass"+b;return["$animate",function(c){function d(a,b){var c=[],d=0;a:for(;d<a.length;d++){for(var e=a[d],m=0;m<b.length;m++)if(e==b[m])continue a;c.push(e)}return c}function e(a){if(!M(a)){if(w(a))return a.split(" ");if(X(a)){var b=[];q(a,function(a,c){a&&b.push(c)});return b}}return a}return{restrict:"AC",link:function(g,f,h){function l(a,b){var c=
f.data("$classCounts")||{},d=[];q(a,function(a){if(0<b||c[a])c[a]=(c[a]||0)+b,c[a]===+(0<b)&&d.push(a)});f.data("$classCounts",c);return d.join(" ")}function k(b){if(!0===a||g.$index%2===a){var k=e(b||[]);if(!m){var r=l(k,1);h.$addClass(r)}else if(!xa(b,m)){var q=e(m),r=d(k,q),k=d(q,k),k=l(k,-1),r=l(r,1);0===r.length?c.removeClass(f,k):0===k.length?c.addClass(f,r):c.setClass(f,r,k)}}m=ba(b)}var m;g.$watch(h[b],k,!0);h.$observe("class",function(a){k(g.$eval(h[b]))});"ngClass"!==b&&g.$watch("$index",
function(c,d){var f=c&1;if(f!==d&1){var k=e(g.$eval(h[b]));f===a?(f=l(k,1),h.$addClass(f)):(f=l(k,-1),h.$removeClass(f))}})}}}]}var K=function(b){return w(b)?b.toLowerCase():b},Fc=Object.prototype.hasOwnProperty,Fa=function(b){return w(b)?b.toUpperCase():b},S,y,Ga,ya=[].slice,Ke=[].push,wa=Object.prototype.toString,Pa=t("ng"),Ea=O.angular||(O.angular={}),Sa,Ka,ka=["0","0","0"];S=Y((/msie (\d+)/.exec(K(navigator.userAgent))||[])[1]);isNaN(S)&&(S=Y((/trident\/.*; rv:(\d+)/.exec(K(navigator.userAgent))||
[])[1]));C.$inject=[];Da.$inject=[];var ca=function(){return String.prototype.trim?function(b){return w(b)?b.trim():b}:function(b){return w(b)?b.replace(/^\s\s*/,"").replace(/\s\s*$/,""):b}}();Ka=9>S?function(b){b=b.nodeName?b:b[0];return b.scopeName&&"HTML"!=b.scopeName?Fa(b.scopeName+":"+b.nodeName):b.nodeName}:function(b){return b.nodeName?b.nodeName:b[0].nodeName};var Xc=/[A-Z]/g,$c={full:"1.2.16",major:1,minor:2,dot:16,codeName:"badger-enumeration"},Ua=N.cache={},gb=N.expando="ng-"+(new Date).getTime(),
me=1,Pc=O.document.addEventListener?function(b,a,c){b.addEventListener(a,c,!1)}:function(b,a,c){b.attachEvent("on"+a,c)},Fb=O.document.removeEventListener?function(b,a,c){b.removeEventListener(a,c,!1)}:function(b,a,c){b.detachEvent("on"+a,c)};N._data=function(b){return this.cache[b[this.expando]]||{}};var he=/([\:\-\_]+(.))/g,ie=/^moz([A-Z])/,Bb=t("jqLite"),je=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,Cb=/<|&#?\w+;/,ke=/<([\w:]+)/,le=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,ea=
{option:[1,'<select multiple="multiple">',"</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ea.optgroup=ea.option;ea.tbody=ea.tfoot=ea.colgroup=ea.caption=ea.thead;ea.th=ea.td;var Ja=N.prototype={ready:function(b){function a(){c||(c=!0,b())}var c=!1;"complete"===U.readyState?setTimeout(a):(this.on("DOMContentLoaded",a),N(O).on("load",a))},toString:function(){var b=
[];q(this,function(a){b.push(""+a)});return"["+b.join(", ")+"]"},eq:function(b){return 0<=b?y(this[b]):y(this[this.length+b])},length:0,push:Ke,sort:[].sort,splice:[].splice},kb={};q("multiple selected checked disabled readOnly required open".split(" "),function(b){kb[K(b)]=b});var nc={};q("input select option textarea button form details".split(" "),function(b){nc[Fa(b)]=!0});q({data:jc,inheritedData:jb,scope:function(b){return y(b).data("$scope")||jb(b.parentNode||b,["$isolateScope","$scope"])},
isolateScope:function(b){return y(b).data("$isolateScope")||y(b).data("$isolateScopeNoTemplate")},controller:kc,injector:function(b){return jb(b,"$injector")},removeAttr:function(b,a){b.removeAttribute(a)},hasClass:Gb,css:function(b,a,c){a=Ta(a);if(B(c))b.style[a]=c;else{var d;8>=S&&(d=b.currentStyle&&b.currentStyle[a],""===d&&(d="auto"));d=d||b.style[a];8>=S&&(d=""===d?s:d);return d}},attr:function(b,a,c){var d=K(a);if(kb[d])if(B(c))c?(b[a]=!0,b.setAttribute(a,d)):(b[a]=!1,b.removeAttribute(d));
else return b[a]||(b.attributes.getNamedItem(a)||C).specified?d:s;else if(B(c))b.setAttribute(a,c);else if(b.getAttribute)return b=b.getAttribute(a,2),null===b?s:b},prop:function(b,a,c){if(B(c))b[a]=c;else return b[a]},text:function(){function b(b,d){var e=a[b.nodeType];if(E(d))return e?b[e]:"";b[e]=d}var a=[];9>S?(a[1]="innerText",a[3]="nodeValue"):a[1]=a[3]="textContent";b.$dv="";return b}(),val:function(b,a){if(E(a)){if("SELECT"===Ka(b)&&b.multiple){var c=[];q(b.options,function(a){a.selected&&
c.push(a.value||a.text)});return 0===c.length?null:c}return b.value}b.value=a},html:function(b,a){if(E(a))return b.innerHTML;for(var c=0,d=b.childNodes;c<d.length;c++)Ha(d[c]);b.innerHTML=a},empty:lc},function(b,a){N.prototype[a]=function(a,d){var e,g;if(b!==lc&&(2==b.length&&b!==Gb&&b!==kc?a:d)===s){if(X(a)){for(e=0;e<this.length;e++)if(b===jc)b(this[e],a);else for(g in a)b(this[e],g,a[g]);return this}e=b.$dv;g=e===s?Math.min(this.length,1):this.length;for(var f=0;f<g;f++){var h=b(this[f],a,d);e=
e?e+h:h}return e}for(e=0;e<this.length;e++)b(this[e],a,d);return this}});q({removeData:hc,dealoc:Ha,on:function a(c,d,e,g){if(B(g))throw Bb("onargs");var f=la(c,"events"),h=la(c,"handle");f||la(c,"events",f={});h||la(c,"handle",h=ne(c,f));q(d.split(" "),function(d){var g=f[d];if(!g){if("mouseenter"==d||"mouseleave"==d){var m=U.body.contains||U.body.compareDocumentPosition?function(a,c){var d=9===a.nodeType?a.documentElement:a,e=c&&c.parentNode;return a===e||!!(e&&1===e.nodeType&&(d.contains?d.contains(e):
a.compareDocumentPosition&&a.compareDocumentPosition(e)&16))}:function(a,c){if(c)for(;c=c.parentNode;)if(c===a)return!0;return!1};f[d]=[];a(c,{mouseleave:"mouseout",mouseenter:"mouseover"}[d],function(a){var c=a.relatedTarget;c&&(c===this||m(this,c))||h(a,d)})}else Pc(c,d,h),f[d]=[];g=f[d]}g.push(e)})},off:ic,one:function(a,c,d){a=y(a);a.on(c,function g(){a.off(c,d);a.off(c,g)});a.on(c,d)},replaceWith:function(a,c){var d,e=a.parentNode;Ha(a);q(new N(c),function(c){d?e.insertBefore(c,d.nextSibling):
e.replaceChild(c,a);d=c})},children:function(a){var c=[];q(a.childNodes,function(a){1===a.nodeType&&c.push(a)});return c},contents:function(a){return a.contentDocument||a.childNodes||[]},append:function(a,c){q(new N(c),function(c){1!==a.nodeType&&11!==a.nodeType||a.appendChild(c)})},prepend:function(a,c){if(1===a.nodeType){var d=a.firstChild;q(new N(c),function(c){a.insertBefore(c,d)})}},wrap:function(a,c){c=y(c)[0];var d=a.parentNode;d&&d.replaceChild(c,a);c.appendChild(a)},remove:function(a){Ha(a);
var c=a.parentNode;c&&c.removeChild(a)},after:function(a,c){var d=a,e=a.parentNode;q(new N(c),function(a){e.insertBefore(a,d.nextSibling);d=a})},addClass:ib,removeClass:hb,toggleClass:function(a,c,d){c&&q(c.split(" "),function(c){var g=d;E(g)&&(g=!Gb(a,c));(g?ib:hb)(a,c)})},parent:function(a){return(a=a.parentNode)&&11!==a.nodeType?a:null},next:function(a){if(a.nextElementSibling)return a.nextElementSibling;for(a=a.nextSibling;null!=a&&1!==a.nodeType;)a=a.nextSibling;return a},find:function(a,c){return a.getElementsByTagName?
a.getElementsByTagName(c):[]},clone:Eb,triggerHandler:function(a,c,d){c=(la(a,"events")||{})[c];d=d||[];var e=[{preventDefault:C,stopPropagation:C}];q(c,function(c){c.apply(a,e.concat(d))})}},function(a,c){N.prototype[c]=function(c,e,g){for(var f,h=0;h<this.length;h++)E(f)?(f=a(this[h],c,e,g),B(f)&&(f=y(f))):Db(f,a(this[h],c,e,g));return B(f)?f:this};N.prototype.bind=N.prototype.on;N.prototype.unbind=N.prototype.off});Va.prototype={put:function(a,c){this[Ia(a)]=c},get:function(a){return this[Ia(a)]},
remove:function(a){var c=this[a=Ia(a)];delete this[a];return c}};var pe=/^function\s*[^\(]*\(\s*([^\)]*)\)/m,qe=/,/,re=/^\s*(_?)(\S+?)\1\s*$/,oe=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,Wa=t("$injector"),Le=t("$animate"),Ld=["$provide",function(a){this.$$selectors={};this.register=function(c,d){var e=c+"-animation";if(c&&"."!=c.charAt(0))throw Le("notcsel",c);this.$$selectors[c.substr(1)]=e;a.factory(e,d)};this.classNameFilter=function(a){1===arguments.length&&(this.$$classNameFilter=a instanceof RegExp?
a:null);return this.$$classNameFilter};this.$get=["$timeout","$$asyncCallback",function(a,d){return{enter:function(a,c,f,h){f?f.after(a):(c&&c[0]||(c=f.parent()),c.append(a));h&&d(h)},leave:function(a,c){a.remove();c&&d(c)},move:function(a,c,d,h){this.enter(a,c,d,h)},addClass:function(a,c,f){c=w(c)?c:M(c)?c.join(" "):"";q(a,function(a){ib(a,c)});f&&d(f)},removeClass:function(a,c,f){c=w(c)?c:M(c)?c.join(" "):"";q(a,function(a){hb(a,c)});f&&d(f)},setClass:function(a,c,f,h){q(a,function(a){ib(a,c);hb(a,
f)});h&&d(h)},enabled:C}}]}],ja=t("$compile");cc.$inject=["$provide","$$sanitizeUriProvider"];var te=/^(x[\:\-_]|data[\:\-_])/i,vc=t("$interpolate"),Me=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,we={http:80,https:443,ftp:21},Kb=t("$location");Ac.prototype=Lb.prototype=zc.prototype={$$html5:!1,$$replace:!1,absUrl:nb("$$absUrl"),url:function(a,c){if(E(a))return this.$$url;var d=Me.exec(a);d[1]&&this.path(decodeURIComponent(d[1]));(d[2]||d[1])&&this.search(d[3]||"");this.hash(d[5]||"",c);return this},protocol:nb("$$protocol"),
host:nb("$$host"),port:nb("$$port"),path:Bc("$$path",function(a){return"/"==a.charAt(0)?a:"/"+a}),search:function(a,c){switch(arguments.length){case 0:return this.$$search;case 1:if(w(a))this.$$search=Yb(a);else if(X(a))this.$$search=a;else throw Kb("isrcharg");break;default:E(c)||null===c?delete this.$$search[a]:this.$$search[a]=c}this.$$compose();return this},hash:Bc("$$hash",Da),replace:function(){this.$$replace=!0;return this}};var Ba=t("$parse"),Ec={},ta,Ma={"null":function(){return null},"true":function(){return!0},
"false":function(){return!1},undefined:C,"+":function(a,c,d,e){d=d(a,c);e=e(a,c);return B(d)?B(e)?d+e:d:B(e)?e:s},"-":function(a,c,d,e){d=d(a,c);e=e(a,c);return(B(d)?d:0)-(B(e)?e:0)},"*":function(a,c,d,e){return d(a,c)*e(a,c)},"/":function(a,c,d,e){return d(a,c)/e(a,c)},"%":function(a,c,d,e){return d(a,c)%e(a,c)},"^":function(a,c,d,e){return d(a,c)^e(a,c)},"=":C,"===":function(a,c,d,e){return d(a,c)===e(a,c)},"!==":function(a,c,d,e){return d(a,c)!==e(a,c)},"==":function(a,c,d,e){return d(a,c)==e(a,
c)},"!=":function(a,c,d,e){return d(a,c)!=e(a,c)},"<":function(a,c,d,e){return d(a,c)<e(a,c)},">":function(a,c,d,e){return d(a,c)>e(a,c)},"<=":function(a,c,d,e){return d(a,c)<=e(a,c)},">=":function(a,c,d,e){return d(a,c)>=e(a,c)},"&&":function(a,c,d,e){return d(a,c)&&e(a,c)},"||":function(a,c,d,e){return d(a,c)||e(a,c)},"&":function(a,c,d,e){return d(a,c)&e(a,c)},"|":function(a,c,d,e){return e(a,c)(a,c,d(a,c))},"!":function(a,c,d){return!d(a,c)}},Ne={n:"\n",f:"\f",r:"\r",t:"\t",v:"\v","'":"'",'"':'"'},
Nb=function(a){this.options=a};Nb.prototype={constructor:Nb,lex:function(a){this.text=a;this.index=0;this.ch=s;this.lastCh=":";this.tokens=[];var c;for(a=[];this.index<this.text.length;){this.ch=this.text.charAt(this.index);if(this.is("\"'"))this.readString(this.ch);else if(this.isNumber(this.ch)||this.is(".")&&this.isNumber(this.peek()))this.readNumber();else if(this.isIdent(this.ch))this.readIdent(),this.was("{,")&&("{"===a[0]&&(c=this.tokens[this.tokens.length-1]))&&(c.json=-1===c.text.indexOf("."));
else if(this.is("(){}[].,;:?"))this.tokens.push({index:this.index,text:this.ch,json:this.was(":[,")&&this.is("{[")||this.is("}]:,")}),this.is("{[")&&a.unshift(this.ch),this.is("}]")&&a.shift(),this.index++;else if(this.isWhitespace(this.ch)){this.index++;continue}else{var d=this.ch+this.peek(),e=d+this.peek(2),g=Ma[this.ch],f=Ma[d],h=Ma[e];h?(this.tokens.push({index:this.index,text:e,fn:h}),this.index+=3):f?(this.tokens.push({index:this.index,text:d,fn:f}),this.index+=2):g?(this.tokens.push({index:this.index,
text:this.ch,fn:g,json:this.was("[,:")&&this.is("+-")}),this.index+=1):this.throwError("Unexpected next character ",this.index,this.index+1)}this.lastCh=this.ch}return this.tokens},is:function(a){return-1!==a.indexOf(this.ch)},was:function(a){return-1!==a.indexOf(this.lastCh)},peek:function(a){a=a||1;return this.index+a<this.text.length?this.text.charAt(this.index+a):!1},isNumber:function(a){return"0"<=a&&"9">=a},isWhitespace:function(a){return" "===a||"\r"===a||"\t"===a||"\n"===a||"\v"===a||"\u00a0"===
a},isIdent:function(a){return"a"<=a&&"z">=a||"A"<=a&&"Z">=a||"_"===a||"$"===a},isExpOperator:function(a){return"-"===a||"+"===a||this.isNumber(a)},throwError:function(a,c,d){d=d||this.index;c=B(c)?"s "+c+"-"+this.index+" ["+this.text.substring(c,d)+"]":" "+d;throw Ba("lexerr",a,c,this.text);},readNumber:function(){for(var a="",c=this.index;this.index<this.text.length;){var d=K(this.text.charAt(this.index));if("."==d||this.isNumber(d))a+=d;else{var e=this.peek();if("e"==d&&this.isExpOperator(e))a+=
d;else if(this.isExpOperator(d)&&e&&this.isNumber(e)&&"e"==a.charAt(a.length-1))a+=d;else if(!this.isExpOperator(d)||e&&this.isNumber(e)||"e"!=a.charAt(a.length-1))break;else this.throwError("Invalid exponent")}this.index++}a*=1;this.tokens.push({index:c,text:a,json:!0,fn:function(){return a}})},readIdent:function(){for(var a=this,c="",d=this.index,e,g,f,h;this.index<this.text.length;){h=this.text.charAt(this.index);if("."===h||this.isIdent(h)||this.isNumber(h))"."===h&&(e=this.index),c+=h;else break;
this.index++}if(e)for(g=this.index;g<this.text.length;){h=this.text.charAt(g);if("("===h){f=c.substr(e-d+1);c=c.substr(0,e-d);this.index=g;break}if(this.isWhitespace(h))g++;else break}d={index:d,text:c};if(Ma.hasOwnProperty(c))d.fn=Ma[c],d.json=Ma[c];else{var l=Dc(c,this.options,this.text);d.fn=D(function(a,c){return l(a,c)},{assign:function(d,e){return ob(d,c,e,a.text,a.options)}})}this.tokens.push(d);f&&(this.tokens.push({index:e,text:".",json:!1}),this.tokens.push({index:e+1,text:f,json:!1}))},
readString:function(a){var c=this.index;this.index++;for(var d="",e=a,g=!1;this.index<this.text.length;){var f=this.text.charAt(this.index),e=e+f;if(g)"u"===f?(f=this.text.substring(this.index+1,this.index+5),f.match(/[\da-f]{4}/i)||this.throwError("Invalid unicode escape [\\u"+f+"]"),this.index+=4,d+=String.fromCharCode(parseInt(f,16))):d=(g=Ne[f])?d+g:d+f,g=!1;else if("\\"===f)g=!0;else{if(f===a){this.index++;this.tokens.push({index:c,text:e,string:d,json:!0,fn:function(){return d}});return}d+=
f}this.index++}this.throwError("Unterminated quote",c)}};var $a=function(a,c,d){this.lexer=a;this.$filter=c;this.options=d};$a.ZERO=D(function(){return 0},{constant:!0});$a.prototype={constructor:$a,parse:function(a,c){this.text=a;this.json=c;this.tokens=this.lexer.lex(a);c&&(this.assignment=this.logicalOR,this.functionCall=this.fieldAccess=this.objectIndex=this.filterChain=function(){this.throwError("is not valid json",{text:a,index:0})});var d=c?this.primary():this.statements();0!==this.tokens.length&&
this.throwError("is an unexpected token",this.tokens[0]);d.literal=!!d.literal;d.constant=!!d.constant;return d},primary:function(){var a;if(this.expect("("))a=this.filterChain(),this.consume(")");else if(this.expect("["))a=this.arrayDeclaration();else if(this.expect("{"))a=this.object();else{var c=this.expect();(a=c.fn)||this.throwError("not a primary expression",c);c.json&&(a.constant=!0,a.literal=!0)}for(var d;c=this.expect("(","[",".");)"("===c.text?(a=this.functionCall(a,d),d=null):"["===c.text?
(d=a,a=this.objectIndex(a)):"."===c.text?(d=a,a=this.fieldAccess(a)):this.throwError("IMPOSSIBLE");return a},throwError:function(a,c){throw Ba("syntax",c.text,a,c.index+1,this.text,this.text.substring(c.index));},peekToken:function(){if(0===this.tokens.length)throw Ba("ueoe",this.text);return this.tokens[0]},peek:function(a,c,d,e){if(0<this.tokens.length){var g=this.tokens[0],f=g.text;if(f===a||f===c||f===d||f===e||!(a||c||d||e))return g}return!1},expect:function(a,c,d,e){return(a=this.peek(a,c,d,
e))?(this.json&&!a.json&&this.throwError("is not valid json",a),this.tokens.shift(),a):!1},consume:function(a){this.expect(a)||this.throwError("is unexpected, expecting ["+a+"]",this.peek())},unaryFn:function(a,c){return D(function(d,e){return a(d,e,c)},{constant:c.constant})},ternaryFn:function(a,c,d){return D(function(e,g){return a(e,g)?c(e,g):d(e,g)},{constant:a.constant&&c.constant&&d.constant})},binaryFn:function(a,c,d){return D(function(e,g){return c(e,g,a,d)},{constant:a.constant&&d.constant})},
statements:function(){for(var a=[];;)if(0<this.tokens.length&&!this.peek("}",")",";","]")&&a.push(this.filterChain()),!this.expect(";"))return 1===a.length?a[0]:function(c,d){for(var e,g=0;g<a.length;g++){var f=a[g];f&&(e=f(c,d))}return e}},filterChain:function(){for(var a=this.expression(),c;;)if(c=this.expect("|"))a=this.binaryFn(a,c.fn,this.filter());else return a},filter:function(){for(var a=this.expect(),c=this.$filter(a.text),d=[];;)if(a=this.expect(":"))d.push(this.expression());else{var e=
function(a,e,h){h=[h];for(var l=0;l<d.length;l++)h.push(d[l](a,e));return c.apply(a,h)};return function(){return e}}},expression:function(){return this.assignment()},assignment:function(){var a=this.ternary(),c,d;return(d=this.expect("="))?(a.assign||this.throwError("implies assignment but ["+this.text.substring(0,d.index)+"] can not be assigned to",d),c=this.ternary(),function(d,g){return a.assign(d,c(d,g),g)}):a},ternary:function(){var a=this.logicalOR(),c,d;if(this.expect("?")){c=this.ternary();
if(d=this.expect(":"))return this.ternaryFn(a,c,this.ternary());this.throwError("expected :",d)}else return a},logicalOR:function(){for(var a=this.logicalAND(),c;;)if(c=this.expect("||"))a=this.binaryFn(a,c.fn,this.logicalAND());else return a},logicalAND:function(){var a=this.equality(),c;if(c=this.expect("&&"))a=this.binaryFn(a,c.fn,this.logicalAND());return a},equality:function(){var a=this.relational(),c;if(c=this.expect("==","!=","===","!=="))a=this.binaryFn(a,c.fn,this.equality());return a},
relational:function(){var a=this.additive(),c;if(c=this.expect("<",">","<=",">="))a=this.binaryFn(a,c.fn,this.relational());return a},additive:function(){for(var a=this.multiplicative(),c;c=this.expect("+","-");)a=this.binaryFn(a,c.fn,this.multiplicative());return a},multiplicative:function(){for(var a=this.unary(),c;c=this.expect("*","/","%");)a=this.binaryFn(a,c.fn,this.unary());return a},unary:function(){var a;return this.expect("+")?this.primary():(a=this.expect("-"))?this.binaryFn($a.ZERO,a.fn,
this.unary()):(a=this.expect("!"))?this.unaryFn(a.fn,this.unary()):this.primary()},fieldAccess:function(a){var c=this,d=this.expect().text,e=Dc(d,this.options,this.text);return D(function(c,d,h){return e(h||a(c,d))},{assign:function(e,f,h){return ob(a(e,h),d,f,c.text,c.options)}})},objectIndex:function(a){var c=this,d=this.expression();this.consume("]");return D(function(e,g){var f=a(e,g),h=d(e,g),l;if(!f)return s;(f=Za(f[h],c.text))&&(f.then&&c.options.unwrapPromises)&&(l=f,"$$v"in f||(l.$$v=s,l.then(function(a){l.$$v=
a})),f=f.$$v);return f},{assign:function(e,g,f){var h=d(e,f);return Za(a(e,f),c.text)[h]=g}})},functionCall:function(a,c){var d=[];if(")"!==this.peekToken().text){do d.push(this.expression());while(this.expect(","))}this.consume(")");var e=this;return function(g,f){for(var h=[],l=c?c(g,f):g,k=0;k<d.length;k++)h.push(d[k](g,f));k=a(g,f,l)||C;Za(l,e.text);Za(k,e.text);h=k.apply?k.apply(l,h):k(h[0],h[1],h[2],h[3],h[4]);return Za(h,e.text)}},arrayDeclaration:function(){var a=[],c=!0;if("]"!==this.peekToken().text){do{if(this.peek("]"))break;
var d=this.expression();a.push(d);d.constant||(c=!1)}while(this.expect(","))}this.consume("]");return D(function(c,d){for(var f=[],h=0;h<a.length;h++)f.push(a[h](c,d));return f},{literal:!0,constant:c})},object:function(){var a=[],c=!0;if("}"!==this.peekToken().text){do{if(this.peek("}"))break;var d=this.expect(),d=d.string||d.text;this.consume(":");var e=this.expression();a.push({key:d,value:e});e.constant||(c=!1)}while(this.expect(","))}this.consume("}");return D(function(c,d){for(var e={},l=0;l<
a.length;l++){var k=a[l];e[k.key]=k.value(c,d)}return e},{literal:!0,constant:c})}};var Mb={},ua=t("$sce"),ga={HTML:"html",CSS:"css",URL:"url",RESOURCE_URL:"resourceUrl",JS:"js"},W=U.createElement("a"),Hc=sa(O.location.href,!0);gc.$inject=["$provide"];Ic.$inject=["$locale"];Kc.$inject=["$locale"];var Nc=".",Ie={yyyy:$("FullYear",4),yy:$("FullYear",2,0,!0),y:$("FullYear",1),MMMM:pb("Month"),MMM:pb("Month",!0),MM:$("Month",2,1),M:$("Month",1,1),dd:$("Date",2),d:$("Date",1),HH:$("Hours",2),H:$("Hours",
1),hh:$("Hours",2,-12),h:$("Hours",1,-12),mm:$("Minutes",2),m:$("Minutes",1),ss:$("Seconds",2),s:$("Seconds",1),sss:$("Milliseconds",3),EEEE:pb("Day"),EEE:pb("Day",!0),a:function(a,c){return 12>a.getHours()?c.AMPMS[0]:c.AMPMS[1]},Z:function(a){a=-1*a.getTimezoneOffset();return a=(0<=a?"+":"")+(Ob(Math[0<a?"floor":"ceil"](a/60),2)+Ob(Math.abs(a%60),2))}},He=/((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,Ge=/^\-?\d+$/;Jc.$inject=["$locale"];var Ee=aa(K),Fe=aa(Fa);Lc.$inject=
["$parse"];var cd=aa({restrict:"E",compile:function(a,c){8>=S&&(c.href||c.name||c.$set("href",""),a.append(U.createComment("IE fix")));if(!c.href&&!c.xlinkHref&&!c.name)return function(a,c){var g="[object SVGAnimatedString]"===wa.call(c.prop("href"))?"xlink:href":"href";c.on("click",function(a){c.attr(g)||a.preventDefault()})}}}),zb={};q(kb,function(a,c){if("multiple"!=a){var d=na("ng-"+c);zb[d]=function(){return{priority:100,link:function(a,g,f){a.$watch(f[d],function(a){f.$set(c,!!a)})}}}}});q(["src",
"srcset","href"],function(a){var c=na("ng-"+a);zb[c]=function(){return{priority:99,link:function(d,e,g){var f=a,h=a;"href"===a&&"[object SVGAnimatedString]"===wa.call(e.prop("href"))&&(h="xlinkHref",g.$attr[h]="xlink:href",f=null);g.$observe(c,function(a){a&&(g.$set(h,a),S&&f&&e.prop(f,g[h]))})}}}});var sb={$addControl:C,$removeControl:C,$setValidity:C,$setDirty:C,$setPristine:C};Oc.$inject=["$element","$attrs","$scope","$animate"];var Qc=function(a){return["$timeout",function(c){return{name:"form",
restrict:a?"EAC":"E",controller:Oc,compile:function(){return{pre:function(a,e,g,f){if(!g.action){var h=function(a){a.preventDefault?a.preventDefault():a.returnValue=!1};Pc(e[0],"submit",h);e.on("$destroy",function(){c(function(){Fb(e[0],"submit",h)},0,!1)})}var l=e.parent().controller("form"),k=g.name||g.ngForm;k&&ob(a,k,f,k);if(l)e.on("$destroy",function(){l.$removeControl(f);k&&ob(a,k,s,k);D(f,sb)})}}}}}]},dd=Qc(),qd=Qc(!0),Oe=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
Pe=/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,Qe=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,Rc={text:ub,number:function(a,c,d,e,g,f){ub(a,c,d,e,g,f);e.$parsers.push(function(a){var c=e.$isEmpty(a);if(c||Qe.test(a))return e.$setValidity("number",!0),""===a?null:c?a:parseFloat(a);e.$setValidity("number",!1);return s});Je(e,"number",c);e.$formatters.push(function(a){return e.$isEmpty(a)?"":""+a});d.min&&(a=function(a){var c=parseFloat(d.min);return pa(e,"min",e.$isEmpty(a)||a>=c,a)},e.$parsers.push(a),
e.$formatters.push(a));d.max&&(a=function(a){var c=parseFloat(d.max);return pa(e,"max",e.$isEmpty(a)||a<=c,a)},e.$parsers.push(a),e.$formatters.push(a));e.$formatters.push(function(a){return pa(e,"number",e.$isEmpty(a)||vb(a),a)})},url:function(a,c,d,e,g,f){ub(a,c,d,e,g,f);a=function(a){return pa(e,"url",e.$isEmpty(a)||Oe.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},email:function(a,c,d,e,g,f){ub(a,c,d,e,g,f);a=function(a){return pa(e,"email",e.$isEmpty(a)||Pe.test(a),a)};e.$formatters.push(a);
e.$parsers.push(a)},radio:function(a,c,d,e){E(d.name)&&c.attr("name",bb());c.on("click",function(){c[0].checked&&a.$apply(function(){e.$setViewValue(d.value)})});e.$render=function(){c[0].checked=d.value==e.$viewValue};d.$observe("value",e.$render)},checkbox:function(a,c,d,e){var g=d.ngTrueValue,f=d.ngFalseValue;w(g)||(g=!0);w(f)||(f=!1);c.on("click",function(){a.$apply(function(){e.$setViewValue(c[0].checked)})});e.$render=function(){c[0].checked=e.$viewValue};e.$isEmpty=function(a){return a!==g};
e.$formatters.push(function(a){return a===g});e.$parsers.push(function(a){return a?g:f})},hidden:C,button:C,submit:C,reset:C,file:C},dc=["$browser","$sniffer",function(a,c){return{restrict:"E",require:"?ngModel",link:function(d,e,g,f){f&&(Rc[K(g.type)]||Rc.text)(d,e,g,f,c,a)}}}],rb="ng-valid",qb="ng-invalid",La="ng-pristine",tb="ng-dirty",Re=["$scope","$exceptionHandler","$attrs","$element","$parse","$animate",function(a,c,d,e,g,f){function h(a,c){c=c?"-"+fb(c,"-"):"";f.removeClass(e,(a?qb:rb)+c);
f.addClass(e,(a?rb:qb)+c)}this.$modelValue=this.$viewValue=Number.NaN;this.$parsers=[];this.$formatters=[];this.$viewChangeListeners=[];this.$pristine=!0;this.$dirty=!1;this.$valid=!0;this.$invalid=!1;this.$name=d.name;var l=g(d.ngModel),k=l.assign;if(!k)throw t("ngModel")("nonassign",d.ngModel,ha(e));this.$render=C;this.$isEmpty=function(a){return E(a)||""===a||null===a||a!==a};var m=e.inheritedData("$formController")||sb,n=0,p=this.$error={};e.addClass(La);h(!0);this.$setValidity=function(a,c){p[a]!==
!c&&(c?(p[a]&&n--,n||(h(!0),this.$valid=!0,this.$invalid=!1)):(h(!1),this.$invalid=!0,this.$valid=!1,n++),p[a]=!c,h(c,a),m.$setValidity(a,c,this))};this.$setPristine=function(){this.$dirty=!1;this.$pristine=!0;f.removeClass(e,tb);f.addClass(e,La)};this.$setViewValue=function(d){this.$viewValue=d;this.$pristine&&(this.$dirty=!0,this.$pristine=!1,f.removeClass(e,La),f.addClass(e,tb),m.$setDirty());q(this.$parsers,function(a){d=a(d)});this.$modelValue!==d&&(this.$modelValue=d,k(a,d),q(this.$viewChangeListeners,
function(a){try{a()}catch(d){c(d)}}))};var r=this;a.$watch(function(){var c=l(a);if(r.$modelValue!==c){var d=r.$formatters,e=d.length;for(r.$modelValue=c;e--;)c=d[e](c);r.$viewValue!==c&&(r.$viewValue=c,r.$render())}return c})}],Fd=function(){return{require:["ngModel","^?form"],controller:Re,link:function(a,c,d,e){var g=e[0],f=e[1]||sb;f.$addControl(g);a.$on("$destroy",function(){f.$removeControl(g)})}}},Hd=aa({require:"ngModel",link:function(a,c,d,e){e.$viewChangeListeners.push(function(){a.$eval(d.ngChange)})}}),
ec=function(){return{require:"?ngModel",link:function(a,c,d,e){if(e){d.required=!0;var g=function(a){if(d.required&&e.$isEmpty(a))e.$setValidity("required",!1);else return e.$setValidity("required",!0),a};e.$formatters.push(g);e.$parsers.unshift(g);d.$observe("required",function(){g(e.$viewValue)})}}}},Gd=function(){return{require:"ngModel",link:function(a,c,d,e){var g=(a=/\/(.*)\//.exec(d.ngList))&&RegExp(a[1])||d.ngList||",";e.$parsers.push(function(a){if(!E(a)){var c=[];a&&q(a.split(g),function(a){a&&
c.push(ca(a))});return c}});e.$formatters.push(function(a){return M(a)?a.join(", "):s});e.$isEmpty=function(a){return!a||!a.length}}}},Se=/^(true|false|\d+)$/,Id=function(){return{priority:100,compile:function(a,c){return Se.test(c.ngValue)?function(a,c,g){g.$set("value",a.$eval(g.ngValue))}:function(a,c,g){a.$watch(g.ngValue,function(a){g.$set("value",a)})}}}},id=va(function(a,c,d){c.addClass("ng-binding").data("$binding",d.ngBind);a.$watch(d.ngBind,function(a){c.text(a==s?"":a)})}),kd=["$interpolate",
function(a){return function(c,d,e){c=a(d.attr(e.$attr.ngBindTemplate));d.addClass("ng-binding").data("$binding",c);e.$observe("ngBindTemplate",function(a){d.text(a)})}}],jd=["$sce","$parse",function(a,c){return function(d,e,g){e.addClass("ng-binding").data("$binding",g.ngBindHtml);var f=c(g.ngBindHtml);d.$watch(function(){return(f(d)||"").toString()},function(c){e.html(a.getTrustedHtml(f(d))||"")})}}],ld=Pb("",!0),nd=Pb("Odd",0),md=Pb("Even",1),od=va({compile:function(a,c){c.$set("ngCloak",s);a.removeClass("ng-cloak")}}),
pd=[function(){return{scope:!0,controller:"@",priority:500}}],fc={};q("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),function(a){var c=na("ng-"+a);fc[c]=["$parse",function(d){return{compile:function(e,g){var f=d(g[c]);return function(c,d,e){d.on(K(a),function(a){c.$apply(function(){f(c,{$event:a})})})}}}}]});var sd=["$animate",function(a){return{transclude:"element",priority:600,terminal:!0,restrict:"A",
$$tlb:!0,link:function(c,d,e,g,f){var h,l,k;c.$watch(e.ngIf,function(g){Qa(g)?l||(l=c.$new(),f(l,function(c){c[c.length++]=U.createComment(" end ngIf: "+e.ngIf+" ");h={clone:c};a.enter(c,d.parent(),d)})):(k&&(k.remove(),k=null),l&&(l.$destroy(),l=null),h&&(k=yb(h.clone),a.leave(k,function(){k=null}),h=null))})}}}],td=["$http","$templateCache","$anchorScroll","$animate","$sce",function(a,c,d,e,g){return{restrict:"ECA",priority:400,terminal:!0,transclude:"element",controller:Ea.noop,compile:function(f,
h){var l=h.ngInclude||h.src,k=h.onload||"",m=h.autoscroll;return function(f,h,q,s,u){var F=0,v,y,A,x=function(){y&&(y.remove(),y=null);v&&(v.$destroy(),v=null);A&&(e.leave(A,function(){y=null}),y=A,A=null)};f.$watch(g.parseAsResourceUrl(l),function(g){var l=function(){!B(m)||m&&!f.$eval(m)||d()},q=++F;g?(a.get(g,{cache:c}).success(function(a){if(q===F){var c=f.$new();s.template=a;a=u(c,function(a){x();e.enter(a,null,h,l)});v=c;A=a;v.$emit("$includeContentLoaded");f.$eval(k)}}).error(function(){q===
F&&x()}),f.$emit("$includeContentRequested")):(x(),s.template=null)})}}}}],Jd=["$compile",function(a){return{restrict:"ECA",priority:-400,require:"ngInclude",link:function(c,d,e,g){d.html(g.template);a(d.contents())(c)}}}],ud=va({priority:450,compile:function(){return{pre:function(a,c,d){a.$eval(d.ngInit)}}}}),vd=va({terminal:!0,priority:1E3}),wd=["$locale","$interpolate",function(a,c){var d=/{}/g;return{restrict:"EA",link:function(e,g,f){var h=f.count,l=f.$attr.when&&g.attr(f.$attr.when),k=f.offset||
0,m=e.$eval(l)||{},n={},p=c.startSymbol(),r=c.endSymbol(),s=/^when(Minus)?(.+)$/;q(f,function(a,c){s.test(c)&&(m[K(c.replace("when","").replace("Minus","-"))]=g.attr(f.$attr[c]))});q(m,function(a,e){n[e]=c(a.replace(d,p+h+"-"+k+r))});e.$watch(function(){var c=parseFloat(e.$eval(h));if(isNaN(c))return"";c in m||(c=a.pluralCat(c-k));return n[c](e,g,!0)},function(a){g.text(a)})}}}],xd=["$parse","$animate",function(a,c){var d=t("ngRepeat");return{transclude:"element",priority:1E3,terminal:!0,$$tlb:!0,
link:function(e,g,f,h,l){var k=f.ngRepeat,m=k.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),n,p,r,s,u,F,v={$id:Ia};if(!m)throw d("iexp",k);f=m[1];h=m[2];(m=m[3])?(n=a(m),p=function(a,c,d){F&&(v[F]=a);v[u]=c;v.$index=d;return n(e,v)}):(r=function(a,c){return Ia(c)},s=function(a){return a});m=f.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);if(!m)throw d("iidexp",f);u=m[3]||m[1];F=m[2];var B={};e.$watchCollection(h,function(a){var f,h,m=g[0],n,v={},H,R,w,C,T,t,
E=[];if(ab(a))T=a,n=p||r;else{n=p||s;T=[];for(w in a)a.hasOwnProperty(w)&&"$"!=w.charAt(0)&&T.push(w);T.sort()}H=T.length;h=E.length=T.length;for(f=0;f<h;f++)if(w=a===T?f:T[f],C=a[w],C=n(w,C,f),Aa(C,"`track by` id"),B.hasOwnProperty(C))t=B[C],delete B[C],v[C]=t,E[f]=t;else{if(v.hasOwnProperty(C))throw q(E,function(a){a&&a.scope&&(B[a.id]=a)}),d("dupes",k,C);E[f]={id:C};v[C]=!1}for(w in B)B.hasOwnProperty(w)&&(t=B[w],f=yb(t.clone),c.leave(f),q(f,function(a){a.$$NG_REMOVED=!0}),t.scope.$destroy());
f=0;for(h=T.length;f<h;f++){w=a===T?f:T[f];C=a[w];t=E[f];E[f-1]&&(m=E[f-1].clone[E[f-1].clone.length-1]);if(t.scope){R=t.scope;n=m;do n=n.nextSibling;while(n&&n.$$NG_REMOVED);t.clone[0]!=n&&c.move(yb(t.clone),null,y(m));m=t.clone[t.clone.length-1]}else R=e.$new();R[u]=C;F&&(R[F]=w);R.$index=f;R.$first=0===f;R.$last=f===H-1;R.$middle=!(R.$first||R.$last);R.$odd=!(R.$even=0===(f&1));t.scope||l(R,function(a){a[a.length++]=U.createComment(" end ngRepeat: "+k+" ");c.enter(a,null,y(m));m=a;t.scope=R;t.clone=
a;v[t.id]=t})}B=v})}}}],yd=["$animate",function(a){return function(c,d,e){c.$watch(e.ngShow,function(c){a[Qa(c)?"removeClass":"addClass"](d,"ng-hide")})}}],rd=["$animate",function(a){return function(c,d,e){c.$watch(e.ngHide,function(c){a[Qa(c)?"addClass":"removeClass"](d,"ng-hide")})}}],zd=va(function(a,c,d){a.$watch(d.ngStyle,function(a,d){d&&a!==d&&q(d,function(a,d){c.css(d,"")});a&&c.css(a)},!0)}),Ad=["$animate",function(a){return{restrict:"EA",require:"ngSwitch",controller:["$scope",function(){this.cases=
{}}],link:function(c,d,e,g){var f,h,l,k=[];c.$watch(e.ngSwitch||e.on,function(d){var n,p=k.length;if(0<p){if(l){for(n=0;n<p;n++)l[n].remove();l=null}l=[];for(n=0;n<p;n++){var r=h[n];k[n].$destroy();l[n]=r;a.leave(r,function(){l.splice(n,1);0===l.length&&(l=null)})}}h=[];k=[];if(f=g.cases["!"+d]||g.cases["?"])c.$eval(e.change),q(f,function(d){var e=c.$new();k.push(e);d.transclude(e,function(c){var e=d.element;h.push(c);a.enter(c,e.parent(),e)})})})}}}],Bd=va({transclude:"element",priority:800,require:"^ngSwitch",
link:function(a,c,d,e,g){e.cases["!"+d.ngSwitchWhen]=e.cases["!"+d.ngSwitchWhen]||[];e.cases["!"+d.ngSwitchWhen].push({transclude:g,element:c})}}),Cd=va({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,g){e.cases["?"]=e.cases["?"]||[];e.cases["?"].push({transclude:g,element:c})}}),Ed=va({link:function(a,c,d,e,g){if(!g)throw t("ngTransclude")("orphan",ha(c));g(function(a){c.empty();c.append(a)})}}),ed=["$templateCache",function(a){return{restrict:"E",terminal:!0,compile:function(c,
d){"text/ng-template"==d.type&&a.put(d.id,c[0].text)}}}],Te=t("ngOptions"),Dd=aa({terminal:!0}),fd=["$compile","$parse",function(a,c){var d=/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,e={$setViewValue:C};return{restrict:"E",require:["select","?ngModel"],controller:["$element","$scope","$attrs",function(a,c,d){var l=this,k={},m=e,n;l.databound=
d.ngModel;l.init=function(a,c,d){m=a;n=d};l.addOption=function(c){Aa(c,'"option value"');k[c]=!0;m.$viewValue==c&&(a.val(c),n.parent()&&n.remove())};l.removeOption=function(a){this.hasOption(a)&&(delete k[a],m.$viewValue==a&&this.renderUnknownOption(a))};l.renderUnknownOption=function(c){c="? "+Ia(c)+" ?";n.val(c);a.prepend(n);a.val(c);n.prop("selected",!0)};l.hasOption=function(a){return k.hasOwnProperty(a)};c.$on("$destroy",function(){l.renderUnknownOption=C})}],link:function(e,f,h,l){function k(a,
c,d,e){d.$render=function(){var a=d.$viewValue;e.hasOption(a)?(A.parent()&&A.remove(),c.val(a),""===a&&w.prop("selected",!0)):E(a)&&w?c.val(""):e.renderUnknownOption(a)};c.on("change",function(){a.$apply(function(){A.parent()&&A.remove();d.$setViewValue(c.val())})})}function m(a,c,d){var e;d.$render=function(){var a=new Va(d.$viewValue);q(c.find("option"),function(c){c.selected=B(a.get(c.value))})};a.$watch(function(){xa(e,d.$viewValue)||(e=ba(d.$viewValue),d.$render())});c.on("change",function(){a.$apply(function(){var a=
[];q(c.find("option"),function(c){c.selected&&a.push(c.value)});d.$setViewValue(a)})})}function n(e,f,g){function h(){var a={"":[]},c=[""],d,k,s,t,z;t=g.$modelValue;z=y(e)||[];var E=n?Qb(z):z,F,I,A;I={};s=!1;var D,H;if(r)if(w&&M(t))for(s=new Va([]),A=0;A<t.length;A++)I[m]=t[A],s.put(w(e,I),t[A]);else s=new Va(t);for(A=0;F=E.length,A<F;A++){k=A;if(n){k=E[A];if("$"===k.charAt(0))continue;I[n]=k}I[m]=z[k];d=p(e,I)||"";(k=a[d])||(k=a[d]=[],c.push(d));r?d=B(s.remove(w?w(e,I):q(e,I))):(w?(d={},d[m]=t,d=
w(e,d)===w(e,I)):d=t===q(e,I),s=s||d);D=l(e,I);D=B(D)?D:"";k.push({id:w?w(e,I):n?E[A]:A,label:D,selected:d})}r||(u||null===t?a[""].unshift({id:"",label:"",selected:!s}):s||a[""].unshift({id:"?",label:"",selected:!0}));I=0;for(E=c.length;I<E;I++){d=c[I];k=a[d];x.length<=I?(t={element:C.clone().attr("label",d),label:k.label},z=[t],x.push(z),f.append(t.element)):(z=x[I],t=z[0],t.label!=d&&t.element.attr("label",t.label=d));D=null;A=0;for(F=k.length;A<F;A++)s=k[A],(d=z[A+1])?(D=d.element,d.label!==s.label&&
D.text(d.label=s.label),d.id!==s.id&&D.val(d.id=s.id),d.selected!==s.selected&&D.prop("selected",d.selected=s.selected)):(""===s.id&&u?H=u:(H=v.clone()).val(s.id).attr("selected",s.selected).text(s.label),z.push({element:H,label:s.label,id:s.id,selected:s.selected}),D?D.after(H):t.element.append(H),D=H);for(A++;z.length>A;)z.pop().element.remove()}for(;x.length>I;)x.pop()[0].element.remove()}var k;if(!(k=t.match(d)))throw Te("iexp",t,ha(f));var l=c(k[2]||k[1]),m=k[4]||k[6],n=k[5],p=c(k[3]||""),q=
c(k[2]?k[1]:m),y=c(k[7]),w=k[8]?c(k[8]):null,x=[[{element:f,label:""}]];u&&(a(u)(e),u.removeClass("ng-scope"),u.remove());f.empty();f.on("change",function(){e.$apply(function(){var a,c=y(e)||[],d={},h,k,l,p,t,v,u;if(r)for(k=[],p=0,v=x.length;p<v;p++)for(a=x[p],l=1,t=a.length;l<t;l++){if((h=a[l].element)[0].selected){h=h.val();n&&(d[n]=h);if(w)for(u=0;u<c.length&&(d[m]=c[u],w(e,d)!=h);u++);else d[m]=c[h];k.push(q(e,d))}}else{h=f.val();if("?"==h)k=s;else if(""===h)k=null;else if(w)for(u=0;u<c.length;u++){if(d[m]=
c[u],w(e,d)==h){k=q(e,d);break}}else d[m]=c[h],n&&(d[n]=h),k=q(e,d);1<x[0].length&&x[0][1].id!==h&&(x[0][1].selected=!1)}g.$setViewValue(k)})});g.$render=h;e.$watch(h)}if(l[1]){var p=l[0];l=l[1];var r=h.multiple,t=h.ngOptions,u=!1,w,v=y(U.createElement("option")),C=y(U.createElement("optgroup")),A=v.clone();h=0;for(var x=f.children(),D=x.length;h<D;h++)if(""===x[h].value){w=u=x.eq(h);break}p.init(l,u,A);r&&(l.$isEmpty=function(a){return!a||0===a.length});t?n(e,f,l):r?m(e,f,l):k(e,f,l,p)}}}}],hd=["$interpolate",
function(a){var c={addOption:C,removeOption:C};return{restrict:"E",priority:100,compile:function(d,e){if(E(e.value)){var g=a(d.text(),!0);g||e.$set("value",d.text())}return function(a,d,e){var k=d.parent(),m=k.data("$selectController")||k.parent().data("$selectController");m&&m.databound?d.prop("selected",!1):m=c;g?a.$watch(g,function(a,c){e.$set("value",a);a!==c&&m.removeOption(c);m.addOption(a)}):m.addOption(e.value);d.on("$destroy",function(){m.removeOption(e.value)})}}}}],gd=aa({restrict:"E",
terminal:!0});O.angular.bootstrap?console.log("WARNING: Tried to load angular more than once."):((Ga=O.jQuery)?(y=Ga,D(Ga.fn,{scope:Ja.scope,isolateScope:Ja.isolateScope,controller:Ja.controller,injector:Ja.injector,inheritedData:Ja.inheritedData}),Ab("remove",!0,!0,!1),Ab("empty",!1,!1,!1),Ab("html",!1,!1,!0)):y=N,Ea.element=y,Zc(Ea),y(U).ready(function(){Wc(U,$b)}))})(window,document);!angular.$$csp()&&angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}.ng-animate-block-transitions{transition:0s all!important;-webkit-transition:0s all!important;}</style>');
//# sourceMappingURL=angular.min.js.map

/*
 AngularJS v1.2.16
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(n,e,A){'use strict';function x(s,g,k){return{restrict:"ECA",terminal:!0,priority:400,transclude:"element",link:function(a,c,b,f,w){function y(){p&&(p.remove(),p=null);h&&(h.$destroy(),h=null);l&&(k.leave(l,function(){p=null}),p=l,l=null)}function v(){var b=s.current&&s.current.locals;if(e.isDefined(b&&b.$template)){var b=a.$new(),d=s.current;l=w(b,function(d){k.enter(d,null,l||c,function(){!e.isDefined(t)||t&&!a.$eval(t)||g()});y()});h=d.scope=b;h.$emit("$viewContentLoaded");h.$eval(u)}else y()}
var h,l,p,t=b.autoscroll,u=b.onload||"";a.$on("$routeChangeSuccess",v);v()}}}function z(e,g,k){return{restrict:"ECA",priority:-400,link:function(a,c){var b=k.current,f=b.locals;c.html(f.$template);var w=e(c.contents());b.controller&&(f.$scope=a,f=g(b.controller,f),b.controllerAs&&(a[b.controllerAs]=f),c.data("$ngControllerController",f),c.children().data("$ngControllerController",f));w(a)}}}n=e.module("ngRoute",["ng"]).provider("$route",function(){function s(a,c){return e.extend(new (e.extend(function(){},
{prototype:a})),c)}function g(a,e){var b=e.caseInsensitiveMatch,f={originalPath:a,regexp:a},k=f.keys=[];a=a.replace(/([().])/g,"\\$1").replace(/(\/)?:(\w+)([\?\*])?/g,function(a,e,b,c){a="?"===c?c:null;c="*"===c?c:null;k.push({name:b,optional:!!a});e=e||"";return""+(a?"":e)+"(?:"+(a?e:"")+(c&&"(.+?)"||"([^/]+)")+(a||"")+")"+(a||"")}).replace(/([\/$\*])/g,"\\$1");f.regexp=RegExp("^"+a+"$",b?"i":"");return f}var k={};this.when=function(a,c){k[a]=e.extend({reloadOnSearch:!0},c,a&&g(a,c));if(a){var b=
"/"==a[a.length-1]?a.substr(0,a.length-1):a+"/";k[b]=e.extend({redirectTo:a},g(b,c))}return this};this.otherwise=function(a){this.when(null,a);return this};this.$get=["$rootScope","$location","$routeParams","$q","$injector","$http","$templateCache","$sce",function(a,c,b,f,g,n,v,h){function l(){var d=p(),m=r.current;if(d&&m&&d.$$route===m.$$route&&e.equals(d.pathParams,m.pathParams)&&!d.reloadOnSearch&&!u)m.params=d.params,e.copy(m.params,b),a.$broadcast("$routeUpdate",m);else if(d||m)u=!1,a.$broadcast("$routeChangeStart",
d,m),(r.current=d)&&d.redirectTo&&(e.isString(d.redirectTo)?c.path(t(d.redirectTo,d.params)).search(d.params).replace():c.url(d.redirectTo(d.pathParams,c.path(),c.search())).replace()),f.when(d).then(function(){if(d){var a=e.extend({},d.resolve),c,b;e.forEach(a,function(d,c){a[c]=e.isString(d)?g.get(d):g.invoke(d)});e.isDefined(c=d.template)?e.isFunction(c)&&(c=c(d.params)):e.isDefined(b=d.templateUrl)&&(e.isFunction(b)&&(b=b(d.params)),b=h.getTrustedResourceUrl(b),e.isDefined(b)&&(d.loadedTemplateUrl=
b,c=n.get(b,{cache:v}).then(function(a){return a.data})));e.isDefined(c)&&(a.$template=c);return f.all(a)}}).then(function(c){d==r.current&&(d&&(d.locals=c,e.copy(d.params,b)),a.$broadcast("$routeChangeSuccess",d,m))},function(c){d==r.current&&a.$broadcast("$routeChangeError",d,m,c)})}function p(){var a,b;e.forEach(k,function(f,k){var q;if(q=!b){var g=c.path();q=f.keys;var l={};if(f.regexp)if(g=f.regexp.exec(g)){for(var h=1,p=g.length;h<p;++h){var n=q[h-1],r="string"==typeof g[h]?decodeURIComponent(g[h]):
g[h];n&&r&&(l[n.name]=r)}q=l}else q=null;else q=null;q=a=q}q&&(b=s(f,{params:e.extend({},c.search(),a),pathParams:a}),b.$$route=f)});return b||k[null]&&s(k[null],{params:{},pathParams:{}})}function t(a,c){var b=[];e.forEach((a||"").split(":"),function(a,d){if(0===d)b.push(a);else{var e=a.match(/(\w+)(.*)/),f=e[1];b.push(c[f]);b.push(e[2]||"");delete c[f]}});return b.join("")}var u=!1,r={routes:k,reload:function(){u=!0;a.$evalAsync(l)}};a.$on("$locationChangeSuccess",l);return r}]});n.provider("$routeParams",
function(){this.$get=function(){return{}}});n.directive("ngView",x);n.directive("ngView",z);x.$inject=["$route","$anchorScroll","$animate"];z.$inject=["$compile","$controller","$route"]})(window,window.angular);
//# sourceMappingURL=angular-route.min.js.map

function FastClick(a,b){"use strict";function c(a,b){return function(){return a.apply(b,arguments)}}var d;if(b=b||{},this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=b.touchBoundary||10,this.layer=a,this.tapDelay=b.tapDelay||200,!FastClick.notNeeded(a)){for(var e=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"],f=this,g=0,h=e.length;h>g;g++)f[e[g]]=c(f[e[g]],f);deviceIsAndroid&&(a.addEventListener("mouseover",this.onMouse,!0),a.addEventListener("mousedown",this.onMouse,!0),a.addEventListener("mouseup",this.onMouse,!0)),a.addEventListener("click",this.onClick,!0),a.addEventListener("touchstart",this.onTouchStart,!1),a.addEventListener("touchmove",this.onTouchMove,!1),a.addEventListener("touchend",this.onTouchEnd,!1),a.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(a.removeEventListener=function(b,c,d){var e=Node.prototype.removeEventListener;"click"===b?e.call(a,b,c.hijacked||c,d):e.call(a,b,c,d)},a.addEventListener=function(b,c,d){var e=Node.prototype.addEventListener;"click"===b?e.call(a,b,c.hijacked||(c.hijacked=function(a){a.propagationStopped||c(a)}),d):e.call(a,b,c,d)}),"function"==typeof a.onclick&&(d=a.onclick,a.addEventListener("click",function(a){d(a)},!1),a.onclick=null)}}!function(a){var b=a.document,c=b.documentElement,d="overthrow-enabled",e="ontouchmove"in b,f="WebkitOverflowScrolling"in c.style||"msOverflowStyle"in c.style||!e&&a.screen.width>800||function(){var b=a.navigator.userAgent,c=b.match(/AppleWebKit\/([0-9]+)/),d=c&&c[1],e=c&&d>=534;return b.match(/Android ([0-9]+)/)&&RegExp.$1>=3&&e||b.match(/ Version\/([0-9]+)/)&&RegExp.$1>=0&&a.blackberry&&e||b.indexOf("PlayBook")>-1&&e&&-1===!b.indexOf("Android 2")||b.match(/Firefox\/([0-9]+)/)&&RegExp.$1>=4||b.match(/wOSBrowser\/([0-9]+)/)&&RegExp.$1>=233&&e||b.match(/NokiaBrowser\/([0-9\.]+)/)&&7.3===parseFloat(RegExp.$1)&&c&&d>=533}();a.overthrow={},a.overthrow.enabledClassName=d,a.overthrow.addClass=function(){-1===c.className.indexOf(a.overthrow.enabledClassName)&&(c.className+=" "+a.overthrow.enabledClassName)},a.overthrow.removeClass=function(){c.className=c.className.replace(a.overthrow.enabledClassName,"")},a.overthrow.set=function(){f&&a.overthrow.addClass()},a.overthrow.canBeFilledWithPoly=e,a.overthrow.forget=function(){a.overthrow.removeClass()},a.overthrow.support=f?"native":"none"}(this),function(a){a.overthrow.set()}(this),function(a,b,c){if(b!==c){b.scrollIndicatorClassName="overthrow";var d=a.document,e=d.documentElement,f="native"===b.support,g=b.canBeFilledWithPoly,h=(b.configure,b.set),i=b.forget,j=b.scrollIndicatorClassName;b.closest=function(a,c){return!c&&a.className&&a.className.indexOf(j)>-1&&a||b.closest(a.parentNode)};var k=!1;b.set=function(){if(h(),!k&&!f&&g){a.overthrow.addClass(),k=!0,b.support="polyfilled",b.forget=function(){i(),k=!1,d.removeEventListener&&d.removeEventListener("touchstart",u,!1)};var j,l,m,n,o=[],p=[],q=function(){o=[],l=null},r=function(){p=[],m=null},s=function(a){n=j.querySelectorAll("textarea, input");for(var b=0,c=n.length;c>b;b++)n[b].style.pointerEvents=a},t=function(a,b){if(d.createEvent){var e,f=(!b||b===c)&&j.parentNode||j.touchchild||j;f!==j&&(e=d.createEvent("HTMLEvents"),e.initEvent("touchend",!0,!0),j.dispatchEvent(e),f.touchchild=j,j=f,f.dispatchEvent(a))}},u=function(a){if(b.intercept&&b.intercept(),q(),r(),j=b.closest(a.target),j&&j!==e&&!(a.touches.length>1)){s("none");var c=a,d=j.scrollTop,f=j.scrollLeft,g=j.offsetHeight,h=j.offsetWidth,i=a.touches[0].pageY,k=a.touches[0].pageX,n=j.scrollHeight,u=j.scrollWidth,v=function(a){var b=d+i-a.touches[0].pageY,e=f+k-a.touches[0].pageX,s=b>=(o.length?o[0]:0),v=e>=(p.length?p[0]:0);b>0&&n-g>b||e>0&&u-h>e?a.preventDefault():t(c),l&&s!==l&&q(),m&&v!==m&&r(),l=s,m=v,j.scrollTop=b,j.scrollLeft=e,o.unshift(b),p.unshift(e),o.length>3&&o.pop(),p.length>3&&p.pop()},w=function(){s("auto"),setTimeout(function(){s("none")},450),j.removeEventListener("touchmove",v,!1),j.removeEventListener("touchend",w,!1)};j.addEventListener("touchmove",v,!1),j.addEventListener("touchend",w,!1)}};d.addEventListener("touchstart",u,!1)}}}}(this,this.overthrow),function(a,b,c){if(b!==c){b.easing=function(a,b,c,d){return c*((a=a/d-1)*a*a+1)+b},b.tossing=!1;var d;b.toss=function(a,e){b.intercept();var f,g,h=0,i=a.scrollLeft,j=a.scrollTop,k={top:"+0",left:"+0",duration:50,easing:b.easing,finished:function(){}},l=!1;if(e)for(var m in k)e[m]!==c&&(k[m]=e[m]);return"string"==typeof k.left?(k.left=parseFloat(k.left),f=k.left+i):(f=k.left,k.left=k.left-i),"string"==typeof k.top?(k.top=parseFloat(k.top),g=k.top+j):(g=k.top,k.top=k.top-j),b.tossing=!0,d=setInterval(function(){h++<k.duration?(a.scrollLeft=k.easing(h,i,k.left,k.duration),a.scrollTop=k.easing(h,j,k.top,k.duration)):(f!==a.scrollLeft?a.scrollLeft=f:(l&&k.finished(),l=!0),g!==a.scrollTop?a.scrollTop=g:(l&&k.finished(),l=!0),b.intercept())},1),{top:g,left:f,duration:b.duration,easing:b.easing}},b.intercept=function(){clearInterval(d),b.tossing=!1}}}(this,this.overthrow);var deviceIsAndroid=navigator.userAgent.indexOf("Android")>0,deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent),deviceIsIOS4=deviceIsIOS&&/OS 4_\d(_\d)?/.test(navigator.userAgent),deviceIsIOSWithBadTarget=deviceIsIOS&&/OS ([6-9]|\d{2})_\d/.test(navigator.userAgent);FastClick.prototype.needsClick=function(a){"use strict";switch(a.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(a.disabled)return!0;break;case"input":if(deviceIsIOS&&"file"===a.type||a.disabled)return!0;break;case"label":case"video":return!0}return/\bneedsclick\b/.test(a.className)},FastClick.prototype.needsFocus=function(a){"use strict";switch(a.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!deviceIsAndroid;case"input":switch(a.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!a.disabled&&!a.readOnly;default:return/\bneedsfocus\b/.test(a.className)}},FastClick.prototype.sendClick=function(a,b){"use strict";var c,d;document.activeElement&&document.activeElement!==a&&document.activeElement.blur(),d=b.changedTouches[0],c=document.createEvent("MouseEvents"),c.initMouseEvent(this.determineEventType(a),!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null),c.forwardedTouchEvent=!0,a.dispatchEvent(c)},FastClick.prototype.determineEventType=function(a){"use strict";return deviceIsAndroid&&"select"===a.tagName.toLowerCase()?"mousedown":"click"},FastClick.prototype.focus=function(a){"use strict";var b;deviceIsIOS&&a.setSelectionRange&&0!==a.type.indexOf("date")&&"time"!==a.type?(b=a.value.length,a.setSelectionRange(b,b)):a.focus()},FastClick.prototype.updateScrollParent=function(a){"use strict";var b,c;if(b=a.fastClickScrollParent,!b||!b.contains(a)){c=a;do{if(c.scrollHeight>c.offsetHeight){b=c,a.fastClickScrollParent=c;break}c=c.parentElement}while(c)}b&&(b.fastClickLastScrollTop=b.scrollTop)},FastClick.prototype.getTargetElementFromEventTarget=function(a){"use strict";return a.nodeType===Node.TEXT_NODE?a.parentNode:a},FastClick.prototype.onTouchStart=function(a){"use strict";var b,c,d;if(a.targetTouches.length>1)return!0;if(b=this.getTargetElementFromEventTarget(a.target),c=a.targetTouches[0],deviceIsIOS){if(d=window.getSelection(),d.rangeCount&&!d.isCollapsed)return!0;if(!deviceIsIOS4){if(c.identifier===this.lastTouchIdentifier)return a.preventDefault(),!1;this.lastTouchIdentifier=c.identifier,this.updateScrollParent(b)}}return this.trackingClick=!0,this.trackingClickStart=a.timeStamp,this.targetElement=b,this.touchStartX=c.pageX,this.touchStartY=c.pageY,a.timeStamp-this.lastClickTime<this.tapDelay&&a.preventDefault(),!0},FastClick.prototype.touchHasMoved=function(a){"use strict";var b=a.changedTouches[0],c=this.touchBoundary;return Math.abs(b.pageX-this.touchStartX)>c||Math.abs(b.pageY-this.touchStartY)>c?!0:!1},FastClick.prototype.onTouchMove=function(a){"use strict";return this.trackingClick?((this.targetElement!==this.getTargetElementFromEventTarget(a.target)||this.touchHasMoved(a))&&(this.trackingClick=!1,this.targetElement=null),!0):!0},FastClick.prototype.findControl=function(a){"use strict";return void 0!==a.control?a.control:a.htmlFor?document.getElementById(a.htmlFor):a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},FastClick.prototype.onTouchEnd=function(a){"use strict";var b,c,d,e,f,g=this.targetElement;if(!this.trackingClick)return!0;if(a.timeStamp-this.lastClickTime<this.tapDelay)return this.cancelNextClick=!0,!0;if(this.cancelNextClick=!1,this.lastClickTime=a.timeStamp,c=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,deviceIsIOSWithBadTarget&&(f=a.changedTouches[0],g=document.elementFromPoint(f.pageX-window.pageXOffset,f.pageY-window.pageYOffset)||g,g.fastClickScrollParent=this.targetElement.fastClickScrollParent),d=g.tagName.toLowerCase(),"label"===d){if(b=this.findControl(g)){if(this.focus(g),deviceIsAndroid)return!1;g=b}}else if(this.needsFocus(g))return a.timeStamp-c>100||deviceIsIOS&&window.top!==window&&"input"===d?(this.targetElement=null,!1):(this.focus(g),this.sendClick(g,a),deviceIsIOS&&"select"===d||(this.targetElement=null,a.preventDefault()),!1);return deviceIsIOS&&!deviceIsIOS4&&(e=g.fastClickScrollParent,e&&e.fastClickLastScrollTop!==e.scrollTop)?!0:(this.needsClick(g)||(a.preventDefault(),this.sendClick(g,a)),!1)},FastClick.prototype.onTouchCancel=function(){"use strict";this.trackingClick=!1,this.targetElement=null},FastClick.prototype.onMouse=function(a){"use strict";return this.targetElement?a.forwardedTouchEvent?!0:a.cancelable&&(!this.needsClick(this.targetElement)||this.cancelNextClick)?(a.stopImmediatePropagation?a.stopImmediatePropagation():a.propagationStopped=!0,a.stopPropagation(),a.preventDefault(),!1):!0:!0},FastClick.prototype.onClick=function(a){"use strict";var b;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===a.target.type&&0===a.detail?!0:(b=this.onMouse(a),b||(this.targetElement=null),b)},FastClick.prototype.destroy=function(){"use strict";var a=this.layer;deviceIsAndroid&&(a.removeEventListener("mouseover",this.onMouse,!0),a.removeEventListener("mousedown",this.onMouse,!0),a.removeEventListener("mouseup",this.onMouse,!0)),a.removeEventListener("click",this.onClick,!0),a.removeEventListener("touchstart",this.onTouchStart,!1),a.removeEventListener("touchmove",this.onTouchMove,!1),a.removeEventListener("touchend",this.onTouchEnd,!1),a.removeEventListener("touchcancel",this.onTouchCancel,!1)},FastClick.notNeeded=function(a){"use strict";var b,c;if("undefined"==typeof window.ontouchstart)return!0;if(c=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]){if(!deviceIsAndroid)return!0;if(b=document.querySelector("meta[name=viewport]")){if(-1!==b.content.indexOf("user-scalable=no"))return!0;if(c>31&&window.innerWidth<=window.screen.width)return!0}}return"none"===a.style.msTouchAction?!0:!1},FastClick.attach=function(a,b){"use strict";return new FastClick(a,b)},"undefined"!=typeof define&&define.amd?define(function(){"use strict";return FastClick}):"undefined"!=typeof module&&module.exports?(module.exports=FastClick.attach,module.exports.FastClick=FastClick):window.FastClick=FastClick,angular.module("mobile-angular-ui.active-links",[]).run(["$rootScope",function(a){return angular.forEach(["$locationChangeSuccess","$includeContentLoaded"],function(b){return a.$on(b,function(){var a;return a=window.location.href,angular.forEach(document.links,function(b){var c;return c=angular.element(b),b.href===a?c.addClass("active"):c.removeClass("active"),c=null}),a=null})})}]),angular.module("mobile-angular-ui.directives.capture",[]).run(["CaptureService","$rootScope",function(a,b){b.$on("$routeChangeStart",function(){a.resetAll()})}]).factory("CaptureService",["$compile",function(a){var b={};return{resetAll:function(){for(name in b)this.resetYielder(name)},resetYielder:function(a){var c=b[a];this.setContentFor(a,c.defaultContent,c.defaultScope)},putYielder:function(a,c,d,e){var f={};f.name=a,f.element=c,f.defaultContent=e||"",f.defaultScope=d,b[a]=f},getYielder:function(a){return b[a]},removeYielder:function(a){delete b[a]},setContentFor:function(c,d,e){var f=b[c];f&&(f.element.html(d),a(f.element.contents())(e))}}}]).directive("contentFor",["CaptureService",function(a){return{link:function(b,c,d){a.setContentFor(d.contentFor,c.html(),b),null==d.duplicate&&c.remove()}}}]).directive("yieldTo",["$compile","CaptureService",function(a,b){return{link:function(a,c,d){b.putYielder(d.yieldTo,c,a,c.html()),c.contents().remove(),a.$on("$destroy",function(){b.removeYielder(d.yieldTo)})}}}]),angular.module("mobile-angular-ui.directives.carousel",[]).run(["$rootScope",function(a){a.carouselPrev=function(b){a.$emit("mobile-angular-ui.carousel.prev",b)},a.carouselNext=function(b){a.$emit("mobile-angular-ui.carousel.next",b)};var b=function(a){var b=angular.element(document.getElementById(a)),c=angular.element(b.children()[0]).children();return b=null,c},c=function(a){for(var b=-1,c=!1,d=0;d<a.length;d++)if(item=a[d],b+=1,angular.element(item).hasClass("active")){c=!0;break}return c?b:-1};a.$on("mobile-angular-ui.carousel.prev",function(a,d){var e=b(d),f=c(e),g=e.length-1;-1!==f&&angular.element(e[f]).removeClass("active"),0>=f?angular.element(e[g]).addClass("active"):angular.element(e[f-1]).addClass("active"),e=null,f=null,g=null}),a.$on("mobile-angular-ui.carousel.next",function(a,d){var e=b(d),f=c(e),g=e.length-1;-1!==f&&angular.element(e[f]).removeClass("active"),f===g?angular.element(e[0]).addClass("active"):angular.element(e[f+1]).addClass("active"),e=null,f=null,g=null})}]),angular.module("mobile-angular-ui.fastclick",[]).run(["$window","$document",function(a,b){a.addEventListener("load",function(){FastClick.attach(b[0].body)},!1)}]).directive("select",function(){return{replace:!1,restrict:"E",link:function(a,b){b.addClass("needsclick")}}}).directive("input",function(){return{replace:!1,restrict:"E",link:function(a,b){b.addClass("needsclick")}}}).directive("textarea",function(){return{replace:!1,restrict:"E",link:function(a,b){b.addClass("needsclick")}}}),angular.module("mobile-angular-ui.directives.forms",[]).directive("bsFormControl",function(){function a(a){for(var c="",d="",e=0;e<a.length;e++){var f=a[e];f in b?c+=f+" ":d+=f+" "}return{i:c.trim(),d:d.trim()}}for(var b={},c=["xs","sm","md","lg"],d=0;d<c.length;d++)for(var e=1;12>=e;e++)b["col-"+c[d]+"-"+e]=!0;return{replace:!0,require:"ngModel",link:function(b,c,d){null==d.labelClass&&(d.labelClass=""),null==d.id&&(d.id=d.ngModel.replace(".","_")+"_input"),("SELECT"==c[0].tagName||("INPUT"==c[0].tagName||"TEXTAREA"==c[0].tagName)&&"checkbox"!=d.type&&"radio"!=d.type)&&c.addClass("form-control");var e=angular.element('<label for="'+d.id+'" class="control-label">'+d.label+"</label>"),f=angular.element('<div class="form-group row"></div>'),g=angular.element('<div class="form-control-wrapper"></div>'),h=a(d.labelClass.split(/\s+/));""==h.i&&e.addClass("col-xs-12"),e.addClass(d.labelClass);var i=a(c[0].className.split(/\s+/));c.removeClass(i.i),g.addClass(i.i),""==i.i&&g.addClass("col-xs-12"),c.wrap(f).wrap(g),c.parent().parent().prepend(e),c.attr("id",d.id),e=f=g=h=i=null}}}).directive("switch",function(){return{restrict:"EA",replace:!0,scope:{model:"=ngModel",changeExpr:"@ngChange",disabled:"@"},template:"<div class='switch'><div class='switch-handle'></div></div>",link:function(a,b,c){function d(a){a?b.addClass("active"):b.removeClass("active")}d(a.model),b.on("click tap",function(){null==c.disabled&&(a.model=!a.model,d(a.model),null!=a.changeExpr&&a.$parent.$eval(a.changeExpr))}),b.addClass("switch-transition-enabled")}}}),angular.module("mobile-angular-ui.directives.navbars",[]).directive("navbarAbsoluteTop",function(){return{replace:!1,restrict:"C",link:function(a,b){b.parent().addClass("has-navbar-top")}}}).directive("navbarAbsoluteBottom",function(){return{replace:!1,restrict:"C",link:function(a,b){b.parent().addClass("has-navbar-bottom")}}}),angular.module("mobile-angular-ui.directives.overlay",[]).directive("overlay",["$compile",function(a){return{link:function(b,c,d){var e="",f=c.html(),g=d.overlay;if(null!=d["default"])var e="default='"+d["default"]+"'";var h='<div class="overlay" id="'+g+'" toggleable '+e+' parent-active-class="overlay-in" active-class="overlay-show">\n  <div class="overlay-inner">\n    <div class="overlay-background"></div>\n    <a href="#'+g+'" toggle="off" class="overlay-dismiss">\n      <i class="fa fa-times-circle-o"></i>\n    </a>\n    <div class="overlay-content">\n      <div class="overlay-body">\n        '+f+"\n      </div>\n    </div>\n  </div>\n</div>";c.remove();var i=angular.element(document.getElementById(g));i.length>0&&i.hasClass("overlay")&&i.remove(),f=angular.element(document.body),f.prepend(a(h)(b)),"active"===d["default"]&&f.addClass("overlay-in")}}}]),angular.module("mobile-angular-ui.directives.panels",[]).directive("bsPanel",function(){return{restrict:"EA",replace:!0,scope:!1,transclude:!0,link:function(a,b){b.removeAttr("title")},template:function(a,b){var c="";return b.title&&(c='<div class="panel-heading">\n  <h2 class="panel-title">\n    '+b.title+"\n  </h2>\n</div>"),'<div class="panel">\n  '+c+'\n  <div class="panel-body">\n     <div ng-transclude></div>\n  </div>\n</div>'}}}),angular.module("mobile-angular-ui.pointer-events",[]).run(["$document",function(a){return angular.element(a).on("click tap",function(a){var b;return b=angular.element(a.target),b.hasClass("disabled")?(a.preventDefault(),a.stopPropagation(),b=null,!1):(b=null,!0)})}]),angular.module("mobile-angular-ui.scrollable",[]).directive("scrollableContent",[function(){return{replace:!1,restrict:"C",link:function(a,b){return"native"!==overthrow.support?(b.addClass("overthrow"),overthrow.forget(),overthrow.set()):void 0}}}]),angular.module("mobile-angular-ui.directives.sidebars",[]).directive("sidebar",["$document","$rootScope",function(a,b){return{replace:!1,restrict:"C",link:function(c,d,e){var f=!0;("false"==e.closeOnOuterClicks||"0"==e.closeOnOuterClicks)&&(f=!1),d.hasClass("sidebar-left")&&d.parent().addClass("has-sidebar-left"),d.hasClass("sidebar-right")&&d.parent().addClass("has-sidebar-right");var g=function(a,b){for(var c=a;c.length>0;){if(c[0]===b[0])return c=null,!0;c=c.parent()}return c=null,!1},h=function(a){return g(angular.element(a.target),d)?void 0:(b.toggle(e.id,"off"),a.preventDefault(),!1)},i=angular.noop();f&&(i=b.$on("mobile-angular-ui.toggle.toggled",function(b,c,d){c==e.id&&(d?setTimeout(function(){a.on("click tap",h)},300):a.unbind("click tap",h))})),c.$on("$destroy",function(){i(),a.unbind("click tap",h)})}}}]),angular.module("mobile-angular-ui.directives.toggle",[]).factory("ToggleHelper",["$rootScope",function(a){return{events:{toggle:"mobile-angular-ui.toggle.toggle",toggleByClass:"mobile-angular-ui.toggle.toggleByClass",togglerLinked:"mobile-angular-ui.toggle.linked",toggleableToggled:"mobile-angular-ui.toggle.toggled"},commands:{alternate:"toggle",activate:"on",deactivate:"off"},toggle:function(b,c){null==c&&(c="toggle"),a.$emit(this.events.toggle,b,c)},toggleByClass:function(b,c){null==c&&(c="toggle"),a.$emit(this.events.toggleByClass,b,c)},notifyToggleState:function(b,c,d){a.$emit(this.events.toggleableToggled,c.id,d,c.exclusionGroup)},toggleStateChanged:function(a,b,c){this.updateElemClasses(a,b,c),this.notifyToggleState(a,b,c)},applyCommand:function(a,b){switch(a){case this.commands.activate:return!0;case this.commands.deactivate:return!1;case this.commands.alternate:return!b}},updateElemClasses:function(a,b,c){if(c){b.activeClass&&a.addClass(b.activeClass),b.inactiveClass&&a.removeClass(b.inactiveClass);var d=a.parent();b.parentActiveClass&&d.addClass(b.parentActiveClass),b.parentInactiveClass&&d.removeClass(b.parentInactiveClass)}else{b.inactiveClass&&a.addClass(b.inactiveClass),b.activeClass&&a.removeClass(b.activeClass);var d=a.parent();b.parentInactiveClass&&d.addClass(b.parentInactiveClass),b.parentActiveClass&&d.removeClass(b.parentActiveClass)}}}}]).run(["$rootScope","ToggleHelper",function(a,b){a.toggle=function(a,c){null==c&&(c="toggle"),b.toggle(a,c)},a.toggleByClass=function(a,c){null==c&&(c="toggle"),b.toggleByClass(a,c)}}]).directive("toggle",["$rootScope","ToggleHelper",function(a,b){return{restrict:"A",link:function(c,d,e){var f=e.toggle||b.commands.alternate,g=e.target,h=e.targetClass,i="true"===e.bubble||"1"===e.bubble||1===e.bubble||""===e.bubble||"bubble"===e.bubble;if(!g&&e.href&&(g=e.href.slice(1)),!g&&!h)throw"'target' or 'target-class' attribute required with 'toggle'";d.on("click tap",function(a){var c=angular.element(a.target);return c.hasClass("disabled")?void 0:(null!=g&&b.toggle(g,f),null!=h&&b.toggleByClass(h,f),i?!0:(a.preventDefault(),!1))});var j=a.$on(b.events.toggleableToggled,function(a,c,f){c===g&&b.updateElemClasses(d,e,f)});null!=g&&a.$emit(b.events.togglerLinked,g),c.$on("$destroy",j)}}}]).directive("toggleable",["$rootScope","ToggleHelper",function(a,b){return{restrict:"A",link:function(c,d,e){var f=!1;if(e["default"]){switch(e["default"]){case"active":f=!0;break;case"inactive":f=!1}b.toggleStateChanged(d,e,f)}var g=a.$on(b.events.toggle,function(a,c,g){var h;c===e.id&&(h=f,f=b.applyCommand(g,h),h!==f&&b.toggleStateChanged(d,e,f))}),h=a.$on(b.events.toggleByClass,function(a,c,g){var h;d.hasClass(c)&&(h=f,f=b.applyCommand(g,h),h!==f&&b.toggleStateChanged(d,e,f))}),i=a.$on(b.events.toggleableToggled,function(a,c,g,h){g&&e.id!==c&&e.exclusionGroup===h&&null!=e.exclusionGroup&&(f=!1,b.toggleStateChanged(d,e,f))}),j=a.$on(b.events.togglerLinked,function(a,c){e.id===c&&b.notifyToggleState(d,e,f)});c.$on("$destroy",function(){g(),h(),i(),j()})}}}]),angular.module("mobile-angular-ui",["mobile-angular-ui.pointer-events","mobile-angular-ui.active-links","mobile-angular-ui.fastclick","mobile-angular-ui.scrollable","mobile-angular-ui.directives.toggle","mobile-angular-ui.directives.overlay","mobile-angular-ui.directives.forms","mobile-angular-ui.directives.panels","mobile-angular-ui.directives.capture","mobile-angular-ui.directives.sidebars","mobile-angular-ui.directives.navbars","mobile-angular-ui.directives.carousel"]);

(function(){var a;a=angular.module("ngQuickDate",[]),a.provider("ngQuickDateDefaults",function(){return{options:{dateFormat:"M/d/yyyy",timeFormat:"h:mm a",labelFormat:null,placeholder:"Click to Set Date",hoverText:null,buttonIconHtml:null,closeButtonHtml:"&times;",nextLinkHtml:"Next &rarr;",prevLinkHtml:"&larr; Prev",disableTimepicker:!1,disableClearButton:!1,defaultTime:null,dayAbbreviations:["Su","M","Tu","W","Th","F","Sa"],dateFilter:null,parseDateFunction:function(a){var b;return b=Date.parse(a),isNaN(b)?null:new Date(b)}},$get:function(){return this.options},set:function(a,b){var c,d,e;if("object"==typeof a){e=[];for(c in a)d=a[c],e.push(this.options[c]=d);return e}return this.options[a]=b}}}),a.directive("quickDatepicker",["ngQuickDateDefaults","$filter","$sce",function(a,b,c){return{restrict:"E",require:"?ngModel",scope:{dateFilter:"=?",onChange:"&",required:"@"},replace:!0,link:function(d,e,f,g){var h,i,j,k,l,m,n,o,p,q,r,s,t;return m=function(){return q(),d.toggleCalendar(!1),d.weeks=[],d.inputDate=null,d.inputTime=null,d.invalid=!0,"string"==typeof f.initValue&&g.$setViewValue(f.initValue),p(),o()},q=function(){var b,e;for(b in a)e=a[b],b.match(/[Hh]tml/)?d[b]=c.trustAsHtml(a[b]||""):!d[b]&&f[b]?d[b]=f[b]:d[b]||(d[b]=a[b]);return d.labelFormat||(d.labelFormat=d.dateFormat,d.disableTimepicker||(d.labelFormat+=" "+d.timeFormat)),f.iconClass&&f.iconClass.length?d.buttonIconHtml=c.trustAsHtml("<i ng-show='iconClass' class='"+f.iconClass+"'></i>"):void 0},i=!1,window.document.addEventListener("click",function(){return d.calendarShown&&!i&&(d.toggleCalendar(!1),d.$apply()),i=!1}),angular.element(e[0])[0].addEventListener("click",function(){return i=!0}),o=function(){var a;return a=g.$modelValue?new Date(g.$modelValue):null,s(),r(a),d.mainButtonStr=a?b("date")(a,d.labelFormat):d.placeholder,d.invalid=g.$invalid},r=function(a){return null!=a?(d.inputDate=b("date")(a,d.dateFormat),d.inputTime=b("date")(a,d.timeFormat)):(d.inputDate=null,d.inputTime=null)},p=function(a){var b;return null==a&&(a=null),b=null!=a?new Date(a):new Date,"Invalid Date"===b.toString()&&(b=new Date),b.setDate(1),d.calendarDate=new Date(b)},s=function(){var a,b,c,e,f,h,i,k,m,n,o,p,q,r;for(h=d.calendarDate.getDay(),e=l(d.calendarDate.getFullYear(),d.calendarDate.getMonth()),f=Math.ceil((h+e)/7),o=[],a=new Date(d.calendarDate),a.setDate(a.getDate()+-1*h),i=p=0,r=f-1;r>=0?r>=p:p>=r;i=r>=0?++p:--p)for(o.push([]),c=q=0;6>=q;c=++q)b=new Date(a),d.defaultTime&&(m=d.defaultTime.split(":"),b.setHours(m[0]||0),b.setMinutes(m[1]||0),b.setSeconds(m[2]||0)),k=g.$modelValue&&b&&j(b,g.$modelValue),n=j(b,new Date),o[i].push({date:b,selected:k,disabled:"function"==typeof d.dateFilter?!d.dateFilter(b):!1,other:b.getMonth()!==d.calendarDate.getMonth(),today:n}),a.setDate(a.getDate()+1);return d.weeks=o},g.$parsers.push(function(a){return d.required&&null==a?(g.$setValidity("required",!1),null):angular.isDate(a)?(g.$setValidity("required",!0),a):angular.isString(a)?(g.$setValidity("required",!0),d.parseDateFunction(a)):null}),g.$formatters.push(function(a){return angular.isDate(a)?a:angular.isString(a)?d.parseDateFunction(a):void 0}),h=function(a,c){return b("date")(a,c)},t=function(a){return"string"==typeof a?n(a):a},n=a.parseDateFunction,j=function(a,b,c){return null==c&&(c=!1),c?a-b===0:(a=t(a),b=t(b),a&&b&&a.getYear()===b.getYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate())},k=function(a,b){return a&&b?parseInt(a.getTime()/6e4)===parseInt(b.getTime()/6e4):!1},l=function(a,b){return[31,a%4===0&&a%100!==0||a%400===0?29:28,31,30,31,30,31,31,30,31,30,31][b]},g.$render=function(){return p(g.$viewValue),o()},g.$viewChangeListeners.unshift(function(){return p(g.$viewValue),o(),d.onChange?d.onChange():void 0}),d.$watch("calendarShown",function(a){var b;return a?(b=angular.element(e[0].querySelector(".quickdate-date-input"))[0],b.select()):void 0}),d.toggleCalendar=function(a){return d.calendarShown=isFinite(a)?a:!d.calendarShown},d.selectDate=function(a,b){var c;return null==b&&(b=!0),c=!g.$viewValue&&a||g.$viewValue&&!a||a&&g.$viewValue&&a.getTime()!==g.$viewValue.getTime(),"function"!=typeof d.dateFilter||d.dateFilter(a)?(g.$setViewValue(a),b&&d.toggleCalendar(!1),!0):!1},d.selectDateFromInput=function(a){var b,c,e,f;null==a&&(a=!1);try{if(c=n(d.inputDate),!c)throw"Invalid Date";if(!d.disableTimepicker&&d.inputTime&&d.inputTime.length&&c){if(f=d.disableTimepicker?"00:00:00":d.inputTime,e=n(""+d.inputDate+" "+f),!e)throw"Invalid Time";c=e}if(!k(g.$viewValue,c)&&!d.selectDate(c,!1))throw"Invalid Date";return a&&d.toggleCalendar(!1),d.inputDateErr=!1,d.inputTimeErr=!1}catch(h){if(b=h,"Invalid Date"===b)return d.inputDateErr=!0;if("Invalid Time"===b)return d.inputTimeErr=!0}},d.onDateInputTab=function(){return d.disableTimepicker&&d.toggleCalendar(!1),!0},d.onTimeInputTab=function(){return d.toggleCalendar(!1),!0},d.nextMonth=function(){return p(new Date(new Date(d.calendarDate).setMonth(d.calendarDate.getMonth()+1))),o()},d.prevMonth=function(){return p(new Date(new Date(d.calendarDate).setMonth(d.calendarDate.getMonth()-1))),o()},d.clear=function(){return d.selectDate(null,!0)},m()},template:"<div class='quickdate'>\n <a href='' ng-focus='toggleCalendar()' ng-click='toggleCalendar()' class='quickdate-button' title='{{hoverText}}'><div ng-hide='iconClass' ng-bind-html='buttonIconHtml'></div>{{mainButtonStr}}</a>\n <div class='quickdate-popup' ng-class='{open: calendarShown}'>\n <a href='' tabindex='-1' class='quickdate-close' ng-click='toggleCalendar()'><div ng-bind-html='closeButtonHtml'></div></a>\n <div class='quickdate-text-inputs'>\n <div class='quickdate-input-wrapper'>\n <label>Date</label>\n <input class='quickdate-date-input' ng-class=\"{'ng-invalid': inputDateErr}\" name='inputDate' type='text' ng-model='inputDate' placeholder='1/1/2013' ng-enter=\"selectDateFromInput(true)\" ng-blur=\"selectDateFromInput(false)\" on-tab='onDateInputTab()' />\n </div>\n <div class='quickdate-input-wrapper' ng-hide='disableTimepicker'>\n <label>Time</label>\n <input class='quickdate-time-input' ng-class=\"{'ng-invalid': inputTimeErr}\" name='inputTime' type='text' ng-model='inputTime' placeholder='12:00 PM' ng-enter=\"selectDateFromInput(true)\" ng-blur=\"selectDateFromInput(false)\" on-tab='onTimeInputTab()'>\n </div>\n </div>\n <div class='quickdate-calendar-header'>\n <a href='' class='quickdate-prev-month quickdate-action-link' tabindex='-1' ng-click='prevMonth()'><div ng-bind-html='prevLinkHtml'></div></a>\n <span class='quickdate-month'>{{calendarDate | date:'MMMM yyyy'}}</span>\n <a href='' class='quickdate-next-month quickdate-action-link' ng-click='nextMonth()' tabindex='-1' ><div ng-bind-html='nextLinkHtml'></div></a>\n </div>\n <table class='quickdate-calendar'>\n <thead>\n <tr>\n <th ng-repeat='day in dayAbbreviations'>{{day}}</th>\n </tr>\n </thead>\n <tbody>\n <tr ng-repeat='week in weeks'>\n <td ng-mousedown='selectDate(day.date, true, true)' ng-click='$event.preventDefault()' ng-class='{\"other-month\": day.other, \"disabled-date\": day.disabled, \"selected\": day.selected, \"is-today\": day.today}' ng-repeat='day in week'>{{day.date | date:'d'}}</td>\n </tr>\n </tbody>\n </table>\n <div class='quickdate-popup-footer'>\n <a href='' class='quickdate-clear' tabindex='-1' ng-hide='disableClearButton' ng-click='clear()'>Clear</a>\n </div>\n </div>\n</div>"}}]),a.directive("ngEnter",function(){return function(a,b,c){return b.bind("keydown keypress",function(b){return 13===b.which?(a.$apply(c.ngEnter),b.preventDefault()):void 0})}}),a.directive("onTab",function(){return{restrict:"A",link:function(a,b,c){return b.bind("keydown keypress",function(b){return 9!==b.which||b.shiftKey?void 0:a.$apply(c.onTab)})}}})}).call(this);

eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('7 p(a){a=a||{};5.8.1N.2h(2,32);2.L=a.1u||"";2.1D=a.1q||H;2.P=a.1H||0;2.E=a.1B||1f 5.8.1U(0,0);2.B=a.W||1f 5.8.2t(0,0);2.S=a.11||q;2.1n=a.1l||"28";2.1k=a.D||{};2.1G=a.1E||"34";2.M=a.19||"2W://2Q.5.2L/2I/2G/2F/1v.2z";3(a.19===""){2.M=""}2.1i=a.1r||1f 5.8.1U(1,1);2.Y=a.1s||H;2.1a=a.1p||H;2.1K=a.2k||"2g";2.17=a.1m||H;2.4=q;2.w=q;2.X=q;2.16=q;2.15=q;2.13=q;2.12=q;2.O=q}p.r=1f 5.8.1N();p.r.22=7(){6 a;6 d=2;6 c=7(e){e.1Z=U;3(e.18){e.18()}};6 b=7(e){e.2S=H;3(e.1Y){e.1Y()}3(!d.17){c(e)}};3(!2.4){2.4=1g.2K("2J");2.1d();3(t 2.L.1w==="u"){2.4.J=2.F()+2.L}v{2.4.J=2.F();2.4.1b(2.L)}2.2y()[2.1K].1b(2.4);2.1F();3(2.4.9.A){2.O=U}v{3(2.P!==0&&2.4.Z>2.P){2.4.9.A=2.P;2.4.9.2u="2s";2.O=U}v{a=2.24();2.4.9.A=(2.4.Z-a.14-a.T)+"R";2.O=H}}2.1t(2.1D);3(!2.17){2.X=5.8.s.I(2.4,"2n",c);2.16=5.8.s.I(2.4,"1L",c);2.15=5.8.s.I(2.4,"2m",c);2.1o=5.8.s.I(2.4,"2l",7(e){2.9.1J="2j"})}2.12=5.8.s.I(2.4,"2i",b);5.8.s.Q(2,"2f")}};p.r.F=7(){6 a="";3(2.M!==""){a="<2e";a+=" 2d=\'"+2.M+"\'";a+=" 2c=T";a+=" 9=\'";a+=" W: 2b;";a+=" 1J: 2a;";a+=" 29: "+2.1G+";";a+="\'>"}N a};p.r.1F=7(){6 a;3(2.M!==""){a=2.4.27;2.w=5.8.s.I(a,\'1L\',2.1I())}v{2.w=q}};p.r.1I=7(){6 a=2;N 7(e){e.1Z=U;3(e.18){e.18()}a.1v();5.8.s.Q(a,"26")}};p.r.1t=7(d){6 m;6 n;6 e=0,G=0;3(!d){m=2.25();3(m 39 5.8.38){3(!m.23().37(2.B)){m.36(2.B)}n=m.23();6 a=m.35();6 h=a.Z;6 f=a.21;6 k=2.E.A;6 l=2.E.1j;6 g=2.4.Z;6 b=2.4.21;6 i=2.1i.A;6 j=2.1i.1j;6 o=2.20().31(2.B);3(o.x<(-k+i)){e=o.x+k-i}v 3((o.x+g+k+i)>h){e=o.x+g+k+i-h}3(2.1a){3(o.y<(-l+j+b)){G=o.y+l-j-b}v 3((o.y+l+j)>f){G=o.y+l+j-f}}v{3(o.y<(-l+j)){G=o.y+l-j}v 3((o.y+b+l+j)>f){G=o.y+b+l+j-f}}3(!(e===0&&G===0)){6 c=m.30();m.2Z(e,G)}}}};p.r.1d=7(){6 i,D;3(2.4){2.4.2Y=2.1n;2.4.9.2X="";D=2.1k;2V(i 2U D){3(D.2R(i)){2.4.9[i]=D[i]}}3(t 2.4.9.1h!=="u"&&2.4.9.1h!==""){2.4.9.2P="2O(1h="+(2.4.9.1h*2N)+")"}2.4.9.W="2M";2.4.9.V=\'1y\';3(2.S!==q){2.4.9.11=2.S}}};p.r.24=7(){6 c;6 a={1e:0,1c:0,14:0,T:0};6 b=2.4;3(1g.1x&&1g.1x.1V){c=b.2H.1x.1V(b,"");3(c){a.1e=C(c.1T,10)||0;a.1c=C(c.1S,10)||0;a.14=C(c.1R,10)||0;a.T=C(c.1W,10)||0}}v 3(1g.2E.K){3(b.K){a.1e=C(b.K.1T,10)||0;a.1c=C(b.K.1S,10)||0;a.14=C(b.K.1R,10)||0;a.T=C(b.K.1W,10)||0}}N a};p.r.2D=7(){3(2.4){2.4.2C.2B(2.4);2.4=q}};p.r.1A=7(){2.22();6 a=2.20().2A(2.B);2.4.9.14=(a.x+2.E.A)+"R";3(2.1a){2.4.9.1c=-(a.y+2.E.1j)+"R"}v{2.4.9.1e=(a.y+2.E.1j)+"R"}3(2.Y){2.4.9.V=\'1y\'}v{2.4.9.V="1X"}};p.r.2T=7(a){3(t a.1l!=="u"){2.1n=a.1l;2.1d()}3(t a.D!=="u"){2.1k=a.D;2.1d()}3(t a.1u!=="u"){2.1Q(a.1u)}3(t a.1q!=="u"){2.1D=a.1q}3(t a.1H!=="u"){2.P=a.1H}3(t a.1B!=="u"){2.E=a.1B}3(t a.1p!=="u"){2.1a=a.1p}3(t a.W!=="u"){2.1z(a.W)}3(t a.11!=="u"){2.1P(a.11)}3(t a.1E!=="u"){2.1G=a.1E}3(t a.19!=="u"){2.M=a.19}3(t a.1r!=="u"){2.1i=a.1r}3(t a.1s!=="u"){2.Y=a.1s}3(t a.1m!=="u"){2.17=a.1m}3(2.4){2.1A()}};p.r.1Q=7(a){2.L=a;3(2.4){3(2.w){5.8.s.z(2.w);2.w=q}3(!2.O){2.4.9.A=""}3(t a.1w==="u"){2.4.J=2.F()+a}v{2.4.J=2.F();2.4.1b(a)}3(!2.O){2.4.9.A=2.4.Z+"R";3(t a.1w==="u"){2.4.J=2.F()+a}v{2.4.J=2.F();2.4.1b(a)}}2.1F()}5.8.s.Q(2,"2x")};p.r.1z=7(a){2.B=a;3(2.4){2.1A()}5.8.s.Q(2,"1O")};p.r.1P=7(a){2.S=a;3(2.4){2.4.9.11=a}5.8.s.Q(2,"2w")};p.r.2v=7(){N 2.L};p.r.1C=7(){N 2.B};p.r.33=7(){N 2.S};p.r.2r=7(){2.Y=H;3(2.4){2.4.9.V="1X"}};p.r.2q=7(){2.Y=U;3(2.4){2.4.9.V="1y"}};p.r.2p=7(c,b){6 a=2;3(b){2.B=b.1C();2.13=5.8.s.2o(b,"1O",7(){a.1z(2.1C())})}2.1M(c);3(2.4){2.1t()}};p.r.1v=7(){3(2.w){5.8.s.z(2.w);2.w=q}3(2.X){5.8.s.z(2.X);5.8.s.z(2.16);5.8.s.z(2.15);5.8.s.z(2.1o);2.X=q;2.16=q;2.15=q;2.1o=q}3(2.13){5.8.s.z(2.13);2.13=q}3(2.12){5.8.s.z(2.12);2.12=q}2.1M(q)};',62,196,'||this|if|div_|google|var|function|maps|style||||||||||||||||InfoBox|null|prototype|event|typeof|undefined|else|closeListener_|||removeListener|width|position_|parseInt|boxStyle|pixelOffset_|getCloseBoxImg_|yOffset|false|addDomListener|innerHTML|currentStyle|content_|closeBoxURL_|return|fixedWidthSet_|maxWidth_|trigger|px|zIndex_|right|true|visibility|position|eventListener1_|isHidden_|offsetWidth||zIndex|contextListener_|moveListener_|left|eventListener3_|eventListener2_|enableEventPropagation_|stopPropagation|closeBoxURL|alignBottom_|appendChild|bottom|setBoxStyle_|top|new|document|opacity|infoBoxClearance_|height|boxStyle_|boxClass|enableEventPropagation|boxClass_|eventListener4_|alignBottom|disableAutoPan|infoBoxClearance|isHidden|panBox_|content|close|nodeType|defaultView|hidden|setPosition|draw|pixelOffset|getPosition|disableAutoPan_|closeBoxMargin|addClickHandler_|closeBoxMargin_|maxWidth|getCloseClickHandler_|cursor|pane_|click|setMap|OverlayView|position_changed|setZIndex|setContent|borderLeftWidth|borderBottomWidth|borderTopWidth|Size|getComputedStyle|borderRightWidth|visible|preventDefault|cancelBubble|getProjection|offsetHeight|createInfoBoxDiv_|getBounds|getBoxWidths_|getMap|closeclick|firstChild|infoBox|margin|pointer|relative|align|src|img|domready|floatPane|apply|contextmenu|default|pane|mouseover|dblclick|mousedown|addListener|open|hide|show|auto|LatLng|overflow|getContent|zindex_changed|content_changed|getPanes|gif|fromLatLngToDivPixel|removeChild|parentNode|onRemove|documentElement|mapfiles|en_us|ownerDocument|intl|div|createElement|com|absolute|100|alpha|filter|www|hasOwnProperty|returnValue|setOptions|in|for|http|cssText|className|panBy|getCenter|fromLatLngToContainerPixel|arguments|getZIndex|2px|getDiv|setCenter|contains|Map|instanceof'.split('|'),0,{}))

eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('5 G(b,a){b.N().V(G,n.o.2Z);4.I=b;4.2E=b.N().2y();4.M=a;4.C=t;4.q=t;4.16=t;4.1o=w;4.K(b.v())}G.6.2F=5(){7 d=4;7 g;7 f;4.q=3A.3u("1Y");4.q.5p=4.2E;9(4.1o){4.2a()}4.4O().4H.4B(4.q);4.2X=n.o.u.1G(4.v(),"4b",5(){f=g});n.o.u.1E(4.q,"42",5(){g=H;f=w});n.o.u.1E(4.q,"2M",5(e){g=w;9(!f){7 c;7 b;7 a=d.I.N();n.o.u.X(a,"2M",d.I);n.o.u.X(a,"3V",d.I);9(a.2B()){b=a.1y();c=d.I.1s();a.v().1V(c);1U(5(){a.v().1V(c);9(b!==t&&(a.v().17()>b)){a.v().3F(b+1)}},3z)}e.3w=H;9(e.2j){e.2j()}}});n.o.u.1E(4.q,"2U",5(){7 a=d.I.N();n.o.u.X(a,"2U",d.I)});n.o.u.1E(4.q,"2L",5(){7 a=d.I.N();n.o.u.X(a,"2L",d.I)})};G.6.2Q=5(){9(4.q&&4.q.3e){4.1F();n.o.u.3b(4.2X);n.o.u.57(4.q);4.q.3e.4Z(4.q);4.q=t}};G.6.38=5(){9(4.1o){7 a=4.28(4.C);4.q.U.1J=a.y+"z";4.q.U.1H=a.x+"z"}};G.6.1F=5(){9(4.q){4.q.U.36="2V"}4.1o=w};G.6.2a=5(){9(4.q){7 e="";7 c=4.3g.4j(" ");7 b=12(c[0].1N(),10);7 d=12(c[1].1N(),10);7 a=4.28(4.C);4.q.U.43=4.2P(a);e="<41 3Z=\'"+4.2O+"\' U=\'20: 1Z; 1J: "+d+"z; 1H: "+b+"z; ";9(!4.I.N().1l){e+="3Y: 3X("+(-1*d)+"z, "+((-1*b)+4.1r)+"z, "+((-1*d)+4.1k)+"z, "+(-1*b)+"z);"}e+="\'>";4.q.3W=e+"<1Y U=\'"+"20: 1Z;"+"1J: "+4.1X[0]+"z;"+"1H: "+4.1X[1]+"z;"+"3T: "+4.2D+";"+"1O-1f: "+4.2z+"z;"+"1O-3P: "+4.2v+";"+"1O-3N: "+4.2t+";"+"1O-U: "+4.2s+";"+"1w-3I: "+4.2o+";"+"1w-3E: 1h;"+"1x: "+4.1r+"z;"+"3B-1u:"+4.1k+"z;"+"\'>"+4.16.1w+"</1Y>";9(1Q 4.16.14==="15"||4.16.14===""){4.q.14=4.I.N().2G()}L{4.q.14=4.16.14}4.q.U.36=""}4.1o=H};G.6.3i=5(a){4.16=a;7 b=A.3p(0,a.2T-1);b=A.22(4.M.p-1,b);7 c=4.M[b];4.2O=c.3f;4.1k=c.1u;4.1r=c.1x;4.1X=c.5m||[0,0];4.2c=c.5g||[12(4.1k/2,10),12(4.1r/2,10)];4.2D=c.5b||"55";4.2z=c.51||11;4.2o=c.4V||"2V";4.2t=c.4T||"4R";4.2s=c.4N||"4K";4.2v=c.4J||"4I,4G-4F";4.3g=c.4D||"0 0"};G.6.3h=5(a){4.C=a};G.6.2P=5(b){7 a=[];a.Y("4A: 4y;");a.Y("20: 1Z; 1J: "+b.y+"z; 1H: "+b.x+"z;");a.Y("1x: "+4.1r+"z; 1u: "+4.1k+"z;");j a.4v("")};G.6.28=5(b){7 a=4.37().1P(b);a.x-=4.2c[1];a.y-=4.2c[0];a.x=12(a.x,10);a.y=12(a.y,10);j a};5 D(a){4.W=a;4.Q=a.v();4.T=a.3c();4.13=a.2S();4.18=a.3a();4.k=[];4.C=t;4.2e=t;4.Z=F G(4,a.23())}D.6.45=5(){j 4.k.p};D.6.1D=5(){j 4.k};D.6.2R=5(){j 4.C};D.6.v=5(){j 4.Q};D.6.N=5(){j 4.W};D.6.1s=5(){7 i;7 b=F n.o.1m(4.C,4.C);7 a=4.1D();B(i=0;i<a.p;i++){b.V(a[i].S())}j b};D.6.1C=5(){4.Z.K(t);4.k=[];21 4.k};D.6.1B=5(e){7 i;7 c;7 b;9(4.2N(e)){j w}9(!4.C){4.C=e.S();4.25()}L{9(4.18){7 l=4.k.p+1;7 a=(4.C.O()*(l-1)+e.S().O())/l;7 d=(4.C.19()*(l-1)+e.S().19())/l;4.C=F n.o.1q(a,d);4.25()}}e.1p=H;4.k.Y(e);c=4.k.p;b=4.W.1y();9(b!==t&&4.Q.17()>b){9(e.v()!==4.Q){e.K(4.Q)}}L 9(c<4.13){9(e.v()!==4.Q){e.K(4.Q)}}L 9(c===4.13){B(i=0;i<c;i++){4.k[i].K(t)}}L{e.K(t)}4.2K();j H};D.6.2J=5(a){j 4.2e.2I(a.S())};D.6.25=5(){7 a=F n.o.1m(4.C,4.C);4.2e=4.W.2f(a)};D.6.2K=5(){7 c=4.k.p;7 a=4.W.1y();9(a!==t&&4.Q.17()>a){4.Z.1F();j}9(c<4.13){4.Z.1F();j}7 b=4.W.23().p;7 d=4.W.2H()(4.k,b);4.Z.3h(4.C);4.Z.3i(d);4.Z.2a()};D.6.2N=5(a){7 i;9(4.k.1d){j 4.k.1d(a)!==-1}L{B(i=0;i<4.k.p;i++){9(a===4.k[i]){j H}}}j w};5 8(a,c,b){4.V(8,n.o.2Z);c=c||[];b=b||{};4.k=[];4.E=[];4.1j=[];4.1e=t;4.1i=w;4.T=b.3U||3S;4.13=b.3R||2;4.1W=b.2C||t;4.M=b.3Q||[];4.2d=b.14||"";4.1z=H;9(b.2A!==15){4.1z=b.2A}4.18=w;9(b.2k!==15){4.18=b.2k}4.1a=w;9(b.2x!==15){4.1a=b.2x}4.1l=w;9(b.2w!==15){4.1l=b.2w}4.1I=b.3O||8.2u;4.1t=b.3L||8.2g;4.1c=b.3J||8.2r;4.1T=b.3H||8.2p;4.1R=b.3G||8.2n;4.1v=b.3D||8.2m;4.1S=b.3C||"P";9(3K.3y.3M().1d("3x")!==-1){4.1R=4.1v}4.2q();4.2l(c,H);4.K(a)}8.6.2F=5(){7 a=4;4.1e=4.v();4.1i=H;4.1b();4.1j=[n.o.u.1G(4.v(),"3v",5(){a.1A(w);9(4.17()===(4.2i("3t")||0)||4.17()===4.2i("2C")){n.o.u.X(4,"2h")}}),n.o.u.1G(4.v(),"2h",5(){a.1n()})]};8.6.2Q=5(){7 i;B(i=0;i<4.k.p;i++){9(4.k[i].v()!==4.1e){4.k[i].K(4.1e)}}B(i=0;i<4.E.p;i++){4.E[i].1C()}4.E=[];B(i=0;i<4.1j.p;i++){n.o.u.3b(4.1j[i])}4.1j=[];4.1e=t;4.1i=w};8.6.38=5(){};8.6.2q=5(){7 i,1f;9(4.M.p>0){j}B(i=0;i<4.1c.p;i++){1f=4.1c[i];4.M.Y({3f:4.1I+(i+1)+"."+4.1t,1u:1f,1x:1f})}};8.6.3s=5(){7 i;7 a=4.1D();7 b=F n.o.1m();B(i=0;i<a.p;i++){b.V(a[i].S())}4.v().1V(b)};8.6.3c=5(){j 4.T};8.6.3r=5(a){4.T=a};8.6.2S=5(){j 4.13};8.6.3q=5(a){4.13=a};8.6.1y=5(){j 4.1W};8.6.40=5(a){4.1W=a};8.6.23=5(){j 4.M};8.6.3o=5(a){4.M=a};8.6.2G=5(){j 4.2d};8.6.3n=5(a){4.2d=a};8.6.2B=5(){j 4.1z};8.6.3m=5(a){4.1z=a};8.6.3a=5(){j 4.18};8.6.44=5(a){4.18=a};8.6.3l=5(){j 4.1a};8.6.3k=5(a){4.1a=a};8.6.3j=5(){j 4.1l};8.6.48=5(a){4.1l=a};8.6.5o=5(){j 4.1t};8.6.5n=5(a){4.1t=a};8.6.5l=5(){j 4.1I};8.6.5k=5(a){4.1I=a};8.6.5i=5(){j 4.1c};8.6.5h=5(a){4.1c=a};8.6.2H=5(){j 4.1T};8.6.5f=5(a){4.1T=a};8.6.5e=5(){j 4.1v};8.6.5d=5(a){4.1v=a};8.6.2y=5(){j 4.1S};8.6.5c=5(a){4.1S=a};8.6.1D=5(){j 4.k};8.6.5a=5(){j 4.k.p};8.6.59=5(){j 4.E};8.6.54=5(){j 4.E.p};8.6.1B=5(b,a){4.2b(b);9(!a){4.1n()}};8.6.2l=5(b,a){7 c;B(c 39 b){9(b.50(c)){4.2b(b[c])}}9(!a){4.1n()}};8.6.2b=5(b){9(b.4X()){7 a=4;n.o.u.1G(b,"4W",5(){9(a.1i){4.1p=w;a.1b()}})}b.1p=w;4.k.Y(b)};8.6.4U=5(c,a){7 b=4.29(c);9(!a&&b){4.1b()}j b};8.6.4S=5(a,c){7 i,r;7 b=w;B(i=0;i<a.p;i++){r=4.29(a[i]);b=b||r}9(!c&&b){4.1b()}j b};8.6.29=5(b){7 i;7 a=-1;9(4.k.1d){a=4.k.1d(b)}L{B(i=0;i<4.k.p;i++){9(b===4.k[i]){a=i;4Q}}}9(a===-1){j w}b.K(t);4.k.4P(a,1);j H};8.6.4M=5(){4.1A(H);4.k=[]};8.6.1b=5(){7 a=4.E.4L();4.E=[];4.1A(w);4.1n();1U(5(){7 i;B(i=0;i<a.p;i++){a[i].1C()}},0)};8.6.2f=5(d){7 f=4.37();7 c=F n.o.1q(d.27().O(),d.27().19());7 a=F n.o.1q(d.24().O(),d.24().19());7 e=f.1P(c);e.x+=4.T;e.y-=4.T;7 g=f.1P(a);g.x-=4.T;g.y+=4.T;7 b=f.32(e);7 h=f.32(g);d.V(b);d.V(h);j d};8.6.1n=5(){4.26(0)};8.6.1A=5(a){7 i,J;B(i=0;i<4.E.p;i++){4.E[i].1C()}4.E=[];B(i=0;i<4.k.p;i++){J=4.k[i];J.1p=w;9(a){J.K(t)}}};8.6.30=5(b,e){7 R=4E;7 g=(e.O()-b.O())*A.1K/1M;7 f=(e.19()-b.19())*A.1K/1M;7 a=A.1L(g/2)*A.1L(g/2)+A.31(b.O()*A.1K/1M)*A.31(e.O()*A.1K/1M)*A.1L(f/2)*A.1L(f/2);7 c=2*A.4C(A.2Y(a),A.2Y(1-a));7 d=R*c;j d};8.6.35=5(b,a){j a.2I(b.S())};8.6.33=5(c){7 i,d,P,1h;7 a=4z;7 b=t;B(i=0;i<4.E.p;i++){P=4.E[i];1h=P.2R();9(1h){d=4.30(1h,c.S());9(d<a){a=d;b=P}}}9(b&&b.2J(c)){b.1B(c)}L{P=F D(4);P.1B(c);4.E.Y(P)}};8.6.26=5(e){7 i,J;7 d;7 c=4;9(!4.1i){j}9(e===0){n.o.u.X(4,"4x",4);9(1Q 4.1g!=="15"){4w(4.1g);21 4.1g}}9(4.v().17()>3){d=F n.o.1m(4.v().1s().24(),4.v().1s().27())}L{d=F n.o.1m(F n.o.1q(34.4u,-2W.4t),F n.o.1q(-34.4s,2W.4r))}7 a=4.2f(d);7 b=A.22(e+4.1R,4.k.p);B(i=e;i<b;i++){J=4.k[i];9(!J.1p&&4.35(J,a)){9(!4.1a||(4.1a&&J.4q())){4.33(J)}}}9(b<4.k.p){4.1g=1U(5(){c.26(b)},0)}L{21 4.1g;n.o.u.X(4,"4Y",4)}};8.6.V=5(d,c){j(5(b){7 a;B(a 39 b.6){4.6[a]=b.6[a]}j 4}).4p(d,[c])};8.2p=5(a,c){7 f=0;7 b="";7 d=a.p.4o();7 e=d;4n(e!==0){e=12(e/10,10);f++}f=A.22(f,c);j{1w:d,2T:f,14:b}};8.2n=52;8.2m=4m;8.2u="4l://n-o-4k-58-4i.4h.4g/4f/4e/4d/4c/m";8.2g="4a";8.2r=[53,56,5j,49,47];9(1Q 3d.6.1N!==\'5\'){3d.6.1N=5(){j 4.46(/^\\s+|\\s+$/g,\'\')}}',62,336,'||||this|function|prototype|var|MarkerClusterer|if||||||||||return|markers_|||google|maps|length|div_|||null|event|getMap|false|||px|Math|for|center_|Cluster|clusters_|new|ClusterIcon|true|cluster_|marker|setMap|else|styles_|getMarkerClusterer|lat|cluster|map_||getPosition|gridSize_|style|extend|markerClusterer_|trigger|push|clusterIcon_|||parseInt|minClusterSize_|title|undefined|sums_|getZoom|averageCenter_|lng|ignoreHidden_|repaint|imageSizes_|indexOf|activeMap_|size|timerRefStatic|center|ready_|listeners_|height_|enableRetinaIcons_|LatLngBounds|redraw_|visible_|isAdded|LatLng|width_|getBounds|imageExtension_|height|batchSizeIE_|text|width|getMaxZoom|zoomOnClick_|resetViewport_|addMarker|remove|getMarkers|addDomListener|hide|addListener|left|imagePath_|top|PI|sin|180|trim|font|fromLatLngToDivPixel|typeof|batchSize_|clusterClass_|calculator_|setTimeout|fitBounds|maxZoom_|anchorText_|div|absolute|position|delete|min|getStyles|getSouthWest|calculateBounds_|createClusters_|getNorthEast|getPosFromLatLng_|removeMarker_|show|pushMarkerTo_|anchorIcon_|title_|bounds_|getExtendedBounds|IMAGE_EXTENSION|idle|get|stopPropagation|averageCenter|addMarkers|BATCH_SIZE_IE|BATCH_SIZE|textDecoration_|CALCULATOR|setupStyles_|IMAGE_SIZES|fontStyle_|fontWeight_|IMAGE_PATH|fontFamily_|enableRetinaIcons|ignoreHidden|getClusterClass|textSize_|zoomOnClick|getZoomOnClick|maxZoom|textColor_|className_|onAdd|getTitle|getCalculator|contains|isMarkerInClusterBounds|updateIcon_|mouseout|click|isMarkerAlreadyAdded_|url_|createCss|onRemove|getCenter|getMinimumClusterSize|index|mouseover|none|178|boundsChangedListener_|sqrt|OverlayView|distanceBetweenPoints_|cos|fromDivPixelToLatLng|addToClosestCluster_|85|isMarkerInBounds_|display|getProjection|draw|in|getAverageCenter|removeListener|getGridSize|String|parentNode|url|backgroundPosition_|setCenter|useStyle|getEnableRetinaIcons|setIgnoreHidden|getIgnoreHidden|setZoomOnClick|setTitle|setStyles|max|setMinimumClusterSize|setGridSize|fitMapToMarkers|minZoom|createElement|zoom_changed|cancelBubble|msie|userAgent|100|document|line|clusterClass|batchSizeIE|align|setZoom|batchSize|calculator|decoration|imageSizes|navigator|imageExtension|toLowerCase|weight|imagePath|family|styles|minimumClusterSize|60|color|gridSize|clusterclick|innerHTML|rect|clip|src|setMaxZoom|img|mousedown|cssText|setAverageCenter|getSize|replace|90|setEnableRetinaIcons|78|png|bounds_changed|images|markerclustererplus|trunk|svn|com|googlecode|v3|split|utility|http|500|while|toString|apply|getVisible|00048865625|08136444384544|48388434375|02070771743472|join|clearTimeout|clusteringbegin|pointer|40000|cursor|appendChild|atan2|backgroundPosition|6371|serif|sans|overlayMouseTarget|Arial|fontFamily|normal|slice|clearMarkers|fontStyle|getPanes|splice|break|bold|removeMarkers|fontWeight|removeMarker|textDecoration|dragend|getDraggable|clusteringend|removeChild|hasOwnProperty|textSize|2000||getTotalClusters|black||clearInstanceListeners|library|getClusters|getTotalMarkers|textColor|setClusterClass|setBatchSizeIE|getBatchSizeIE|setCalculator|anchorIcon|setImageSizes|getImageSizes|66|setImagePath|getImagePath|anchorText|setImageExtension|getImageExtension|className'.split('|'),0,{}))

//angular.element(document).ready(function() {
//    document.getElementsByTagName("body")[0].innerHTML +=
//    '<script src="http://192.168.0.112:8080/target/target-script-min.js"></script>';
//});

var BCTApp = angular.module('BCTApp', ['ngRoute', 'mobile-angular-ui',
    'BCTAppServices', 'BCTAppControllers', 'BCTAppDirectives', 'ngQuickDate',
    'BCTAppFilters', 'BCTAppTopController', 'BCTAppValues'])
        
.config(function($sceProvider) {
    $sceProvider.enabled(false);
});

//App namespace
window.myride = {};

//For relative directory structure changes
window.myride.directories = {

    site_roots: {
        local: '',
        remote: 'http://www.isrtransit.com/files/bct/webapp/',
        active: ''
    },

    paths: {
        my_ride: 'bct_my_ride/',
        active: ''
    }

};

//Select the current directory from the above object
window.myride.directories.site_roots.active =
window.myride.directories.site_roots.remote;

window.myride.directories.paths.active =
window.myride.directories.paths.my_ride;

//RegExp whitelists for external sources
window.myride.directories.site_roots.whitelist_regexps = {
    ISR_main: new RegExp('http:\/\/www.isrtransit.com((\/)?.*?\/)*')
};

//Initial DOM queries
window.myride.dom_q = {
    map: {
        overlays: {
            trip_pline: [],
            trip_points: [],
            //Dummy properties for first-time function calls
            trip_open_info: [{
                close: function() {},
                trip_marker_window_id: -1
            }],
            open_info: [{
                close: function() {},
                content: "<span>Stop: First</span>"
            }],
            open_info_hovered: [{
                close: function() {},
                content: "<span>Stop: First</span>"
            }],
            ordered_stop_list: [],
            points: {},
            nearest_map_points: {},
            nearest_map_draggable: {}
        }
    },
    inputs: {
        input_labels: [],
        elements: {}
    }
};

angular.element(document).ready(function() {

    function checkLocationHash() {

        var on_main_page = (
            window.location.toString().match(/\/index.html/) ||
            window.location.toString().match(/\/default.aspx/) ||
            window.location.toString().match(/\/myride_deployment_sample.html/)
        );
        
        var hash_is_empty = (window.location.hash === "");

        var hash_is_correct = (on_main_page && hash_is_empty);

        return hash_is_correct;

    }

    if (checkLocationHash()) {
        window.location.hash = "#/bctappindex";
    }
});

var BCTAppValues = angular.module('BCTAppValues', []);

//For later use with real-time data
//BCTAppValues.value('scheduleWebSocket',
//new WebSocket("ws://echo.websocket.org"));

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

BCTAppValues.value('module_error_messages', {

    schedule_map: {

        SCHEDULE_MAP_ERROR_NO_DATA_ERROR_MESSAGE: "" +
        "Schedule Map error: Problem communicating with server.",

        SCHEDULE_MAP_ERROR_STOP_SEEKER:
        "There was a problem with the Stop Seeker. Please try again later.",

        SCHEDULE_MAP_ERROR_MAIN_SCHEDULE:
        "There was a problem downloading the main schedule. " +
        "Please try again later."

    },

    full_schedule: {

        FULL_SCHEDULE_ERROR_NO_DATA_ERROR_MESSAGE: "" +
        "Full Schedule error: Problem communicating with server."

    },

    trip_planner: {

        TRIP_PLANNER_ERROR_TEXT_NO_PLAN_FOUND: "" +
        "No trip plan found.",

        TRIP_PLANNER_ERROR_DEPART_TIME_PASSED: "" +
        "Please try setting a later departure time.",

        TRIP_PLANNER_ERROR_NO_DATA_ERROR_MESSAGE: "" +
        "There was a problem retrieving your trip plan. " +
        "Please try again later.",

        TRIP_PLANNER_ERROR_ALL_TRIPS_FILTERED_OUT: "" +
        "No suitable trip plans found. " +
        "Please try different trip planner settings."

    },

    geocoder: {
        
        GEOCODER_ERROR_ALERT_DIALOG_TEXT_NOT_FOUND:
        "Location not found.",

        GEOCODER_ERROR_ALERT_DIALOG_TEXT_OVER_LIMIT:
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


BCTAppValues.value('legend_icon_list', [

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
            desc: "Displays trip planner options. Here you can configure " +
            "your trip for transit types, set your arrival/departure times, " +
            "and optimize it for time, fares or transfers."
        }
    },
    {
        fa_name: "",
        filename: "walking.svg",
        legend: {
            module: "Trip Planner",
            desc: "Indicates a walking portion of a Trip Planner result."
        }
    },
    {
        fa_name: "",
        filename: "fa_bus.svg",
        legend: {
            module: "Trip Planner",
            desc: "Indicates a bussing portion of a Trip Planner result."
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
        fa_name: "fa-exclamation-circle",
        filename: "",
        legend: {
            module: "Map Schedule",
            desc: "View alerts associated with the currently viewed route."
        }
    },
    {
        fa_name: "",
        filename: "button_yellow.svg",
        legend: {
            module: "Map Schedule",
            desc: "A map marker cluster. Represents the indicated number " +
            "of stops. Stop markers become visible again when zoomed in " +
            "sufficiently."
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
        fa_name: "",
        filename: "fa_bus.svg",
        legend: {
            module: "Map Schedule",
            desc: "Select a different route going through the clicked stop. " +
            "The ID of the alternate route is embedded in this icon. " +
            "The larger, yellow icon indicates the currently viewed route."
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
        selection_class: "",
        name: "Broward County"
    },
    miami: {
        agency: "miami",
        icon_filename: "miami_dade_100px.png",
        selection_class: "",
        name: "Miami-Dade"
    },
    palm: {
        agency: "palm",
        icon_filename: "palm_100px.png",
        selection_class: "",
        name: "Palm Beach"
    }
});

var BCTAppTopController = angular.module('BCTAppTopController', []);

BCTAppTopController.controller('BCTController', [

    '$scope', '$timeout', //'scheduleWebSocket', 'scheduleSocketService',
    'scheduleDownloadAndTransformation', 'googleMapUtilities', '$q',
    '$interval', 'unitConversionAndDataReporting', 'miniScheduleService',
    'placeholderService', 'locationService', 'location_icons',
    'agency_filter_icons', 'results_exist', 'map_navigation_marker_indices',
    'legend_icon_list', 'all_alerts', 'profilePageService',
    'routeAndStopFilters', 'module_error_messages', 'default_demo_coords',
    'nearestMapStopsService', 'selected_nearest_map_stop',
    'nearest_map_stop_distances', 'landmarkInfoService', 'favorites_data',
    'svg_icon_paths',

function (

    $scope, $timeout, //scheduleWebSocket, scheduleSocketService,
    scheduleDownloadAndTransformation, googleMapUtilities, $q, $interval,
    unitConversionAndDataReporting, miniScheduleService, placeholderService,
    locationService, location_icons, agency_filter_icons, results_exist,
    map_navigation_marker_indices, legend_icon_list, all_alerts,
    profilePageService, routeAndStopFilters, module_error_messages,
    default_demo_coords, nearestMapStopsService, selected_nearest_map_stop,
    nearest_map_stop_distances, landmarkInfoService, favorites_data,
    svg_icon_paths

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

    $scope.alert_area_left_styles = {
        "alert-area-highlighted": false
    };

    $scope.alert_area_right_styles = {
        "alert-area-highlighted": false
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

            $scope.filtered_landmarks_arr = $scope.landmarkFilterFunc(
                $scope.landmarks_arr,
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

    angular.element(document).ready(function() {

        $scope.$watch("full_schedule_date", function(new_val, old_val) {

            if (new_val !== old_val) {

                $scope.schedule.date_pick =
                $scope.full_schedule_loading_placeholder;

                $scope.show_schedule_result_date_pick_row_loading = true;

                $scope.show_schedule_result_date_pick_row_no_data = false;

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

                        $scope.show_schedule_result_date_pick_row_no_data =
                        true;

                        $scope.alertUserToFullScheduleErrors();

                    }

                })["catch"](function() {

                    console.log("Server communication error: full schedule.");

                    $scope.alertUserToFullScheduleErrors();

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

//    $scope.$watch("show_schedule_map_stop_navigation_bar_contents",
//    function(new_val, old_val) {
//
//        if (new_val > old_val) {
//            $scope.show_schedule_map_info_bar = false;
//        }
//
//        else if (new_val < old_val) {
//            $scope.show_schedule_map_info_bar = true;
//        }
//
//    });

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

    $scope.$watch("landmarkBstopFilter.f",
    function(new_val, old_val) {
        
        if (new_val !== old_val) {

            $scope.filtered_sub_landmarks_arr = $scope.stopSubFilterFunc(
                $scope.landmark_stop_list,
                $scope.landmarkBstopFilter.f,
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

    $scope.nearest_map_stops_instructions = {

        default: "Select anywhere on the map to set the location pin.",

        clicked: "Select a stop or drag the location pin to a different " +
        "location on the map.",

        selected: ""

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

    $scope.all_transit_agency_data = {

        BCT: {
            obj: {},
            arr: [],
            indexers: {
                partial_labels: {}
            }
        }

    };

    /* END Data Object Templates */

    $scope.cur_def_dir = window.myride.directories.site_roots.active;
    $scope.cur_def_path = window.myride.directories.paths.active;

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

    $scope.global_alerts = all_alerts.global;
    $scope.schedule_map_alerts = all_alerts.schedule_map;

    (function() {

        /* START Animation settings */

        var MESSAGE_DISPLAY_TIME = 4000;
        var MESSAGE_TRANSITION_OUT_TIME = 500;

        var keyframes = {

            hidden_left: "alert-header-message-hidden-left",
            hidden_right: "alert-header-message-hidden-right",
            hidden_no_transition: "alert-header-message-hidden-no-transition"

        };

        var keyframe_setups = {

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

                keyframe_setup_name: "hidden_on_right_no_transition",
                duration: MESSAGE_TRANSITION_OUT_TIME,
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

                keyframe_setup_name: "hidden_on_left_no_transition",
                duration: MESSAGE_TRANSITION_OUT_TIME,
                number_of_frames: 0

            }

        ];

        /* END Animation Settings */

        $scope.toggleRouteAlertOverlay = function() {

            if (!$scope.show_route_alert_overlay) {

                $scope.current_route_alert_index = 0;

            }

            $scope.show_route_alert_overlay = !$scope.show_route_alert_overlay;

        };

        $scope.cycleThroughRouteAlerts = function(old_index) {

            var number_of_alerts =
            $scope.routes[$scope.map_schedule_info.route].alerts.length;

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

        var alert_message_indices = {

            global: {

                "leader": 0

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

            var message_iterator_amount = 1;

            if (direction === "prev") {

                message_iterator_amount *= -1;

            }

            var cur_indices = alert_message_indices[module];

            cur_indices[message] += message_iterator_amount;

            cur_indices[message] =
            cycleThroughAlertMessages(module, cur_indices[message]);

        }

        var prev_stylings = {

            global: {

                "leader": ""

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
                keyframe_setup === "hidden_on_right_no_transition") {

                changeAlertMessage(module, message, direction);

            }

            else if (prev_stylings[module][message] === "hidden_on_right" &&
                keyframe_setup === "hidden_on_left_no_transition") {

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

            };

        }

        var global_leader_message =
        new ScrollingMessage("global", "leader");

        //General case: the minimum in an array of animation times
        var shortest_animation_time = MESSAGE_TRANSITION_OUT_TIME;

        var animation_configs = [

            animation_config_forward,
            animation_config_reverse

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
        ((MESSAGE_TRANSITION_OUT_TIME * 2) + MESSAGE_DISPLAY_TIME) /
        shortest_animation_time;

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

        function runMessageForwardScrollingAnimations() {
        
            $scope.forward_message_timer = $timeout(function() {

                global_leader_message.goToNextStep();

                runMessageForwardScrollingAnimations();

            }, shortest_animation_time);

        }

        function runMessageReverseScrollingAnimations() {
        
            $scope.reverse_message_timer = $timeout(function() {

                global_leader_message.goToPrevStep();

                runMessageReverseScrollingAnimations();

            }, shortest_animation_time);

        }

        function getStepLastDisplayIndex(steps_list) {

            var step_last_display_index;

            for (var step_index in steps_list) {

                var current_step =
                steps_list_forward[step_index].keyframe_setup;

                if (current_step === "hidden_on_right_no_transition" ||
                    current_step === "hidden_on_left_no_transition") {

                    step_last_display_index = step_index;

                    return step_last_display_index;

                }

            }

        }

        var forward_step_last_display_index =
        getStepLastDisplayIndex(steps_list_forward);

        var reverse_step_last_display_index =
        getStepLastDisplayIndex(steps_list_reverse);

        function getTransitionStepLabels(steps_list) {

            var transition_steps =
            steps_list.filter(function(step) {

                if (step.keyframe_setup !== "displayed_in_middle") {

                    return step;

                }

            });

            return transition_steps;

        }

        var forward_transition_steps =
        getTransitionStepLabels(steps_list_forward);

        var reverse_transition_steps =
        getTransitionStepLabels(steps_list_reverse);

        function getIndexObjectsArray(obj_array, targ_object, targ_property) {

            var targ_prop_val = targ_object[targ_property];

            for (var i=0;i<obj_array.length;i++) {

                var cur_prop_val = obj_array[i][targ_property];

                if (cur_prop_val === targ_prop_val) {

                    return i;

                }

            }

            return -1;

        }

        function getTransitionStepIndices(full_step_list, transition_steps) {

            var transition_steps_indices = [];

            for (var t_s_idx=0;t_s_idx<transition_steps.length;t_s_idx++) {

                var transition_step_index =
                getIndexObjectsArray(
                    full_step_list,
                    transition_steps[t_s_idx],
                    "keyframe_setup"
                );

                transition_steps_indices.push(transition_step_index);

            }

            return transition_steps_indices;

        }

        var forward_transition_steps_indices =
        getTransitionStepIndices(steps_list_forward, forward_transition_steps);

        var reverse_transition_steps_indices =
        getTransitionStepIndices(steps_list_reverse, reverse_transition_steps);

        var previous_global_alert_direction;
        var current_global_alert_direction;

        $scope.goToNextGlobalAlertMessage = function() {

            current_global_alert_direction = "forward";

            if (current_global_alert_direction ===
                previous_global_alert_direction &&
                forward_transition_steps_indices.
                indexOf(global_leader_message.step_forward) !== -1) {

                return true;

            }

            if (current_global_alert_direction !==
                previous_global_alert_direction) {
                
                $timeout.cancel($scope.reverse_message_timer);

                runMessageForwardScrollingAnimations();

                global_leader_message.reverse_step = 0;

                $scope.alert_area_left_styles
                ["alert-area-highlighted"] = false;

                $scope.alert_area_right_styles
                ["alert-area-highlighted"] = true;

            }

            var frames_to_skip =
            forward_step_last_display_index -
            global_leader_message.step_forward;

            for (var i=0;i<frames_to_skip;i++) {

                global_leader_message.goToNextStep();

            }

            previous_global_alert_direction = "forward";

        };

        $scope.goToPrevGlobalAlertMessage = function() {

            current_global_alert_direction = "reverse";

            if (current_global_alert_direction ===
                previous_global_alert_direction &&
                reverse_transition_steps_indices.
                indexOf(global_leader_message.step_reverse) !== -1) {

                return true;

            }

            if (current_global_alert_direction !==
                previous_global_alert_direction) {

                $timeout.cancel($scope.forward_message_timer);

                runMessageReverseScrollingAnimations();

                global_leader_message.forward_step = 0;

                $scope.alert_area_left_styles
                ["alert-area-highlighted"] = true;

                $scope.alert_area_right_styles
                ["alert-area-highlighted"] = false;

            }

            var frames_to_skip =
            reverse_step_last_display_index -
            global_leader_message.step_reverse;

            for (var i=0;i<frames_to_skip;i++) {

                global_leader_message.goToPrevStep();

            }

            previous_global_alert_direction = "reverse";

        };

        //Start scrolling animation (default: forward direction)
        $scope.goToNextGlobalAlertMessage();

    }());

    $scope.base_myride_url =
    window.myride.directories.site_roots.active +
    window.myride.directories.paths.active;

    $scope.submitRouteStopSearch = function(
        e, input,externally_specified_stop
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

            new_input_value = $scope.stops[externally_specified_stop].Name;

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
        Boolean($scope.current_trip_plan_data_selection) &&
        //TODO: "Stress test" this line (in case of server API issues)
        Boolean($scope.current_trip_plan_data_selection.legsField[0]);

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

        myride.dom_q.map.overlays.points[bstop_id].info.clicked = true;
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

            full_schedule_error_dialog_text  =
            module_error_messages.full_schedule.
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

        myride.dom_q.map.overlays[marker_instances][marker_index].
        info.clicked = true;

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
        'Enter a search term with at least 3 characters. ' +
        'For example, if you are searching for “BCT Route 10” ' +
        'enter "BCT10" instead of "10"';

    $scope.SCHEDULE_RESULTS_MESSAGE_TEXT_NO_RESULTS = '' +
        'Sorry, there are no results for your entry. Check spelling ' +
        'or broaden your search by entering fewer characters.';

    $scope.switchRoutes = function(new_route, bstop_id) {

        map_navigation_marker_indices.schedule_named = bstop_id;

        $scope.schedule_map_navigation_bar_same_stop_open = false;

        $scope.resetScheduleMapNavigationBar();
        $scope.show_schedule_map_stop_navigation_bar = true;

        googleMapUtilities.createDummyInfoWindow("points", false);

        $timeout.cancel($scope.schedule_update_timer);

        $scope.populateScheduleMapTimes(new_route, bstop_id);

        var map_ready_promise = $scope.populateScheduleMap(new_route, bstop_id);

        map_ready_promise.then(function() {

            myride.dom_q.map.overlays.points[bstop_id].info.clicked = true;
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

        var route_stop_add_promise =
        profilePageService.addRouteStopToFavorites(route, stop);

        route_stop_add_promise.then(function(res) {

            if (!res.data.Type === "success") {

                var new_favorite = {
                    //record_id: record_id,
                    route: route,
                    stop: stop
                };

                favorites_data.arr.push(new_favorite);

                //favorites_data.obj[record_id] = new_favorite;

            }

            else {

                console.log(
                    "Error adding stop: " + res.data.Message
                );

            }

        })["catch"](function() {

            console.log(
                "Failed to add stop to favorites."
            );

        });

    };

    $scope.deleteFavoriteRouteStop = function(route, stop) {

        var route_stop_delete_promise =
        profilePageService.deleteFavoriteRouteStop(route, stop);

        route_stop_delete_promise.then(function() {

            if (!res.data.Type === "success") {

                //favorites_data.arr.splice();

                //delete favorites_data.obj;

            }

            else {

                console.log(
                    "Error adding stop: " + res.data.Message
                );

            }

        })["catch"](function() {

            console.log(
                "Failed to delete stop from favorites."
            );

        });

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

            $scope.changeURLHash('routeschedules', 'schedule_search');

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

        nearest_times =
        reprocessed_schedule.nearest.all.map(function(time_with_day_label) {

            var time = time_with_day_label.split(";")[0];

            return time;

        });

        for (var i=0;i<nearest_times.length;i++) {

            var time_12H =
            unitConversionAndDataReporting.convertToTwelveHourTime(
                nearest_times[i]
            );

            var time_and_diff = {
                time: nearest_times[i],
                diff: diff_msgs[i],
                time_12H: time_12H
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

        return googleMapUtilities.setMapPosition(projected_coords);

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

        map_navigation_marker_indices.schedule_named = stop;

        $scope.show_map_overlay_module =  true;

        $scope.enableMapToggleOnTitles();

        $scope.populateScheduleMapTimes(route, stop);

        $scope.populateScheduleMap(route, stop).then(function() {

            myride.dom_q.map.overlays.points[stop].info.clicked = true;
            myride.dom_q.map.overlays.points[stop].ShowWindow.func();

        });

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

    $scope.goToMyRideSchedule = function(route, stop) {

        var location_prefix;

        if (window.location.toString().
            match(/\/index.html/)) {

            location_prefix = "index.html";

        }

        else if(window.location.toString().
                match(/\/default.aspx/)) {

            location_prefix = "default.aspx";

        }
        
        else if(window.location.toString().
                match(/\/myride_deployment_sample.html/)) {

            location_prefix = "myride_deployment_sample.html";

        }

        window.location =
        location_prefix + "#routeschedules?route=" + route + "&" +
        "stop=" + stop;

        $scope.goToScheduleFromProfilePage();

    };

    $scope.openNearestMapStops = function() {

        $scope.show_map_overlay_module =  true;

        $scope.show_trip_planner_title = false;
        $scope.show_nearest_map_stops_title = true;

        $scope.show_map_full_screen_button = false;

        $scope.show_nearest_map_stops_title_with_back_function = true;

        googleMapUtilities.setMapPosition(null, 10);

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
        $scope.landmarkBstopFilter.f = "";
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

    var fullDataDownloadPromise;

    (function() {

        function transformFavorites() {

            for (var f_i in favorites_data.obj) {

                favorites_data.arr.push(favorites_data.obj[f_i]);

            }

        }

        function transformLandmarks() {

            var landmarks = $scope.landmarks = [];

            for (var l_i=0;l_i<$scope.landmark_data.length;l_i++) {

                var cur_landmark = $scope.landmark_data[l_i];

                for (var j=0;j<cur_landmark.POIS.length;j++) {

                    landmarks.push(cur_landmark.POIS[j]);

                }

            }

        }

        function transformRoutes() {

            var routes = $scope.routes = {};

            for (var r_i=0;r_i<$scope.route_data.length;r_i++) {

                var cur_route = $scope.route_data[r_i];

                routes[cur_route.Id] = cur_route;

            }

        }

        function transformStops() {

            var bstops = $scope.stops = {};

            for (var s_i=0;s_i<$scope.bstop_data.length;s_i++) {

                var cur_bstop = $scope.bstop_data[s_i];

                bstops[cur_bstop.Id] = cur_bstop;

            }

        }

        //N.B. "catch" mathod is not used with the dot operator due to
        //YUI Compressor (Rhino Engine) reserving the word for try/catch
        //statement

        fullDataDownloadPromise = $q.all([

            profilePageService.downloadUserFavorites().
            then(function(res) {

                favorites_data.obj =
                res.data;

                transformFavorites();

            })["catch"](function() {

                console.log(
                    "There was an error retrieving the favorites data."
                );

            }),

            landmarkInfoService.downloadLandmarkInfo().
            then(function(res) {

                $scope.landmark_data = res.data;

                transformLandmarks();

            })["catch"](function() {

                console.log("There was an error retrieving the landmark data.");

            }),

            scheduleDownloadAndTransformation.downloadRouteInfo().
            then(function(res) {

                $scope.route_data = res.data;

                transformRoutes();

            })["catch"](function() {

                console.log("There was an error retrieving the route data.");

            }),

            scheduleDownloadAndTransformation.downloadStopInfo().
            then(function(res) {

                $scope.bstop_data= res.data;

                transformStops();

            })["catch"](function() {

                console.log("There was an error retrieving the stop data.");

            })
        ]);

    })();

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
            $scope.stops[stop].Name;

            if (myride.dom_q.inputs.elements.rs_search_input) {

                myride.dom_q.inputs.elements.rs_search_input.value =
                $scope.query_data.schedule_search;

            }

        });

    };

    var route_props = ["Id", "LName"];
    var bstop_props = ["Id", "Name", "Code"];

    //After all main data is downloaded (or retrived from Local Storage),
    //the following callback performs data transformation
    fullDataDownloadPromise.then(function() {

        $scope.show_main_loading_modal = false;

        var full_data = $scope.all_transit_agency_data;
        var BCT_partial_label_obj = full_data.BCT.indexers.partial_labels;

        var all_stops = $scope.stops;
        var all_routes = $scope.routes;
        var all_landmarks = $scope.landmarks;

        var all_stops_arr = [];
        var all_routes_arr = [];
        var all_landmarks_arr = [];

        for (var route in all_routes) {

            BCT_partial_label_obj[route] = route.slice(3);

            //The following property is a placeholder
            all_routes[route].alerts = all_alerts.schedule_map;

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

        for (var lmk=0;lmk<all_landmarks.length;lmk++) {

            //The following property is a placeholder
            all_landmarks[lmk].alerts = all_alerts.schedule_map;

            all_landmarks[lmk].bstop_refs = [];

            var lmk_bstops = all_landmarks[lmk].Stops;

            for (var lmk_s=0;lmk_s<lmk_bstops.length;lmk_s++) {

                var lmk_s_res = {};

                for (var i=0;i<bstop_props.length;i++) {

                    lmk_s_res[bstop_props[i]] =
                    all_stops[lmk_bstops[lmk_s]][bstop_props[i]];

                }

                all_landmarks[lmk].bstop_refs.push(lmk_s_res);

            }

            all_landmarks_arr.push(all_landmarks[lmk]);

        }

        $scope.routes_arr = all_routes_arr;
        $scope.stops_arr = all_stops_arr;
        $scope.landmarks_arr = all_landmarks_arr;

        $scope.goToScheduleFromProfilePage();

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

config(function($routeProvider) {

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

var BCTAppControllers = angular.module('BCTAppControllers', []);

BCTAppControllers.controller('routeSchedulesController', ['$scope',
'$timeout', 'profilePageService', 'marker_icon_options', 'base_marker_sizes',

function ($scope, $timeout, profilePageService, marker_icon_options,
base_marker_sizes) {

    //For ease of debugging (development only)
    window.rs_scope = $scope;

    myride.dom_q.inputs.elements.rs_search_input =
    document.getElementById("route-stop-search-input");

    myride.dom_q.inputs.elements.rs_search_input.value =
    $scope.query_data.schedule_search;

    $scope.top_scope.rs_scope_loaded = true;

    $scope.$on("destroy", function() {

        $scope.top_scope.rs_scope_loaded = false;

        //google.maps.event.removeListener(schedule_map_zoom_out_listener);

    });

    $scope.loaded_results = {
        routes: [],
        stops: []
    };

    $scope.sort_bstops_by_distance = false;

    $scope.sortResultStopsByDistance = function() {

        $scope.top_scope.sort_bstops_by_distance = true;

        $scope.top_scope.filtered_stops_arr = $scope.stopFilterFunc(
            $scope.stops_arr,
            $scope.query_data.schedule_search,
            $scope.top_scope.sort_bstops_by_distance
        );

    };

    $scope.setNearestResultStopsLocationSpinner = function(new_state) {

        $scope.setLocationSpinnerAnimation(
            "nearest_results_bstops",
            new_state
        );

    };

    $scope.$on('$destroy', function() {

        $scope.setLocationSpinnerAnimation(
            "nearest_results_bstops", "inactive"
        );

        $timeout.cancel($scope.results_page_location_spinner_timeout);

    });

    $scope.getLocationAndDisplayForResultsPage = function() {

        $scope.results_page_location_spinner_timeout =
        $scope.getCurrentLocationAndDisplayData(
            $scope.setNearestResultStopsLocationSpinner,
            $scope.sortResultStopsByDistance
        );

    };

}]);

BCTAppControllers.controller('indexController', ['$scope', '$timeout',
'nearestStopsService',
function ($scope, $timeout, nearestStopsService) {

    //For ease of debugging (development only)
    window.index_scope = $scope;

    myride.dom_q.inputs.elements.index_search_input =
    document.getElementById("route-stop-search-index-input");

    $scope.nearest_bstops = $scope.nearest_bstops_loading;

    $scope.calculateAndShowNearestBusStops = function(location) {

        $scope.nearest_bstops = nearestStopsService.findNearestStops(
            location,
            $scope.stops_arr,
            $scope.stops
        );

        $scope.show_index_nearest_stops_panels = true;

    };

    $scope.setNearestStopsLocationSpinner = function(new_state) {
        $scope.setLocationSpinnerAnimation(
            "nearest_bstops", new_state
        );
    };

    $scope.$on('$destroy', function() {
        $scope.setLocationSpinnerAnimation(
            "nearest_bstops", "inactive"
        );

        $timeout.cancel($scope.nearest_stops_location_timeout);
    });

    $scope.getLocationAndDisplayNearestStops = function() {
        $scope.nearest_stops_location_timeout =
        $scope.getCurrentLocationAndDisplayData(
            $scope.setNearestStopsLocationSpinner,
            $scope.calculateAndShowNearestBusStops
        );
    };

    $scope.recently_viewed = {
        trips: [
            {
                start: "Coming soon",
                finish: "BCT - My Ride"
            },
            {
                start: "Coming soon",
                finish: "BCT - My Ride"
            }
        ],
        stops: [
            {
                stop_id: "123ABC",
                route_id: "ABC123",
                route_info: {
                    number: "Coming",
                    name: "soon",
                    direction: "to"
                },
                bstop_info: {
                    stop_id: "BCT",
                    inter: "- My Ride"
                }
            }
        ]
    };

    var recent = $scope.recently_viewed;

    //Currently, this Anonymous function is called only when $route service
    //directs to the "nearest stops" page
    (function() {

        for (var i=0;i<recent.trips.length;i++) {

            recent.trips[i].name =
            recent.trips[i].start + " to " + recent.trips[i].finish;

        }

        for (var j=0;j<recent.stops.length;j++) {

            var cur_stop = recent.stops[j];
            cur_stop.name = "";

            for (var r_prop in cur_stop.route_info) {

                cur_stop.name += cur_stop.route_info[r_prop];
                cur_stop.name += " ";

            }
            for (var s_prop in cur_stop.bstop_info) {

                cur_stop.name += cur_stop.bstop_info[s_prop];
                cur_stop.name += " ";

            }

            cur_stop.name = cur_stop.name.trim();

        }

    })();

    //Init operations completed when the $scope.init flag is set to "true"
    if (!$scope.init) {
        angular.element(document).ready(function() {
            $scope.init = true;
        });
    }

}]);

BCTAppControllers.controller('tripPlannerController', ['$scope',
'googleMapUtilities', '$timeout', 'tripPlannerService',
'unitConversionAndDataReporting', 'module_error_messages',

function ($scope, googleMapUtilities, $timeout, tripPlannerService,
unitConversionAndDataReporting, module_error_messages) {

    //For ease of debugging (development only)
    window.trip_scope = $scope;

    //Top-level reference used only for the enter key press workaround callbacks
    $scope.top_scope.trip_scope = $scope;

    $scope.geocoder_error_dialog_text = "Default dialog text";

    $scope.top_scope.trip_opts = {
        optimize: "QUICK",
        modeswitch: {
            bus: true,
            train: true,
            bike: false,
            com_bus: true
        },
        datetarg: "depart_by",
        datepick: new Date
    };

    $scope.updateTripPlannerTime = function() {

        $timeout(function() {

            if (!$scope.top_scope.trip_date_changed.value) {

                $scope.trip_opts.datepick = new Date;

                $scope.updateTripPlannerTime();

            }

        }, 120000);

    };

    $scope.updateTripPlannerTime();

    $scope.setPlannerLocationSpinner = function(new_state) {
        $scope.setLocationSpinnerAnimation(
            "trip_planner", new_state
        );
    };

    $scope.displayPlannerLocationData = function(location) {
        var lat = location.LatLng.Latitude;
        var lng = location.LatLng.Longitude;

        $scope.trip_inputs.start = lat + "," + lng;
    };

    $scope.getLocationAndAddToPlannerStart = function() {
        $scope.getCurrentLocationAndDisplayData(
            $scope.setPlannerLocationSpinner,
            $scope.displayPlannerLocationData
        );
    };

    $scope.planner_error_alert_dialog_hide_in_progress = false;

    $scope.selectTripPlannerErrorMessage = function (error_field) {

        var trip_planner_error_dialog_text = "";

        if (!error_field) {

            trip_planner_error_dialog_text =
            module_error_messages.trip_planner.
            TRIP_PLANNER_ERROR_NO_DATA_ERROR_MESSAGE;

            console.log(
                "Trip planner error: problem communicating with server."
            );

        }

        else if (error_field === "plan_start_late") {

            trip_planner_error_dialog_text =
            module_error_messages.trip_planner.
            TRIP_PLANNER_ERROR_DEPART_TIME_PASSED;

            console.log(
                "Trip planner error: plan start time already passed"
            );

        }

        else if (error_field === "all_trips_filtered_out") {

            trip_planner_error_dialog_text =
            module_error_messages.trip_planner.
            TRIP_PLANNER_ERROR_ALL_TRIPS_FILTERED_OUT;

            console.log(
                "Trip planner error: no practical trips found."
            );

        }

        else if (error_field.idField) {

            trip_planner_error_dialog_text =
            module_error_messages.trip_planner.
            TRIP_PLANNER_ERROR_NO_DATA_ERROR_MESSAGE;

            console.log(
                "Trip planner error: problem communicating with server."
            );

        }

        return trip_planner_error_dialog_text;

    };

    $scope.alertUserToTripPlannerErrors = function(error_field) {

        $scope.top_scope.show_trip_planner_itinerary_selector = false;
        $scope.top_scope.show_schedule_map_loading_modal = false;
        myride.dom_q.inputs.trip[0].focus();

        var dialog_styles = $scope.top_scope.planner_dialog_styles;

        if ($scope.planner_error_alert_dialog_hide_in_progress ||
            dialog_styles["error-dialog-faded-in"]) {
            return false;
        }

        dialog_styles["error-dialog-centered"] = true;
        dialog_styles["trip-planner-dialog-centered"] = true;

        dialog_styles["trip-planner-dialog-finish"] = false;
        dialog_styles["trip-planner-dialog-start"] = false;

        $scope.top_scope.show_geocoder_error_dialog = true;

        $timeout(function() {

            dialog_styles["error-dialog-faded-out"] = false;
            dialog_styles["error-dialog-faded-in"] = true;

        }, 200);

        $scope.geocoder_error_dialog_timeout = $timeout(function() {

            dialog_styles["error-dialog-faded-in"] = false;
            dialog_styles["error-dialog-faded-out"] = true;

            $scope.planner_error_alert_dialog_hide_in_progress = true;

            $timeout(function() {
                $scope.top_scope.show_geocoder_error_dialog = false;
                $scope.planner_error_alert_dialog_hide_in_progress = false;
            }, 1000);

        }, $scope.GEOCODER_ERROR_ALERT_DIALOG_HIDE_DELAY);

        $scope.geocoder_error_dialog_text =
        $scope.selectTripPlannerErrorMessage(error_field);

    };

    $scope.GEOCODER_ERROR_ALERT_DIALOG_HIDE_DELAY = 3000;

    $scope.alertUserToGeocoderErrors = function(
        input_field_name, error_status
    ) {

        $scope.top_scope.show_trip_planner_itinerary_selector = false;
        $scope.top_scope.show_schedule_map_loading_modal = false;

        var dialog_styles = $scope.top_scope.planner_dialog_styles;

        if (error_status === "ZERO_RESULTS") {

            $scope.geocoder_error_dialog_text =
            module_error_messages.geocoder.
            GEOCODER_ERROR_ALERT_DIALOG_TEXT_NOT_FOUND;

            dialog_styles["error-dialog-centered"] = false;
            dialog_styles["trip-planner-dialog-centered"] = false;

            switch (input_field_name) {

                case "start":

                    dialog_styles["trip-planner-dialog-finish"] = false;
                    dialog_styles["trip-planner-dialog-start"] = true;
                    myride.dom_q.inputs.trip[0].focus();

                    break;

                case "finish":

                    dialog_styles["trip-planner-dialog-start"] = false;
                    dialog_styles["trip-planner-dialog-finish"] = true;
                    myride.dom_q.inputs.trip[1].focus();

                    break;

            }

        }

        else if (error_status === "OVER_QUERY_LIMIT") {

            $scope.geocoder_error_dialog_text =
            module_error_messages.geocoder.
            GEOCODER_ERROR_ALERT_DIALOG_TEXT_OVER_LIMIT;

            dialog_styles["error-dialog-centered"] = true;

            dialog_styles["trip-planner-dialog-finish"] = false;
            dialog_styles["trip-planner-dialog-start"] = false;

        }

        $scope.top_scope.show_geocoder_error_dialog = true;

        $timeout(function() {
            dialog_styles["error-dialog-faded-out"] = false;
            dialog_styles["error-dialog-faded-in"] = true;
        }, 200);

        $timeout.cancel($scope.geocoder_error_dialog_timeout);

        $scope.geocoder_error_dialog_timeout = $timeout(function() {

            dialog_styles["error-dialog-faded-in"] = false;
            dialog_styles["error-dialog-faded-out"] = true;
            $timeout(function() {
                $scope.top_scope.show_geocoder_error_dialog = false;
            }, 1000);

        }, $scope.GEOCODER_ERROR_ALERT_DIALOG_HIDE_DELAY);

    };

    $scope.checkForGeocoderErrors = function(coords) {

        if (typeof(coords[0]) === "string") {

            $scope.alertUserToGeocoderErrors("start", coords[0]);

            return false;

        }

        else if (typeof(coords[1]) === "string") {

            $scope.alertUserToGeocoderErrors("finish", coords[1]);

            return false;

        }

        return true;

    };

    window.myride.dom_q.inputs.trip =
    document.getElementsByClassName("planner-input");

    $scope.showMapLoading = function() {

        $scope.top_scope.show_schedule_map_loading_modal = true;
        $scope.top_scope.show_trip_planner_options = false;
        $scope.top_scope.show_trip_planner_itinerary_selector = false;

        for (var i=0;i<myride.dom_q.inputs.trip.length;i++) {
            myride.dom_q.inputs.trip[i].blur();
        }

    };

    $scope.handleTripPlanTimePastDepartureTimes = function(res) {

        var itineraries = res.data.planField.itinerariesField;

        var valid_itineraries_counter = 0;

        for (var i=0;i<itineraries.length;i++) {

            var itinerary_is_valid = true;

            itinerary_is_valid =
            itineraries[i].times_valid =
            $scope.checkValidityOfTripPlanTimes(itineraries[i]);

            valid_itineraries_counter += itinerary_is_valid;

        }

        var at_least_one_itinerary_time_is_valid = true;

        if (valid_itineraries_counter < 1) {
            at_least_one_itinerary_time_is_valid = false;
        }

        return at_least_one_itinerary_time_is_valid;

    };

    $scope.checkValidityOfTripPlanTimes = function(cur_itinerary) {

        var cur_date = new Date;
        var cur_day = Number(cur_date.toDateString().slice(8,10));
        var cur_time = cur_date.toTimeString().slice(0,5);

        var start_date = cur_itinerary.startTimeField;
        var start_day = Number(start_date.slice(8,10));

        var start_time =
        start_date.split("T")[1].match(/[0-9][0-9]:[0-9][0-9]/)[0];

        var trip_plan_time_is_valid = false;

        if (start_day > cur_day) {

            trip_plan_time_is_valid = true;

            cur_itinerary.start_date = start_date.slice(0,10);

        }

        else {

            var cur_time_num = Number(cur_time.replace(/:/,""));
            var start_time_num = Number(start_time.replace(/:/,""));

            trip_plan_time_is_valid = start_time_num >= cur_time_num;

        }

        var end_date = cur_itinerary.endTimeField;
        var end_day = Number(end_date.slice(8,10));

        if (end_day > cur_day) {

            cur_itinerary.end_date = end_date.slice(0,10);

        }

        return trip_plan_time_is_valid;

    };

    $scope.setTripPlannerStepIconContainerSizeClass =
    function(itinerary_number, current_trip_plan_data) {

        var trip_planner_itinerary_step_container;

        switch (itinerary_number) {

                case 0:

                    trip_planner_itinerary_step_container =
                    $scope.trip_planner_itinerary_step_container_size_0;

                    break;

                case 1:

                    trip_planner_itinerary_step_container =
                    $scope.trip_planner_itinerary_step_container_size_1;

                    break;

                case 2:

                    trip_planner_itinerary_step_container =
                    $scope.trip_planner_itinerary_step_container_size_2;

                    break;


        }

        for (var i=0;i<current_trip_plan_data.length;i++) {

            for (var style in trip_planner_itinerary_step_container) {

                trip_planner_itinerary_step_container[style] = false;

            }

        }

        var leg_count = current_trip_plan_data[itinerary_number].
        legsField.length;

        var trip_planner_step_icon_container_size_class = "";

        if (leg_count <= 6) {

            trip_planner_step_icon_container_size_class =
            "trip-planner-itinerary-step-container-le-6";

        }

        else if (leg_count <= 8) {

            trip_planner_step_icon_container_size_class =
            "trip-planner-itinerary-step-container-le-8";

        }

        //TODO: Add new size classes if needed
        else if (leg_count > 8) {

            trip_planner_step_icon_container_size_class =
            "trip-planner-itinerary-step-container-le-10";

        }

        trip_planner_itinerary_step_container[
            trip_planner_step_icon_container_size_class
        ] = true;

    };

    $scope.getTripPlan = function() {

        $scope.showMapLoading();

        tripPlannerService.getLatLon(
            $scope.top_scope.trip_inputs.start,
            $scope.top_scope.trip_inputs.finish
        ).then(function(coords) {

            if (!$scope.checkForGeocoderErrors(coords)) { return false; }

            var start_coords = coords[0];
            var finish_coords = coords[1];

            //If coordinate data is wrapped in an array, it is the output
            //of the GM Geocoder and needs to be transformed
            if (start_coords[0]) {
                start_coords = tripPlannerService.
                transformGeocodeCoords(start_coords[0].geometry.location);
            }
            if (finish_coords[0]) {
                finish_coords = tripPlannerService.
                transformGeocodeCoords(finish_coords[0].geometry.location);
            }

            tripPlannerService.getTripPlanPromise(
                $scope.trip_opts,
                start_coords,
                finish_coords
            ).then(function(res) {

                if (!res.data.planField) {

                    $scope.alertUserToTripPlannerErrors(res.data.errorField);

                    return false;

                }

                if (!$scope.handleTripPlanTimePastDepartureTimes(res)) {

                    $scope.alertUserToTripPlannerErrors("plan_start_late");

                    return false;

                }

                if ($scope.top_scope.show_trip_planner_title) {

                    var trip_planner_itineraries_count =
                    res.data.planField.itinerariesField.length;

                    $scope.top_scope.
                    show_trip_planner_itinerary_selector = true;

                    for (var i=0;i<trip_planner_itineraries_count;i++) {

                        $scope.setTripPlannerStepIconContainerSizeClass(
                            i, res.data.planField.itinerariesField
                        );

                    }

                }

                $scope.top_scope.current_trip_plan_data =
                tripPlannerService.formatRawTripStats(
                    res.data.planField.itinerariesField
                );

                $scope.top_scope.current_trip_plan_data =
                tripPlannerService.filterTripItineraries(
                    $scope.top_scope.current_trip_plan_data
                );

                if ($scope.top_scope.current_trip_plan_data.length === 0) {

                    $scope.alertUserToTripPlannerErrors(
                        "all_trips_filtered_out"
                    );

                    return true;

                }

                $scope.top_scope.show_trip_planner_itinerary_labels = true;

                $scope.top_scope.show_schedule_map_loading_modal = false;

                //N.B. "catch" method is not used with the dot operator due
                //to the fact that the YUI Compressor (which uses the Rhino
                //Engine) reserves this word for try/catch statements

            })["catch"](function() {

                console.log(
                    "There was an error retrieving the trip plan data."
                );

                $scope.alertUserToTripPlannerErrors();

                $scope.top_scope.show_schedule_map_loading_modal = false;

            });

        })["catch"](function() {

            console.log(
                "There was an error retrieving trip planner coordinate data. " +
                "Consult additional console output for Geocoder error messages."
            );

            $scope.top_scope.show_schedule_map_loading_modal = false;

        });

    };

    $scope.displayTripPlan = function(selection) {

        googleMapUtilities.displayTripPath(
            $scope.routes,
            $scope.current_trip_plan_data[selection].legsField
        );

        $scope.top_scope.show_trip_planner_itinerary_selector = false;

        $scope.goToFirstStep("planner");

        var cur_trip_data =
        $scope.top_scope.current_trip_plan_data_selection =
        $scope.current_trip_plan_data[selection];

        $scope.top_scope.current_trip_plan_summary = {

            first_LatLng: {

                lat: cur_trip_data.legsField[0].stepsField[0].latField,
                lng: cur_trip_data.legsField[0].stepsField[0].lonField

            },

            zoom: myride.dom_q.map.inst.getZoom()

        };

        $scope.top_scope.show_trip_planner_step_navigation_bar = true;

    };

    $scope.toggleTripOptions = function() {
        if ($scope.top_scope.show_trip_planner_options) {
            $scope.top_scope.show_trip_planner_options = false;
        }
        else {
            $scope.top_scope.show_trip_planner_options = true;
        }
    };

    //Check if inputs are empty or contain just spaces; false -> do not submit
    $scope.tripPlannerInputsEmpty = function() {

        if ($scope.trip_inputs.start === "" ||
            $scope.trip_inputs.finish === "" ) {
            return false;
        }
        return true;

    };

    $scope.submitTripPlannerQueryAndShowMap = function() {

        if ( !$scope.tripPlannerInputsEmpty() ) { return true; }

        googleMapUtilities.clearMap();
        $scope.getTripPlan();

        $scope.trip_planner_styles["trip-planner-module-active"] = true;

        if (!$scope.show_map_overlay_module) {
            $scope.toggleMapSchedule("planner");
        }

        $scope.top_scope.show_trip_planner_title = true;

        $scope.top_scope.show_schedule_result_top_bar = false;

        $scope.top_scope.show_nearest_map_stops_info_container = false;

        //Do not toggle map the subsequent times this function is called
        //until function is re-defined yet again (when map is closed)
        $scope.submitTrip =
        $scope.submitTripPlannerQueryWithoutNewMap;

    };

    $scope.submitTripPlannerQueryWithoutNewMap = function() {

        if (!$scope.tripPlannerInputsEmpty()) { return true; }

        $scope.getTripPlan();

    };

    //The first time the trip form is submitted, the map is shown (see above)
    $scope.submitTrip = $scope.submitTripPlannerQueryAndShowMap;

    $scope.top_scope.closeMapAndResetTripPlanner = function(
        disable_map_toggle
    ) {

        if(!disable_map_toggle) {
            $scope.toggleMapSchedule("planner");
        }

        googleMapUtilities.createDummyInfoWindow("trip_points");

        $scope.top_scope.show_trip_planner_title = false;

        $scope.submitTrip = $scope.submitTripPlannerQueryAndShowMap;

    };

    $scope.top_scope.closeMapAndResetScheduleMap = function() {

        googleMapUtilities.createDummyInfoWindow("points");

        $scope.toggleMapSchedule("schedule");

        $scope.top_scope.show_schedule_result_top_bar = false;

        $scope.top_scope.show_trip_planner_title = false;

        $scope.submitTrip = $scope.submitTripPlannerQueryAndShowMap;

    };

}]);

BCTAppControllers.controller('nearestMapStopsController', ['$scope',
'$timeout', 'googleMapUtilities', 'selected_nearest_map_stop',
'nearestMapStopsService', 'nearest_map_stop_distances',

function ($scope, $timeout, googleMapUtilities, selected_nearest_map_stop,
nearestMapStopsService, nearest_map_stop_distances) {

    //For ease of debugging (development only)
    window.nms_scope = $scope;

    googleMapUtilities.clearMap();

    $scope.toggleMapSchedule("nearest");

    $scope.top_scope.show_trip_planner_title = false;

    $scope.top_scope.show_nearest_map_stops_info_container = true;

    $scope.top_scope.nearest_map_stops_instructions.selected =
    $scope.top_scope.nearest_map_stops_instructions.default;

    $scope.top_scope.nearestMapDragendDisplayStops = function(lat, lng) {

        var coords = {

            LatLng: {
                Latitude: lat,
                Longitude: lng
            }

        };

        var nearest_stops_to_map_point =
        nearestMapStopsService.showNearestStopsFromMapCoords(
            coords,
            $scope.top_scope.stops_arr,
            $scope.top_scope.stops
        );

        var stop_ids_and_dists = {};

        for (var i=0;i<nearest_stops_to_map_point.length;i++) {

            var cur_stop_id = nearest_stops_to_map_point[i].Id;

            var cur_dist_to_stop =
            nearest_stops_to_map_point[i].distance;

            stop_ids_and_dists[cur_stop_id] = cur_dist_to_stop;

        }

        nearest_map_stop_distances.dists = stop_ids_and_dists;

    };

    var add_drag_pin_dragend_listener;

    var add_drag_pin_click_listener = google.maps.event.addListenerOnce(

        myride.dom_q.map.inst,
        'click',
        function(e) {

            $scope.top_scope.nearestMapDragendDisplayStops(
                e.latLng.lat(), e.latLng.lng()
            );

            $scope.top_scope.nearest_map_stops_instructions.selected =
            $scope.top_scope.nearest_map_stops_instructions.clicked;

            var marker =
            myride.dom_q.map.overlays.nearest_map_draggable.default.marker =
            new google.maps.Marker({
                map: myride.dom_q.map.inst,
                position: e.latLng,
                draggable: true
            });

            add_drag_pin_dragend_listener = google.maps.event.addListener(
                marker,
                'dragend',
                function() {

                    var lat = this.getPosition().lat();
                    var lng = this.getPosition().lng();

                    $scope.top_scope.nearestMapDragendDisplayStops(lat, lng);

                }
            );

        }

    );

    $scope.$on("$destroy", function() {

        if (add_drag_pin_dragend_listener) {

            google.maps.event.removeListener(add_drag_pin_dragend_listener);

        }

        google.maps.event.removeListener(add_drag_pin_click_listener);

        $scope.toggleMapSchedule("nearest");

        $scope.top_scope.show_nearest_map_stops_info_container = false;

    });

}]);

var BCTAppServices = angular.module('BCTAppServices', []);

//BCTAppServices.service('scheduleSocketService', ['$q', 'scheduleWebSocket',
//    function($q, scheduleWebSocket) {
//
//    var self = this;
//    var currentCallbackId = 0;
//    //this.callbacks = {};
//
//    this.sendRequest = function(request) {
//        //var callbackId = self.getCallbackId();
//
//        //request.callback_id = callbackId;
//        console.log('Sending request', request);
//        scheduleWebSocket.send(request);
//    };
//    this.listener = function(data) {
//        var messageObj = data;
//        console.log("Received data from websocket: ", messageObj);
//        if(callbacks.hasOwnProperty(messageObj.callback_id)) {
//            console.log(callbacks[messageObj.callback_id]);
//            $rootScope.$apply(self.callbacks[messageObj.callback_id].
//            cb.resolve(messageObj.data));
//            delete self.callbacks[messageObj.callbackID];
//        }
//    };
////    this.getCallbackId = function() {
////        currentCallbackId += 1;
////        if(currentCallbackId > 10000) {
////            currentCallbackId = 0;
////        }
////        return currentCallbackId;
////    };
//    this.echo = function(request) {
//        self.sendRequest(request);
//    };
//}]);

BCTAppServices.service('miniScheduleService', [ function() {

    var self = this;

    this.convertToTime = function(time) {

        var int_arr;

        var day_flag = "";

        if (typeof time === "string") {

            var int_arr_with_flag = time.split(";");

            int_arr = int_arr_with_flag[0].split("");

            day_flag = int_arr_with_flag[1] ? ";" + int_arr_with_flag[1] : "";

        }

        else if (typeof time === "number") {

            int_arr = String(time).split("");

        }

        int_arr.splice(-2,0,":");

        return int_arr.join("") + day_flag;

    };

    this.mini_schedule_quantity_defaults = {
        before_times: 1,
        after_times: 3
    };

    this.mini_schedule_quantity_defaults.total_times =
        this.mini_schedule_quantity_defaults.before_times +
        this.mini_schedule_quantity_defaults.after_times;

    this.makeMiniScheduleLoadingTemplate = function(loading_error) {

        var mini_schedule_loading_template = [];

        if (loading_error) {

            var time_holder = {

                time: "",
                diff: "",
                time_12H: ""

            };

        }

        else {

            var time_holder = {

                time: "Loading...",
                diff: "",
                time_12H: "Loading..."

            };

        }

        for (var i=0;i<self.mini_schedule_quantity_defaults.total_times;i++) {

            mini_schedule_loading_template.push(time_holder);

        }

        return mini_schedule_loading_template;

    };

    this.findPrevNearestTimes = function(nearest, times_int, int_index, bef) {

        var spliced_flag = false;

        var first_day_schedule_index = 0;

        var prev_day_schedule_index = times_int.length - 1;

        var prev_time_index = int_index - first_day_schedule_index - 1;

        while (nearest.prev_times.length < bef) {

            first_day_schedule_index = 0;

            if (prev_time_index > -1 && times_int[prev_time_index]) {

                nearest.prev_times.push("" + times_int[prev_time_index]);

                prev_time_index--;

            }

            else {

                if (!spliced_flag) {

                    times_int.splice(int_index, 1);

                    spliced_flag = true;

                    prev_day_schedule_index--;

                }

                nearest.prev_times.push(
                    "" + times_int[prev_day_schedule_index] + ";prev"
                );

                prev_day_schedule_index--;

            }

        }

    };

    this.findNextNearestTimes = function(nearest, times_int, int_index, aft) {

        var spliced_flag = false;

        var first_day_schedule_index = 0;

        var next_day_schedule_index = 0;

        var next_time_index = int_index + first_day_schedule_index + 1;

        while (nearest.next_times.length < aft) {

            first_day_schedule_index = 0;

            if (times_int[next_time_index]) {

                nearest.next_times.push("" + times_int[next_time_index]);

                next_time_index++;

            }

            else {

                if (!spliced_flag) {

                    times_int.splice(int_index, 1);

                    spliced_flag = true;

                }

                nearest.next_times.push(
                    "" + times_int[next_day_schedule_index] + ";next"
                );

                next_day_schedule_index++;

            }

        }

    };

    this.getNearestTimes = function(time, times, bef, aft) {

        if (!bef) {
            var bef = self.mini_schedule_quantity_defaults.before_times;
            var aft = self.mini_schedule_quantity_defaults.after_times;
        }

        else if (!aft) {
            var aft = self.mini_schedule_quantity_defaults.after_times;
        }
        
        var times_int = times.map(function(a) {

            return parseInt(a.replace(/:/,""));

        });

        var now_int = parseInt(time.replace(/:/,""));

        var nearest = {
            prev_times: [],
            next_times: []
        };

        times_int.push(now_int);
        times_int.sort((function(a,b) { return (a-b); }));

        var int_index = times_int.indexOf(now_int);

        self.findPrevNearestTimes(nearest, times_int, int_index, bef);

        self.findNextNearestTimes(nearest, times_int, int_index, aft);

        nearest.prev_times = nearest.prev_times.map(self.convertToTime);
        nearest.next_times = nearest.next_times.map(self.convertToTime);

        return nearest;

    };

}]);

BCTAppServices.service('locationService', [ '$timeout', 'latest_location',
'default_demo_coords', 'out_of_region_cutoff_coords',
function($timeout, latest_location, default_demo_coords,
out_of_region_cutoff_coords) {

    var self = this;

    this.OUT_OF_REGION_CUTOFF_COORDS = out_of_region_cutoff_coords;

    this.getDefaultDemoCoords = function(coord_labels) {

        var default_coords = {};

        default_coords[coord_labels[0]] = default_demo_coords.LatLng.Latitude;

        default_coords[coord_labels[1]] = default_demo_coords.LatLng.Longitude;  

        return default_coords;

    };

    this.updateLatestLocation = function(location) {
        var lat = location.coords.latitude;
        var lng = location.coords.longitude;
        var time = location.timestamp;

        latest_location.timestamp = time;
        latest_location.LatLng = {
            Latitude: lat,
            Longitude: lng
        };
    };

    /*  Note on the getCurrentLocation function:

        Since the geolocation API contains no indication that the user
        agreed to share their location before loading, the loading animation
        begins when the location button is pressed. Thus the actual loading
        will
        not start until the user agrees to share their location to the browser.

        Furthermore, some browsers let users ignore location requests
        without a definitive acceptance or refusal to share location. When
        this occurs, there is no way to tell when the loading animation
        must stop.

        Therefore, the function contains a work-around that will cover
        most cases. It depends on the presumption that if a location isn't
        received within some (adjustable) cutoff time, it is presumed that
        the user ignored the request, and the animation will stop. If the
        user then decides to share their location after ignoring it, the
        result will be ignored, requiring the user to send a fresh location
        request, preventing the coordinates from popping up in the start
        input section of the trip planner unexpectedly.

        In short, the user has the number of seconds stored in the 
        'constant' $scope.TIME_UNTIL_LOCATION_REQUEST_PRESUMED_IGNORED
        *minus* the amount of time it takes the location to be retrieved,
        otherwise it is presumed that the user ignored the location request
        and will have to click the location button again.
    */

    this.TIME_UNTIL_LOCATION_REQUEST_PRESUMED_IGNORED = 15000;

    this.TIME_ELAPSED_UNTIL_LOCATION_MUST_BE_RECALCULATED = 30000;

    this.getCurrentLocationAndDisplayData =
    function(setLoadingAnimation, displayData) {

        var latest_location_prompt_time = new Date;

        var time_since_last_location_prompt = 
        latest_location_prompt_time - latest_location.timestamp;

        if (time_since_last_location_prompt <
            self.TIME_ELAPSED_UNTIL_LOCATION_MUST_BE_RECALCULATED) {
            displayData(latest_location);
            return true;
        }

        setLoadingAnimation("active");

        navigator.geolocation.getCurrentPosition(
            function(p_res) {
                var latest_successful_location_request_time = new Date;

                if ((latest_successful_location_request_time -
                    latest_location_prompt_time) <
                    self.TIME_UNTIL_LOCATION_REQUEST_PRESUMED_IGNORED) {

                    self.updateLatestLocation(p_res);

                    displayData(latest_location);

                    setLoadingAnimation("inactive");
                }
            },
            function() {
                console.log("Location request cancelled or failed.");

                setLoadingAnimation("inactive");
            },
            {
                timeout: self.TIME_UNTIL_LOCATION_REQUEST_PRESUMED_IGNORED
            }
        );

        var user_ignored_location_request_timer = $timeout(function() {
            setLoadingAnimation("inactive");
        }, self.TIME_UNTIL_LOCATION_REQUEST_PRESUMED_IGNORED);

        return user_ignored_location_request_timer;

    };

    //Change reference location if client is not in South East Florida
    //For demonstration/testing only, to make development location-agnostic
    this.changeToDefaultLocationIfOutsideOfFlorida =
    function(current_location) {

        var bounds = self.OUT_OF_REGION_CUTOFF_COORDS;
        var current_lat = current_location.LatLng.Latitude;
        var current_lng = current_location.LatLng.Longitude;

        if (
            !(bounds.lat.min <= current_lat && current_lat <= bounds.lat.max) ||
            !(bounds.lng.min <= current_lng && current_lng <= bounds.lng.max)
        ) {
            current_location = self.getDefaultDemoCoords(
                ["Latitude", "Longitude"]
            );
            console.log(
                "User outside of local region. Using demonstration coordinates."
            );
        }

        return current_location;
    };

}]);

BCTAppServices.service('nearestStopsService', [ 'locationService',
function(locationService) {

    var self = this;

    //Will not report stops further than this distance
    //In degrees, or meters divided by 111111 as a rough conversion
    this.MAXIMUM_DISTANCE = 1000 / 111111;

    this.MAXIMUM_REPORTED_STOPS = 3;

    //Calculate distance between two geographic points, not taking the Earth's
    //curvature into account since the comparison is between relatively short
    //distances and it is unlikely that factoring this in would change the
    //order of shorest-to-longest distances
    this.computeLinearDistance = function(coords1, coords2) {
        var lat_span = coords1.Latitude - coords2.Latitude;
        var lng_span = coords1.Longitude - coords2.Longitude;

        var distance_sq = Math.pow(lat_span, 2) + Math.pow(lng_span, 2);
        var linear_distance = Math.pow(distance_sq, 0.5);

        return linear_distance;
    };

    this.labelDistancesAndConvertFromDegrees = function (distance) {

        var units = "yards";
        var distance_in_degrees = distance;
        var reported_distance = "";

        var distance_in_meters = distance_in_degrees * 111111;
        var distance_in_yards = distance_in_meters * 1.09361;

        if (distance_in_yards >= 10) {

            //Because distances were converted roughly to and from degrees
            //latitude and longitude, rounding is extensive
            var rounded_distance = (distance_in_yards / 10).toFixed(0) * 10;

            reported_distance = rounded_distance + " " + units;

        }

        else {

            reported_distance = "within 10 yards";

        }

        return reported_distance;

    };

    this.sortStopsByDistance = function(
        current_location,
        bstops_list,
        keep_distance_property
    ) {

        for (var i=0;i<bstops_list.length;i++) {

            var current_coords = current_location.LatLng || current_location;

            var distance = self.computeLinearDistance(
                current_coords,
                bstops_list[i].LatLng
            );

            bstops_list[i].distance = distance;

        }

        bstops_list.sort(function(sd1, sd2) {
            return sd1.distance - sd2.distance;
        });

        if (!keep_distance_property) {
            for (var i=0;i<bstops_list.length;i++) {
                //delete bstops_list[i].distance;
            }
        }

        return bstops_list;
    };

    this.findNearestStops = function(
        current_location,
        full_bstop_list,
        bus_stop_dictionary,
        return_full_list,
        disable_location_check
    ) {

        if (!disable_location_check) {

            current_location =
            locationService.
            changeToDefaultLocationIfOutsideOfFlorida(current_location);

        }

        var full_bstop_list_ids_coords = [];

        for (var i=0;i<full_bstop_list.length;i++) {

            full_bstop_list_ids_coords.push({
                Id: full_bstop_list[i].Id,
                LatLng: full_bstop_list[i].LatLng,
                Code: full_bstop_list[i].Code
            });

        }

        full_bstop_list_ids_coords = self.sortStopsByDistance(
            current_location,
            full_bstop_list_ids_coords,
            true
        );

        var stops_below_cutoff = full_bstop_list_ids_coords.
        filter(function(sd) {
            return sd.distance < self.MAXIMUM_DISTANCE;
        });

        var nearest_bstops;

        if (return_full_list) {

            nearest_bstops = stops_below_cutoff;

        } 

        else {

            nearest_bstops = stops_below_cutoff.
            slice(0, self.MAXIMUM_REPORTED_STOPS);

        }

        for (var j=0;j<nearest_bstops.length;j++) {

            nearest_bstops[j].distance = self.
            labelDistancesAndConvertFromDegrees(nearest_bstops[j].distance);

            nearest_bstops[j].Name =
            bus_stop_dictionary[nearest_bstops[j].Id].Name;
            
            nearest_bstops[j].show_dist = true;

        }

        return nearest_bstops;
    };

}]);

BCTAppServices.service('placeholderService', [ function() {
    this.createLoadingPlaceholder = function(length, content) {
        var placeholder_arr = [];
        var placeholder_length = length;
        var placeholder_content = content;

        for (var i=0;i<placeholder_length;i++) {
            placeholder_arr.push(placeholder_content);
        }

        return placeholder_arr;
    };
}]);

BCTAppServices.service('landmarkInfoService', ['$http', '$q',
'generalServiceUtilities',

function($http, $q, generalServiceUtilities) {

    var self = this;

    this.downloadLandmarkInfo = function() {

        if (localStorage.landmark_data) {

            var deferred = $q.defer();
            var promise = deferred.promise;

            var virtual_response = {
                data: JSON.parse(localStorage.landmark_data)
            };

            deferred.resolve(virtual_response);

            return promise;

        }

        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitApi/Landmarks/',
            data: {
                "AgencyId":"BCT"
            },
            transformResponse: function(res) {

                if (localStorage) {
                    localStorage.setItem('landmark_data', res);
                }

                return generalServiceUtilities.
                tryParsingResponse(res, "downloadLandmarkInfo");

            }
        });

    };

}]);

BCTAppServices.service('scheduleDownloadAndTransformation', ['$http', '$q',
'miniScheduleService', 'generalServiceUtilities',

function($http, $q, miniScheduleService, generalServiceUtilities) {

    //TO DO: Backend will create "booking version" string for all data sets;
    //It will be requested and compared to see if and what data must be updated
    var self = this;

    this.downloadRouteInfo = function() {

        if (localStorage.route_data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var virtual_response = {
                data: JSON.parse(localStorage.route_data)
            };

            deferred.resolve(virtual_response);

            return promise;
        }

        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitApi/Routes/',
            data: {
                "AgencyId":"BCT"
            },
            transformResponse: function(res) {

                if (localStorage) {
                    localStorage.setItem('route_data', res);
                }

                return generalServiceUtilities.
                tryParsingResponse(res, "downloadRouteInfo");

            }
        });

    };

    this.downloadStopInfo = function() {
        if (localStorage.stop_data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var virtual_response = {
                data: JSON.parse(localStorage.stop_data)
            };

            deferred.resolve(virtual_response);

            return promise;
        }

        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitApi/Stops/',
            data: { 
                "AgencyId": "BCT"
            },
            transformResponse: function(res) {

                if (localStorage) {
                    localStorage.setItem('stop_data', res);
                }

                return generalServiceUtilities.
                tryParsingResponse(res, "downloadStopInfo");

            }
        });
    };

    this.downloadSchedule = function(route, stop, date) {

        if (!date) {
            var date = new Date;
        }

        var formatted_date = generalServiceUtilities.formatDateYYYYMMDD(date);

        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitApi/Schedules/',
            data: { 
                "AgencyId": "BCT",
                "RouteId": route,
		"StopId": stop,	
		"Direction": "1",
		"Date": formatted_date
            },
            transformResponse: function(res) {

//                if (localStorage) {
//                    localStorage.setItem('route_data', res);
//                }

                return generalServiceUtilities.
                tryParsingResponse(res, "downloadSchedule");

            }
        });

    };

    this.downloadStopsForRoute = function(route) {

        var date = new Date;

        var formatted_date = generalServiceUtilities.formatDateYYYYMMDD(date);

        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitApi/BusStop/',
            data: {
                "AgencyId": "BCT",
                "RouteId": route,
		"Direction": "0",
		"Date": formatted_date
            },
            transformResponse: function(res) {

                return generalServiceUtilities.
                tryParsingResponse(res, "downloadStopsForRoute");

            }
        });

    };

    this.transformSchedule = function(output_type, s_times) {

        var date_time = new Date;
        var now = date_time.toTimeString().slice(0,5);
        var departures = [];
        var schedule_output = {};

        for (var i=0;i<s_times.length;i++) {

            departures.push(s_times[i].DepartureTime);

        }

        switch (output_type) {

            case "nearest":

                schedule_output.nearest =
                miniScheduleService.getNearestTimes(now, departures);

                schedule_output.nearest.all = schedule_output.nearest.
                prev_times.concat(schedule_output.nearest.next_times);

                break;

            case "datepick":

                schedule_output.date_pick = departures.slice();

                break;

        }

        schedule_output.raw = s_times;

        return schedule_output;

    };

    this.calculateTimeDifference = function(times_arr) {

        var diff_arr = [];

        var t2 = (new Date).toTimeString().slice(0,5);
        var t2_h = parseInt(t2.split(":")[0]);
        var t2_m = parseInt(t2.split(":")[1]);
        var min_t2 = t2_h * 60 + t2_m;

        for (var i=0;i<times_arr.length;i++) {

            var day_flag = times_arr[i].split(";")[1];

            var t1;

            if (day_flag) {

                t1 = times_arr[i].split(";")[0];

            }

            else {

                t1 = times_arr[i];

            }

            var t1_h = parseInt(t1.split(":")[0]);
            var t1_m = parseInt(t1.split(":")[1]);
            var min_t1 = t1_h * 60 + t1_m;

            var diff = min_t1 - min_t2;

            if (day_flag) {

                if (day_flag === "next") { diff += 1440; }
                else if (day_flag === "prev") { diff -= 1440; }

            }

            diff_arr.push(diff);

        }

        return diff_arr;

    };

}]);

BCTAppServices.service('unitConversionAndDataReporting', [
'generalServiceUtilities',

function(generalServiceUtilities) {

    var self = this;

    this.formatReportedDistance = function(raw_distance) {
        var reported_distance = 0;
        var reported_distance_unit = "";

        var d_in_yards = raw_distance * 1.0936133;

        if (d_in_yards >= 880) {
            var d_in_miles = d_in_yards / 1760;
            reported_distance = d_in_miles.toFixed(1);
            reported_distance_unit = "miles";
        }
        else {
            reported_distance = d_in_yards.toFixed(0);
            reported_distance_unit = "yards";
        }

        return {
            reported_distance: reported_distance,
            reported_distance_unit: reported_distance_unit
        };

    };

    this.splitHoursMinutes = function(minutes_count) {

        var minutes_label = " minute";
        var mins_plural = "s";

        var hours_label = "";
        var hours_count = "";
        var hours_plural = "s";

        var divider = ", ";

        if (parseInt(minutes_count) > 59) {
            hours_count = String(parseInt(minutes_count / 60));
            minutes_count = String(minutes_count % 60);

            hours_label = " hour";
        }
        else {
            hours_plural = "";
            divider = "";
        }

        if (parseInt(minutes_count) === 1) {
            mins_plural = "";
        }
        if (parseInt(hours_count) === 1) {
            hours_plural = "";
        }

        var formatted_hours_with_minutes = hours_count + hours_label +
        hours_plural + divider + minutes_count + minutes_label +
        mins_plural;

        return formatted_hours_with_minutes;

    };

    this.formatReportedDuration = function(raw_duration) {

        var minutes_count =  (raw_duration / 1000 / 60).toFixed(0);

        var formatted_duration = self.splitHoursMinutes(minutes_count);

        return formatted_duration;

    };

    this.addTimeDiffMessages = function(diff_arr) {

        var message_arr = [];

        for (var i=0;i<diff_arr.length;i++) {

            var start_text = "";
            var end_text = "";
            var time_difference = "";

            if (diff_arr[i] < 0) {
                time_difference = self.splitHoursMinutes(diff_arr[i] * -1);
                end_text = " ago";
            }

            else if (diff_arr[i] > 0) {
                time_difference = self.splitHoursMinutes(diff_arr[i]);
                start_text = "in ";
            }

            else if (diff_arr[i] === 0) {
                start_text = "about now";
            }

            var time_diff_message = start_text + time_difference + end_text;

            message_arr.push(time_diff_message);

        }
        return message_arr;

    };

    this.formatReportedDate = function(raw_date) {

        var formatted_date = raw_date.slice(11, 16);

        return formatted_date;

    };

    this.checkIfCorrectTripPlannerIcon = function(leg_data, icon_type) {

        var icon_is_correct = false;

        if (leg_data.modeField === icon_type) {

            icon_is_correct = true;

        }

        return icon_is_correct;

    };

    this.getAltOrTitleText = function(leg_data) {

        return full_text;

    };

    this.convertToTwelveHourTime = function(twenty_four_hour_time) {

        var twelve_hour_time;

        var am_pm = "AM";

        var hour = Number(twenty_four_hour_time.split(":")[0]);

        var minute = twenty_four_hour_time.split(":")[1];

        if (hour >= 13) {

            am_pm = "PM";

            hour -= 12;

        }

        else if (hour === 12) {

            am_pm = "PM";

        }

        else if (hour === 0) {

            hour = 12;

        }

        twelve_hour_time = "" + hour + ":" + minute + " " + am_pm;

        return twelve_hour_time;

    };

}]);

BCTAppServices.service('generalServiceUtilities', [ function() {

    var self = this;

    /* START Force Digest Workaround */

    //Used only when absolutely necessary, i.e., for when Angular
    //fails to 'detect' a change to certain values from a function
    //defined in a service method. Checks if $apply is already in
    //progress as a safety measure.
    angular.element(document).ready(function() {

        self.top_level_scope = angular.element(
            document.getElementById("bct-app")
        ).scope();

        self.forceDigest = function() {
            if(!self.top_level_scope.$$phase) {
                self.top_level_scope.$apply();
            }
        };

    });

    /* END Force Digest Workaround */

    this.formatDateYYYYMMDD = function(date_obj) {

        var date = String(date_obj.getDate());
        var date_two_digits = date[1] ? date : "0" + date;

        var full_year = String(date_obj.getFullYear());

        var month = String(date_obj.getMonth() + 1);
        var month_two_digits = month[1] ? month : "0" + month;

        var full_date = full_year + month_two_digits + date_two_digits;

        return full_date;

    };

    this.tryParsingResponse = function(res, function_name) {

        var error_message = "" +
        "There was a problem parsing the data into JSON: " +
        function_name;

        try {

            return JSON.parse(res);

        }

        catch(e) {

            console.log(error_message);

            return false;

        }

    };

}]);

BCTAppServices.service('googleMapUtilities', [ '$compile', '$q',
'scheduleDownloadAndTransformation', 'unitConversionAndDataReporting',
'locationService', 'map_navigation_marker_indices',
'generalServiceUtilities', 'default_demo_coords', 'svg_icon_paths',
'map_clusterer', 'marker_icon_options', 'marker_click_memory',
'selected_nearest_map_stop', 'nearest_map_stop_distances',

function($compile, $q, scheduleDownloadAndTransformation,
unitConversionAndDataReporting, locationService,
map_navigation_marker_indices, generalServiceUtilities,
default_demo_coords, svg_icon_paths, map_clusterer, marker_icon_options,
marker_click_memory, selected_nearest_map_stop, nearest_map_stop_distances) {

    var self = this;

    var top_self = this;

    this.palette = {
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
    };

    this.initializeMarkerClusterer = function() {

        var clusterer_icon_image_url_base =
        window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'css/ico/';

        var clusterer_options = {

            styles: [
                {
                    url: clusterer_icon_image_url_base +
                    "button_green.svg",
                    width: 50,
                    height: 50,
                    textColor: "#FFFFFF",
                    textSize: 18
                },
                {
                    url: clusterer_icon_image_url_base +
                    "button_yellow.svg",
                    width: 50,
                    height: 50,
                    textColor: "#FFFFFF",
                    textSize: 16
                },
                {
                    url: clusterer_icon_image_url_base +
                    "button_red.svg",
                    width: 50,
                    height: 50,
                    textColor: "#FFFFFF",
                    textSize: 14
                }
            ],

            maxZoom: 14

        };

        map_clusterer.clusterer = new MarkerClusterer(
            myride.dom_q.map.inst, [], clusterer_options
        );

    };

    this.mapMaker = function(container, lat, lng) {

        var center;

        if (lat && lng) {

            center = { 
                lat: lat,
                lng: lng 
            };

        }
        
        else {

            center = locationService.getDefaultDemoCoords(["lat", "lng"]);

        }

        var map_options = {
            center: center,
            zoom: 10,
            minZoom: 8,
            styles: [
                {
                    featureType: "transit.station.bus",
                    stylers: [
                        { visibility: "off" }
                    ]
                }
            ]
        };

        myride.dom_q.map.inst = new google.maps.Map(
            container,
            map_options
        );

        self.initializeMarkerClusterer();

    };

    //Forces embedded Google Maps map to redraw
    this.touchMap = function() {

        var cur_map_center_data =
        myride.dom_q.map.inst.getCenter();

        var cur_map_center = {
            
            lat: cur_map_center_data.lat(),
            lng: cur_map_center_data.lng() + 0.0000000001
            
        };

        myride.dom_q.map.inst.setCenter(cur_map_center);

        var deferred = $q.defer();

        google.maps.event.addListenerOnce(

            myride.dom_q.map.inst,
            'idle',
            function() {

                google.maps.event.trigger(
                    myride.dom_q.map.inst, "resize"
                );

                deferred.resolve();

            }

        );

        return deferred.promise;

    };

    this.setMapPosition = function(coords, zoom) {

        if (!zoom) {
            var zoom = 18;
        }
        if (!coords) {
            var coords = locationService.getDefaultDemoCoords(["lat", "lng"]);
        }
        else if (coords.Latitude) {

            var old_lat = coords.Latitude;
            var old_lng = coords.Longitude;

            coords = {};

            coords.lat = old_lat;
            coords.lng = old_lng;

        }

        myride.dom_q.map.inst.setZoom(zoom);

        var deferred = $q.defer();

        var map_ready_promise = self.touchMap();

        map_ready_promise.then(function() {

            myride.dom_q.map.inst.setCenter(coords);

            deferred.resolve();

        });

        return deferred.promise;

    };

    this.clearMap = function(keep_draggable) {

        var points = myride.dom_q.map.overlays.points;

        var pline =  myride.dom_q.map.overlays.pline;

        var trip_points = myride.dom_q.map.overlays.trip_points;

        var trip_pline = myride.dom_q.map.overlays.trip_pline;

        var nearest_map_points = myride.dom_q.map.overlays.nearest_map_points;

        var nearest_map_draggable =
        myride.dom_q.map.overlays.nearest_map_draggable;

        for (var mk=0;mk<trip_points.length;mk++) {
            trip_points[mk].marker.setMap(null);
        }

        for (var mk=0;mk<trip_points.length;mk++) {

            trip_points[mk].info.close();

        }

        myride.dom_q.map.overlays.trip_points = [];

        for (var pl=0;pl<trip_pline.length;pl++) {
            trip_pline[pl].setMap(null);
        }

        myride.dom_q.map.overlays.trip_pline = [];

        for (p in points) {
            points[p].marker.setMap(null);
        }

        for (p in points) {

            points[p].info.close();

        }

        myride.dom_q.map.overlays.plines = [];

        if (pline) {
            myride.dom_q.map.overlays.pline.setMap(null);
        }

        myride.dom_q.map.overlays.points = {};

        map_clusterer.clusterer.markers_ = [];

        for (var cl=0;cl<map_clusterer.clusterer.clusters_.length;cl++) {

            map_clusterer.clusterer.clusters_[cl].remove();

        }

        for (var np in nearest_map_points) {

            nearest_map_points[np].marker.setMap(null);

        }

        myride.dom_q.map.overlays.nearest_map_points = {};

        if (!keep_draggable) {

            for (var nd in nearest_map_draggable) {

                if (nd === "default" && nearest_map_draggable.default.marker) {

                    nearest_map_draggable[nd].marker.setMap(null);

                }

            }

            myride.dom_q.map.overlays.nearest_map_draggable = {};

        }

        marker_click_memory.nearest = "";

        selected_nearest_map_stop.stop_id = "";

        nearest_map_stop_distances.dists = [];

    };

    this.displayRoute = function(route, routes) {

        var route_coords = self.decodePath(routes[route].Shp);
        var route_coords_cor = [];

        for (var i=0;i<route_coords.length;i++) {

            var coords_obj = { lat: "", lng: "" };

            coords_obj.lat = route_coords[i][0];
            coords_obj.lng = route_coords[i][1];

            route_coords_cor.push(coords_obj);

        }

        var route_color = "#" + routes[route].Color;

        myride.dom_q.map.overlays.pline = new google.maps.Polyline({
            map: myride.dom_q.map.inst,
            path: route_coords_cor,
            strokeColor: route_color,
            strokeWeight: self.palette.weights.lines.mid
        });

        return route_coords_cor;

    };

    //Replace items in "other routes" list with clickable
    //buttons that change the displayed route
    this.addRouteSwapButtons = function(
        route_swap_button_holders,
        open_info_stop
    ) {

        var scope = 
        angular.element(document.getElementById("bct-app")).scope();

        var route_swap_button_container =
        route_swap_button_holders[0].parentNode;

        route_swap_button_container.innerHTML =
        route_swap_button_container.innerHTML.replace(/,/g, "");

        while (route_swap_button_holders.length > 0) {

            var route_swap_button = angular.element(
                '<a class="ptr" ng-click="switchRoutes(' +
                    '\'' + route_swap_button_holders[0].innerHTML + '\', ' +
                    '\'' + open_info_stop + '\'' +
                ');">' +
                    route_swap_button_holders[0].innerHTML +
                '</a>'
            );

            angular.element(route_swap_button_container).
            append($compile(route_swap_button)(scope));

            route_swap_button_holders[0].outerHTML = "";

            if (route_swap_button_holders[0]) {
                angular.element(route_swap_button_container).append(",&nbsp;");
            }

        }

    };

    //Creates a temporary object made to resemble an info window/box object by
    //including mock placeholder properties. These objects are generally used
    //in order to get around checks for which info windows/boxes are open
    this.createDummyInfoWindow = function(marker_list_name, hovered) {

        var open_info_name = "";

        if (marker_list_name === "trip_points") {
            open_info_name = "trip_open_info";
        }
        else if (marker_list_name === "points") {

            if (hovered) {
                open_info_name = "open_info_hovered";
            }

            else {
                open_info_name = "open_info";
            }

        }

        myride.dom_q.map.overlays[open_info_name] = [{
            close: function() {},
            content: "<span>Stop: First</span>"
        }];

    };

    this.showSelectedInfoWindow = function(
        module,
        point,
        e,
        point_name,
        hovered
    ) {

        var open_info_name = "";
        var id_type_name = "";

        if (module === "planner") {

            open_info_name = "trip_open_info";
            id_type_name = "trip_marker_window_id";

        }
        else if (module === "schedule") {

            if (hovered) {

                open_info_name = "open_info_hovered";

            }

            else {

                open_info_name = "open_info";

            }

            id_type_name = "schedule_marker_window_id";

        }

        //Prevent info box from opening from hover if already opened from click
        if (module === "schedule" && !!hovered) {

            if (typeof myride.dom_q.map.
                overlays["open_info"][0][id_type_name] !== "undefined" &&
                point.info[id_type_name] ===
                myride.dom_q.map.overlays["open_info"][0][id_type_name]) {

                return true;

            }

        }

        var open_window = myride.dom_q.map.overlays[open_info_name][0];

        if (point.info[id_type_name] === open_window[id_type_name]) { 
            return true;
        }

        point.info.open(
            myride.dom_q.map.inst,
            point.marker
        );

        var marker_label =
        myride.dom_q.map.overlays[open_info_name][0].marker_label;

        if ((!hovered && marker_label) || module === "planner") {

            myride.dom_q.map.overlays[open_info_name][0].close();

            if (module === "schedule") {

                myride.dom_q.map.overlays.points[marker_label].info.clicked =
                false;

            }

        }

        myride.dom_q.map.overlays[open_info_name].pop();

        //Store a reference to the latest opened info window
        //so it can be closed when another is opened
        myride.dom_q.map.overlays[open_info_name].push(point.info);

        if (!hovered) {

            var point_coords = point.marker.getPosition();

            myride.dom_q.map.inst.setCenter({
                lat: point_coords.lat(),
                lng: point_coords.lng()
            });

            if (e) {

                var ordered_stops = myride.dom_q.map.overlays.ordered_stop_list;

                if (ordered_stops && module === "schedule") {

                    map_navigation_marker_indices.schedule =
                    ordered_stops.indexOf(point_name);

                }
                else if (module === "planner") {

                    var newly_opened_window = myride.dom_q.map.
                    overlays[open_info_name][0];

                    map_navigation_marker_indices.planner =
                    newly_opened_window[id_type_name];

                }

            }

        }

        //False, i.e., window not already opened (normal execution)
        return false;

    };

    this.addMarkerClickAndCloseListeners = function(
        marker_list_name, 
        marker_id
    ) {

        google.maps.event.addListener(
            myride.dom_q.map.overlays[marker_list_name][marker_id].info,
            'closeclick',
            function() {

                self.createDummyInfoWindow(marker_list_name);

                self.createDummyInfoWindow(marker_list_name, true);

                myride.dom_q.map.overlays[marker_list_name][marker_id].
                info.clicked = false;

            }
        );

        if (marker_list_name === "points") {

            google.maps.event.addListener(
                myride.dom_q.map.overlays[marker_list_name][marker_id].marker,
                'click',
                function() {
                    myride.dom_q.map.overlays[marker_list_name][marker_id].
                    ShowWindow.func("click", false);
                }
            );

            google.maps.event.addListener(
                myride.dom_q.map.overlays[marker_list_name][marker_id].marker,
                'mouseover',
                function() {

                    var icon_options =
                    marker_icon_options.schedule_map.mouseover;

                    icon_options.fillColor =
                    myride.dom_q.map.overlays[marker_list_name][marker_id].
                    marker.getIcon().fillColor;

                    myride.dom_q.map.overlays[marker_list_name][marker_id].
                    marker.setOptions(
                        {
                            icon: icon_options
                        }
                    );

                    myride.dom_q.map.overlays[marker_list_name][marker_id].
                    ShowWindow.func(null, true);

                }
            );

            google.maps.event.addListener(
                myride.dom_q.map.overlays[marker_list_name][marker_id].marker,
                'mouseout',
                function() {

                    var icon_options = marker_icon_options.schedule_map.default;

                    icon_options.fillColor =
                    myride.dom_q.map.overlays[marker_list_name][marker_id].
                    marker.getIcon().fillColor;

                    myride.dom_q.map.overlays[marker_list_name][marker_id].
                    marker.setOptions(
                        {
                            icon: icon_options
                        }
                    );

                    var marker_was_clicked =
                    myride.dom_q.map.overlays[marker_list_name][marker_id].
                    info.clicked;

                    if (!marker_was_clicked) {

                        myride.dom_q.map.overlays[marker_list_name][marker_id].
                        info.close();

                        self.createDummyInfoWindow(marker_list_name, true);

                    }

                }
            );

        }
        
        else if (marker_list_name === "trip_points") {
        
            google.maps.event.addListener(
                myride.dom_q.map.overlays[marker_list_name][marker_id].marker,
                'click',
                myride.dom_q.map.overlays[marker_list_name][marker_id].
                ShowWindow.func
            );

        }

    };

    this.getOrderedStopListForCurrentRoute = function(route) {

        var ordered_stop_name_list_for_current_route = [];

        var promise = scheduleDownloadAndTransformation.
        downloadStopsForRoute(route).then(function(res) {

            for (var i=0;i<res.data.Stops.length;i++) {
                ordered_stop_name_list_for_current_route.
                push(res.data.Stops[i].Id);
            }

            map_navigation_marker_indices.schedule =
            ordered_stop_name_list_for_current_route.
            indexOf(map_navigation_marker_indices.schedule_named);

            return ordered_stop_name_list_for_current_route;

        });

        return promise;

    };

    this.mapStopsToRoutePath = function(coords, route_path) {

        //Disabling stop coordinate projection; verify before function deleted
        return coords;

        var linear_dist_arr = [];

        for (var i=0;i<route_path.length;i++) {

            var x1 = route_path[i].lat;
            var y1 = route_path[i].lng;

            var x2 = typeof coords.lat === "number" ? coords.lat : coords.lat();
            var y2 = typeof coords.lng === "number" ? coords.lng : coords.lng();

            var h_dist_pow_2 = Math.pow((x2 - x1), 2);
            var v_dist_pow_2 = Math.pow((y2 - y1), 2);

            var linear_dist = Math.pow((h_dist_pow_2 + v_dist_pow_2), 0.5);

            var dist_obj = {

                orig_coord: route_path[i],
                linear_dist: linear_dist

            };

            linear_dist_arr.push(dist_obj);

        }

        linear_dist_arr.sort(function(d_obj1, d_obj2) {
            return d_obj1.linear_dist - d_obj2.linear_dist;
        });

        return linear_dist_arr[0].orig_coord;

    };

    this.displayStops = function(route, routes, stops, route_path) {

        var cur_route = routes[route];
        var bstops_names = cur_route.Stops;

        var clustered_markers = [];

//        //Test code showing points used to generate polyline
//        var line_points =
//        myride.dom_q.map.overlays.pline.latLngs.getArray()[0].getArray();
//
//        for (var z=0;z<line_points.length;z++) {
//            
//            var test_lat = line_points[z].lat();
//            var test_lng = line_points[z].lng();
//
//            var test_marker = new google.maps.Marker({
//                map: myride.dom_q.map.inst,
//                position: {lat: test_lat, lng: test_lng}
//            });
//
//        }

        for (var i=0;i<bstops_names.length;i++) {

            if (!stops[bstops_names[i]].LatLng.Latitude) { continue; }

            var lat = stops[bstops_names[i]].LatLng.Latitude;
            var lng = stops[bstops_names[i]].LatLng.Longitude;

            var raw_coords = new google.maps.LatLng(lat, lng);

            var coords = self.mapStopsToRoutePath(
                raw_coords, route_path
            );

            var route_color = "#" + routes[route].Color;

            var icon_options = marker_icon_options.schedule_map.default;

            icon_options.fillColor = route_color;

            var marker = new google.maps.Marker({
                map: myride.dom_q.map.inst,
                position: coords,
                title: route + ' ' + bstops_names[i],
                icon: icon_options
            });

            var associated_routes = stops[bstops_names[i]].Routes;

            //Put current route as the first element (CSS pseudo-element
            //will handle highlighting)
            associated_routes.splice(associated_routes.indexOf(route), 1);

            associated_routes.splice(0, 0, route);

            var associated_routes_icons = '';

            var schedule_template = '' +

                '<span class="schedule-map-info-window-schedule-contents">' +
                    'Loading Schedule...' +
                '</span>';

            for (var k=0; k<associated_routes.length; k++) {

                var switch_route_function_attribute;

                if (k === 0) {

                    switch_route_function_attribute = "";

                }

                else {

                    switch_route_function_attribute = '' +
                    'ng-click="switchRoutes(' +
                        '\'' + stops[bstops_names[i]].Routes[k] + '\', ' +
                        '\'' + bstops_names[i] + '\'' +
                    ');"';

                }

                associated_routes_icons += '' +

                    '<div class="schedule-map-info-box-route-icon ' +
                    'no-highlight ptr" ' + switch_route_function_attribute +
                    '>' +

                        '<span class="schedule-map-info-box-route-id">' +

                            stops[bstops_names[i]].Routes[k].replace(/BCT/,"") +

                        '</span>' +

                        '<bus-svg></bus-svg>' +

                    '</div>';

            }

            var schedule_map_info_box_contents = '' +

                '<div class="myride-info-box-contents">' +

                    '<div class="schedule-map-info-box-top">' +

                        '<div class="schedule-map-info-box-top-contents">' +

                            '<span>' +
                                "[ID #" + stops[bstops_names[i]].Code + "]" +
                            //'</span>' +
                                " - " +
                            //'<span>' +
                                stops[bstops_names[i]].Name +
                            '</span>' +

                        '</div>' +

                    '</div>' +

                    '<div class="schedule-map-info-box-bottom">' +

                        //The class name is needed for $compile step when opened
                        '<span class="info-window-associated-routes"></span>' +

                        '<span class="schedule-map-info-window-schedule">' +
                        '</span>' +

                    '</div>' +

                '</div>';

            var info_window =
            new InfoBox({

                content: schedule_map_info_box_contents,
                boxClass: "schedule-map-info-box",
                pixelOffset: {

                    width: -103,
                    height: -122

                },
                infoBoxClearance: {

                    width: 0,
                    height: 20

                }

            });

            info_window.set("schedule_marker_window_id", i);

            info_window.set("marker_label", bstops_names[i]);

            myride.dom_q.map.overlays.points[bstops_names[i]] = {
                marker: marker,
                info: info_window
            };

            clustered_markers.push(marker);

            myride.dom_q.map.overlays.points[bstops_names[i]].ShowWindow =
            new (function() {

                var self = this;

                this.s_id = bstops_names[i];

                this.pt_name = bstops_names[i];

                this.pt = myride.dom_q.map.overlays.points[self.pt_name];

                this.associated_routes_icons = associated_routes_icons;

                this.schedule_template = schedule_template;

                this.func = function(e, hovered) {

                    var window_already_open = 
                    top_self.showSelectedInfoWindow(
                        "schedule",
                        self.pt,
                        e,
                        self.pt_name,
                        hovered
                    );

                    if (window_already_open) { return true; }

                    var scope = generalServiceUtilities.top_level_scope;

                    angular.element(document).ready(function() {

                        try {

                            var route_icons_el = self.pt.info.div_.
                            getElementsByClassName(
                                "info-window-associated-routes"
                            )[0];

                            var schedule_el = self.pt.info.div_.
                            getElementsByClassName(
                                "schedule-map-info-window-schedule"
                            )[0];

                            schedule_el.style.display = "none";

                            var route_icons_el_ang_obj =
                            angular.element(route_icons_el);

                            var schedule_el_ang_obj =
                            angular.element(schedule_el);

                            route_icons_el_ang_obj.
                            append(
                                $compile(self.associated_routes_icons)(scope)
                            );

                            schedule_el_ang_obj.
                            append(
                                $compile(self.schedule_template)(scope)
                            );

                        }

                        catch(e) {

                            console.log(
                                "Info box closed too quickly to load SVGs."
                            );

                        }

                    });

                    if (!hovered) {

                        self.pt.info.clicked = true;

                        scope.$evalAsync(function() {

                            angular.element(document).ready(function() {

                                var schedule_el = self.pt.info.div_.
                                getElementsByClassName(
                                    "schedule-map-info-window-schedule"
                                )[0];

                                schedule_el.style.display = "block";

                            });

                        });

                        scope.show_info_window_schedule = true;

                        //Request next arrivals for clicked route/stop
                        scheduleDownloadAndTransformation.
                        downloadSchedule(route, self.s_id).then(function(res) {

                            if (!res.data.Today) {

                                console.log(
                                    "Problem communicating with server: " +
                                    "InfoBox schedule."
                                );

                                return true;

                            }

                            var nearest_schedule =
                            scheduleDownloadAndTransformation.
                            transformSchedule("nearest", res.data.Today);

                            angular.element(document).ready(function() {

                                try {

                                    var schedule_el_cont = self.pt.info.div_.
                                    getElementsByClassName(
                                        "schedule-map-info-" +
                                        "window-schedule-contents"
                                    )[0];

                                    var nearest_times =
                                    nearest_schedule.nearest.next_times;

                                    var converted_nearest_times = [];

                                    for (var i=0;i<nearest_times.length;i++) {

                                        converted_nearest_times.push(
                                            unitConversionAndDataReporting.
                                            convertToTwelveHourTime(
                                                nearest_times[i]
                                            )
                                        );

                                    }

                                    if (converted_nearest_times[0]) {

                                        schedule_el_cont.innerHTML =
                                        converted_nearest_times.map(
                                            function(time) {

                                                var time_no_flags =
                                                time.replace(/;next|;prev/, "");

                                                return time_no_flags;

                                            }
                                        ).join(", ");

                                    }

                                    else {

                                        schedule_el_cont.innerHTML =
                                        "No more departures today.";

                                    }

                                }

                                catch(e) {

                                    console.log("A Google Maps infowindow " +
                                    "was closed before next times were fully " +
                                    "loaded.");

                                }

                            });

                        });

                    }

                    angular.element(document).ready(function() {

                        var route_swap_button_holders =
                        document.getElementsByClassName(
                            "route-swap-button-holder"
                        );

                        if (route_swap_button_holders[0]) {
                            top_self.addRouteSwapButtons(
                                route_swap_button_holders,
                                self.s_id
                            );
                        }

                    });

                };

            });

            top_self.addMarkerClickAndCloseListeners("points", bstops_names[i]);

        }

        map_clusterer.clusterer.markers_ = clustered_markers;

    };

    this.addNearestMapMarkerClickAndHoverListeners = function(
        cur_point,
        cur_point_id
    ) {

        google.maps.event.addListener(
            cur_point.marker,
            'mouseover',
            function() {

                var icon_options = marker_icon_options.schedule_map.mouseover;

                icon_options.fillColor = self.palette.colors.blue;

                cur_point.marker.setOptions(
                    {
                        icon: icon_options
                    }
                );

            }
        );

        google.maps.event.addListener(
            cur_point.marker,
            'mouseout',
            function() {

                if(!cur_point.clicked) {

                    var icon_options = marker_icon_options.schedule_map.default;

                    icon_options.fillColor = self.palette.colors.red;

                    cur_point.marker.setOptions(
                        {
                            icon: icon_options
                        }
                    );

                }

            }
        );

        google.maps.event.addListener(
            cur_point.marker,
            'click',
            function() {

                if (marker_click_memory.nearest === cur_point_id) {
                    return true;
                }

                cur_point.clicked = true;

                var icon_options;

                if (!!myride.dom_q.map.overlays.
                    nearest_map_points[marker_click_memory.nearest]) {

                    var old_point = myride.dom_q.map.overlays.
                    nearest_map_points[marker_click_memory.nearest];

                    old_point.clicked = false;

                    icon_options =
                    marker_icon_options.schedule_map.default;

                    icon_options.fillColor = self.palette.colors.red;

                    old_point.marker.setOptions( {
                        icon: icon_options
                    });

                }

                marker_click_memory.nearest = cur_point_id;

                icon_options =
                marker_icon_options.schedule_map.mouseover;

                icon_options.fillColor = self.palette.colors.blue;

                cur_point.marker.setOptions(
                    {
                        icon: icon_options
                    }
                );

                selected_nearest_map_stop.stop_id = cur_point_id;

            }
    );

    };

    this.displayNearestMapStops = function(
        nearest_stops,
        stops
    ) {

        for (var i=0; i<nearest_stops.length;i++) {

            var marker_coords = { 
                lat: nearest_stops[i].LatLng.Latitude,
                lng: nearest_stops[i].LatLng.Longitude
            };

            var marker_options = marker_icon_options.
            schedule_map.default;

            marker_options.fillColor = self.palette.colors.red;

            var marker = new google.maps.Marker({
                map: myride.dom_q.map.inst,
                position: marker_coords,
                icon: marker_options
            });

            var cur_point =
            myride.dom_q.map.overlays.nearest_map_points[nearest_stops[i].Id] =
            {
                marker: marker
            };

            top_self.addNearestMapMarkerClickAndHoverListeners(
                cur_point,nearest_stops[i].Id
            );

        }

    };

    //TODO: Request API modification to return GTFS route colors directly
    this.formatTransitModeResult = function(
        all_routes,
        mode_field,
        route_field
    ) {

        var leg_color = "";
        var route_text = "";
        var label = "";

        switch (mode_field) {
            case "BUS":
                leg_color = "#" + all_routes["BCT" + route_field].Color;
                route_text = "BCT" + route_field;
                label = "Bus route";
                break;
            case "WALK":
                leg_color = self.palette.colors.black;
                route_text = "";
                label = "Walk";
                break;
            case "TRAIN":
                leg_color = "#009933";
                route_text = "";
                label = "Train";
                break;
            case "DEST":
                leg_color = "#000000",
                route_text = "",
                label = "Destination";
                break;
            default:
                throw (new Error).message = "" +
                "Invalid transit mode setting: " + mode_field;
        }

        return {
            leg_color: leg_color,
            route_text: route_text,
            label: label
        };

    };

    this.getCoordsMidsAndSpans = function(all_path_coords_divided) {
        var all_lats = all_path_coords_divided.lats;
        var all_lngs = all_path_coords_divided.lngs;

        all_lats.sort();
        all_lngs.sort();

        var lat_min = all_lats[0];
        var lat_max = all_lats[all_lats.length-1];
        var lng_min = all_lngs[0];
        var lng_max = all_lngs[all_lngs.length-1];

        var lat_span = Number((lat_max - lat_min).toFixed(5));
        var lng_span = Number((lng_max - lng_min).toFixed(5));

        var lat_mid = Number((lat_min + (lat_span / 2)).toFixed(5));
        var lng_mid = Number((lng_min + (lng_span / 2)).toFixed(5));

        return {
            lat: {
                span: Math.abs(lat_span),
                mid: lat_mid
            },
            lng: {
                span: Math.abs(lng_span),
                mid: lng_mid
            }
        };
    };

    this.inferZoomFromMaxCoordSpan = function(max_coord_span) {

        /* Force zoom level break points manually here */

        var span_breakpoints = [
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
        ];

        /* Calculate zoom level break points automatically
           Assumes log(2) relationship between breakpoints and zoom levels */

        //Start of breakpoint calculation with lowest zoom (16 in this case)
        //Increase this slightly if you need more room on edges of plan path
        var ZOOM_16_BREAKPOINT = 0.01200;

        for (var i=0;i<span_breakpoints.length;i++) {
            var power = i;

            span_breakpoints[i].calculated_breakpoint = ZOOM_16_BREAKPOINT *
                Math.pow(2, power);
        }

        //Factor in map canvas width into required zoom breakpoint calculation
        //This is the calibration value, and is arbitrarily assigned to 1.0
        //e.g.: map canvas is 600px wide at some zoom (14) --> 1.0
        //      map canvas is 300px wide at some zoom (14) --> 0.5
        var ZOOM_14_SPAN_0_5_MAP_WIDTH = 600;

        var map_width = myride.dom_q.map.cont.clientWidth;
        var map_width_calibration_ratio = Number(
                map_width / ZOOM_14_SPAN_0_5_MAP_WIDTH
            ).toFixed(1);

        for (var j=0;j<span_breakpoints.length;j++) {
            var old_breakpoint = span_breakpoints[j].calculated_breakpoint;

            span_breakpoints[j].calculated_breakpoint = old_breakpoint *
                map_width_calibration_ratio;
        }

        //Use manual breakpoint if one was chosen, otherwise use calculated
        for (var i=0;i<span_breakpoints.length;i++) {
            var cur_zoom_breakpoint = span_breakpoints[i].manual_breakpoint ||
                                      span_breakpoints[i].calculated_breakpoint;

            if (max_coord_span <= cur_zoom_breakpoint) {
                return span_breakpoints[i].needed_zoom;
            }
        }
        //Default if coordinate span is too large, as it covers
        //Broward, Miami-Dade and Palm Beach
        return 8;
    };

    this.findBestZoomAndCenter = function(all_path_coords_divided) {
        var coords_stats = self.getCoordsMidsAndSpans(all_path_coords_divided);

        var center = {
            lat: coords_stats.lat.mid,
            lng: coords_stats.lng.mid
        };

        var max_coord_span = Math.max(
            coords_stats.lat.span, coords_stats.lng.span
        );

        var zoom = self.inferZoomFromMaxCoordSpan(max_coord_span);

        return {
            zoom: zoom,
            center: center
        };
    };

    this.displayTripPath = function(all_routes, line_data) {

        self.clearMap();

        var legs = line_data;
        var all_path_coords_divided = {
            lats: [],
            lngs: []
        };

        var orig_legs_count = legs.length;

        for (var i=0;i<orig_legs_count + 1;i++) {

            var path_coords_raw;

            if (i === orig_legs_count) {

                legs[i] = {

                    legGeometryField: {
                        pointsField: []
                    },
                    modeField: "DEST",
                    routeField: null,
                    fromField: {
                        latField: legs[i-1].toField.latField,
                        lonField: legs[i-1].toField.lonField
                    },
                    distanceField: "DEST",
                    durationField: "DEST"

                };

                path_coords_raw = [];

            }

            else {

                path_coords_raw = self.decodePath(
                    legs[i].legGeometryField.pointsField
                );

            }

            var path_coords = [];

            var last_pline_coords;

            for (var j=0;j<path_coords_raw.length;j++) {

                var LatLng = {};

                LatLng.lat = path_coords_raw[j][0];
                LatLng.lng = path_coords_raw[j][1];

                all_path_coords_divided.lats.push(path_coords_raw[j][0]);
                all_path_coords_divided.lngs.push(path_coords_raw[j][1]);

                path_coords.push(LatLng);

                last_pline_coords = path_coords_raw[j];

            }

            var formattedModeResult = self.formatTransitModeResult(
                all_routes,
                legs[i].modeField,
                legs[i].routeField
            );

            var leg_color = formattedModeResult.leg_color;
            var route_text = formattedModeResult.route_text;
            var label = formattedModeResult.label;

            var line_symbol = {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 1,
                strokeWeight: 3,
                strokeOpacity: 1
            };

            var leg_pline_config;


            if (legs[i].modeField === "WALK") {

                leg_pline_config = {
                    map: myride.dom_q.map.inst,
                    path: path_coords,
                    strokeColor: leg_color,
                    strokeWeight: self.palette.weights.lines.mid,
                    strokeOpacity: 0,
                    icons: [{
                        icon: line_symbol,
                        offset: '0',
                        repeat: '7px'
                    }]
                };

            }

            else {

                leg_pline_config = {
                    map: myride.dom_q.map.inst,
                    path: path_coords,
                    strokeColor: leg_color,
                    strokeWeight: self.palette.weights.lines.mid
                };

            }

            var leg_pline = new google.maps.Polyline(leg_pline_config);

            myride.dom_q.map.overlays.trip_pline.push(leg_pline);

            var walking_svg = svg_icon_paths.walking;
            var bus_svg = svg_icon_paths.bus;
            var dest_svg = svg_icon_paths.dest;

            var icon_svg_path = "";

            var icon_offset;

            var icon_offset_coord1 = 0;
            var icon_offset_coord2 = 0;

            var icon_color = "";

            switch (legs[i].modeField) {

                case "WALK":

                    icon_svg_path = walking_svg;

                    icon_offset_coord1 = 32;
                    icon_offset_coord2 = 57;

                    icon_color = "#017AC2";

                    break;

                case "BUS":

                    icon_svg_path = bus_svg;

                    icon_offset_coord1 = 7;
                    icon_offset_coord2 = 20;

                    icon_color = formattedModeResult.leg_color;

                    break;

                case "DEST":

                    icon_svg_path = dest_svg;

                    icon_offset_coord1 = 8;
                    icon_offset_coord2 = 4;

                    icon_color = "#017AC2";

                    break;

            }

            icon_offset =
            new google.maps.Point(icon_offset_coord1, icon_offset_coord2);

            var marker_coords = {
                lat: legs[i].fromField.latField,
                lng: legs[i].fromField.lonField
            };

            var marker = new google.maps.Marker({
                map: myride.dom_q.map.inst,
                position: marker_coords,
                icon: {
                    path: icon_svg_path,
                    scale: 1.5,
                    strokeColor: "#000000",
                    strokeWeight: 1,
                    fillColor: icon_color,
                    fillOpacity: 1,
                    anchor: icon_offset
                }
            });

            var formattedDistance;
            var reported_distance;
            var reported_distance_unit;

            formattedDistance = unitConversionAndDataReporting.
            formatReportedDistance(legs[i].distanceField);

            reported_distance = formattedDistance.reported_distance;

            reported_distance_unit = formattedDistance.
            reported_distance_unit;

            var trip_planner_info_box_contents;

            if (i === orig_legs_count) {

                trip_planner_info_box_contents = '' +
                    '<div class="trip-marker-info-window">' +
                        "<span>" +
                            "Arrived at destination." +
                        "</span>" +
                    '</div>';

            }

            else {

                trip_planner_info_box_contents = '' +
                    '<div class="trip-marker-info-window">' +
                        "<span>" +
                            "<em>" + (i+1) + ". </em> " +
                            label + " " + route_text +
                        "</span>" +
                        "<span>" +
                            "<em>Distance: </em>" +
                            reported_distance + " " + reported_distance_unit +
                        "</span>" +
                        "<span>" +
                            "<em> Time: </em>" +
                            legs[i].startTimeField.slice(11,16) +
                            " - " +
                            legs[i].endTimeField.slice(11,16) +
                        "</span>" +
                        "<span>" +
                            "<em> Duration: </em>" +
                            (legs[i].durationField / 1000 / 60).toFixed(0) +
                            " minutes" +
                        "</span>";
                    '</div>';

            }

            var info_window =
            new InfoBox({

                content: trip_planner_info_box_contents,
                boxClass: "trip-planner-info-box",
                pixelOffset: {

                    width: -100,
                    height: -101

                },
                infoBoxClearance: {

                    width: 0,
                    height: 25

                }

            });

            info_window.set("trip_marker_window_id", i);

            var trip_marker_window = {
                marker: marker,
                info: info_window
            };

            myride.dom_q.map.overlays.trip_points.push(trip_marker_window);

            myride.dom_q.map.overlays.trip_points[i].ShowWindow =
            new (function() {

                var self = this;

                this.pt = myride.dom_q.map.overlays.trip_points[i];

                this.func = function(e) {

                    var window_already_open =
                    top_self.showSelectedInfoWindow("planner", self.pt, e);

                    if (window_already_open) { return true; }

                    if (e) {
                        //Digest not being called despite planner index changing
                        generalServiceUtilities.forceDigest();
                    }

                };

            });

            top_self.addMarkerClickAndCloseListeners("trip_points", i);

        }

        if (i === orig_legs_count) {

            legs.pop();

        }

        var best_zoom_and_center = self.
        findBestZoomAndCenter(all_path_coords_divided);

        myride.dom_q.map.inst.setZoom(best_zoom_and_center.zoom);
        myride.dom_q.map.inst.setCenter(best_zoom_and_center.center);

    };

    this.decodePath = function(encoded) {

        var len = encoded.length;
        var index = 0;
        var array = [];
        var lat = 0;
        var lng = 0;

        encoded = encoded.replace(/\\/g,"\\");
        while (index < len) {
            var b;
            var shift = 0;
            var result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } 
            while (b >= 0x20);

            var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;

            do 
            {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } 
            while (b >= 0x20);

            var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            array.push([lat * 1e-5, lng * 1e-5]);
        }

        return array;
    };

}]);

BCTAppServices.service('tripPlannerService', [ '$http', '$q',
'generalServiceUtilities', 'unitConversionAndDataReporting',
'trip_planner_constants',
function($http, $q, generalServiceUtilities, unitConversionAndDataReporting,
trip_planner_constants) {

    var self = this;
    var geocoder = new google.maps.Geocoder;

    this.geocodeAddress = function(query_address) {

        var deferred = $q.defer();

        var lat_lng_input = query_address.
        match(/-?[0-9]*\.[0-9]*,-?[0-9]*\.[0-9]*/);

        if (lat_lng_input) {
            var bstop_coords_arr = lat_lng_input[0].split(",");
            var bstop_coords_obj = {
                Latitude: Number(bstop_coords_arr[0]),
                Longitude: Number(bstop_coords_arr[1])
            };

            deferred.resolve(bstop_coords_obj);
        }
        else {
            geocoder.geocode(
                { 'address': query_address },
                function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        deferred.resolve(results);
                    }
                    else {
                        deferred.resolve(status);
                    }
                }
            );
        }
        return deferred.promise;
    };

    this.getLatLon = function(start_input_string, finish_input_string) {

        return $q.all([
            self.geocodeAddress(start_input_string),
            self.geocodeAddress(finish_input_string)
        ]);

    };

    this.transformGeocodeCoords = function(coords_object) {
        var lat = coords_object.lat();
        var lng = coords_object.lng();

        return {
            Latitude: lat,
            Longitude: lng
        };
    };

    this.getTripPlanPromise = function(trip_opts, start, finish) {

        var arrdep = false;

        var date =
        generalServiceUtilities.formatDateYYYYMMDD(trip_opts.datepick);

        var time = trip_opts.datepick.toTimeString().slice(0,5);
        var optimize = "";
        var modearr = ["WALK"];
        var coord_objs = [start, finish];

        if (trip_opts.datetarg === "arrive_by") {
            arrdep = true;
        }
        for (mode in trip_opts.modeswitch) {
            if (trip_opts.modeswitch[mode] === true) {
                modearr.push(mode.toUpperCase());
            }
        }

        return $http({
             method: 'POST',
             url: 'http://174.94.153.48:7777/TransitApi/TripPlanner/',
             data: {
                 "From": start,
                 "To": finish,
                 "ArriveBy": String(arrdep),
                 "MaxWalk": 900,
                 "Date": date,
                 "Time": time,
                 "Mode": modearr
             }
         });
    };

    this.formatRawTripStats = function(all_itineraries) {

        for (var i=0;i<all_itineraries.length;i++) {

            all_itineraries[i].durationFieldFormatted =
            unitConversionAndDataReporting.formatReportedDuration(
                all_itineraries[i].durationField
            );

            all_itineraries[i].startTimeFieldFormatted =
            unitConversionAndDataReporting.formatReportedDate(
                all_itineraries[i].startTimeField
            );

            all_itineraries[i].endTimeFieldFormatted =
            unitConversionAndDataReporting.formatReportedDate(
                all_itineraries[i].endTimeField
            );

            all_itineraries[i].legsField[0].styles =
            "trip-planner-itinerary-step-highlighted";

            for (var j=1;j<all_itineraries[i].legsField.length;j++) {
                all_itineraries[i].legsField[j].styles = "";
            }

        }

        return all_itineraries;

    };

    this.filterTripItineraries = function(all_itineraries) {

        var filtered_trip_itineraries = [];

        var trip_duration_cutoff =
        trip_planner_constants.trip_duration_cutoff_hours;

        var trip_walking_cutoff =
        trip_planner_constants.trip_walking_cutoff_meters;

        for (var i=0;i<all_itineraries.length;i++) {
            
            var trip_duration_in_hours =
            all_itineraries[i].durationField / 1000 / 60 / 60;

            var trip_walking_distance =
            all_itineraries[i].walkDistanceField;

            if (trip_duration_in_hours < trip_duration_cutoff &&
                trip_walking_distance < trip_walking_cutoff) {

                filtered_trip_itineraries.push(all_itineraries[i]);

            }

        }

        return filtered_trip_itineraries;

    };

}]);

BCTAppServices.service('profilePageService', [ '$http', 'favorites_data',
'generalServiceUtilities',

function($http, favorites_data, generalServiceUtilities) {

    var self = this;

    this.downloadUserFavorites = function() {

        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitAPI/Favorites',
            data: {
                UserId: 777,
                Action: "GET",
                "Favorite": null
            },
            transformResponse: function(res) {

                return generalServiceUtilities.
                tryParsingResponse(res, "downloadUserFavorites");

            }
        });

    };

    this.addRouteStopToFavorites = function(route, stop) {

        return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitAPI/Favorites',
            data: {
                UserId: 777,
                Action: "ADD",
                Favorite: {
                    UserId: 777,
                    AgencyId: "BCT",
                    RouteId: route,
                    StopId: stop
                }
            }
        });

    };

    this.deleteFavoriteRouteStop = function(route, stop) {

       return $http({
            method: 'POST',
            url: 'http://174.94.153.48:7777/TransitAPI/Favorites',
            data: {
                UserId: 777,
                Action: "DELETE",
                "Favorite": {
                    UserId: 777,
                    AgencyId: "BCT",
                    RouteId: route,
                    StopId: stop
                }
            }
        });

    };

    this.checkIfRouteStopFavorited = function(route, stop) {

        var favorites = favorites_data.arr;

        for (var i=0;i<favorites.length;i++) {

            if (favorites[i].RouteId === "route" &&
                favorites[i].StopId === "stop") {

                return true;

            }

        }

        return false;

    };

}]);

BCTAppServices.service('filterHelpers', [ 'results_exist', 'filter_buffer_data',
function(results_exist, filter_buffer_data) {

    this.bufferResultsExistTruthiness = function(
        results_exist_flag,
        current_results_exist,
        search_input
    ) {

        results_exist[results_exist_flag] = false;

        filter_buffer_data.results_exist_counter +=
        current_results_exist;

        filter_buffer_data.search_string_buffer.push(search_input);

        if (filter_buffer_data.search_string_buffer[0] !== 
        search_input) {

            filter_buffer_data.search_string_buffer =
            [search_input];

            filter_buffer_data.results_exist_counter =
            current_results_exist;

        }

        results_exist[results_exist_flag] =
        Boolean(filter_buffer_data.results_exist_counter);
    };
 
}]);

BCTAppServices.factory('routeAndStopFilters', [ 'nearestStopsService',
'locationService', 'latest_location', 'filterHelpers',
function(nearestStopsService, locationService, latest_location, filterHelpers) {

    return {

        RouteAndStopFilterMaker: function(
            filter_type,
            use_minimum_length
        ) {

            var self = this;

            if (filter_type === "stop") {

                this.property_name = "Name";
                this.id_or_code = "Code";

            }

            else if (filter_type === "route") {

                this.property_name = "LName";
                this.id_or_code = "Id";

            }

            else if (filter_type === "landmark") {

                this.property_name = "Description";
                this.id_or_code = false;

            }

            //The two top level search filters use minimum length
            if (use_minimum_length) {

                this.filter_condition = function(input_string_length) {

                    if (input_string_length < 3) {
                        return false;
                    }

                    return true;

                };

                this.results_exist_flag = "main";

            }
            else {

                this.filter_condition = function() {
                    return true;
                };

                this.results_exist_flag = "sub";

            }

            this.filter = function(
                items,
                search_string,
                sort_bstops_by_distance
            ) {

                var filtered = [];

                var input_lower = search_string.toLowerCase();

                var input_simplified =
                input_lower.replace("\(", "\\(").replace("\)", "\\)");

                if (!self.filter_condition(search_string.length)) { 
                    return true; 
                }

                if (search_string.length === 0) {
                    return items;
                };

                if (filter_type === "route" &&
                    input_simplified === "all routes") {

                    filtered = items;

                }

                else {

                    for (var i=0;i<items.length;i++) {

                        var item_search_string_cased;

                        item_search_string_cased = "" +
                        items[i][self.property_name];

                        if (self.id_or_code) {

                            item_search_string_cased +=
                            " " + items[i][self.id_or_code];

                        }

                        var item_search_string =
                        item_search_string_cased.toLowerCase();

                        if (item_search_string.match(input_simplified)) {
                            filtered.push(items[i]);
                        }

                    }

                }

                if (sort_bstops_by_distance) {

                    var current_location = locationService.
                    changeToDefaultLocationIfOutsideOfFlorida(latest_location);

                    filtered = nearestStopsService.sortStopsByDistance(
                        current_location,
                        filtered
                    );

                }

                var current_results_exist = !!filtered[0];

                filterHelpers.bufferResultsExistTruthiness(
                    self.results_exist_flag,
                    current_results_exist,
                    input_simplified
                );

                return filtered;

            };
        }

    };

}]);

BCTAppServices.service('linkFunctions', [ '$compile',

function($compile) {

    this.dynamicPanelContentsLoader = function(
        scope, element, type
    ) {

        var inner_template =
        "<sub-panel-" + type + "s></sub-panel-" + type + "s>";

        angular.element(element[0].childNodes[0].childNodes[1]).
        bind("click", function() {

            element[0].parentNode.parentNode.parentNode.scrollTop =
            element[0].offsetTop - 10;

            var data_id;

            if (type === "route") {

                data_id = element[0].childNodes[0].getAttribute("id");

                scope.cur_route = scope.routes[data_id];

                scope.top_scope.filtered_sub_routes_arr = 
                scope.top_scope.route_stop_list =
                scope.cur_route.bstop_refs;

            }

            else if (type === "stop") {

                data_id = element[0].childNodes[0].getAttribute("id");

                scope.cur_stop = scope.stops[data_id];

                scope.top_scope.filtered_sub_stops_arr = 
                scope.top_scope.stop_route_list =
                scope.cur_stop.route_refs;

            }

            else if (type === "landmark") {

                var landmark_id = element[0].childNodes[0].getAttribute("id");

                for (var lmk_idx=0;lmk_idx<scope.landmarks.length;lmk_idx++) {

                    if (scope.landmarks[lmk_idx].Id === landmark_id) {
                        break;
                    }

                }

                scope.cur_landmark = scope.landmarks[lmk_idx];

                scope.top_scope.filtered_sub_landmarks_arr = 
                scope.top_scope.landmark_stop_list =
                scope.cur_landmark.bstop_refs;

            }

            var sub_panel_already_exists = Boolean(
                element.children().children()[1].childNodes[1].childNodes[3].
                innerHTML.
                match(/sub-panel-stops|sub-panel-landmarks|sub-panel-routes/)
            );

            if(!sub_panel_already_exists) {
                angular.element(
                    element[0].childNodes[0].childNodes[3].
                    childNodes[1].childNodes[3]
                ).append($compile(inner_template)(scope));
            }

        });

    };

}]);

BCTAppServices.service('templateGenerators', [ 'agency_filter_icons',
function(agency_filter_icons) {

    this.createFilterIconBarTemplate = function(filter_type) {

        var icon_arrangement_class = "";

        switch (filter_type) {
            case "mobile":
                icon_arrangement_class = "schedule-results-icons-mobile";
                break;
            case "inline":
                icon_arrangement_class = "schedule-results-icons-inline";
                break;
        }

        var template = '';

        for (var agency in agency_filter_icons) {

            var agency_filter = agency_filter_icons[agency];

            var agency_name = agency_filter_icons[agency].name;

            template += '' +

            '<span id="' + agency_filter.agency + '-filter-' + filter_type +
            '"' +
            'class="link-icon agency-filter ' +
            icon_arrangement_class + '">' +

                '<img ' +
                'alt="Select Agency: ' + agency_name + '" ' +
                'title="Select Agency: ' + agency_name + '" ' +
                'class="agency-filter-icon ptr ' +
                '{{ agency_filter_icons.' + agency_filter.agency +
                '.selection_class }}" ' +
                'src="' +
                window.myride.directories.site_roots.active +
                window.myride.directories.paths.active +
                'css/ico/' +
                agency_filter.icon_filename + '" ' +
                'ng-click="enableAgencyFilter(\'' + agency_filter.agency +
                '\'' + '); ' +
                '">' +

            '</span>';

        }

        return template;

    };

}]);

BCTAppServices.service('nearestMapStopsService', [ 'nearestStopsService',
'googleMapUtilities',

function(nearestStopsService, googleMapUtilities) {

    this.showNearestStopsFromMapCoords = function(
        coords,
        full_bstop_list,
        bus_stop_dictionary
    ) {

        var nearest_stops_to_map_point = nearestStopsService.findNearestStops(
            coords,
            full_bstop_list,
            bus_stop_dictionary,
            true,
            true
        );

        googleMapUtilities.clearMap(true);

        googleMapUtilities.displayNearestMapStops(
            nearest_stops_to_map_point,
            bus_stop_dictionary
        );

        return nearest_stops_to_map_point;

    };

}]);

var BCTAppDirectives = angular.module('BCTAppDirectives', []);

BCTApp.directive('iconLegendOverlay', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/icon_legend.html'
    };
}]);

BCTApp.directive('bctMyRideTopLevelOverlays', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/main.html'
    };
}]);

BCTApp.directive('scheduleMap', [ 'googleMapUtilities', 'marker_icon_options',
'base_marker_sizes',

function(googleMapUtilities, marker_icon_options, base_marker_sizes) {

    function link(scope) {

        myride.dom_q.map.cont = document.getElementById("map-canvas");
        googleMapUtilities.mapMaker(myride.dom_q.map.cont);

        function getNewMarkerIconProperty(event, prop) {

            var base_size = base_marker_sizes[event][prop];

            var cur_zoom = myride.dom_q.map.inst.getZoom();

            var size_multiplier = cur_zoom / base_marker_sizes.scaling_weight;

            var new_size = size_multiplier * base_size;

            return new_size;

        }

        scope.top_scope.$evalAsync(function() {

            scope.top_scope.schedule_map_zoom_out_listener =
            google.maps.event.addListener(

                myride.dom_q.map.inst,
                'zoom_changed',
                function() {

                    marker_icon_options.schedule_map.default.scale =
                    getNewMarkerIconProperty("default", "scale");

                    marker_icon_options.schedule_map.mouseover.scale =
                    getNewMarkerIconProperty("mouseover", "scale");

                    marker_icon_options.schedule_map.default.strokeWeight =
                    getNewMarkerIconProperty("default", "strokeWeight");

                    marker_icon_options.schedule_map.mouseover.strokeWeight =
                    getNewMarkerIconProperty("mouseover", "strokeWeight");

                    if (scope.top_scope.show_schedule_result_top_bar) {

                        var schedule_map_points = myride.dom_q.map.overlays.
                        points;

                        for (var point in schedule_map_points) {

                            schedule_map_points[point].marker.setIcon(
                                marker_icon_options.schedule_map.default
                            );

                        }

                    }

                    else if (scope.top_scope.
                            show_nearest_map_stops_title_header) {

                        var nearest_map_points =
                        myride.dom_q.map.overlays.nearest_map_points;

                        for (var point in nearest_map_points) {

                            nearest_map_points[point].marker.setIcon(
                                marker_icon_options.schedule_map.default
                            );

                        }

                    }

                }

            );

        });

    }

    return {

        link: link,
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/schedule_map.html'

    };

}]);

BCTApp.directive('mainLoadingModal', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/main_loading_modal.html'
    };
}]);

BCTApp.directive('routeAlertOverlay', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/route_alert_overlay.html'
    };
}]);

BCTApp.directive('scheduleMapOverlay', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/schedule_map_overlay.html'
    };
}]);

BCTApp.directive('tripPlanner', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/trip_planner.html'
    };
}]);

BCTApp.directive('subPanelRoutes', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/sub_panel_routes.html'
    };
}]);

BCTApp.directive('subPanelStops', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/sub_panel_stops.html'
    };
}]);

BCTApp.directive('subPanelLandmarks', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/sub_panel_landmarks.html'
    };
}]);

BCTApp.directive('routeResultPanel', [ 'linkFunctions', 
function(linkFunctions) {

    function link(scope, element) {

        var type = "route";

        linkFunctions.dynamicPanelContentsLoader(
            scope, element, type
        );
    }

    return {
        link: link,
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/route_result_panel.html'
    };
}]);

BCTApp.directive('stopResultPanel', [ 'linkFunctions',
function(linkFunctions) {

    function link(scope, element) {

        var type = "stop";

        linkFunctions.dynamicPanelContentsLoader(
            scope, element, type
        );
    }

    return {
        link: link,
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/stop_result_panel.html'
    };

}]);

BCTApp.directive('landmarkResultPanel', [ 'linkFunctions', 
function(linkFunctions) {

    function link(scope, element) {

        var type = "landmark";

        linkFunctions.dynamicPanelContentsLoader(
            scope, element, type
        );
    }

    return {
        link: link,
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/landmark_result_panel.html'
    };
}]);

BCTApp.directive('tripPlannerDialog', [ function() {

    var template = '' +
        '<div id="trip-planner-dialog" ng-class="planner_dialog_styles"' +
            'ng-show="show_geocoder_error_dialog">' +
            '{{ geocoder_error_dialog_text }}' +
        '<div>';

    return {
        restrict: 'E',
        template: template
    };

}]);

BCTApp.directive('scheduleMapErrorDialog', [ function() {

    var template = '' +
        '<div id="schedule-map-error-dialog" ' + 
        'ng-class="schedule_map_error_dialog_styles" ' +
            'ng-show="show_schedule_map_error_dialog">' +
            '{{ schedule_map_error_dialog_text }}' +
        '<div>';

    return {
        restrict: 'E',
        template: template
    };

}]);

BCTApp.directive('fullScheduleErrorDialog', [ function() {

    var template = '' +
        '<div id="full-schedule-error-dialog" ' + 
        'ng-class="full_schedule_error_dialog_styles" ' +
            'ng-show="show_full_schedule_error_dialog">' +
            '{{ full_schedule_error_dialog_text }}' +
        '<div>';

    return {
        restrict: 'E',
        template: template
    };

}]);

BCTApp.directive('plannerOptionBar', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/planner_option_bar.html'
    };
}]);

BCTApp.directive('nearestStops', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/nearest_stops.html'
    };
}]);

BCTApp.directive('mobileFilterIcons', [ 'templateGenerators',
function(templateGenerators) {

    var template = templateGenerators.createFilterIconBarTemplate("mobile");

    return {
        restrict: 'E',
        template: template
    };

}]);

BCTApp.directive('inlineFilterIcons', [ 'templateGenerators',
function(templateGenerators) {

    var template = templateGenerators.createFilterIconBarTemplate("inline");

    return {
        restrict: 'E',
        template: template
    };

}]);

BCTApp.directive('tripPlannerNavigationBar', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/trip_planner_navigation_bar.html'
    };

}]);

BCTApp.directive('scheduleMapNavigationBar', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/schedule_map_navigation_bar.html'
    };

}]);

BCTApp.directive('tripPlannerStep', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/trip_planner_step.html'
    };

}]);

BCTApp.directive('globalAlertsHeader', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/global_alerts_header.html'
    };

}]);

BCTApp.directive('scheduleMapAlertsHeader', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/schedule_map_alerts_header.html'
    };

}]);

BCTApp.directive('busSvg', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/svg/bus.html'
    };

}]);

BCTApp.directive('destSvg', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/svg/dest.html'
    };

}]);

BCTApp.directive('walkingSvg', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/svg/walking.html'
    };

}]);

BCTApp.directive('tripPlannerIcon', [ '$compile', function($compile) {

    function link(scope, element) {

        var cur_mode = scope.leg.modeField;

        var trip_planner_icon_html = "";

        switch (cur_mode) {

            case "WALK":

              trip_planner_icon_html = "<walking-svg></walking-svg>";

            break;

            case "BUS":

                trip_planner_icon_html = "<bus-svg></bus-svg>";

            break;

            case "DEST":

                trip_planner_icon_html = "<dest-svg></dest-svg>";

            break;

        }

        element.append($compile(trip_planner_icon_html)(scope));

    }

    return {
        restrict: 'E',
        link: link
    };

}]);

BCTApp.directive('nearestMapStopsInfoContainer', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/nearest_map_stops_info_container.html'
    };

}]);

var BCTAppFilters = angular.module('BCTAppFilters', []);
