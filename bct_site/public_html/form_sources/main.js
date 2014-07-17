//Namespace for additional behavior
//Company name
ISR = {};

//Stored DOM queries
ISR.dom = {};

//Utility functions
ISR.utils = {};

ISR.utils.selectDropDownOption = function(target) {

    var target_text = target.textContent.trim();

    var selection_holder = target.parentNode.parentNode.parentNode.children[0];

    selection_holder.textContent = target_text;

};

window.onload = function() {

    //Namespace for values and functions needed for init operations
    var inits = {};

    /* START HTML Templating */

    //Templating init module
    inits.templating = {};

    //Container for all base HTML template strings
    inits.templating.templates = {};

    //Here, "directive" refers to a collection of top-level 'constants'
    //that will control the number and contents of each generated template
    inits.templating.createBaseTemplate = function(
        name,
        group,
        html
    ) {

        inits.templating.templates[template_group][name] = {
            html: html_string,
            directive: {}
        };

        return inits.templating.templates[template_group][name];

    };

    var login_form_templates =
    inits.templating.templates.login_form = {};

    var profile_page_templates =
    inits.templating.templates.profile_page = {};

    //NB: Borrowing {{ }} syntax from AngularJS
    //With all-caps contents, it represents a regex target in the template
    //string that will be swapped out with a generated value in a loop

    var bct_drop_down_item_template_html = '' +
    '<span class="bct-drop-down-item" ' +
    'onclick="ISR.utils.selectDropDownOption(this)">' +
        '{{ DAY_OF_THE_WEEK }}' +
    '</span>';

    var bct_drop_down_item_template = inits.templating.createBaseTemplate(
        "bct-drop-down-item",
        "profile_page",
        bct_drop_down_item_template_html
    );

    function generateHTMLFromLoginFormTemplates() {
        return true;
    }

    function generateHTMLFromProfilePageTemplates() {
        return true;
    }

    function generateTemplates(container_id) {
        switch (container_id) {
            case "login-form":
                generateHTMLFromLoginFormTemplates();
                break;
            case "bct-profile-page":
                generateHTMLProfilePageTemplates();
                break;
        }
    }

    /* END HTML Templating */

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

           generateTemplates(container_id);

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

/*
    var bct_my_ride_container = document.getElementById("bct-app");

    var bct_my_ride_request = new XMLHttpRequest;

    bct_my_ride_request.open('GET', 'bct_my_ride/bct_app.html', true);
    bct_my_ride_request.responseType = 'document';
    bct_my_ride_request.onload = function(e) {

        bct_my_ride_container.innerHTML = "";

        var bct_my_ride_app = e.target.response;
        window.bct_my_ride_app_html =
        bct_my_ride_app.getElementsByTagName("html")[0];

        bct_my_ride_container.appendChild(bct_my_ride_app_html);

    };

    bct_my_ride_request.send();
*/

};