import React, { useState, useEffect } from 'react';
import { BiSearch, BiMicrophone, BiX } from 'react-icons/bi';
import { IoCloseCircleOutline } from 'react-icons/io5';
import './SearchBar.css';

const SearchBar = ({   placeholder,
  onSearch,
  showSearchIcon = true,
  showMicrophoneIcon = true,
  initialValue = "",
  autoSearch = false }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue || "");

  // Update state if the initial value changes (e.g. when navigating back to results)
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleSearch = () => {
    if (searchTerm.trim() && onSearch) {
      onSearch(searchTerm); // Call the function passed as a prop with the search input
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (onSearch) onSearch("");
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    if (autoSearch && onSearch) {
      onSearch(newValue);
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        className="search-input"
        onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Trigger search on Enter key
      />
      <div className="icon-buttons">
      {showSearchIcon && (
          <>
            {searchTerm && (
              <IoCloseCircleOutline
                aria-label="Clear search"
                className="icon-btn"
                onClick={clearSearch}
              />
            )}
            <BiSearch
              aria-label="Search icon"
              className="icon-btn"
              onClick={handleSearch}
            />
          </>
        )}
      {showMicrophoneIcon && <BiMicrophone aria-label="Microphone icon" className="icon-btn" />}
      </div>
    </div>
  );
};

export default SearchBar;
