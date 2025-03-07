import requests
import json



test_cases = {"deleted user": "KWfNh8S9HlRLENCra0sU", 
              "extant user": "z1r1DJJ1RlJYYg9rNrQJ"
              }


forum_ids = ["KWfNh8S9HlRLENCra0sU"]
params = {"forum_id":"KWfNh8S9HlRLENCra0sU"}

for label, forum_id in test_cases.items():
    params["forum_id"] = forum_id
    print(forum_id)
    response = requests.get("http://localhost:5000/forums", params=params)
    try:
        print(response)
        print(response.json())
    except Exception as e:
        print(1, e)
