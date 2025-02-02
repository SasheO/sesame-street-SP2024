import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login/login";  // ✅ Ensure correct import
import SignUp from "./components/login/signup";
import ForgotPassword from "./components/login/forgot_pass";
import Home from "./components/home_page/home";
import Profile from "./components/profile/Profile";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />  {/* ✅ Default to login */}
          <Route path="/login" element={<Login />} />  {/* ✅ Ensure this route exists */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
