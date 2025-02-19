import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mockArticles from "./mockArticles";
import SearchBar from "../../shared/SearchBar";
import Header from "../../shared/Header";
import "./SearchResults.css"; // Add styles for layout

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get search term from URL query params
  const query = new URLSearchParams(location.search).get("q") || "";

  // Filter fake articles to "match" the search
  const filteredArticles = mockArticles.filter((article) =>
    article.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = (term) => {
    if (term.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(term)}`);
    }
  };

  return (
    <div className="search-results-container">

      <Header label="Carelink Search Results"/>
      <SearchBar 
        placeholder="Find a simple remedy"
        onSearch={handleSearch}
        showSearchIcon={true}
        showMicrophoneIcon={true}
        initialValue={query}
      />
      <div className="results-display-container">
        {/* 🔹 Back Button */}
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2>Search Results for "{query}"</h2>

        {filteredArticles.length > 0 ? (
          <ul className="results-list">
            {filteredArticles.map((article) => (
              <li key={article.id} className="result-item">
                <h3>{article.title}</h3>
                <p>{article.snippet}</p>
                <button onClick={() => navigate(article.url)}>Read More</button>
              </li>
            ))}
          </ul>
          ) : (
            <p>No results found.</p>
          )}
      </div>
      
    </div>
  );
};

export default SearchResults;
