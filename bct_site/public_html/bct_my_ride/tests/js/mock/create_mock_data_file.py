import urllib.request
import json

request_dict = {

    "stops": {

        "url": "http://174.94.153.48:7777/TransitApi/Stops/",

        "data": {"AgencyId":"BCT"}

    }

}

request_url = request_dict["stops"]["url"]
request_data_b = urllib.parse.urlencode(request_dict["stops"]["data"]).encode()

JSON_data = json.loads(
    urllib.request.urlopen(
        url=request_url,
        data=request_data_b
    ).read().decode()
)

with open("json_file", "w") as json_file:

    json_file.write(json.dumps(JSON_data, indent=4))