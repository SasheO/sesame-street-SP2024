import requests
import json
import os
from dotenv import load_dotenv
from pathlib import Path
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

test_user_email = "practitioner2.tester@gmail.com"
test_user_password = "12.3rdaskufq24eS"

user_credentials = sign_in_with_email_and_password(test_user_email, test_user_password)
test_data = {"title":"Local Herbs for Migraine",
             "replied_to_id": "KWfNh8S9HlRLENCra0sU",
             "root_forum_id": "KWfNh8S9HlRLENCra0sU",
             "created_at":"02-25-2025", 
             "tags":"herbal,migraine",
             "post_description": "Wow, thanks for sharing! I saw this in school."
             }


test_data['idToken'] = user_credentials['idToken']

response = requests.post("http://localhost:5000/post_forum", json=test_data)
try:
    print(response)
    print(response.json())
except Exception as e:
    print(1, e)