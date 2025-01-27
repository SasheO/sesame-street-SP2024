import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  return (
    <header className="header">
      <button className="menu-btn">☰</button>
      <h1 className="header-title">CareLink Home</h1>
      {/* Directly place the profile picture inside the header */}
      <img
        src={user?.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
        alt="Profile"
        className="profile-picture"
        onClick={() => navigate("/profile")}
      />
    </header>
  );
};

export default Header;
