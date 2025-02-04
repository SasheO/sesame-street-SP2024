import React from 'react';
import { BiSolidUser } from "react-icons/bi";

const Header = () => {
  return (
    <header className="header">
      <button className="menu-btn">☰</button>
      <h1 className="header-title">CareLink Home</h1>
      <BiSolidUser aria-label="Profile icon"className="profile-btn"></BiSolidUser>
    </header>
  );
};

export default Header;
