import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import LocationsPage from './components/Locations/LocationsPage';
import Login from "./components/login/login";  
import SignUp from "./components/login/signup";
import ForgotPassword from "./components/login/forgot_pass";
import Profile from "./components/profile/Profile";
import Forum from "./components/forum/forum"
import './App.css';
import SearchResults from "./components/HomePage/HomePage_Components/SearchBar_Components/SearchResults"; // ✅ Import new page


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
        <Route path="/home" element={<HomePage />} />
        <Route path="/search-results" element={<SearchResults />} /> {/* ✅ New Route */}
      </Routes>
    </Router>
  );
}

export default App;
