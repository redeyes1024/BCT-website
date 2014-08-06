window.onload = function() {

    function runModuleContentTemplateGenerators() {

        var init_functions = ISR.utils.init;

        for (func in init_functions) {
            init_functions[func]();
        }

    }

    //Module Importer
    function getAndAppendModuleHTML(container_id, filename, append_target) {

        var template_container = document.getElementById(container_id);

        if (!template_container) {
            return true;
        }

        var template_request = new XMLHttpRequest;

        var url = 'form_sources/' + filename;

        template_request.open('GET', url, true);
        template_request.responseType = 'document';
        template_request.onload = function(e) {

            template_container.innerHTML = "";

            var template = e.target.response;
            var target_container =
            template.getElementById(append_target);

           template_container.appendChild(target_container);

           runModuleContentTemplateGenerators();

        };

        template_request.send();

    };

    getAndAppendModuleHTML(
        'bct-profile-page',
        'bct_profile_page_template.html',
        'profile-container'
    );

};