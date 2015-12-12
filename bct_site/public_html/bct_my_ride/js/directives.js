var BCTAppDirectives = angular.module('BCTAppDirectives', []);

BCTAppDirectives.directive('iconLegendOverlay', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/icon_legend.html'
    };
}]);

BCTAppDirectives.directive('bctMyRideTopLevelOverlays', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/main.html'
    };
}]);

BCTAppDirectives.directive('scheduleMap', [ 'googleMapsUtilities', 'marker_icon_options',
'base_marker_sizes', 'clusterer_options', '$q',

function(googleMapsUtilities, marker_icon_options, base_marker_sizes,
clusterer_options, $q) {

    function link(scope) {

        myride.dom_q.map.cont = document.getElementById("map-canvas");
        googleMapsUtilities.mapMaker(myride.dom_q.map.cont);
        
        googleMapsUtilities.displayBikes();
     
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

                var clicked_point_label =
                myride.dom_q.map.overlays.open_info[0].marker_label;

                if (clicked_point_label) {

                    schedule_map_points[clicked_point_label].marker.setIcon(
                        marker_icon_options.schedule_map.mouseover
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

                    if ((!scope.top_scope.nearest_map_stops_is_open &&
                        !scope.top_scope.schedule_map_is_open) ||
                        scope.top_scope.trip_planner_is_open) {

                        return true;

                    }

                    marker_icon_options.schedule_map.default.scale =
                    getNewMarkerIconProperty("default", "scale");

                    marker_icon_options.schedule_map.mouseover.scale =
                    getNewMarkerIconProperty("mouseover", "scale");

                    marker_icon_options.schedule_map.default.strokeWeight =
                    getNewMarkerIconProperty("default", "strokeWeight");

                    marker_icon_options.schedule_map.mouseover.strokeWeight =
                    getNewMarkerIconProperty("mouseover", "strokeWeight");

                    var cur_zoom = myride.dom_q.map.inst.getZoom();

                    var map_ready_deferred = $q.defer();

                    google.maps.event.addListenerOnce(
                        myride.dom_q.map.inst,
                        'idle',
                        function() {

                            if (scope.top_scope.nearest_map_stops_is_open ||
                                cur_zoom > clusterer_options.maxZoom) {

                                resetMarkerSizes();

                            }

                            map_ready_deferred.resolve();

                        }
                    );

                    if (scope.top_scope.schedule_map_is_open &&
                        !!myride.dom_q.map.overlays.open_info[0].hide) {

                        var cur_info_window_hidden =
                        myride.dom_q.map.overlays.open_info[0].isHidden_;

                        if (cur_zoom <= clusterer_options.maxZoom) {

                            if (!myride.dom_q.map.overlays.
                                open_info_hovered[0].is_dummy) {

                                map_ready_deferred.promise.then(function() {

                                    myride.dom_q.map.overlays.
                                    open_info_hovered[0].close();

                                    myride.dom_q.map.overlays.
                                    open_info_hovered.pop();

                                    googleMapsUtilities.
                                    createDummyInfoWindow("points", true);

                                });

                            }

                            if (!cur_info_window_hidden) {

                                myride.dom_q.map.overlays.open_info[0].hide();

                            }

                        }

                        else if (cur_info_window_hidden) {

                            myride.dom_q.map.overlays.open_info[0].show();

                        }

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

BCTAppDirectives.directive('mainLoadingModal', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/main_loading_modal.html'
    };
}]);

BCTAppDirectives.directive('routeAlertOverlay', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/route_alert_overlay.html'
    };
}]);

BCTAppDirectives.directive('scheduleMapOverlay', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/schedule_map_overlay.html'
    };
}]);

BCTAppDirectives.directive('tripPlanner', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/trip_planner.html'
    };
}]);

BCTAppDirectives.directive('tripPlannerItinerarySelector', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/trip_planner_itinerary_selector.html'
    };
}]);

BCTAppDirectives.directive('subPanelRoutes', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/sub_panel_routes.html'
    };
}]);

BCTAppDirectives.directive('subPanelStops', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/sub_panel_stops.html'
    };
}]);

BCTAppDirectives.directive('subPanelLandmarks', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/sub_panel_landmarks.html'
    };
}]);

