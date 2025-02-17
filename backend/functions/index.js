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
