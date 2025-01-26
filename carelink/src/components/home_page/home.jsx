import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Make sure this file exists

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/"); // Redirect to login if not authenticated
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser"); // Clear login session
    navigate("/"); // Redirect to login
  };

  return (
    <div className="home-container">
      {/* Profile Icon in the Top Right Corner */}
      <div className="top-bar">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" // ✅ Profile Icon (Replace if needed)
          alt="Profile"
          className="profile-icon"
          onClick={() => navigate("/profile")}
        />
      </div>

      <h2>Welcome, {user ? user.name : "User"}!</h2>
      <p>Select an option below:</p>

      <div className="button-container">
        <button className="disabled-button">Chat Forum (Coming Soon)</button>
        <button className="disabled-button">Healthcare Near You (Coming Soon)</button>
      </div>
      
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
