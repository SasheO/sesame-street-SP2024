import requests
import json



test_cases = {"find most recent posts": "", 
              "search title": "local", 
              "search tags": "herbal",
              "search content": "ginger"}

params = {"query":""}

for label, query in test_cases.items():
    params['query'] = query
    response = requests.get("http://localhost:5000/forums", params=params)
    try:
        print(response)
        print(response.json())
    except Exception as e:
        print(1, e)
    break # REMOVE WHEN YOU WANT TO TEST MORE