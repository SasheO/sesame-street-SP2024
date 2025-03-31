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

email1 = "tester.person@gmail.com"
password1 = "12.3rdaskufq24eS"
user_credentials1 = sign_in_with_email_and_password(email1, password1)
email2 = "testuseremail9@gmail.com"
password2 = "12.3rdaskufq24eS"
user_credentials2 = sign_in_with_email_and_password(email2, password2)

existing_requests = [
    "TgvBWHh777xuWc7FUTZs",
    "i5WhJGjciUc8qsiDHOYW",
    "lsJFK3eZP60ITe0Jlj3F"
    ]

test_datas = {
    "good request 1": {
    "request_id":existing_requests[0],
    "idToken": user_credentials1['idToken']
    },
    "good request 2": {
    "request_id":existing_requests[1],
    "idToken": user_credentials1['idToken']
    },
   "already deleted request": {
    "request_id":existing_requests[0],
    "idToken": user_credentials1['idToken']
    },
    "invalid request id": {
    "request_id":"ads9244v-w4PO",
    "idToken": user_credentials1['idToken']
    },
    "patient attempts to delete another patient's id": {
    "request_id":existing_requests[2],
    "idToken": user_credentials2['idToken']
    },
    "not logged in user": {
    "request_id":existing_requests[2],
    "idToken": ""
    },
    "no idToken": {
    "request_id":existing_requests[2]
    },
    "good request 3": {
    "request_id":existing_requests[2],
    "idToken": user_credentials1["idToken"]
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
    response = requests.post("http://localhost:5000/delete_doctor_requests", json=test_data)
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