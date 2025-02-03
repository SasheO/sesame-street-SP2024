import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BiMenu } from "react-icons/bi"; // ✅ Ensure this import is correct
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Dynamically update header title
  const headerTitle = location.pathname === "/forum" ? "CareLink Forum" : "CareLink Home";

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  return (
    <header className="header">
      <button className="menu-btn">
        <BiMenu />
      </button>
      {/* ✅ Use dynamic title */}
      <h1 className="header-title">{headerTitle}</h1> 
      
      {/* Profile Picture */}
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
