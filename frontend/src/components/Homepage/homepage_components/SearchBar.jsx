import React, { useState } from "react";
import { BiX } from "react-icons/bi"; // Import "X" icon
import "./SearchBar.css";

const SearchBar = () => {
  const [searchText, setSearchText] = useState("");

  const handleClear = () => {
    setSearchText(""); // Clears the input field
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      
      {/* Small 'X' button inside input field */}
      {searchText && (
        <BiX className="clear-icon" onClick={handleClear} />
      )}
    </div>
  );
};

export default SearchBar;
