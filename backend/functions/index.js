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

app.post("/send_doctor_connection_request", (req, res) => {
  // user should be logged in patient
  // they should send the doctor they want to connect with
  // info:
  // a. Doctor id
  // b. patient id
  // c. user alert level (1 mild, 2 moderate, 3 severe)
  // d. general background of user (i.e. user name, gender, age)
  // e. Symptoms
  // f. Doctor notes (initialized to null, updated when doctor  gives one)
  // g. contact information of patient (phone number)
  // h. Status of accepted or rejected or pending
  // i. Doctor message to patient (initialized
  // as null, will be populated when the doctor
  // accepts or deletes)
  // j. Timestamp received (created on backend)
  // Patient not allowed to send a new request
  // to same practitioner if there's an existing
  // one less than two weeks old
  const idToken = req.body.idToken;

  if (idToken==null ) {
    console.log("idToken==null");
    return res.status(401).json({message: "User is not logged in"});
  }

  const _practitionerUID = req.body.practitioner_id;
  if (_practitionerUID==null||_practitionerUID==="") {
    console.log("_practitionerUID==null||_practitionerUID===''");
    return res.status(422).json({message: "No practitioner_id given"});
  }

  const _requestAlertLevel = req.body.alert_level;
  if (!([1, 2, 3].includes(_requestAlertLevel))) {
    console.log("Invalid value for _requestAlertLevel");
    return res.status(422).json({message: "Invalid value for alert_level"});
  }

  const _symptoms = req.body.symptoms;
  if (_symptoms === undefined || _symptoms.length == 0) {
    console.log("_symptoms === undefined || _symptoms.length == 0");
    return res.status(422).json({message: "No symptoms given"});
  }

  const _patientPhoneNumber = req.body.phone_number;
  // TODO: check if phone number is in phone number format
  // this currently just checks if the phone number is givens
  if (_patientPhoneNumber==null||_patientPhoneNumber==="") {
    console.log("_patientPhoneNumber==null||_patientPhoneNumber===''");
    return res.status(422).json({message: "No phone_number given"});
  }

  const _doctorNotes = null;
  const _practictionerMessageToPatient = null;

  const _status = "pending";

  firebase.auth()
      .verifyIdToken(idToken)
      .then(async (decodedToken) => {
        const _patientUID = decodedToken.uid;
        console.log("patientUID: "+_patientUID);

        // check if uid is patient
        const userRef = db.collection("user");
        await userRef.where("uid", "==", _patientUID)
            .get().then((querySnapshot) => {
              if (querySnapshot.empty) {
                // return user data to client without revealing UID info
                console.log("user is logged in but not in user collection");
                return res.status(500).json({message:
                  "Some error has occurred..."});
              } else {
                const user = querySnapshot.docs[0];
                // TODO: change logging in to "user_type"
                // in firestore for uniform camel case there.
                // TODO: then change to user.data()["user_type"]
                const userType = user.data()["userType"];
                if (userType!=="patient") {
                  return res.status(401).json({message:
                    "Wrong user type for this request"});
                }
              }
            });

        // confirm _practitionerUID belongs to an actual doctor
        await userRef.where("uid", "==", _practitionerUID)
            .get().then((querySnapshot) => {
              if (querySnapshot.empty) {
                // return user data to client without revealing UID info
                return res.status(422).json({message: "Doctor does not exist"});
              } else {
                const user = querySnapshot.docs[0];
                // TODO: change logging in to "user_type" in
                // firestore for uniform camel case there.
                // TODO: then change to user.data()["user_type"]
                const userType = user.data()["userType"];
                if (userType!="practitioner") {
                  return res.status(422).json({message:
                    "Doctor does not exist"});
                }
              }
            });

        // TODO here: check if user already has
        // rejected request with doctor less than 2 weeks old

        const doctorPatientConnectionRequest = {
          // all these are required fields for patients
          patientUID: _patientUID,
          practitionerUID: _practitionerUID,
          request_alert_level: _requestAlertLevel,
          symptoms: _symptoms,
          doctor_notes: _doctorNotes,
          practictioner_message_to_patient: _practictionerMessageToPatient,
          patient_phone_number: _patientPhoneNumber,
          status: _status,
          created_at: Date.now(), // timestamp created in milliseconds
        };

        console.log(doctorPatientConnectionRequest);

        const doctorPatientConnectionRef = db
            .collection("doctor_patient_connection");
        doctorPatientConnectionRef.doc()
            .set(doctorPatientConnectionRequest).then((request) =>{
              // TODO: set up all other user info being saved, log it to the
              console.log("Successfully sent request");
              return res.status(200)
                  .json({message: "Successfully sent request"});
            })
            .catch((error) => {
              console.log(error);
              return res.status(500)
                  .json({message: "Some error has occurred..."});
            });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({message: "Some error has occurred..."});
      });
});

