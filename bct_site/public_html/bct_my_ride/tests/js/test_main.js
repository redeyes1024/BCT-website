'use strict';

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

};

jasmine.DEFAULT_TIMEOUT_INTERVAL = 35000;