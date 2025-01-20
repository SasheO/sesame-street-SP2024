from application import app,db,auth
from flask import Flask, render_template, request, json, Response,redirect,flash,url_for,session

@app.route('/sign_up')
def sign_up():
    try:
        # TODO: get user credentials and sign in
        user = auth.create_user_with_email_and_password("sasheojuba@gmail.com","1234567")
    except:
        print("could not sign in")
    # TODO: index.html does not exist. use text response to test then connect to front end
    return render_template('index.html')

@app.sign_in('/sign_in')
def index():
    # try:
    #     user = auth.create_user_with_email_and_password("Parasmani300@gmail.com","1234567")
    # except:
    #     print("Error Signing up")

    try:
        # To sign in user using email and password
        # TODO: get user credentials and sign in
        sign_user = auth.sign_in_with_email_and_password("sasheojuba@gmail.com","1234567")

        # before the 1 hour expiry:
        sign_user = auth.refresh(sign_user['refreshToken'])
        # now we have a fresh token
        print(sign_user['idToken'])
        session['user'] = sign_user['idToken']
        print("sign In Successfull")

        #Sending the account confirmation mail to the user email on successfull sign in
        # auth.send_email_verification(sign_user['idToken'])
    except:
        print("Some thing happend!! could not sign in")
    # TODO: index.html does not exist. use text response to test then connect to front end
    return render_template('index.html')

@app.route('/reset_password')
def reset():
    token = session['user']
    # Sending Password reset email
    # TODO: get user credentials and sign in
    reset_email = auth.send_password_reset_email("sasheojuba@gmail.com")
    # TODO: index.html does not exist. use text response to test then connect to front end
    return render_template("index.html")