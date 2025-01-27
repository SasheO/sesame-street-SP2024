// backend/services/FirestoreService.js
const { getFirestore, doc, setDoc, getDoc, updateDoc } = require("firebase/firestore");
const { initializeApp } = require("firebase/app");

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Store user profile information in Firestore
 * @param {string} userId - The unique ID of the user
 * @param {Object} profileData - The user's profile information (e.g., email, phone, photoURL)
 * @returns {Promise<void>}
 */
const saveUserProfile = async (userId, profileData) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, profileData, { merge: true }); // Merge updates with existing data
    console.log("User profile saved successfully!");
  } catch (error) {
    console.error("Error saving user profile: ", error);
    throw error;
  }
};

/**
 * Retrieve user profile information from Firestore
 * @param {string} userId - The unique ID of the user
 * @returns {Promise<Object>} - The user's profile information
 */
const getUserProfile = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      console.log("User profile retrieved successfully!");
      return docSnap.data();
    } else {
      console.log("No user profile found!");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user profile: ", error);
    throw error;
  }
};

/**
 * Update specific fields in a user's profile
 * @param {string} userId - The unique ID of the user
 * @param {Object} updatedData - The fields to update in the user's profile
 * @returns {Promise<void>}
 */
const updateUserProfile = async (userId, updatedData) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, updatedData);
    console.log("User profile updated successfully!");
  } catch (error) {
    console.error("Error updating user profile: ", error);
    throw error;
  }
};

module.exports = {
  saveUserProfile,
  getUserProfile,
  updateUserProfile,
};
