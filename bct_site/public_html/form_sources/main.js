window.onload = function() {

    function getAndAppendModuleHTML(container_id, filename, append_target) {

        var template_container = document.getElementById(container_id);

        if (!template_container) {
            return true;
        }

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
        'bct-profile-page',
        'bct_profile_page.html',
        'profile-container'
    );

};