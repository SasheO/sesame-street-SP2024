import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mockArticles from "./mockArticles";
import SearchBar from "../../shared/SearchBar";
import Header from "../../shared/Header";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q") || "";

  const handleSearch = (term) => {
    if (term.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(term)}`);
    }
  };

  const highlightQuery = (text) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <b key={i}>{part}</b> : part
    );
  };

  const filteredArticles = mockArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.snippet.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-results-page">
      <Header label="Carelink Search" />
      <SearchBar
        placeholder="Find a simple remedy"
        onSearch={handleSearch}
        showSearchIcon={true}
        showMicrophoneIcon={true}
        initialValue={query}
      />

      <div className="results-section">
        {filteredArticles.length > 0 ? (
          <ul className="results-list">
            {filteredArticles.map((article) => (
              <li key={article.id} className="result-item-box">
                <a
                  className="result-title"
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {article.title}
                </a>
                <p className="result-snippet">
                  {highlightQuery(article.snippet)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found for "{query}".</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