app.get("/my_doctor_requests", (req, res) => {
  // user should be logged in patient
  // show them requests sent
  // divide results into pending vs accepted vs rejected
  // return all requests as well as pending, accepted,
  // rejected as separate lists
  const idToken = req.query.idToken;
  if (idToken==null ) {
    console.log("idToken==null");
    return res.status(401).json({message: "User is not logged in"});
  }

  // TODO here: check if the user type is patient
  // if not, return an error of invalid user type (mayber code 422?)

  const doctorPatientConnectionRef = db.collection("doctor_patient_connection");
  firebase.auth()
      .verifyIdToken(idToken)
      .then(async (decodedToken) => {
        const uid = decodedToken.uid;
        await doctorPatientConnectionRef.where("patientUID", "==", uid).get()
            .then(async (querySnapshot) => {
              if (!querySnapshot.empty) {
                const myDoctorRequests = [];
                for (const item of querySnapshot.docs) {
                  myDoctorRequests.push(item);
                }
                return res.status(200).json({doctor_requests:
                  myDoctorRequests});
              } else {
                return res.status(200).json({doctor_requests: []});
              }
            });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({message: "Some error has occurred..."});
      });
});

app.post("/delete_doctor_requests", (req, res) => {
  // user should be logged in patient
  // should provide id of doctor request
  // delete it
  const idToken = req.body.idToken;
  const _requestID = req.body.request_id;

  if (idToken==null ) {
    console.log("idToken==null");
    return res.status(401).json({message: "User is not logged in"});
  }

  if (_requestID==null||_requestID==="") {
    console.log("_requestID==null||_requestID===''");
    return res.status(422).json({message: "No request_id given"});
  }

  firebase.auth()
      .verifyIdToken(idToken)
      .then(async (decodedToken) => {
        const curentUserUID = decodedToken.uid;
        console.log("_curentUserUID: "+curentUserUID);
        // check if logged in user is the one on the request.
        // delete if so
        // else give this request does not exist error
        const doctorPatientConnectionRef = db
            .collection("doctor_patient_connection");

        doctorPatientConnectionRef.doc(_requestID).get()
            .then(async (querySnapshot) => {
              if (!querySnapshot.empty) {
                const doctorPatientConnectionRequest = querySnapshot.data();
                if (doctorPatientConnectionRequest==undefined) {
                  return res.status(500).json({message:
                    "Some error has occurred..."});
                }
                if (doctorPatientConnectionRequest.patientUID===curentUserUID) {
                  querySnapshot.ref.delete();
                  return res.status(200).json({message:
                    "Request deleted successfully"});
                } else {
                  return res.status(204).json({message:
                    "Your request with this request_id was not found"});
                }
              } else {
                return res.status(204).json({message:
                  "Your request with this request_id was not found"});
              }
            });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({message: "Some error has occurred..."});
      });
});

