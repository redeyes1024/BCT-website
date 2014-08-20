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
ISR.directories.site_roots.local;

ISR.directories.paths.active =
ISR.directories.paths.form_sources;

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

    ISR.utils.styling.highlightHeaderPanel(selected_panel_name);
    ISR.utils.styling.switchModule(selected_module_name);

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

ISR.utils.colorSelectedTimeRange = function(element) {

    var panel_darkened = "alerts-container-time-range-selected";

    var time_ranges = ISR.dom.post_templating["alerts-container-time-range"];

    for (var i=0;i<time_ranges.length;i++) {

        time_ranges[i].classList.add(panel_darkened);

    }

    element.parentNode.parentNode.classList.remove(panel_darkened);

};

//Utility functions run successively after module is loaded
ISR.utils.init = {};

//General init functions
ISR.utils.init.general = {};

ISR.utils.init.general.startingDomQueries = function() {

    /* Modules */

    ISR.dom.modules = {};

    ISR.dom.modules.favorites_module =
    document.getElementById("favorites-container");

    ISR.dom.modules.alerts_module =
    document.getElementById("alerts-container");

    /* Header Panels */

    ISR.dom.header_panels = {};

    var header_panels =
    document.getElementsByClassName("profile-page-section-title-sub-container");

    ISR.dom.header_panels.favorites_page_button = header_panels[0];
    
    ISR.dom.header_panels.alerts_page_button = header_panels[1];

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

ISR.utils.styling.config.header_deactivated_styles = {

    favorites_page_button: 
    "profile-page-section-title-sub-container-deactivated-left",

    alerts_page_button: 
    "profile-page-section-title-sub-container-deactivated-right"

};

ISR.utils.styling.highlightHeaderPanel = function(selected_panel_name) {

    for (var cur_panel_name in ISR.dom.header_panels) {

        var current_panel = ISR.dom.header_panels[cur_panel_name];

        var panel_deactivated_style = ISR.utils.styling.config.
        header_deactivated_styles[cur_panel_name];

        if (cur_panel_name === selected_panel_name) {

            current_panel.classList.remove(panel_deactivated_style);

        }

        else {

            current_panel.classList.add(panel_deactivated_style);

        }

    }


};

ISR.utils.styling.switchModule = function(selected_module_name) {

    for (var cur_module_name in ISR.dom.modules) {

        var cur_module = ISR.dom.modules[cur_module_name];

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