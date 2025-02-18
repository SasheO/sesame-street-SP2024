import React, { useState } from 'react';
import { BiSolidUser } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import './Header.css';
import SlideOutMenu from './SlideOutMenu';

const Header = ({ label }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <GiHamburgerMenu className="menu-btn" aria-label="Menu" onClick={() => setMenuOpen(true)} />
      <h1 className="header-title" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>{label}</h1>
      <BiSolidUser aria-label="Profile icon" className="profile-btn" onClick={() => navigate('/profile')} />

      <SlideOutMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
};

export default Header;