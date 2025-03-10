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

test_user_email1 = "testuseremail12@gmail.com"
test_user_email2 = "practitioner2.tester@gmail.com"
test_user_password = "12.3rdaskufq24eS"

user_credentials1 = sign_in_with_email_and_password(test_user_email1, test_user_password)
user_credentials2 = sign_in_with_email_and_password(test_user_email2, test_user_password)

test_datas = {"good post from patient": {"title":"Who knows how to cure migraines????",
             "created_at":"02-24-2025", 
             "tags":"herbal,migraine",
             "post_description": "I'm desperate please who knows how to cure migraines????",
             "idToken": user_credentials1['idToken']
             },
             "good post from doctor": {"title":"Please consult with your doctor before attempting any diets",
             "created_at":"03-08-2025", 
             "tags":"doctor,diet,diet_culture",
             "post_description": "Your doctor has the expertise! listen to them.",
             "idToken": user_credentials2['idToken']
             },
             "post from patient empty post_description (content)": {"title":"Who knows how to cure migraines????",
             "created_at":"02-24-2025", 
             "tags":"herbal,migraine",
             "post_description": "",
             "idToken": user_credentials1['idToken']
             },
             "post from doctor empty post_description (content)": {"title":"Please consult with your doctor before attempting any diets",
             "created_at":"03-08-2025", 
             "tags":"doctor,diet,diet_culture",
             "post_description": "",
             "idToken": user_credentials2['idToken']
             },
             "post from patient no post_description (content)": {"title":"Who knows how to cure migraines????",
             "created_at":"02-24-2025", 
             "tags":"herbal,migraine",
             "idToken": user_credentials1['idToken']
             },
             "post from doctor no post_description (content)": {"title":"Please consult with your doctor before attempting any diets",
             "created_at":"03-08-2025", 
             "tags":"doctor,diet,diet_culture",
             "idToken": user_credentials2['idToken']
             },
             "empty created at": {"title":"Please consult with your doctor before attempting any diets",
             "created_at":"", 
             "tags":"doctor,diet,diet_culture",
             "post_description": "Your doctor has the expertise! listen to them.",
             "idToken": user_credentials2['idToken']
             },
             "no created at": {"title":"Please consult with your doctor before attempting any diets",
             "tags":"doctor,diet,diet_culture",
             "post_description": "Your doctor has the expertise! listen to them.",
             "idToken": user_credentials2['idToken']
             },
             "empty title": {"title":"",
             "created_at":"01-24-2025", 
             "tags":"fever",
             "post_description": "Help me ,, My child has high fever",
             "idToken": user_credentials1['idToken']
             },
             "no title": {
             "created_at":"01-24-2025", 
             "tags":"fever",
             "post_description": "Help me ,, My child has high fever",
             "idToken": user_credentials1['idToken']
             },
             "good with no tags": {"title":"My child has fever",
             "created_at":"01-24-2025", 
             "post_description": "Help me ,, My child has high fever",
             "idToken": user_credentials1['idToken']
             },
             "good with empty tags": {"title":"My child has fever",
             "created_at":"01-24-2025", 
             "tags": "",
             "post_description": "Help me ,, My child has high fever",
             "idToken": user_credentials1['idToken']
             },
             }


for label,test_data in test_datas.items():
    print(label)
    response = requests.post("http://localhost:5000/post_forum", json=test_data)
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
