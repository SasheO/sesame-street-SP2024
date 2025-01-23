from flask import Flask
from config import Config
from pyrebase import pyrebase
app = Flask(__name__)
from dotenv import load_dotenv
import os
from flask import Flask, render_template, request, json, Response,redirect,flash,url_for,session

app.config.from_object(Config)
load_dotenv()
# port = 5100 # for testing

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


@app.route('/')
def hello_world():
    return "hello world"



@app.route('/sign_up')
def sign_up():
    print("Sign up...")
    email = input("Enter email: ")
    password=input("Enter password: ")
    try:
        # TODO: get user credentials and sign in
        user = auth.create_user_with_email_and_password(email, password)
    except:
        print("could not sign up")
    # TODO: index.html does not exist. use text response to test then connect to front end
    # return render_template('index.html')
    return "signed up"

@app.route('/sign_in')
def sign_in():
    # try:
    #     user = auth.create_user_with_email_and_password("Parasmani300@gmail.com","1234567")
    # except:
    #     print("Error Signing up")

    print("Sign in...")
    email = input("Enter email: ")
    password=input("Enter password: ")

    try:
        # To sign in user using email and password
        # TODO: get user credentials and sign in
        user = auth.sign_in_with_email_and_password(email, password)

        # before the 1 hour expiry:
        user = auth.refresh(user['refreshToken'])
        # now we have a fresh token
        print(user['idToken'])
        session['user'] = user['idToken']
        print("sign In Successfull")

        #Sending the account confirmation mail to the user email on successfull sign in
        # auth.send_email_verification(user['idToken'])
    except:
        print("Some thing happend!! could not sign in")
    # TODO: index.html does not exist. use text response to test then connect to front end
    # return render_template('index.html')
    return "signed in"

@app.route('/reset_password')
def reset():
    token = session['user']
    # Sending Password reset email
    # TODO: get user credentials and sign in
    reset_email = auth.send_password_reset_email("sasheojuba@gmail.com")
    # TODO: index.html does not exist. use text response to test then connect to front end
    # return render_template("index.html")


# import routes

if __name__ == "__main__":
    app.run(debug = True)
    # app.run(host="0.0.0.0", port=port) # for testing