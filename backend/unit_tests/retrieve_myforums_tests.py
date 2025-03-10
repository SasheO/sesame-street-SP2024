import requests
import json
import os
from dotenv import load_dotenv
from pathlib import Path
dotenv_path = Path('../.env')
load_dotenv(dotenv_path=dotenv_path)

test_cases = {"deleted user": "KWfNh8S9HlRLENCra0sU", 
              "extant user": "z1r1DJJ1RlJYYg9rNrQJ"
              }

def sign_in_with_email_and_password(email, password, return_secure_token=True):
    payload = json.dumps({"email":email, "password":password, "return_secure_token":return_secure_token})
    FIREBASE_WEB_API_KEY = os.getenv("API_KEY")

    rest_api_url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword"

    r = requests.post(rest_api_url,
                  params={"key": FIREBASE_WEB_API_KEY},
                  data=payload)

    return r.json()

test_users = {"good patient": ("tester.person@gmail.com", "12.3rdaskufq24eS"), 
              "good practitioner": ("practitioner2.tester@gmail.com", "12.3rdaskufq24eS"), 
              "user with no replies":("practitioner.tester@gmail.com", "12.3rdaskufq24eS")
              }


for label, (email, password) in test_users.items():
    print(label)
    user_credentials = sign_in_with_email_and_password(email, password)
    params = {"idToken": user_credentials['idToken']}
    response = requests.get("http://localhost:5000/myforums", params=params)
    try:
        print(response)
        print(response.json())
        print(response.json()['forum_posts'])

    except Exception as e:
        print(1, e)
    print()
    print()
    print()
    print()
    print()
    print()

