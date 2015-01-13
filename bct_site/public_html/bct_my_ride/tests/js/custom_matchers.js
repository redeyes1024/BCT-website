(function() {

    /* Top Level Format Checker */

    function topLevelFormatChecker(type, target_obj) {

        var target_is_formatted_properly = true;

        var property_checkers = format_checker_dict[type];

        for (var prop in target_obj) {

            if (!property_checkers[prop](target_obj[prop])) {

                target_is_formatted_properly = false;

                ISR.testing.errors.push("Top level property: " + prop);

                break;

            }

        }

        return target_is_formatted_properly;

    }

    /* Property Format Checkers */

    function checkDescription(desc) {

        var description_is_formatted_properly;

        if (typeof desc === "string") {

            description_is_formatted_properly = true;

        }

        else {

            ISR.testing.errors.push("Description: " + desc);

            description_is_formatted_properly = false;

        }

        return description_is_formatted_properly;

    }

    function checkId(id) {

        var id_is_formatted_properly;

        if (typeof id === "string") {

            id_is_formatted_properly = true;

        }

        else {

            ISR.testing.errors.push("ID: " + id);

            id_is_formatted_properly = false;

        }

        return id_is_formatted_properly;
        
    }

    function checkLatitude(lat) {

        var lat_is_formatted_properly;

        if (lat >= 20 && lat <= 30) {

            lat_is_formatted_properly = true;

        }

        else {

            ISR.testing.errors.push("Latitude: " + lat);

            lat_is_formatted_properly = false;

        }

        return lat_is_formatted_properly;

    }

    function checkLongitude(lng) {

        var lng_is_formatted_properly;

        if (lng >= -90 && lng <= -70) {

            lng_is_formatted_properly = true;

        }

        else {

            ISR.testing.errors.push("Longitude: " + lng);

            lng_is_formatted_properly = false;

        }

        return lng_is_formatted_properly;

    }

    function checkStop(stop) {

        var stop_is_formatted_properly;

        if (typeof stop === "string") {

            stop_is_formatted_properly = true;

        }

        else {

            ISR.testing.errors.push("Stop: " + stop);

            stop_is_formatted_properly = false;

        }

        return stop_is_formatted_properly;
        
    }

    function checkRoute(route) {

        var route_is_formatted_properly;

        if (typeof route === "string") {

            route_is_formatted_properly = true;

        }

        else {

            ISR.testing.errors.push("Route: " + route);

            route_is_formatted_properly = false;

        }

        return route_is_formatted_properly;
        
    }

    function checkRouteOrStopList(route_or_stop_list, type) {

        var routeOrStopChecker;

        if (type === "stops") {

            routeOrStopChecker = checkStop;

        }

        else if (type === "routes") {

            routeOrStopChecker = checkRoute;

        }

        var routes_or_stops_are_formatted_properly = true;

        if (route_or_stop_list.constructor !== Array) {

            routes_or_stops_are_formatted_properly = false;

        }

        else {

            for (var r_or_s=0;r_or_s<route_or_stop_list.length;r_or_s++) {

                if (!routeOrStopChecker(route_or_stop_list[r_or_s])) {

                    routes_or_stops_are_formatted_properly = false;

                    break;

                }

            }

        }

        if (!routes_or_stops_are_formatted_properly) {

            ISR.testing.errors.push(
                "List of " + type + ": " + route_or_stop_list
            ); 

        }

        return routes_or_stops_are_formatted_properly;

    }

    function checkStops(stop_list) {

        return checkRouteOrStopList(stop_list, "stops");

    }

    function checkRoutes(route_list) {

        return checkRouteOrStopList(route_list, "routes");

    }

    function checkLandmarkPOIS(pois) {

        var POIS_formatted_properly = false;

        if (typeof pois === undefined ||
            pois.constructor !== Array) {

            return false;

        }

        for (var poi=0;poi<pois.length;poi++) {

            if (

                checkDescription(pois[poi].Description) &&
                checkId(pois[poi].Id) &&
                checkLatitude(pois[poi].Latitude) &&
                checkLongitude(pois[poi].Longitude) &&
                checkStops(pois[poi].Stops)

            ) {

                POIS_formatted_properly = true;

            }

            return POIS_formatted_properly;

        }

    }

    function checkColor(color) {

        var color_is_formatted_properly;

        if (typeof color === "string") {

            color_is_formatted_properly = true;

        }

        else {

            ISR.testing.errors.push("Color: " + color);

            color_is_formatted_properly = false;

        }

        return color_is_formatted_properly;

    }

    function checkLongName(long_name) {

        var long_name_is_formatted_properly;

        if (typeof long_name === "string") {

            long_name_is_formatted_properly = true;

        }

        else {

            ISR.testing.errors.push("Long Name: " + long_name);

            long_name_is_formatted_properly = false;

        }

        return long_name_is_formatted_properly;


    }

    function checkShortName(short_name) {

        var short_name_is_formatted_properly;

        if (typeof short_name === "string") {

            short_name_is_formatted_properly = true;

        }

        else {

            ISR.testing.errors.push("Short Name: " + short_name);

            short_name_is_formatted_properly = false;

        }

        return short_name_is_formatted_properly;

    }

    function checkRouteShape(route_shape) {

        var route_shape_is_formatted_properly;

        if (typeof route_shape === "string") {

            route_shape_is_formatted_properly = true;

        }

        else {

            ISR.testing.errors.push("Route Shape: " + route_shape);

            route_shape_is_formatted_properly = false;

        }

        return route_shape_is_formatted_properly;

    }

    function checkTextColor(text_color) {

        var text_color_is_formatted_properly;

        if (typeof text_color === "string") {

            text_color_is_formatted_properly = true;

        }

        else {

            ISR.testing.errors.push("Text Color: " + text_color);

            text_color_is_formatted_properly = false;

        }

        return text_color_is_formatted_properly;

    }
    
    function checkInfoType(info_type) {

        var info_type_is_formatted_properly;

        if (typeof info_type === "number") {

            info_type_is_formatted_properly = true;

        }

        else {

            ISR.testing.errors.push("Info Type: " + info_type);

            info_type_is_formatted_properly = false;

        }

        return info_type_is_formatted_properly;

    }

    function checkStopCode(stop_code) {
        
        var stop_code_is_formatted_properly;

        if (typeof stop_code === "string") {

            stop_code_is_formatted_properly = true;

        }

        else {

            ISR.testing.errors.push("Stop code: " + stop_code);

            stop_code_is_formatted_properly = false;

        }

        return stop_code_is_formatted_properly;

    }

    function checkLatLng(lat_lng) {

        var lat_lng_is_formatted_properly;

        if (checkLatitude(lat_lng.Latitude) &&
            checkLongitude(lat_lng.Longitude)) {

            lat_lng_is_formatted_properly = true;

        }

        else {

            ISR.testing.errors.push(
                "LatLng: " +
                    "Latitude: " + lat_lng.Latitude +
                    "Longitude: " + lat_lng.Longitude
            );

            lat_lng_is_formatted_properly = false;

        }

        return lat_lng_is_formatted_properly;

    }

    function checkStopName(stop_name) {

        var stop_name_is_formatted_properly;

        if (typeof stop_name === "string") {

            stop_name_is_formatted_properly = true;

        }

        else {

            ISR.testing.errors.push("Stop Name: " + stop_name);

            stop_name_is_formatted_properly = false;

        }

        return stop_name_is_formatted_properly;

    }

    // Unkown property
    function checkStopParent() {

        return true;

    }

    var format_checker_dict = {

        "landmarks": {

            "Description": checkDescription,
            "Id": checkId,
            "POIS": checkLandmarkPOIS

        },

        "routes": {

            "Color": checkColor,
            "Id": checkId,
            "LName": checkLongName,
            "SName": checkShortName,
            "Shp": checkRouteShape,
            "Stops": checkStops,
            "TextColor": checkTextColor,
            "Type": checkInfoType

        },

        "stops": {

            "Code": checkStopCode,
            "Id": checkId,
            "LatLng": checkLatLng,
            "Name": checkStopName,
            "Routes": checkRoutes,
            "Parent": checkStopParent

        }

    };

    ISR.testing.utils.custom_matchers = {

        toBeFormattedProperly: function() {

            return {

                compare: function(actual, expected) {

                    var result = {};

                    result.pass = topLevelFormatChecker(expected, actual);

                    if (result.pass) {

                        result.message = "Expected " + expected + " object " +
                        "to be formatted properly, and it was.";

                    }

                    else {

                        result.message = "Expected " + expected + " object " +
                        "to be formatted properly";

                    }

                    return result;

                }

            };

        }

    };

})();