BCTAppDirectives.directive('routeResultPanel', [ 'linkFunctions', 
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

BCTAppDirectives.directive('stopResultPanel', [ 'linkFunctions',
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

BCTAppDirectives.directive('landmarkResultPanel', [ 'linkFunctions', 
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

BCTAppDirectives.directive('tripPlannerDialog', [ function() {

    var template =
    '<div id="trip-planner-dialog" ng-class="planner_dialog_styles">' +
        '{{ geocoder_error_dialog_text }}' +
    '<div>';

    return {
        restrict: 'E',
        template: template
    };

}]);

BCTAppDirectives.directive('nearestStopsMapDialog', [ function() {

    var template =
    '<div id="nearest-stops-map-dialog" ' +
    'ng-class="nearest_stops_map_error_dialog_styles">' +
        '{{ nearest_stops_map_error_dialog_text }}' +
    '<div>';

    return {
        restrict: 'E',
        template: template
    };

}]);

BCTAppDirectives.directive('scheduleMapErrorDialog', [ function() {

    var template =
    '<div id="schedule-map-error-dialog" ' + 
    'ng-class="schedule_map_error_dialog_styles" ' +
        '{{ schedule_map_error_dialog_text }}' +
    '<div>';

    return {
        restrict: 'E',
        template: template
    };

}]);

BCTAppDirectives.directive('fullScheduleErrorDialog', [ function() {

    var template =
    '<div id="full-schedule-error-dialog" ' + 
    'ng-class="full_schedule_error_dialog_styles" ' +
        '{{ full_schedule_error_dialog_text }}' +
    '<div>';

    return {
        restrict: 'E',
        template: template
    };

}]);

BCTAppDirectives.directive('plannerOptionBar', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/planner_option_bar.html'
    };
}]);

BCTAppDirectives.directive('nearestStops', [ function() {
    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/nearest_stops.html'
    };
}]);

BCTAppDirectives.directive('mobileFilterIcons', [ 'templateGenerators',
function(templateGenerators) {

    var template = templateGenerators.createFilterIconBarTemplate("mobile");

    return {
        restrict: 'E',
        template: template
    };

}]);

BCTAppDirectives.directive('inlineFilterIcons', [ 'templateGenerators',
function(templateGenerators) {

    var template = templateGenerators.createFilterIconBarTemplate("inline");

    return {
        restrict: 'E',
        template: template
    };

}]);

BCTAppDirectives.directive('tripPlannerNavigationBar', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/trip_planner_navigation_bar.html'
    };

}]);

BCTAppDirectives.directive('scheduleMapNavigationBar', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/schedule_map_navigation_bar.html'
    };

}]);

BCTAppDirectives.directive('tripPlannerStep', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/trip_planner_step.html'
    };

}]);

BCTAppDirectives.directive('globalAlertsHeader', [ function() {

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

BCTAppDirectives.directive('busSvg', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/svg/bus.html'
    };

}]);

BCTAppDirectives.directive('destSvg', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/svg/dest.html'
    };

}]);

BCTAppDirectives.directive('walkingSvg', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/svg/walking.html'
    };

}]);

BCTAppDirectives.directive('tripPlannerIcon', [ '$compile', function($compile) {

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

BCTAppDirectives.directive('nearestMapStopsInfoContainer', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/nearest_map_stops_info_container.html'
    };

}]);

BCTAppDirectives.directive('fullSchedulePanel', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/full_schedule_panel.html'
    };

}]);

BCTAppDirectives.directive('fullSchedulePanelWithDatepicker', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/full_schedule_panel_with_datepicker.html'
    };

}]);

BCTAppDirectives.directive('recentlyViewedItems', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/recently_viewed_items.html'
    };

}]);

BCTAppDirectives.directive('subPanelRecentTrip', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/sub_panel_recent_trip.html'
    };

}]);

BCTAppDirectives.directive('subPanelRecentRouteStop', [ function() {

    return {
        restrict: 'E',
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/sub_panel_recent_route_stop.html'
    };

}]);

BCTAppDirectives.directive('topSearchBar', [ '$timeout', function($timeout) {

    function link(scope) {

        var top_level_scope = scope.$parent.top_scope;

        if (scope.module === "index_page") {

            scope.input_id = "route-stop-search-index-input";

            scope.submitRouteStopSearchWrapper = function() {

                scope.top_scope.changeURLHash(
                    'routeschedules', 'schedule_search'
                );

                top_level_scope.submitRouteStopSearch('click', 'index');

            };

            scope.showAllRoutesWrapper = function() {

                top_level_scope.showAllRoutes('index');

            };

            $timeout(function() {

                myride.dom_q.inputs.elements.index_search_input = document.
                getElementById("route-stop-search-index-input");

            }, 0);

        }

        else if (scope.module === "search_results_page") {

            scope.input_id = "route-stop-search-input";

            scope.submitRouteStopSearchWrapper = function() {

                top_level_scope.submitRouteStopSearch('click', 'results');

            };

            scope.showAllRoutesWrapper = function() {

                top_level_scope.showAllRoutes('schedule_search');

            };

            $timeout(function() {
                
                myride.dom_q.inputs.elements.rs_search_input = document.
                getElementById("route-stop-search-input");

                myride.dom_q.inputs.elements.rs_search_input.
                value = top_level_scope.query_data.schedule_search;

            }, 0);

        }

    }

    return {
        restrict: 'E',
        scope: {
            module: '@'
        },
        link: link,
        templateUrl: window.myride.directories.site_roots.active +
        window.myride.directories.paths.active +
        'partials/top_search_bar.html'
    };

}]);