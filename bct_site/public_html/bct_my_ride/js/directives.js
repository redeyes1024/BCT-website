var BCTAppDirectives = angular.module('BCTAppDirectives', []);

BCTApp.directive('iconLegendOverlay', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/icon_legend.html'
    };
}]);

BCTApp.directive('bctMyRideTopLevelOverlays', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/main.html'
    };
}]);

BCTApp.directive('scheduleMap', [ 'googleMapsUtilities', 'marker_icon_options',
'base_marker_sizes', 'clusterer_options',

function(googleMapsUtilities, marker_icon_options, base_marker_sizes,
clusterer_options) {

    function link(scope) {

        myride.dom_q.map.cont = document.getElementById("map-canvas");
        googleMapsUtilities.mapMaker(myride.dom_q.map.cont);

        function getNewMarkerIconProperty(event, prop) {

            var base_size = base_marker_sizes[event][prop];

            var cur_zoom = myride.dom_q.map.inst.getZoom();

            var size_multiplier = cur_zoom / base_marker_sizes.scaling_weight;

            var new_size = size_multiplier * base_size;

            return new_size;

        }

        function resetMarkerSizes() {

            if (scope.top_scope.show_schedule_result_top_bar) {

                var schedule_map_points =
                myride.dom_q.map.overlays.points;

                for (var point in schedule_map_points) {

                    schedule_map_points[point].marker.setIcon(
                        marker_icon_options.schedule_map.default
                    );

                }

            }

            else if (scope.top_scope.show_nearest_map_stops_title) {

                var nearest_map_points =
                myride.dom_q.map.overlays.nearest_map_points;

                for (var point in nearest_map_points) {

                    if (!nearest_map_points[point].clicked) {

                        nearest_map_points[point].marker.setIcon(
                            marker_icon_options.schedule_map.default
                        );

                    }

                }

            }

        }

        scope.top_scope.$evalAsync(function() {

            scope.top_scope.schedule_map_zoom_out_listener =
            google.maps.event.addListener(

                myride.dom_q.map.inst,
                'zoom_changed',
                function() {

                    marker_icon_options.schedule_map.default.scale =
                    getNewMarkerIconProperty("default", "scale");

                    marker_icon_options.schedule_map.mouseover.scale =
                    getNewMarkerIconProperty("mouseover", "scale");

                    marker_icon_options.schedule_map.default.strokeWeight =
                    getNewMarkerIconProperty("default", "strokeWeight");

                    marker_icon_options.schedule_map.mouseover.strokeWeight =
                    getNewMarkerIconProperty("mouseover", "strokeWeight");

                    if (scope.top_scope.show_schedule_result_top_bar ||
                        scope.top_scope.show_nearest_map_stops_title) {

                        resetMarkerSizes();

                        if (scope.top_scope.show_schedule_result_top_bar &&
                            !!myride.dom_q.map.overlays.open_info[0].hide) {

                            var cur_info_window_hidden =
                            myride.dom_q.map.overlays.open_info[0].isHidden_;

                            if (myride.dom_q.map.inst.getZoom() <=
                                clusterer_options.maxZoom) {

                                if (!myride.dom_q.map.overlays.
                                    open_info_hovered[0].is_dummy) {

                                    google.maps.event.addListenerOnce(

                                        myride.dom_q.map.inst,
                                        'idle',
                                        function() {

                                            myride.dom_q.map.overlays.
                                            open_info_hovered[0].close();

                                            myride.dom_q.map.overlays.
                                            open_info_hovered.pop();

                                            googleMapsUtilities.
                                            createDummyInfoWindow(
                                                "points", true
                                            );

                                    });

                                }

                                if (!cur_info_window_hidden) {

                                    myride.dom_q.map.overlays.
                                    open_info[0].hide();

                                }

                            }

                            else if (cur_info_window_hidden) {

                                myride.dom_q.map.overlays.open_info[0].show();

                            }

                        }

                    }

                    else if (scope.top_scope.show_trip_planner_title) {
     
                        return true;

                    }

                    else {

                        google.maps.event.addListenerOnce(

                            myride.dom_q.map.inst,
                            'idle',
                            function() {

                                resetMarkerSizes();

                            }

                        );

                    }

                }

            );

        });

    }

    return {

        link: link,
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/schedule_map.html'

    };

}]);

BCTApp.directive('mainLoadingModal', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/main_loading_modal.html'
    };
}]);

BCTApp.directive('routeAlertOverlay', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/route_alert_overlay.html'
    };
}]);

BCTApp.directive('scheduleMapOverlay', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/schedule_map_overlay.html'
    };
}]);

BCTApp.directive('tripPlanner', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/trip_planner.html'
    };
}]);

BCTApp.directive('tripPlannerItinerarySelector', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/trip_planner_itinerary_selector.html'
    };
}]);

BCTApp.directive('subPanelRoutes', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/sub_panel_routes.html'
    };
}]);

BCTApp.directive('subPanelStops', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/sub_panel_stops.html'
    };
}]);

BCTApp.directive('subPanelLandmarks', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/sub_panel_landmarks.html'
    };
}]);

