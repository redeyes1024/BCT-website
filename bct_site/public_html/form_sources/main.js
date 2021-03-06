//Namespace for additional behavior
//Company name
ISR = {};

//General data storage
ISR.data = {};

ISR.data.urls = {

    stops_info: "http://174.94.153.48:7777/TransitApi/Stops/",
    favorites: "http://174.94.153.48:7777/TransitAPI/Favorites"

};

//Stored DOM queries
ISR.dom = {};

ISR.directories = {

    site_roots: {
        local: '',
        remote: 'https://webapps.appdev.cty/BctMyRide/',
        remote_isr: 'http://www.isrtransit.com/files/bct/webapp/',
        active: ''
    },

    paths: {
        none: '',
        form_sources: 'form_sources/',
        active: ''
    }

};

ISR.directories.site_roots.active =
//START DEPLOYMENT_ROOT_TARGET
ISR.directories.site_roots.remote_isr;
//END DEPLOYMENT_ROOT_TARGET

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

ISR.utils.makeAPIRequest = function(
    request_type, doneCallback, additional_data
) {

    var request = new XMLHttpRequest;

    var request_body_obj;

    var api_module_name;

    switch (request_type) {

        case "get_favorites": 

            api_module_name = "favorites";

            request_body_obj = {
                "UserId": 777,
                "Action": "GET"
            };

            break;

        case "delete_favorite": 

            api_module_name = "favorites";

            request_body_obj = {
                UserId: 777,
                Action: "DELETE",
                Favorite: {
                    RecordId: additional_data.record_id
                }
            };

            break;

        case "get_stops_info": 

            api_module_name = "stops_info";

            request_body_obj = { 
                "AgencyId": "BCT"
            };

            break;

        default:
            
            console.log(
                "makeApiRequest: Request type unknown: " + request_type + "."
            );

            break;

    }

    var request_url = ISR.data.urls[api_module_name];

    var request_body = JSON.stringify(request_body_obj);

    request.open("POST", request_url);

    request.setRequestHeader("Accept", "application/json");
    request.setRequestHeader("Content-Type", "application/json");

    request.send(request_body);

    request.onreadystatechange = function() {

    if (typeof doneCallback === "function" &&
        request.readyState === 4 &&
        request.status === 200) {

            doneCallback(request.responseText);

        }

    };

};

ISR.utils.deleteFavoriteRouteStop = function(route, stop, element) {

    var favorites_list =
    ISR.templates.data.profile_page["favorites-container-route-stop-panel"].
    favorites_list;

    for (var i=0;i<favorites_list.length;i++) {

        if (favorites_list[i].RouteId === route &&
            favorites_list[i].StopId === stop) {

            var record_id = favorites_list[i].RecordId;

        }

    }

    ISR.utils.styling.functions.toggleFavoritePanelDeleteModal(element);

    var doneCallback = function(response_text) {

        var response = JSON.parse(response_text);

        if (response.Type !== "success") {

            console.log("Error deleting favorite: " + response.Message);

            return false;

        }

        favorites_list.splice(i, 1);

        element.parentNode.parentNode.parentNode.removeChild(
            element.parentNode.parentNode
        );

    };

    ISR.utils.makeAPIRequest(
        "delete_favorite",
        doneCallback,
        { record_id: record_id }
    );

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

//    else if(window.location.toString().
//            match(/\/default.aspx/)) {
//
//        location_prefix = "default.aspx";
//
//    }

//    else if(window.location.toString().
//            match(/\/myride_deployment_sample.html/)) {
//
//        location_prefix = "myride_deployment_sample.html";
//
//    }

    window.location = location_prefix + "#bctappindex?route=" + route +
    "&" + "stop=" + stop;

};

ISR.utils.downloadFavoritesData = function() {

    var doneCallback = function(response_text) {

        ISR.utils.styling.functions.toggleFavoritesContainerLoadingModal();

        ISR.templates.data.
        profile_page["favorites-container-route-stop-panel"].
        favorites_list = JSON.parse(response_text);

        ISR.utils.templating.addFavoriteRouteStopPanelsToContainer();

    };

    ISR.utils.makeAPIRequest(
        "get_favorites",
        doneCallback
    );

};

ISR.utils.createHashMapWithStopsInfoList = function(stops_info_JSON) {

    var stops_info = JSON.parse(stops_info_JSON);

    ISR.data.stops_info = {};

    for (var i=0;i<stops_info.length;i++) {

        ISR.data.stops_info[stops_info[i].Id] = {
            Name: stops_info[i].Name,
            Code: stops_info[i].Code
        };

    }

};

ISR.utils.downloadStopsInfo = function() {

    if (localStorage && localStorage.stop_data) {

        ISR.utils.createHashMapWithStopsInfoList(localStorage.stop_data);

        ISR.utils.downloadFavoritesData();

        return true;

    }

    var doneCallback = function(response_text) {

        if (localStorage) {
            localStorage.setItem('stop_data', response_text);
        }

        ISR.utils.createHashMapWithStopsInfoList(response_text);

        ISR.utils.downloadFavoritesData();

    };

    ISR.utils.makeAPIRequest(
        "get_stops_info",
        doneCallback
    );

};

//Utility functions run successively after module is loaded
ISR.utils.init = {};

//General init functions
ISR.utils.init.general = {};

ISR.utils.init.general.startingDomQueries = function() {

    /* Modules */

    
    ISR.dom.modals = {};

    ISR.dom.modals["favorites-container-loading-modal"] = 
    document.getElementById(
        "favorites-container-loading-modal"
    );

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

ISR.utils.styling.functions.toggleFavoritesContainerLoadingModal = function() {

    var target_modal = ISR.dom.modals["favorites-container-loading-modal"];

    if (target_modal.classList.contains("module-hidden")) {

        target_modal.classList.remove("module-hidden");

    }

    else {

        target_modal.classList.add("module-hidden");

    }

};

ISR.utils.styling.functions.toggleFavoritePanelDeleteModal = function(panel) {

    var target_modal = panel.parentNode.children[0];

    if (target_modal.classList.contains("module-hidden")) {

        target_modal.classList.remove("module-hidden");

    }

    else {

        target_modal.classList.add("module-hidden");

    }

};

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

    ISR.utils.downloadStopsInfo();

};