import React from 'react';
import { BiSolidUser } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ label }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <GiHamburgerMenu className="menu-btn" aria-label="Menu"/>
      <h1 className="header-title">{label}</h1>
      <BiSolidUser aria-label="Profile icon" className="profile-btn" onClick={() => navigate('/profile')} />
    </header>
  );
};

export default Header;
