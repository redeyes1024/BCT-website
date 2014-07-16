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

};