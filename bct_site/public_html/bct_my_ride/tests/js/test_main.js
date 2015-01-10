var ISR = {
    testing: {
        utils: {} 
    }
};

ISR.testing.utils.POSTRequestJSONFromAPI = function(
    request_url, request_body_obj, doneCallback
) {

    var request = new XMLHttpRequest;

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

ISR.testing.errors = [];

ISR.testing.utils.reportErrorsIfExist = function() {

    var error_count = ISR.testing.errors.length;

    if (error_count < 1) { return true; }

    console.log("Anomalous data:");

    for (var e=0;e<error_count;e++) {

        console.log(ISR.testing.errors[e]);

    }

}

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

    function checkStops(stops) {

        var stops_are_formatted_properly = true;

        if (stops.constructor !== Array) {

            stops_are_formatted_properly = false;

        }

        else {

            for (var bstop=0;bstop<stops.length;bstop++) {

                if (typeof stops[bstop] !== "string") {

                    stops_are_formatted_properly = false;

                    break;

                }

            }

        }

        if (!stops_are_formatted_properly) {

            ISR.testing.errors.push("Stops List: " + stops); 

        }

        return stops_are_formatted_properly;

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

        }

    };

    ISR.testing.utils.custom_matchers = {

        toBeFormattedProperly: function() {

            return {

                compare: function(actual, expected) {

                    var result = {};

                    result.pass = topLevelFormatChecker(actual, expected);

                    if (result.pass) {

                        result.message = "Expected " + expected + " object " +
                        "to be formatted properly, and it was.";

                    }

                    else {

                        result.message = "Expected " + expected + " object " +
                        "to be formatted properly: " + JSON.stringify(actual);

                    }

                    return result;

                }

            };

        }

    };

})();