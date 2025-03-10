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
test_datas = {"good": {"replied_to_id": "z1r1DJJ1RlJYYg9rNrQJ",
             "root_forum_id": "z1r1DJJ1RlJYYg9rNrQJ",
            # "replied_to_id": "c",
            #  "root_forum_id": "c",
             "created_at":"02-25-2025", 
             "post_description": "This is poorly researched.",
             "idToken": user_credentials['idToken']
             },
             "good 2":{"replied_to_id": "YrNOAIkbt7FXVHTHAOp0",
             "root_forum_id": "YrNOAIkbt7FXVHTHAOp0",
            # "replied_to_id": "c",
            #  "root_forum_id": "c",
             "created_at":"02-25-2025", 
             "post_description": "I hate how I never knew this.",
             "idToken": user_credentials['idToken']
             },
             "non-existent replied_to_id but existing root_forum_id":  {"replied_to_id": "z1sesrgf2qlJYYg9rNrQJ",
             "root_forum_id": "z1r1DJJ1RlJYYg9rNrQJ",
            # "replied_to_id": "c",
            #  "root_forum_id": "c",
             "created_at":"02-25-2025", 
             "post_description": "Wow, thanks for sharing! I saw this in school.",
             "idToken": user_credentials['idToken']
             },
             "mismatched but both existing replied_to and root_forum_id":{"replied_to_id": "z1r1DJJ1RlJYYg9rNrQJ",
             "root_forum_id": "YrNOAIkbt7FXVHTHAOp0",
            # "replied_to_id": "c",
            #  "root_forum_id": "c",
             "created_at":"02-25-2025", 
             "post_description": "Wow, thanks for sharing! I saw this in school.",
             "idToken": user_credentials['idToken']
             },
             "non-existent replied_to_id or root_forum_id":{
            "replied_to_id": "c",
             "root_forum_id": "c",
             "created_at":"02-25-2025", 
             "post_description": "Wow, thanks for sharing! I saw this in school.",
             "idToken": user_credentials['idToken']
             },
             "empty post description":{"replied_to_id": "YrNOAIkbt7FXVHTHAOp0",
             "root_forum_id": "YrNOAIkbt7FXVHTHAOp0",
             "created_at":"02-25-2025", 
             "post_description": "",
             "idToken": user_credentials['idToken']
             },
             "no post description":{"replied_to_id": "YrNOAIkbt7FXVHTHAOp0",
             "root_forum_id": "YrNOAIkbt7FXVHTHAOp0",
             "created_at":"02-25-2025", 
             "idToken": user_credentials['idToken']
             },
             "not signed in":{"replied_to_id": "YrNOAIkbt7FXVHTHAOp0",
             "root_forum_id": "YrNOAIkbt7FXVHTHAOp0",
             "created_at":"02-25-2025", 
             "post_description": "Lovely /s"
             },
             "good but title included":{"replied_to_id": "YrNOAIkbt7FXVHTHAOp0",
             "root_forum_id": "YrNOAIkbt7FXVHTHAOp0",
             "created_at":"02-25-2025", 
             "post_description": "Lovely /s",
             "title": "my response",
             "idToken": user_credentials['idToken']
             },
             "empty root_forum_id":{"replied_to_id": "z1r1DJJ1RlJYYg9rNrQJ",
             "root_forum_id": "",
            # "replied_to_id": "c",
            #  "root_forum_id": "c",
             "created_at":"02-25-2025", 
             "post_description": "This is poorly researched.",
             "idToken": user_credentials['idToken']
             },
             "root_forum_id missing": {"replied_to_id": "z1r1DJJ1RlJYYg9rNrQJ",
            # "replied_to_id": "c",
            #  "root_forum_id": "c",
             "created_at":"02-25-2025", 
             "post_description": "This is poorly researched.",
             "idToken": user_credentials['idToken']
             },
             "empty replied_to_id":{"replied_to_id": "",
             "root_forum_id": "z1r1DJJ1RlJYYg9rNrQJ",
            # "replied_to_id": "c",
            #  "root_forum_id": "c",
             "created_at":"02-25-2025", 
             "post_description": "This is poorly researched.",
             "idToken": user_credentials['idToken']
             },
             "emptyn replied_to_id and root_forum_id":{"replied_to_id": "",
             "root_forum_id": "",
            # "replied_to_id": "c",
            #  "root_forum_id": "c",
             "created_at":"02-25-2025", 
             "post_description": "This is poorly researched.",
             "idToken": user_credentials['idToken']
             }
             }

for label, test_data in test_datas.items():
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
