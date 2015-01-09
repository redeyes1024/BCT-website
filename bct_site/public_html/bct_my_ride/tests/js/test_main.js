ISR = { utils: {} };

ISR.utils.POSTRequestJSONFromAPI = function(
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