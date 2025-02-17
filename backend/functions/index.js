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


app.post('/sign_up', (req, res) => { 
    
    const email = req.body.email;
    const password = req.body.password;
    const _user_type = req.body.user_type;
    const _first_name = req.body.first_name;
    const _surname = req.body.surname;
    var _gender = req.body.gender;

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
    // TODO: do stuff in sign_up like if no gender given, set user gender to none
    const idToken = req.body.idToken;
    if (idToken==null    ){
        console.log("idToken==null");
        return res.status(401).json({message: "User is not logged in"});
    }

    firebase.auth()
    .verifyIdToken(idToken)
    .then(async (decodedToken) => {
        
        const uid = decodedToken.uid;
        console.log(uid);
        const userRef = db.collection('user');
        const q = await userRef.where('uid', '==', uid).get().then(querySnapshot => {
            if(!querySnapshot.empty) {
            const user = querySnapshot.docs[0];
            const user_type  = user.data()['user_type'];
            if(user_type === "patient"){
                // update patient values from request: first_name, surname, dob, preferred_lang, gender
                if ("first_name" in req.body){
                    if (req.body.first_name===""){
                        // return res.status(422).json({message: "no first_name entered"});
                    }
                    else{
                        user.ref.update({first_name: req.body.first_name});
                    }
                    
                }
                if ("surname" in req.body){
                    if (req.body.surname===""){
                        // return res.status(422).json({message: "no first_name entered"});
                        console.log("no surname entered");

                    }
                    else{
                        user.ref.update({surname: req.body.surname});
                    }
                    
                }
                if ("preferred_lang" in req.body){
                    if (req.body.preferred_lang===""){
                        // return res.status(422).json({message: "no first_name entered"});
                        console.log("no preferred_lang entered");
                    }
                    else{
                        user.ref.update({preferred_lang: req.body.preferred_lang});
                    }
                }
                
                if ("gender" in req.body){
                    if (req.body.gender===""){
                        // return res.status(422).json({message: "no first_name entered"});
                        console.log("no gender entered");

                    }
                    else{
                        user.ref.update({gender: req.body.gender});
                    }
                }
                if ("dob" in req.body){
                    if (req.body.dob===""){
                        // return res.status(422).json({message: "no first_name entered"});
                        console.log("no dob entered");
                        
                    }
                    else{
                        var date_st = req.body.dob;
                        var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
                        const _dob = new Date(date_st.replace(pattern,'$3-$2-$1'));
                        if (_dob === "Invalid Date" || isNaN(_dob)){
                            // return res.status(422).json({message: "invalid dob format"});
                            console.log("invalid dob format");
                        }
                        else{
                            user.ref.update({dob: _dob});
                        }
                        
                    }
                }
                return res.status(200).json({message: "Edited user profile"});
                
            }
            else if (user_type=="practitioner") { // user_type = practitioner
                // update practitioner values from request: first_name, surname, specialty, certification

                if ("first_name" in req.body){
                    if (req.body.first_name===""){
                        // return res.status(422).json({message: "no first_name entered"});
                    }
                    else{
                        user.ref.update({first_name: req.body.first_name});
                    }
                    
                }
                if ("surname" in req.body){
                    if (req.body.surname===""){
                        // return res.status(422).json({message: "no first_name entered"});
                        console.log("no surname entered");

                    }
                    else{
                        user.ref.update({surname: req.body.surname});
                    }
                    
                }
                if ("certification" in req.body){
                    if (req.body.certification===""){
                        // return res.status(422).json({message: "no first_name entered"});
                        console.log("no certification entered");

                    }
                    else{
                        user.ref.update({certification: req.body.certification});
                    }
                    
                }
                if ("specialty" in req.body){
                    if (req.body.specialty===""){
                        // return res.status(422).json({message: "no first_name entered"});
                        console.log("no specialty entered");

                    }
                    else{
                        user.ref.update({specialty: req.body.specialty});
                    }
                    
                }
                if ("gender" in req.body){
                    if (req.body.gender===""){
                        // return res.status(422).json({message: "no first_name entered"});
                        console.log("no gender entered");

                    }
                    else{
                        user.ref.update({gender: req.body.gender});
                    }
                }
                return res.status(200).json({message: "Edited user profile"});

            }
            
            }
            else{
                return res.status(401).json({message: "Invalid user credentials"});
            }
        });
    })
    .catch((error) => {
        console.log(error);
        return res.status(401).json({message: "Invalid user credentials"});
    });


});

app.post('/user_profile', (req, res) => { 
    const idToken = req.body.idToken;
    if (idToken==null    ){
        console.log("idToken==null");
        return res.status(401).json({message: "User is not logged in"});
    }

    firebase.auth()
    .verifyIdToken(idToken)
    .then(async (decodedToken) => {
        
        const uid = decodedToken.uid;
        console.log("uid: "+uid);

        const userRef = db.collection('user');

        const q = await userRef.where('uid', '==', uid).get().then(querySnapshot => {

            if(!querySnapshot.empty) {
                // return user data to client without revealing UID info
                const user = querySnapshot.docs[0]; 
                var user_data = user.data();
                if ("dob" in user_data){ // convert dob to right format from timestamp
                    user_data['dob'] = new Date(1000*user_data["dob"]['_seconds']);
                }
                delete user_data['uid'];
                return res.status(200).json({user_info: user_data});
            }
            else{
                return res.status(401).json({message: "Invalid user credentials"});
            }
        });
    })
    .catch((error) => {

        console.log(error);
        return res.status(401).json({message: "Invalid user credentials"});
    });


});

// TODO: don't think i can sign in or out with 

exports.app = onRequest(app); // exports.'app' is the app in firebase.json