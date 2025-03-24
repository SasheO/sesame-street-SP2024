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

test_datas = {
    "good request 1": {
    "practitioner_id": "sl0UdIiiu3ZB9nX4uRbJiFsjxLN2",
    "alert_level": ALERT_LEVEL['high'],
    "symptoms": ["heart palpitations", "shortness of breath"],
    "phone_number": "12021234567",
    "idToken": user_credentials['idToken']
    },
    "practitioner does not exist": {
    "practitioner_id": "arwoiuw40asndvwi9e",
    "alert_level": ALERT_LEVEL['high'],
    "symptoms": ["heart palpitations", "shortness of breath"],
    "phone_number": "12021234567",
    "idToken": user_credentials['idToken']
    },
    "not logged in": {
    "practitioner_id": "sl0UdIiiu3ZB9nX4uRbJiFsjxLN2",
    "alert_level": ALERT_LEVEL['high'],
    "symptoms": ["heart palpitations", "shortness of breath"],
    "phone_number": "12021234567",
    "idToken": "sadfwdf"
    },
    "not logged in 2 (no token given)": {
    "practitioner_id": "sl0UdIiiu3ZB9nX4uRbJiFsjxLN2",
    "alert_level": ALERT_LEVEL['high'],
    "symptoms": ["heart palpitations", "shortness of breath"],
    "phone_number": "12021234567"
    },
    "good request 2": {
    "practitioner_id": "eDeef1VPrHNboouF7VTAc68CiEA3",
    "alert_level": ALERT_LEVEL['high'],
    "symptoms": ["I am tired all the time. i don't know why"],
    "phone_number": "12021225569",
    "idToken": user_credentials['idToken']
    },
    "empty symptoms": {
    "practitioner_id": "eDeef1VPrHNboouF7VTAc68CiEA3",
    "alert_level": ALERT_LEVEL['high'],
    "symptoms": [],
    "phone_number": "12021225569",
    "idToken": user_credentials['idToken']
    },
    "no symptoms": {
    "practitioner_id": "eDeef1VPrHNboouF7VTAc68CiEA3",
    "alert_level": ALERT_LEVEL['high'],
    "phone_number": "12021225569",
    "idToken": user_credentials['idToken']
    },
    "empty phone number/contact info": {
    "practitioner_id": "eDeef1VPrHNboouF7VTAc68CiEA3",
    "alert_level": ALERT_LEVEL['high'],
    "symptoms": ["I am tired all the time. i don't know why"],
    "phone_number": "",
    "idToken": user_credentials['idToken']
    },
    "no phone number/contact info": {
    "practitioner_id": "eDeef1VPrHNboouF7VTAc68CiEA3",
    "alert_level": ALERT_LEVEL['high'],
    "symptoms": ["I am tired all the time. i don't know why"],
    "idToken": user_credentials['idToken']
    },
    "empty practitioner id": {
    "practitioner_id": "",
    "alert_level": ALERT_LEVEL['high'],
    "symptoms": ["I am tired all the time. i don't know why"],
    "phone_number": "12021225569",
    "idToken": user_credentials['idToken']
    },
    "no practitioner id": {
    "alert_level": ALERT_LEVEL['high'],
    "symptoms": ["I am tired all the time. i don't know why"],
    "phone_number": "12021225569",
    "idToken": user_credentials['idToken']
    },
    "empty string alert level": {
    "practitioner_id": "eDeef1VPrHNboouF7VTAc68CiEA3",
    "alert_level": "",
    "symptoms": ["I am tired all the time. i don't know why"],
    "phone_number": "12021225569",
    "idToken": user_credentials['idToken']
    },
    "null alert level": {
    "practitioner_id": "eDeef1VPrHNboouF7VTAc68CiEA3",
    "alert_level": None,
    "symptoms": ["I am tired all the time. i don't know why"],
    "phone_number": "12021225569",
    "idToken": user_credentials['idToken']
    },
    "no alert level": {
    "practitioner_id": "eDeef1VPrHNboouF7VTAc68CiEA3",
    "symptoms": ["I am tired all the time. i don't know why"],
    "phone_number": "12021225569",
    "idToken": user_credentials['idToken']
    }
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
for label, test_data in test_datas.items():
    print(label)
    response = requests.post("http://localhost:5000/send_doctor_connection_request", json=test_data)
    try:
        print(response)
        print(response.json())
    except Exception as e:
        print(1, e)
    print()
    print()
    print()
    print()
    print()
    print()