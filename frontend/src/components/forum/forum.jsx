import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiHome, BiPlus, BiMessageRounded, BiSearch, BiX } from "react-icons/bi";
import Header from "../HomePage/HomePage_Components/Header";
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
    replies: [],
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
    replies: [],
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
    replies: [],
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
    replies: [],
  }
];

const Forum = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);

  // 🔹 Updated filter function to include BOTH search bar & tag filtering
  const filteredThreads = mockThreads.filter((thread) =>
    (thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    (selectedTag ? thread.tags.includes(selectedTag) : true)
  );

  return (
    <div className="forum-page">
      <Header />

      {/* Search Bar */}
      <div className="forum-search-bar">
        <input
          type="text"
          placeholder="Search forum posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery ? (
          <BiX className="clear-icon" onClick={() => setSearchQuery("")} />
        ) : (
          <BiSearch className="search-icon" />
        )}
      </div>

      {/* Main Forum Layout */}
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
                    {thread.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="tag"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering thread click
                          setSelectedTag(tag);
                        }}
                      >
                        {tag}{index < thread.tags.length - 1 ? ", " : ""}
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
      {/* Bottom Navigation Bar */}
      <div className="bottom-bar">
        <BiHome onClick={() => navigate("/home")} className="bottom-icon" />
        <BiPlus onClick={() => navigate("/forum/create")} className="bottom-icon" />
        <BiMessageRounded className="bottom-icon" />
      </div>

    </div>
  );
};

export default Forum;
