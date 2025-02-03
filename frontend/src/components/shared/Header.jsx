import React from 'react';
import { BiSolidUser } from "react-icons/bi";
import './Header.css';

const Header = ({label}) => {
  return (
    <header className="header">
      <button className="menu-btn">☰</button>
      <h1 className="header-title"> {label} </h1>
      <BiSolidUser aria-label="Profile icon"className="profile-btn"></BiSolidUser>
    </header>
  );
};

export default Header;
