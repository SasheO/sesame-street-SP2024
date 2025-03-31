import React, { useState } from 'react';
import { BiSolidUser } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import './Header.css';
import SlideOutMenu from './SlideOutMenu';
import { useAuth } from "../../context/AuthContext";

const Header = ({ label }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useAuth(); // ✅ Get user from Firebase Auth

  const handleProfileClick = () => {
    console.log("🔎 Checking user before navigating:", user);
    if (loading) return; // Prevent navigation while loading
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <GiHamburgerMenu className="menu-btn" aria-label="Menu" onClick={() => setMenuOpen(true)} />
      <h1 className="header-title" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>{label}</h1>

      {/* ✅ Ensure profile icon calls handleProfileClick */}
      {user && user?.profilePic ? (
        <img
          src={user.profilePic}
          alt="Profile"
          className="profile-picture-header"
          onClick={handleProfileClick} // ✅ Now correctly calls the function
        />
      ) : (
        <BiSolidUser 
          aria-label="Profile icon" 
          className="profile-btn" 
          onClick={handleProfileClick} // ✅ Now correctly calls the function
        />
      )}

      <SlideOutMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
};

export default Header;
