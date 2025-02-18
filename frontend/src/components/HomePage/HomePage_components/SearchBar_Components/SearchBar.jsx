import React, { useState } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search for health topics..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
        onKeyPress={(e) => e.key === "Enter" && handleSearch()} // Allow Enter key search
      />
      <button className="search-icon" onClick={searchTerm ? clearSearch : handleSearch}>
        {searchTerm ? <BiX /> : <BiSearch />}
      </button>
    </div>
  );
};

export default SearchBar;
