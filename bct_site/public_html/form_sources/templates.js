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

            '[ID #{{ ROUTE_STOP_PANEL_STOP_CODE }}]' + ' - ' +
            '{{ ROUTE_STOP_PANEL_STOP_NAME }}' +

        '</div>' +

        '<div class="favorites-container-route-stop-panel-item ' +
        'favorites-container-route-stop-panel-delete ' +
        'link-icon no-highlight">' +

            '<div class="favorites-container-route-stop-panel-delete-modal ' +
            'module-hidden">' +

                '<div class="' +
                    'favorites-container-route-stop-panel-delete-modal'+
                    '-spinner"' +
                '>' +

                    '<i class="fa fa-spinner fa-spin"></i>' +

                '</div>' +

            '</div>' +

            '<div class="favorites-container-route-stop-panel-delete-icon ' +
            'ptr "' +
            'onclick="ISR.utils.deleteFavoriteRouteStop(' +
                '\'{{ ROUTE_STOP_PANEL_ROUTE }}\', ' + 
                '\'{{ ROUTE_STOP_PANEL_STOP_ID }}\', ' +
                'this' +
            ');">' +

                '<i class="fa fa-times-circle"></i>' +

            '</div>' +

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