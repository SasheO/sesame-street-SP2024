/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


const express = require("express");
const functions = require('firebase-functions/v1');
const app = express();

app.get('/embedded_google_search', (req, res) => {
    try {
        res.status(200).json({ message: "Google Search API Endpoint" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
    const API_KEY = 'AIzaSyC6KoJ7n8zPos4Md5EJoddoKRGDaUsvSMk';
    const CX = 'e2d3ac9f4a49e4eba';

    async function searchGoogle(query) {
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEY}&cx=${CX}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            displayResults(data.items);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    }

    function displayResults(results) {
        const resultsDiv = document.getElementById('searchResults');
        resultsDiv.innerHTML = '';

        if (!results) {
            resultsDiv.innerHTML = '<p>No results found.</p>';
            return;
        }

        results.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.innerHTML = `
                <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                <p>${item.snippet}</p>
            `;
            resultsDiv.appendChild(resultItem);
        });
    }

    document.getElementById('searchButton').addEventListener('click', () => {
        const query = document.getElementById('searchInput').value;
        if (query) {
            searchGoogle(query);
        }
    });
});

app.get('/embedded_google_maps', (req, res) => { // each endpoint of app should be expressed here as well as in ..\firebase.json hosting
    try {
        res.status(200).json({ message: "Google Maps API Endpoint" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
    src="https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyAWwwRByaGji1A_HnKGHRBabtcFyDP0Xus&callback=initMap"
    function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13
        });
        var input = document.getElementById('searchInput');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);
    
        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });
    
        autocomplete.addListener('place_changed', function() {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }
      
            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }
            marker.setIcon(({
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);
        
            var address = '';
            if (place.address_components) {
                address = [
                  (place.address_components[0] && place.address_components[0].short_name || ''),
                  (place.address_components[1] && place.address_components[1].short_name || ''),
                  (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }
        
            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(map, marker);
          
            // Location details
            for (var i = 0; i < place.address_components.length; i++) {
                if(place.address_components[i].types[0] == 'postal_code'){
                    document.getElementById('postal_code').innerHTML = place.address_components[i].long_name;
                }
                if(place.address_components[i].types[0] == 'country'){
                    document.getElementById('country').innerHTML = place.address_components[i].long_name;
                }
            }
            document.getElementById('location').innerHTML = place.formatted_address;
            document.getElementById('phone_number').innerHTML = place.formatted_phone_number;
            document.getElementById('website').innerHTML = place.website;
            document.getElementById('business_hours').innerHTML = place.opening_hours.weekday_text;
            document.getElementById('currently_open').innerHTML = place.opening_hours.open_now;
            document.getElementById('lat').innerHTML = place.geometry.location.lat();
            document.getElementById('lon').innerHTML = place.geometry.location.lng();
            showCallPrompt(place.formatted_phone_number);


            
        });
    }

    function showCallPrompt(phoneNumber) {
        if (!phoneNumber) {
            console.error("Invalid phone number");
            return;
        }
    
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
        if (!isIOS) {
            alert("This feature is only available on iOS devices.");
            return;
        }
    
        const confirmation = confirm(`Would you like to call ${phoneNumber}?`);
    
        if (confirmation) {
            window.location.href = `tel:${phoneNumber}`;
        }
    }
});

// Start server only if not in test mode
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for testing
module.exports = app;
exports.api = functions.https.onRequest


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
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

const firebaseApp = firebase.initializeApp(functions.config().firebase); // initializa according to the project logged into lcoally i.e. carelink // unsure if this should be commented out or not
const db = firebase.firestore();

app.use(express.json()); // Middleware to parse JSON body
app.use(cors({ origin: true })); // Enable CORS for frontend access


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
        
// ORIGINAL SIGN_UP: (COMMENTED OUT)
//         if (_user_type=="patient"){
//             if (!("dob" in req.body)){
//                 return res.status(422).json({message: "no dob entered"});
//             }
//             var date_st = req.body.dob;
//             var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
//             const _dob = new Date(date_st.replace(pattern,'$3-$2-$1'));
//             if (_dob === "Invalid Date" || isNaN(_dob)){
//                 return res.status(422).json({message: "invalid dob format"});
//             }
//             var userData = {
//                 // all these are required fields for patients
//                 uid: _uid,
//                 dob: _dob,
//                 user_type: _user_type,
//                 gender: _gender,
//                 first_name: _first_name,
//                 surname: _surname
//             };
            
