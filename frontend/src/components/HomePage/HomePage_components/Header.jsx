import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import "./Header.css";

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
      <button className="menu-btn">
        <BiMenu />
      </button>
      <h1 className="header-title">CareLink Home</h1>
      
      {/* ✅ Display Personalized Profile Pic or Default */}
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
