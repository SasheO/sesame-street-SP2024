/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const firebase = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");

const app = express();

const firebaseApp = firebase.initializeApp(functions.config().firebase); // initializa according to the project logged into lcoally i.e. carelink
const db = firebase.firestore();

function verifyIdToken(idToken){
    // idToken comes from the client app
    firebase.auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
    const uid = decodedToken.uid;
    return uid;
    })
    .catch((error) => {
    return null;
    });
}


app.post('/sign_up', (req, res) => { // each endpoint of app should be expressed here as well as in ..\firebase.json hosting
    
    const email = req.body.email;
    const password = req.body.password;
    const _user_type = req.body.user_type;
    console.log("\n\n\nuser_type: "+_user_type);
    const _gender = req.body.gender;
    const _first_name = req.body.first_name;
    const _surname = req.body.surname;
    
    firebase.auth().createUser({
        email: email,
        emailVerified: false,
        password: password,
        displayName: _first_name+" "+_surname
       })
      .then(userCred => {
        // const user = userCred.user;
        const _uid = userCred.uid;
        
        if (_user_type=="patient"){
            var date_st = req.body.dob;
            var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
            const _dob = new Date(date_st.replace(pattern,'$3-$2-$1'));
            var userData = {
                // all these are required fields for patients
                uid: _uid,
                dob: _dob,
                user_type: _user_type,
                gender: _gender,
                first_name: _first_name,
                surname: _surname
            };
            
            // optional fields below. if not filled by user, fill them in as null
            if ("preferred_lang" in req.params){
                userData['preferred_lang'] = req.body.preferred_lang; 
            }
            else{
                userData['preferred_lang'] = null;
            }
            if ("gender" in req.params){
                userData['gender'] = req.body.gender;
            }
            else{
                userData['gender'] = null;
            }
            // console.log(userData);
        }
        else{ // user_type = practitioner
            var userData = { 
                // all these are required fields for healthcare practictioners
                uid: _uid,
                user_type: _user_type,
                first_name: _first_name,
                surname: _surname,
                specialty: req.body.specialty,
                certification: req.body.certification,
            };
            
            // optional fields below. if not filled by user, fill them in as null
            if ("hospital_id" in req.params){
                userData['hospital_id'] = req.body.hospital_id;
            }
            else{
                userData['hospital_id'] = null;
            }
            if ("gender" in req.params){
                userData['gender'] = req.body.gender;
            }
            else{
                userData['gender'] = null;
            }
            // console.log(userData);

        }

        // ensure empty values are converted to null
        for (const [key, value] of Object.entries(userData)) {
            if (value==""){
                userData[key]=null;
            }
        }

        // upload user record to user collections in firestore
        const userRef = db.collection('user');
        userRef.doc().set(userData).then(() =>{
            // TODO: set up all other user info being saved, log it to the 
            console.log('Successfully created new user:'+userCred.uid);
            res.status(200).json({message: "Successfully created new user:"});
        });
        
      })
      .catch(error => {
        console.log("Error: "+error.code);
        res.status(500).json({error: "Error"});
        // res.send("Error: "+error.code);
      });
});

app.post('/edit_profile', (req, res) => { // each endpoint of app should be expressed here as well as in ..\firebase.json hosting
    const idToken = req.body.idToken;
    const uid = verifyIdToken(idToken);
    if (uid == null){
        // user is not authenticated
        res.status(401).json({message: "Please log in to edit profile information"});
        res.send("User is not logged in");
    }
    else{
        // TODO:update each profile field
        // use update instead of set function
    }
});

app.get('/user_profile', (req, res) => { // each endpoint of app should be expressed here as well as in ..\firebase.json hosting
    
});

// TODO: don't think i can sign in or out with 

exports.app = onRequest(app); // exports.'app' is the app in firebase.json