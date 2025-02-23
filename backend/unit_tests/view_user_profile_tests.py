import requests
from dotenv import load_dotenv
from pathlib import Path
import os
import time
import json

dotenv_path = Path('../.env')
load_dotenv(dotenv_path=dotenv_path)

def sign_in_with_email_and_password(email, password, return_secure_token=True):
    payload = json.dumps({"email":email, "password":password, "return_secure_token":return_secure_token})
    FIREBASE_WEB_API_KEY = os.getenv("API_KEY")
    rest_api_url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword"

    r = requests.post(rest_api_url,
                  params={"key": FIREBASE_WEB_API_KEY},
                  data=payload)

    return r.json()

users = {"tester.person@gmail.com":"12.3rdaskufq24eS", 
         "practitioner2.tester@gmail.com":"12.3rdaskufq24eS",
         "testuseremail12@gmail.com":"12.3rdaskufq24eS",
         "testuseremail9@gmail.com":"12.3rdaskufq24eS",
         "practitioner4.tester@gmail.com":"12.3rdaskufq24eS"
         }

for email, password in users.items():
    user_credentials = sign_in_with_email_and_password(email, password)
    test_data = {"idToken":user_credentials['idToken']}

    response = requests.post("http://localhost:5000/user_profile", json=test_data)
    try:
        print(response)
        print(response.json())
        print(1)
    except Exception as e:
        print(e)
    time.sleep(1)