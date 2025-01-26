import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Profile Icon in Top Right */}
      <div className="top-bar">
        <img
          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          alt="Profile"
          className="profile-icon"
          onClick={() => navigate("/profile")}
        />
      </div>

      <h1>Welcome to CareLink</h1>
      <p>Select an option below:</p>

      <div className="button-container">
        <button className="disabled-button">Chat Forum (Coming Soon)</button>
        <button className="disabled-button">Healthcare Near You (Coming Soon)</button>
        <button className="profile-button" onClick={() => navigate("/profile")}>
          Go to Profile
        </button>
      </div>
    </div>
  );
};

export default Home;
