import firebase_admin
from firebase_admin import credentials, firestore

# Use your Firebase Admin SDK key JSON file
cred = credentials.Certificate("path/to/your-service-account-file.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def save_user_data(uid, user_data):
    try:
        doc_ref = db.collection('users').document(uid)
        doc_ref.set(user_data)
        print("User data saved!")
    except Exception as e:
        print(f"Error saving user data: {e}")
def get_user_data(uid):
    try:
        doc_ref = db.collection('users').document(uid)
        doc = doc_ref.get()
        if doc.exists:
            print("User data:", doc.to_dict())
            return doc.to_dict()
        else:
            print("No such document!")
    except Exception as e:
        print(f"Error retrieving user data: {e}")
