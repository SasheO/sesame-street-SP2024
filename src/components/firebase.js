// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWnLAaWyVYeI2k709ZdMoU3GDNJqFArgs",
  authDomain: "carelink-d0b71.firebaseapp.com",
  projectId: "carelink-d0b71",
  storageBucket: "carelink-d0b71.firebasestorage.app",
  messagingSenderId: "252357033948",
  appId: "1:252357033948:web:39ba6a1cfc002c41f21919",
  measurementId: "G-D3NLL9K1G7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);