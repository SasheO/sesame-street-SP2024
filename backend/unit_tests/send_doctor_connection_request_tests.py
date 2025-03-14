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

ALERT_LEVEL = {"low": 1, "medium":2, "high": 3}

email = "tester.person@gmail.com"
password = "12.3rdaskufq24eS"
user_credentials = sign_in_with_email_and_password(email, password)

test_data = {
    "practitioner_id": "sl0UdIiiu3ZB9nX4uRbJiFsjxLN2",
    "alert_level": ALERT_LEVEL['high'],
    "symptoms": ["heart palpitations", "shortness of breath"],
    "phone_number": "+12021234567",
    "idToken": user_credentials['idToken']
}

'''
test cases:
2+ valid requests from different users to different doctors
1. not logged in user
2. doctor does not exist
3. missing values in some field
4. non-valid alert level
5. 
'''

response = requests.post("http://localhost:5000/send_doctor_connection_request", json=test_data)
try:
    print(response)
    print(response.json())
except Exception as e:
    print(1, e)
