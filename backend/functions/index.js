/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
//const logger = require("firebase-functions/logger");
const firebase = require("firebase-admin");
//const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors"); //-angelica
const admin = require("firebase-admin"); //-angelica

admin.initializeApp(); // No need for `functions.config()`
const db = admin.firestore();
const auth = admin.auth();
const app = express();

app.use(express.json()); // Middleware to parse JSON body
app.use(cors({ origin: true })); // Enable CORS for frontend access

async function verifyIdToken(idToken) {
    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        return decodedToken.uid;
    } catch (error) {
        return null;
    }
}



app.post('/sign_up', async (req, res) => { 

    const email = req.body.email;
    const password = req.body.password;
    const _first_name = req.body.first_name;
    const _surname = req.body.surname;
    var _gender = req.body.gender;

    console.log("Received request:", req.body);

    // check that values are not empty and return accurate error message
    if (email === "" || !email) {
        // strValue was empty string
        return res.status(400).json({message: "email or password inaccurately entered"});
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

    const _user_type = "patient"; // Automatically assign "patient" or another default

    try{
    console.log("🛠 Creating user...");
        const userRecord = await auth.createUser({
        email: email,
        emailVerified: false,
        password: password,
        displayName: _first_name+" "+_surname
       });
        const _uid = userRecord.uid;
        console.log("✅ User Created:", _uid);
        
      

        const userData = {
            uid: _uid,
            _first_name,
            _surname,
            email
        };

        await db.collection('users').doc(_uid).set(userData);
        console.log("✅ User Data Saved to Firestore:", _uid);
        res.status(200).json({ message: "User created successfully", uid: _uid });
      } catch(error) {
        console.error("Firebase Sign-Up Error:", error);
        res.status(500).json({ error: error.message }); 
      };
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