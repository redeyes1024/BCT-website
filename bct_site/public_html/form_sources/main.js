window.onload = function() {

    var login_form_container = document.getElementById("login-form");

    var login_form_request = new XMLHttpRequest;

    login_form_request.open('GET', 'form_sources/bct_login_form.html', true);
    login_form_request.responseType = 'document';
    login_form_request.onload = function(e) {

        login_form_container.innerHTML = "";

        var login_form_template = e.target.response;
        var login_form_inner_container =
        login_form_template.getElementById("login-form-inner-container");

        login_form_container.appendChild(login_form_inner_container);

    };

    login_form_request.send();

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