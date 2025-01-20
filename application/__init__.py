from flask import Flask
from config import Config
from pyrebase import pyrebase
app = Flask(__name__)
from dotenv import load_dotenv
import os

app.config.from_object(Config)
load_dotenv()

print(os.environ['API_KEY'])

firebaseConfig = {
    'apiKey': "API_KEY",
    'authDomain': "YOUR_API_DOMAIN",
    'databaseURL': "YOUR_URL",
    'projectId': "YOUR_APP",
    'storageBucket': "YOUR_STORAGE_BUCKET",
    'messagingSenderId': "YOUR_MESSENGER_ID",
    'appId': "YOUR_APP_ID",
    'measurementId': "YOUR_MEASUREMENT_ID"
    }

firebase = pyrebase.initialize_app(firebaseConfig)

auth = firebase.auth()
db = firebase.database()

import routes


if __name__ == "__main__":
    app.run()