app.get("/my_patient_requests", (req, res) => {
  // user should be logged in practitioner
  // return all requests by still existing users
  const idToken = req.query.idToken;
  if (idToken==null ) {
    console.log("idToken==null");
    return res.status(401).json({message: "User is not logged in"});
  }

  // TODO here: check if the user type is practitioner
  // if not, return an error of invalid user type (mayber code 422?)

  const doctorPatientConnectionRef = db.collection("doctor_patient_connection");
  firebase.auth()
      .verifyIdToken(idToken)
      .then(async (decodedToken) => {
        const uid = decodedToken.uid;
        await doctorPatientConnectionRef.where("practitionerUID", "==",
            uid).get()
            .then(async (querySnapshot) => {
              if (!querySnapshot.empty) {
                // TODO: divide results into pending vs accepted vs rejected
                // return all requests as well as pending,
                // accepted, rejected as separate lists
                const myPatientRequests = [];
                for (const item of querySnapshot.docs) {
                  myPatientRequests.push(item);
                }
                return res.status(200).json({patient_requests:
                  myPatientRequests});
              } else {
                return res.status(200).json({patient_requests: []});
              }
            });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({message: "Some error has occurred..."});
      });
});

app.post("/edit_patient_requests", (req, res) => {
  // user should be logged in practitioner
  // if pending status:
  // accept or reject based
  // display message
  // if rejectd status:
  // can change to accepted
  // if accepted status:
  // edit fields
  // OR move patient into previous patients by changing status to previous
  const idToken = req.body.idToken;
  const _requestID = req.body.request_id;
  const _status = req.body.status;
  const _doctorNotes = req.body.doctor_notes;
  if (idToken==null ) {
    console.log("idToken==null");
    return res.status(401).json({message: "User is not logged in"});
  }

  // TODO here: check if the user type is practitioner
  // if not, return an error of invalid user type (mayber code 422?)

  const doctorPatientConnectionRef = db.collection("doctor_patient_connection");
  firebase.auth()
      .verifyIdToken(idToken)
      .then(async (decodedToken) => {
        const curentUserUID = decodedToken.uid;
        // TODO retrieve connection request with given ID
        // check if it is for the current doctor
        doctorPatientConnectionRef.doc(_requestID).get()
            .then(async (docSnapshot) => {
              // TODO: is this right?
              // https://firebase.google.com/docs/firestore/manage-data/add-data#web_3
              if (docSnapshot.exists) {
                const doctorPatientConnectionRequest = docSnapshot;
                if (doctorPatientConnectionRequest.data()
                    .practitionerUID===curentUserUID) {
                  if (["accepted", "previous", "rejected"].includes(_status)) {
                    doctorPatientConnectionRef.doc(_requestID).update({
                      status: _status,
                    })
                        .then(() => {
                          console.log("Patient request successfully edited!");
                        })
                        .catch((error) => {
                          // The document probably doesn't exist.
                          console.error("Error updating document: ", error);
                          return res.status(501).json({message:
                            "Error updating document..."});
                        });
                    return res.status(200).json({message:
              "Patient request successfully edited!"});
                  }
                  if (!(!_doctorNotes)&&_doctorNotes!=="") {
                    doctorPatientConnectionRef.doc(_requestID).update({
                      doctor_notes: _doctorNotes,
                    })
                        .then(() => {
                          console.log("Patient request successfully edited!");
                        })
                        .catch((error) => {
                          // The document probably doesn't exist.
                          console.error("Error updating document: ", error);
                          return res.status(501).json({message:
                            "Error updating document..."});
                        });
                    return res.status(200).json({message:
                      "Patient request successfully edited!"});
                  }
                  return res.status(422).json({message:
                    "Request not fulfilled"});
                } else {
                  return res.status(403).json({message:
                    "Your request with this request_id was not found"});
                }
              } else {
                return res.status(403).json({message:
                    "Your request with this request_id was not found"});
              }
            });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({message: "Some error has occurred..."});
      });
});

// TODO: don't think i can sign in or out with

// ✅ Export Express API as a Cloud Function
exports.api = functions.https.onRequest(app);
