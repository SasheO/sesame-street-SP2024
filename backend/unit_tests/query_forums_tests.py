import requests
import json

params = {"query":""}


response = requests.get("http://localhost:5000/forums", params=params)
try:
    print(response)
    print(response.json())
except Exception as e:
    print(1, e)