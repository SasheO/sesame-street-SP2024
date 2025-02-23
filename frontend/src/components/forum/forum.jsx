import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiHome, BiPlus, BiMessageRounded, BiX } from "react-icons/bi";
import Header from "../shared/Header";
import SearchBar from "../shared/SearchBar";
import "./Forum.css";

const mockThreads = [
  {
    id: 1,
    title: "Local herbs for migraine",
    user: "@username1",
    date: "Dec 1, 2023",
    content: "Natural remedies may help prevent the onset of migraine attacks...",
    likes: 3456,
    comments: 254,
    tags: ["health", "migraine", "herbs"],
  },
  {
    id: 2,
    title: "What type of herb is this?",
    user: "@username2",
    date: "Jan 23, 2024",
    content: "I came across this plant, does anyone know what this is?",
    likes: 2540,
    comments: 156,
    tags: ["plants", "herbs", "identification"],
  },
  {
    id: 3,
    title: "Benefits of turmeric",
    user: "@username3",
    date: "Feb 2, 2024",
    content: "Turmeric has amazing anti-inflammatory properties...",
    likes: 1820,
    comments: 89,
    tags: ["health", "turmeric", "anti-inflammatory"],
  },
  {
    id: 4,
    title: "Best teas for digestion?",
    user: "@username4",
    date: "Feb 10, 2024",
    content: "Looking for herbal teas that aid in digestion. Any suggestions?",
    likes: 1324,
    comments: 97,
    tags: ["tea", "digestion", "herbs"],
  }
];

const Forum = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]); // Allows multiple selected tags

  // Function to handle tag selection
  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  // Function to clear all selected tags
  const clearAllTags = () => setSelectedTags([]);

  // Filter threads based on search and selected tags
  const filteredThreads = mockThreads.filter((thread) => {
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTags = selectedTags.length === 0 || thread.tags.some((tag) => selectedTags.includes(tag));

    return matchesSearch && matchesTags;
  });

  return (
    <div className="forum-page">
      <Header label="Carelink Forum"/>
      <SearchBar 
        placeholder="Search forum posts" 
        onSearch={(term) => setSearchQuery(term)} 
        initialValue={searchQuery} 
        autoSearch={true}
      />

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="selected-tags-container">
          <p>Filtering by: </p>
          {selectedTags.map((tag) => (
            <span key={tag} className="selected-tag" data-testid={`selected-tag-${tag}`}>
              {tag} <BiX className="remove-tag" data-testid={`clear-tag-${tag}`} onClick={() => toggleTag(tag)} />
            </span>
          ))}
          <button className="clear-all-tags" onClick={clearAllTags}>Clear All</button>
        </div>
      )}

      <div className="forum-container">
        <div className="forum-sidebar">
          <h3>Forum Posts</h3>
          {filteredThreads.length === 0 ? (
            <p className="no-results">No results found</p>
          ) : (
            <div className="thread-list">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  className="thread-card"
                  onClick={() => navigate(`/forum/${thread.id}`, { state: { thread } })}
                >
                  <h3>{thread.title}</h3>
                  <p>{thread.user} • {thread.date}</p>
                  <p>{thread.content}</p>
                  
                  {/* Tag List */}
                  <p className="thread-tags">
                    <strong>Tags: </strong>
                    {thread.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className={`tag ${selectedTags.includes(tag) ? "active" : ""}`}
                        data-testid={`tag-${tag}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent thread click event
                          toggleTag(tag);
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </p>

                  <div className="thread-actions">
                    <span>❤️ {thread.likes}</span>
                    <span>💬 {thread.comments}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bottom-bar">
        <BiHome onClick={() => navigate("/home")} className="bottom-icon" />
        <BiPlus 
          onClick={() => navigate("/forum/create")} 
          className="bottom-icon" 
          data-testid="create-post-btn" 
        />
        <BiMessageRounded className="bottom-icon" />
      </div>
    </div>
  );
};

export default Forum;
