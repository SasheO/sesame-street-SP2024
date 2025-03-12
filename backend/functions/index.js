const functions = require("firebase-functions");
const express = require("express");
const firebase = require("firebase-admin");
const axios = require("axios");
const cors = require("cors");
const { onRequest } = require("firebase-functions/v2/https");

// Initialize Firebase Admin SDK
firebase.initializeApp();
const db = firebase.firestore();
const auth = firebase.auth();

const app = express();
app.use(express.json());

// ✅ Apply CORS globally before routes are defined
app.use(cors({ origin: true }));

/** 
 * 🔹 Cloud Function: Fetch Nearby Hospitals
 */
const { defineSecret } = require("firebase-functions/params");

// Load secret environment variable
const GOOGLE_MAPS_API_KEY = defineSecret("GOOGLE_MAPS_API_KEY");

const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (angle * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

exports.getNearbyHospitals = onRequest({ secrets: [GOOGLE_MAPS_API_KEY] }, async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(204).send(""); // ✅ End preflight request
    }

    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ error: "Latitude and Longitude are required" });
        }

        // ✅ Fetch API Key from Firebase Secrets
        const apiKey = GOOGLE_MAPS_API_KEY.value();
        if (!apiKey) {
            return res.status(500).json({ error: "Google API Key is missing." });
        }

        const googleMapsUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=hospital&key=${apiKey}`;
        const response = await axios.get(googleMapsUrl);

        console.log("Google API Response:", response.data);

        if (response.data.status !== "OK") {
            return res.status(400).json({ error: "Google API Error", details: response.data });
        }

        // ✅ Extract only necessary details
        const hospitals = response.data.results.map(hospital => ({
            name: hospital.name,
            rating: hospital.rating || 0,
            address: hospital.vicinity || "No address available",
            place_id: hospital.place_id,
            photo: hospital.photos 
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${hospital.photos[0].photo_reference}&key=${apiKey}`
                : "https://via.placeholder.com/400", // Default placeholder image if no photo exists
            distance: haversineDistance(lat, lng, hospital.geometry.location.lat, hospital.geometry.location.lng),
            latitude: hospital.geometry?.location?.lat,  // ✅ Ensure lat/lng exist
            longitude: hospital.geometry?.location?.lng,
        }));

        hospitals.sort((a, b) => a.distance - b.distance);

        return res.status(200).json(hospitals);
    } catch (error) {
        console.error("Error fetching hospitals:", error);
        return res.status(500).json({ error: "Failed to fetch hospitals." });
    }
});

/**
 * 🔹 Firebase Authentication: User Signup
 */
app.post('/sign_up', async (req, res) => {
    const { email, password, first_name, surname } = req.body;
    if (!email || !password || !first_name || !surname) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const userRecord = await auth.createUser({
            email,
            emailVerified: false,
            password,
            displayName: `${first_name} ${surname}`
        });

        const _uid = userRecord.uid;
        const userData = { uid: _uid, first_name, surname, email, user_type: "patient" };

        await db.collection('users').doc(_uid).set(userData);
        res.status(200).json({ message: "User created successfully", uid: _uid });
    } catch (error) {
        console.error("Firebase Sign-Up Error:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * 🔹 User Profile Editing
 */
app.post('/edit_profile', async (req, res) => {
    const idToken = req.body.idToken;
    if (!idToken) {
        return res.status(401).json({ message: "User is not logged in" });
    }

    try {
        const decodedToken = await firebase.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const userRef = db.collection('users').doc(uid);
        await userRef.update(req.body);
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid user credentials" });
    }
});

// ✅ Export Express API as a Cloud Function
exports.api = functions.https.onRequest(app);
