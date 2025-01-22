import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// Save user data to Firestore
export const saveUserData = async (uid, userData) => {
  try {
    await setDoc(doc(db, "users", uid), userData);
    console.log("User data saved!");
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

// Retrieve user data from Firestore
export const getUserData = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error retrieving user data:", error);
  }
};
