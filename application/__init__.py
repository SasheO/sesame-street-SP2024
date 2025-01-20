from flask import Flask
from config import Config
from pyrebase import pyrebase
app = Flask(__name__)
from dotenv import load_dotenv
import os

app.config.from_object(Config)
load_dotenv()

firebaseConfig = {
    'apiKey': os.environ['API_KEY'],
    'authDomain': os.environ['AUTH_DOMAIN'],
    'databaseURL': os.environ['DATABASE_URL'],
    'projectId': os.environ['PROJECT_ID'],
    'storageBucket': os.environ['STORAGE_BUCKET'],
    'messagingSenderId': os.environ['MESSAGING_SENDER_ID'],
    'appId': os.environ['APP_ID'],
    'measurementId': os.environ['MEASUREMENT_ID']
    }

firebase = pyrebase.initialize_app(firebaseConfig)

auth = firebase.auth()
db = firebase.database()

import routes


if __name__ == "__main__":
    app.run()