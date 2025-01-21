import React from 'react';
import { BiSearch, BiMicrophone } from 'react-icons/bi'; // Import icons
import '../App.css';

const SearchBar = () => {
  return (
    <div className="search-bar-container">
      <div className="icon-buttons">
        <BiSearch className="icon-btn" />
        <BiMicrophone className="icon-btn" />
      </div>
      <input type="text" placeholder="Find a simple remedy" className="search-input" />
    </div>
  );
};

export default SearchBar;
