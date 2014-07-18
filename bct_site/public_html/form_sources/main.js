//Namespace for additional behavior
//Company name
ISR = {};

//Stored DOM queries
ISR.dom = {};

//Container for all base HTML template strings
ISR.templates = {};

ISR.templates.login_form = {};

ISR.templates.profile_page = {};

ISR.templates.profile_page["bct-drop-down-item"] = '' +
'<span class="bct-drop-down-item" ' +
'onclick="ISR.utils.selectDropDownOption(this)">' +
    '{{ DAY_OR_TIME_LABEL }}' +
'</span>';

ISR.templates.profile_page["favorites-alert-day-time-selection"] = '' +
    '<span class="bct-drop-down bct-day-drop-down no-hightlight ptr">' +
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

ISR.templates.data.
profile_page["favorites-full-item-full-date-time"].day_list = [

    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
    "Sunday", "Weekdays", "Weekends"

];

ISR.templates.data.
profile_page["favorites-full-item-full-date-time"].time_list = [

    "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00"

];

function generateDropDownItemHTML(day_or_time_label) {

    var drop_down_item_template_base =
    ISR.templates.profile_page["bct-drop-down-item"];

    var template_placeholders = drop_down_item_template_base.match(/{{.*?}}/g);

    var drop_down_item_template =
    drop_down_item_template_base.
    replace(template_placeholders[0],day_or_time_label);

    return drop_down_item_template;

}

function generateMultipleDropDownItemsHTML(label_list) {

    var drop_down_item_list = [];

    for (var i=0;i<label_list.length;i++) {
        var drop_down_item = generateDropDownItemHTML(label_list[i]);

        drop_down_item_list.push(drop_down_item);
    }

    return drop_down_item_list.join("");

}

function generateAlertDayTimeSelection(day_or_time_selection_list) {

    var day_time_selection_template_base =
    ISR.templates.profile_page["favorites-alert-day-time-selection"];

    var day_time_selection_template = day_time_selection_template_base;

    var template_placeholders = day_time_selection_template_base.
    match(/{{.*?}}/g);

    for (var i=0;i<template_placeholders.length;i++) {
        switch (template_placeholders[i]) {
            case "{{ SELECTED_DAY_OR_TIME }}":

                day_time_selection_template =
                day_time_selection_template.replace(
                    template_placeholders[i],
                    day_or_time_selection_list[0]
                );

                break;

            case "{{ DAY_AND_TIME_DROP_DOWN_ITEMS }}":

                day_time_selection_template =
                day_time_selection_template.replace(
                    template_placeholders[i],
                    generateMultipleDropDownItemsHTML(
                        day_or_time_selection_list
                    )
                );

                break;

        }
    }

    return day_time_selection_template;

}

function generateAlertFullDateTimeSelector() {

    var full_date_time_selector_template_base =
    ISR.templates.profile_page["favorites-full-item-full-date-time"];

    var full_date_time_selector_template =
    full_date_time_selector_template_base;

    var template_placeholders = full_date_time_selector_template_base.
    match(/{{.*?}}/g);

    for (var i=0;i<template_placeholders.length;i++) {
        switch (template_placeholders[i]) {
            case "{{ FAVORITES_ALERT_DAY_SELECTION }}":

                full_date_time_selector_template =
                full_date_time_selector_template.replace(
                    template_placeholders[i],
                    generateAlertDayTimeSelection(
                        ISR.templates.data.
                        profile_page["favorites-full-item-full-date-time"].
                        day_list
                    )
                );

                break;

            case "{{ FAVORITES_ALERT_START_TIME }}":

                full_date_time_selector_template =
                full_date_time_selector_template.replace(
                    template_placeholders[i],
                    generateAlertDayTimeSelection(
                        ISR.templates.data.
                        profile_page["favorites-full-item-full-date-time"].
                        time_list
                    )
                );

                break;

            case "{{ FAVORITES_ALERT_END_TIME }}":

                full_date_time_selector_template =
                full_date_time_selector_template.replace(
                    template_placeholders[i],
                    generateAlertDayTimeSelection(
                        ISR.templates.data.
                        profile_page["favorites-full-item-full-date-time"].
                        time_list
                    )
                );

                break;

        }
    }

    return full_date_time_selector_template;

}

//Utility functions
ISR.utils = {};

ISR.utils.selectDropDownOption = function(target) {

    var target_text = target.textContent.trim();

    var selection_holder = target.parentNode.parentNode.parentNode.children[0];

    selection_holder.textContent = target_text;

};

ISR.utils.generateAlertDateTimeBarHTML = function(target) {

    var date_time_bar_template = generateAlertFullDateTimeSelector();

    target.parentNode.childNodes[5].innerHTML += date_time_bar_template;

};

ISR.utils.addBusRouteStopAlert = function() {
    ISR.utils.generateAlertDateTimeBarHTML();
};

window.onload = function() {

    

    function getAndAppendModuleHTML(container_id, filename, append_target) {

        var template_container = document.getElementById(container_id);

        var template_request = new XMLHttpRequest;

        template_request.open('GET', 'form_sources/' + filename, true);
        template_request.responseType = 'document';
        template_request.onload = function(e) {

            template_container.innerHTML = "";

            var template = e.target.response;
            var target_container =
            template.getElementById(append_target);

           template_container.appendChild(target_container);

        };

        template_request.send();

    };

    getAndAppendModuleHTML(
        'login-form',
        'bct_login_form.html',
        'login-form-inner-container'
    );

    getAndAppendModuleHTML(
        'bct-profile-page',
        'bct_profile_page.html',
        'profile-container'
    );

};