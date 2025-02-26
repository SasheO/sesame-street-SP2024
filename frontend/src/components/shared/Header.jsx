import React, { useState, useEffect } from 'react';
import { BiSolidUser } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import './Header.css';
import SlideOutMenu from './SlideOutMenu';

const Header = ({ label }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  //   if (loggedInUser) {
  //     setUser(loggedInUser);
  //   }
  // }, []);

  return (
    <header className="header">
      <GiHamburgerMenu className="menu-btn" aria-label="Menu" onClick={() => setMenuOpen(true)} />
      <h1 className="header-title" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>{label}</h1>

      {/* ✅ Display Profile Picture or Default User Icon */}
      {user?.profilePic ? (
        <img
          src={user.profilePic}
          alt="Profile"
          className="profile-picture"
          onClick={() => navigate('/profile')}
        />
      ) : (
        <BiSolidUser aria-label="Profile icon" className="profile-btn" onClick={() => navigate('/profile')} />
      )}

      <SlideOutMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
};

export default Header;