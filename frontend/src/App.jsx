import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import LocationsPage from './components/Locations/LocationsPage';
import Login from "./components/login/login";  
import SignUp from "./components/login/signup";
import ForgotPassword from "./components/login/forgot_pass";
import Profile from "./components/profile/Profile";
import Forum from "./components/forum/forum"
import ForumThread from "./components/Forum/ForumThread";
import CreatePost from "./components/Forum/CreatePost";
import SearchResults from "./components/HomePage/HomePage_components/SearchResults";
import DoctorsPage from './components/Doctors/DoctorsPage';
import DoctorPatientsPage from "./components/Doctor_view/DoctorPatientsPage"; 
import MyChats from "./components/Forum/MyChats";
import './App.css';

function App() {
  return (
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
        <Route path="/doctor" element={<DoctorsPage />} />
        <Route path="/doctor-patients" element={<DoctorPatientsPage />} /> 
        <Route path="/my-chats" element={<MyChats />} />
      </Routes>
    </Router>
  );
}

export default App;
