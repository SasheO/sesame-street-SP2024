import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api"; // ✅ Global LoadScript
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./components/HomePage/HomePage";
import LocationsPage from "./components/Locations/LocationsPage";
import Login from "./components/login/login";
import SignUp from "./components/login/signup";
import ForgotPassword from "./components/login/forgot_pass";
import Profile from "./components/profile/Profile";
import Forum from "./components/forum/forum";
import ForumThread from "./components/Forum/ForumThread";
import CreatePost from "./components/Forum/CreatePost";
import SearchResults from "./components/HomePage/HomePage_components/SearchResults";
import DoctorsPage from "./components/Doctors/DoctorsPage";
import DoctorPatientsPage from "./components/Doctor_view/DoctorPatientsPage";
import DummyDoctors from "./components/Doctors/DummyDoctors.json";
import MyChats from "./components/Forum/MyChats";
import PatientDetails from './components/Doctor_view/PatientDetails';
import "./App.css";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ["places"]; // ✅ Define libraries outside component

function App(){
  const [doctors, setDoctors] = useState(DummyDoctors);
  const [doctorRequests, setDoctorRequests] = useState([]);

  const handleDoctorRequest = (updatedRequest) => {
    setDoctorRequests((prevRequests) => {
      const existingRequestIndex = prevRequests.findIndex((req) => req.id === updatedRequest.id);
  
      if (existingRequestIndex !== -1) {
        // Update the existing request instead of creating a new one
        const updatedRequests = [...prevRequests];
        updatedRequests[existingRequestIndex] = updatedRequest;
        return updatedRequests;
      } else {
        // Add a new request if it doesn't exist
        return [...prevRequests, updatedRequest];
      }
    });

    // Update doctor state to requested
    setDoctors((prevDoctors) =>
      prevDoctors.map((doc) =>
        doc.id === updatedRequest.id ? { ...doc, requested: true } : doc
      )
    );
  };

  const updateDoctorStatus = (doctorId, status) => {
    setDoctors((prevDoctors) =>
      prevDoctors.map((doc) =>
        doc.id === doctorId ? { ...doc, requested: status !== "denied", accepted: status === "accepted" } : doc
      )
    );
  };

  // Update patients list to remove the doctor request if deleted by the patient
  const handleDeleteDoctorRequest = (doctorId) => {
    setDoctorRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== doctorId)
    );
  
    // Also update doctors list to reflect that the doctor is no longer requested
    setDoctors((prevDoctors) =>
      prevDoctors.map((doc) =>
        doc.id === doctorId ? { ...doc, requested: false, accepted: false } : doc
      )
    );
  };

  return (
    <AuthProvider> {/* ✅ Wrap entire app with Auth Context */}
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}> {/* ✅ Load Google Maps API globally */}
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:id" element={<ForumThread />} />
            <Route path="/forum/create" element={<CreatePost />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/patient/:patientId" element={<PatientDetails />} />
            <Route path="/doctor" element={<DoctorsPage onDoctorRequest={handleDoctorRequest} doctors={doctors} onDeleteDoctorRequest={handleDeleteDoctorRequest} doctorRequests={doctorRequests}/>} />
            <Route path="/doctor-patients" element={<DoctorPatientsPage doctorRequests={doctorRequests} updateDoctorStatus={updateDoctorStatus}/>} /> 
            <Route path="/my-chats" element={<MyChats />} />
          </Routes>
        </Router>
      </LoadScript>
    </AuthProvider>
  );
}

export default App;
