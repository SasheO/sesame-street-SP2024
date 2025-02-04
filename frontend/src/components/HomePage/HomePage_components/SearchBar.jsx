import React from 'react';
import { BiSearch, BiMicrophone } from 'react-icons/bi';
import './SearchBar.css';

const SearchBar = () => {
  return (
    <div className="search-bar-container">
      <input type="text" placeholder="Find a simple remedy" className="search-input" />
      <div className="icon-buttons">
        <BiSearch aria-label="Search icon" className="icon-btn" />
        <BiMicrophone aria-label="Microphone icon" className="icon-btn" />
      </div>
    </div>
  );
};

export default SearchBar;