BCTApp.directive('routeResultPanel', [ 'linkFunctions', 
function(linkFunctions) {

    function link(scope, element) {

        var type = "route";

        linkFunctions.dynamicPanelContentsLoader(
            scope, element, type
        );
    }

    return {
        link: link,
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/route_result_panel.html'
    };
}]);

BCTApp.directive('stopResultPanel', [ 'linkFunctions',
function(linkFunctions) {

    function link(scope, element) {

        var type = "stop";

        linkFunctions.dynamicPanelContentsLoader(
            scope, element, type
        );

    }

    return {
        link: link,
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/stop_result_panel.html'
    };

}]);

BCTApp.directive('landmarkResultPanel', [ 'linkFunctions', 
function(linkFunctions) {

    function link(scope, element) {

        var type = "landmark";

        linkFunctions.dynamicPanelContentsLoader(
            scope, element, type
        );
    }

    return {
        link: link,
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/landmark_result_panel.html'
    };
}]);

BCTApp.directive('tripPlannerDialog', [ function() {

    var template =
        '<div id="trip-planner-dialog" ng-class="planner_dialog_styles"' +
            'ng-show="show_geocoder_error_dialog">' +
            '{{ geocoder_error_dialog_text }}' +
        '<div>';

    return {
        restrict: 'E',
        template: template
    };

}]);

BCTApp.directive('scheduleMapErrorDialog', [ function() {

    var template =
        '<div id="schedule-map-error-dialog" ' + 
        'ng-class="schedule_map_error_dialog_styles" ' +
            'ng-show="show_schedule_map_error_dialog">' +
            '{{ schedule_map_error_dialog_text }}' +
        '<div>';

    return {
        restrict: 'E',
        template: template
    };

}]);

BCTApp.directive('fullScheduleErrorDialog', [ function() {

    var template =
        '<div id="full-schedule-error-dialog" ' + 
        'ng-class="full_schedule_error_dialog_styles" ' +
            'ng-show="show_full_schedule_error_dialog">' +
            '{{ full_schedule_error_dialog_text }}' +
        '<div>';

    return {
        restrict: 'E',
        template: template
    };

}]);

BCTApp.directive('plannerOptionBar', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/planner_option_bar.html'
    };
}]);

BCTApp.directive('nearestStops', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/nearest_stops.html'
    };
}]);

BCTApp.directive('mobileFilterIcons', [ 'templateGenerators',
function(templateGenerators) {

    var template = templateGenerators.createFilterIconBarTemplate("mobile");

    return {
        restrict: 'E',
        template: template
    };

}]);

BCTApp.directive('inlineFilterIcons', [ 'templateGenerators',
function(templateGenerators) {

    var template = templateGenerators.createFilterIconBarTemplate("inline");

    return {
        restrict: 'E',
        template: template
    };

}]);

BCTApp.directive('tripPlannerNavigationBar', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/trip_planner_navigation_bar.html'
    };

}]);

BCTApp.directive('scheduleMapNavigationBar', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/schedule_map_navigation_bar.html'
    };

}]);

BCTApp.directive('tripPlannerStep', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/trip_planner_step.html'
    };

}]);

BCTApp.directive('globalAlertsHeader', [ function() {

    function link(scope, element) {

        element.ready(function() {
            
            myride.dom_q.scrolling_alerts.global =
            document.getElementById("global-alert-header-message");

            scope.global_alerts_ready_deferred.resolve();

        });

    }

    return {
        link: link,
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/global_alerts_header.html'
    };

}]);

BCTApp.directive('busSvg', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/svg/bus.html'
    };

}]);

BCTApp.directive('destSvg', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/svg/dest.html'
    };

}]);

BCTApp.directive('walkingSvg', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/svg/walking.html'
    };

}]);

BCTApp.directive('tripPlannerIcon', [ '$compile', function($compile) {

    function link(scope, element) {

        var cur_mode = scope.leg.modeField;

        var trip_planner_icon_html = "";

        switch (cur_mode) {

            case "WALK":

              trip_planner_icon_html = "<walking-svg></walking-svg>";

            break;

            case "BUS":

                trip_planner_icon_html = "<bus-svg></bus-svg>";

            break;

            case "DEST":

                trip_planner_icon_html = "<dest-svg></dest-svg>";

            break;

        }

        element.append($compile(trip_planner_icon_html)(scope));

    }

    return {
        restrict: 'E',
        link: link
    };

}]);

BCTApp.directive('nearestMapStopsInfoContainer', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/nearest_map_stops_info_container.html'
    };

}]);

BCTApp.directive('fullSchedulePanel', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/full_schedule_panel.html'
    };

}]);

BCTApp.directive('fullSchedulePanelWithDatepicker', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/full_schedule_panel_with_datepicker.html'
    };

}]);

BCTApp.directive('recentlyViewedItems', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/recently_viewed_items.html'
    };

}]);

BCTApp.directive('subPanelRecentTrip', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/sub_panel_recent_trip.html'
    };

}]);

BCTApp.directive('subPanelRecentRouteStop', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/sub_panel_recent_route_stop.html'
    };

}]);