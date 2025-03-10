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

test_user_email = "tester.person@gmail.com"
test_user_password = "12.3rdaskufq24eS"
user_credentials = sign_in_with_email_and_password(test_user_email, test_user_password)
params = {"idToken": user_credentials['idToken']}

response = requests.get("http://localhost:5000/myforums", params=params)
try:
    print(response)
    print(response.json())
    print(response.json()['forum_posts'])

except Exception as e:
    print(1, e)
