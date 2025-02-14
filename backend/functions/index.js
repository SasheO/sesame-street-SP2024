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


function verifyIdToken(idToken, successfulCallback){
    // idToken comes from the client app
    firebase.auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
        console.log(1)
    const uid = decodedToken.uid;
    console.log(2)
    console.log(uid);
    successfulCallback(uid);
    })
    .catch((error) => {
        console.log(5); 
        return null;
    });
}

async function editProfile(uid){
    console.log(4); 
    const userRef = db.collection('user');
    console.log(4); 
    const q = await userRef.where('uid', '==', uid).get().then(querySnapshot => {
        if(!querySnapshot.empty) {
          const user = querySnapshot.docs[0].data()
          console.log(user);
          // TODO HERE: set user data as request in edit profile, return request to client.
        }
      });
    
    console.log(4); 
    console.log(uid);
    // console.log(user);
}

app.post('/sign_up', (req, res) => { 
    
    const email = req.body.email;
    const password = req.body.password;
    const _user_type = req.body.user_type;
    const _first_name = req.body.first_name;
    const _surname = req.body.surname;
    var _gender = req.body.gender;

    console.log("\n\n\nuser_type: "+_user_type);

    // check that values are not empty and return accurate error message
    if (email === "" || !email) {
        // strValue was empty string
        return res.status(400).json({message: "email or password inaccurately entered"});
    }
    if (email === "" || !email) {
        // strValue was empty string
        gender = "undisclosed";
    }
    if (password === "" || !password) {
        // strValue was empty string
        return res.status(400).json({message: "email or password inaccurately entered"});
    }
    if (_first_name === "" || !_first_name) {
        // strValue was empty string
        return res.status(422).json({message: "no first  name entered"});
    }
    if (_surname === "" || !_surname) {
        // strValue was empty string
        return res.status(422).json({message: "no surname  name entered"});
    }
    if (!(_user_type==="practitioner" || _user_type==="patient")){
        return res.status(422).json({message: "invalid user type"});
    }

    
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
            if (!("dob" in req.body)){
                return res.status(422).json({message: "no dob entered"});
            }
            var date_st = req.body.dob;
            var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
            const _dob = new Date(date_st.replace(pattern,'$3-$2-$1'));
            if (_dob === "Invalid Date" || isNaN(_dob)){
                return res.status(422).json({message: "invalid dob format"});
            }
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
            if ("preferred_lang" in req.body){
                userData['preferred_lang'] = req.body.preferred_lang; 
            }
            else{
                userData['preferred_lang'] = null;
            }
            if ("gender" in req.body && !(req.body.gender==="")){
                userData['gender'] = req.body.gender;
            }
            else{
                userData['gender'] = null;
            }
            // console.log(userData);
        }
        else if (_user_type=="practitioner") { // user_type = practitioner
            var userData = { 
                // all these are required fields for healthcare practictioners
                uid: _uid,
                user_type: _user_type,
                first_name: _first_name,
                surname: _surname,
                
            };

            if ("specialty" in req.body){
                if (req.body.specialty===""){
                    return res.status(422).json({message: "no specialty entered"});
                }
                userData['specialty'] = req.body.specialty;
            }
            else{
                return res.status(422).json({message: "no specialty entered"});
            }

            if ("certification" in req.body){
                if (req.body.certification===""){
                    return res.status(422).json({message: "no certification provided"});
                }

                userData['certification'] = req.body.certification;
            }
            else{
                return res.status(422).json({message: "no certification entered"});
            }
            
            
            // optional fields below. if not filled by user, fill them in as null
            if ("hospital_id" in req.body){
                userData['hospital_id'] = req.body.hospital_id;
            }
            else{
                userData['hospital_id'] = null;
            }
            if ("gender" in req.body && !(req.body.gender==="")){
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
        console.log("Error: "+error.code+" "+error.message);
        res.status(500).json({error: "Some error has occured..."});
        // res.send("Error: "+error.code);
      });
});

app.post('/edit_profile', (req, res) => { 
    const idToken = req.body.idToken;
    if (idToken==null    ){
        console.log("idToken==null");
        return res.status(401).json({message: "User is not logged in"});
    }
    verifyIdToken(idToken, editProfile); // TODO: this runs out of order, getting uid as null even when the idToken is valid since the verifyIdToken function runs and returns after. do this to fix out of order node js execution:
    // https://stackoverflow.com/questions/5010288/how-to-make-a-function-wait-until-a-callback-has-been-called-using-node-js
    // https://www.youtube.com/watch?v=QvIC2z8ADtU&list=PLC3y8-rFHvwh8shCMHFA5kWxD9PaPwxaY&index=25
    
    
    // console.log(5);
    // console.log(uid);
    // if (uid == null){
    //     console.log("uid==null");
    //     // user is not authenticated
    //     return res.status(401).json({message: "User is not logged in"});
    // }
    // else{
    //     // TODO:update each profile field
    //     // use update instead of set function
    //     const userRef = db.collection('user');
    //     const user = query(userRef, where("uid", "==", uid));
    //     console.log(user);
    // }


});

app.get('/user_profile', (req, res) => { 
    
});

// TODO: don't think i can sign in or out with 

exports.app = onRequest(app); // exports.'app' is the app in firebase.json