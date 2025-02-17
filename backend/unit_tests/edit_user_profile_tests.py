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

users = {
    "tester.person@gmail.com":"12.3rdaskufq24eS", 
    "practitioner2.tester@gmail.com":"12.3rdaskufq24eS",
    "testuseremail12@gmail.com":"12.3rdaskufq24eS",
    "testuseremail9@gmail.com":"12.3rdaskufq24eS",
    "practitioner4.tester@gmail.com":"12.3rdaskufq24eS"
         }

users_data = {
    "tester.person@gmail.com":{"dob":"11-23-2002", "gender":"F", "first_name": "tester", "surname": "person", "preferred_lang": "English"}, 
    "practitioner2.tester@gmail.com":{"gender":"F", "first_name": "new_name", "surname": "new_surname", "specialty": "obstetrics and gynaecology", "certification":"NOBGYN"},
    "testuseremail12@gmail.com":{"dob":"11-23-1992", "gender":"F", "first_name": "tester", "surname": "changed", "preferred_lang": "Igbo"},
    "testuseremail9@gmail.com":{"dob":"01-03-2000", "first_name": "tester", "surname": "changed", "preferred_lang": "Igbo"}, # no gender
    "practitioner4.tester@gmail.com":{"gender":"M"}
}

indx=0
for email, password in users.items():
    indx+=1
    user_credentials = sign_in_with_email_and_password(email, password)
    test_data = users_data[email]
    test_data['idToken'] = user_credentials['idToken']
    print("\n\n\n\n\n\nuser", indx, ":", email)
    response = requests.post("http://localhost:5000/user_profile", json=test_data)
    time.sleep(1)
    try:
        print(response)
        print(response.json())
    except Exception as e:
        print(1, e)
        continue
    response = requests.post("http://localhost:5000/edit_profile", json=test_data)
    time.sleep(1)
    response = requests.post("http://localhost:5000/user_profile", json=test_data)
    time.sleep(1)
    try:
        print(response)
        print(response.json())
    except Exception as e:
        print(2, e)