//             // optional fields below. if not filled by user, fill them in as null
//             if ("preferred_lang" in req.body){
//                 userData['preferred_lang'] = req.body.preferred_lang; 
//             }
//             else{
//                 userData['preferred_lang'] = null;
//             }
//             if ("gender" in req.body && !(req.body.gender==="")){
//                 userData['gender'] = req.body.gender;
//             }
//             else{
//                 userData['gender'] = null;
//             }
//         }
//         else if (_user_type=="practitioner") { // user_type = practitioner
//             var userData = { 
//                 // all these are required fields for healthcare practictioners
//                 uid: _uid,
//                 user_type: _user_type,
//                 first_name: _first_name,
//                 surname: _surname,
                
//             };

//             if ("specialty" in req.body){
//                 if (req.body.specialty===""){
//                     return res.status(422).json({message: "no specialty entered"});
//                 }
//                 userData['specialty'] = req.body.specialty;
//             }
//             else{
//                 return res.status(422).json({message: "no specialty entered"});
//             }

//             if ("certification" in req.body){
//                 if (req.body.certification===""){
//                     return res.status(422).json({message: "no certification provided"});
//                 }

//                 userData['certification'] = req.body.certification;
//             }
//             else{
//                 return res.status(422).json({message: "no certification entered"});
//             }
            
            
//             // optional fields below. if not filled by user, fill them in as null
//             if ("hospital_id" in req.body){
//                 userData['hospital_id'] = req.body.hospital_id;
//             }
//             else{
//                 userData['hospital_id'] = null;
//             }
//             if ("gender" in req.body && !(req.body.gender==="")){
//                 userData['gender'] = req.body.gender;
//             }
//             else{
//                 userData['gender'] = null;
//             }
// END OF ORIGINAL SIGN_UP (COMMENTED OUT)

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
                        // TODO: User must have first name
                    }
                    else{
                        user.ref.update({first_name: req.body.first_name});
                    }
                    
                }
                if ("surname" in req.body){
                    if (req.body.surname===""){
                        // return res.status(422).json({message: "no first_name entered"});
                        console.log("no surname entered");
                        // TODO: User must have surname
                    }
                    else{
                        user.ref.update({surname: req.body.surname});
                    }
                    
                }
                if ("preferred_lang" in req.body){
                    if (req.body.preferred_lang===""){
                        // return res.status(422).json({message: "no first_name entered"});
                        console.log("no preferred_lang entered");
                        user.ref.update({preferred_lang: null});

                    }
                    else{
                        user.ref.update({preferred_lang: req.body.preferred_lang});
                    }
                }
                
                if ("gender" in req.body){
                    if (req.body.gender===""){
                        // return res.status(422).json({message: "no first_name entered"});
                        console.log("no gender entered");
                        user.ref.update({gender: null});

                    }
                    else{
                        user.ref.update({gender: req.body.gender});
                    }
                }
                if ("dob" in req.body){
                    if (req.body.dob===""){
                        // return res.status(422).json({message: "no first_name entered"});
                        console.log("no dob entered");
                        // TODO: user must have dob
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
                        // TODO: user must have certification. also should be system to verify certification
                    }
                    else{
                        user.ref.update({certification: req.body.certification});
                    }
                    
                }
                if ("specialty" in req.body){
                    if (req.body.specialty===""){
                        // return res.status(422).json({message: "no first_name entered"});
                        console.log("no specialty entered");
                        // TODO: user must have specialty
                    }
                    else{
                        user.ref.update({specialty: req.body.specialty});
                    }
                    
                }
                if ("gender" in req.body){
                    if (req.body.gender===""){
                        // return res.status(422).json({message: "no first_name entered"});
                        console.log("no gender entered");
                        user.ref.update({gender: null});
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
