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

email1 = "practitioner.tester@gmail.com"
password1 = "12.3rdaskufq24eS"
practitioner_credentials1 = sign_in_with_email_and_password(email1, password1)
email2 = "testuseremail9@gmail.com"
password2 = "12.3rdaskufq24eS"
patient_credentials1 = sign_in_with_email_and_password(email2, password2)

existing_requests = [
    "pFEnGNFT0Sv36saQT4lU",
    "t9fmjXAcrQ8bq6huhC6s",
    "w9kVprN4byCrZKepfrZj"
    ]

test_datas = {
    "good request 1 (accepted + doctor's notes)": {
    "request_id":existing_requests[0],
    "idToken": practitioner_credentials1['idToken'],
    "status": "accepted",
    "doctors_notes":"will ask patient to come in for further testing"
    },
    "patient tries to edit": {
    "request_id":existing_requests[1],
    "idToken": patient_credentials1['idToken'],
    "status": "accepted"
    },
    "wrong practitioner logged in": {
    "request_id":existing_requests[2],
    "idToken": practitioner_credentials1['idToken'],
    "status": "accepted"
    },
    "good request 2 (rejected for previously accepted)": {
    "request_id":existing_requests[0],
    "idToken": practitioner_credentials1['idToken'],
    "status": "rejected"
    },
    "non-existing request": {
    "request_id":"dafew",
    "idToken": practitioner_credentials1['idToken'],
    "status": "rejected"
    },
    "not logged in": {
    "request_id":existing_requests[0],
    "status": "rejected"
    },
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
    response = requests.post("http://localhost:5000/edit_patient_requests", json=test_data)
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
    # break