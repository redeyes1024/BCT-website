//Container for all base HTML template strings
ISR.templates = {};

ISR.templates.login_form = {};

ISR.templates.profile_page = {};

ISR.templates.profile_page["favorites-container-agency-bar-item"] = '' +

    '<span class="favorites-container-agency-bar-item ptr no-highlight" ' +
    'onclick="ISR.utils.changeAgency(\'{{ AGENCY_NAME }}\');">' +

        '<img class="favorites-container-agency-bar-item-image" ' +
        'src="{{ PATH_TO_AGENCY_ICON }}">' +

    '</span>';

ISR.templates.profile_page["favorite-route-stop-panel"] = '' +

    '<div class="favorite-route-stop-panel">' +

        '<div class="favorite-route-stop-panel-property-container">' +

            '<span class="favorite-route-stop-panel-property ' +
            'favorite-route-stop-panel-route">' +

                '<span class="favorite-route-stop-panel-property-name">' +
                    'Route:' +
                '</span>' +

                '<span class="favorite-route-stop-panel-property-content">' +
                    '{{ ROUTE_STOP_PANEL_ROUTE }}' +
                '</span>' +

            '</span>' +

            '<span class="favorite-route-stop-panel-property ' +
            'favorite-route-stop-panel-stop">' +

                '<span class="favorite-route-stop-panel-property-name">' +
                    'Stop:' +
                '</span>' +

                '<span class="favorite-route-stop-panel-property-content">' +
                    '{{ ROUTE_STOP_PANEL_STOP_ID }}' + ' - ' +
                    '{{ ROUTE_STOP_PANEL_STOP_NAME }}' +
                '</span>' +

            '</span>' +

        '</div>' +

        '<span class="favorite-route-stop-panel-property ' +
        'favorite-route-stop-panel-myride-link">' +

            '<a href="#" onclick="ISR.utils.goToMyRideSchedule(' +
                '\'{{ ROUTE_STOP_PANEL_ROUTE }}\', ' + 
                '\'{{ ROUTE_STOP_PANEL_STOP_ID }}\'' +
            ');">' + 
                'Search for stop in My Ride' +
            '</a>' +

        '</span>' +

        '<span class="favorite-route-stop-panel-delete-button ' +
        'link-icon no-highlight ptr"' + 
        'onclick="ISR.utils.deleteFavoriteRouteStop(' +
            '\'{{ ROUTE_STOP_PANEL_ROUTE }}\', ' + 
            '\'{{ ROUTE_STOP_PANEL_STOP_ID }}\', ' +
            'this' +
        ');">' + 

            '<i class="fa fa-times-circle"></i>' +

        '</span>' +

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