import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiHome, BiPlus, BiMessageRounded, BiX } from "react-icons/bi";
import Header from "../shared/Header";
import SearchBar from "../shared/SearchBar";
import "./Forum.css";

const mockThreads = [
  {
    id: "mock-1",
    title: "Local herbs for migraine",
    user: "@username1",
    date: "Dec 1, 2023",
    content: "Natural remedies may help prevent the onset of migraine attacks...",
    likes: 3456,
    comments: [],
    tags: ["health", "migraine", "herbs"],
  },
  {
    id: "mock-2",
    title: "What type of herb is this?",
    user: "@username2",
    date: "Jan 23, 2024",
    content: "I came across this plant, does anyone know what this is?",
    likes: 2540,
    comments: [],
    tags: ["plants", "herbs", "identification"],
  },
  {
    id: "mock-3",
    title: "Benefits of turmeric",
    user: "@username3",
    date: "Feb 5, 2024",
    content: "Turmeric has anti-inflammatory properties that benefit health.",
    likes: 1200,
    comments: [],
    tags: ["health", "herbs"],
  }
];

const Forum = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    let storedThreads = JSON.parse(localStorage.getItem("forumPosts"));

    if (!storedThreads || storedThreads.length === 0) {
      console.log("📌 No stored threads found. Initializing with mock data.");
      localStorage.setItem("forumPosts", JSON.stringify(mockThreads));
      storedThreads = mockThreads;
    } else {
      console.log("📌 Using stored forum posts.");
    }

    setThreads(storedThreads);
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const clearAllTags = () => setSelectedTags([]);

  const filteredThreads = threads.filter((thread) => {
    if (!thread || !thread.title) return false;

    const matchesSearch =
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTags =
      selectedTags.length === 0 || thread.tags.some((tag) => selectedTags.includes(tag));

    return matchesSearch && matchesTags;
  });

  return (
    <div className="forum-page">
      <Header label="Carelink Forum" />
      <SearchBar
        placeholder="Search forum posts"
        onSearch={(term) => setSearchQuery(term)}
        initialValue={searchQuery}
        autoSearch={true}
      />

      {selectedTags.length > 0 && (
        <div className="selected-tags-container">
          <p>Filtering by: </p>
          {selectedTags.map((tag) => (
            <span key={tag} className="selected-tag">
              {tag} <BiX className="remove-tag" onClick={() => toggleTag(tag)} />
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
                  onClick={() => navigate(`/forum/${thread.id}`, { state: { post: thread } })}
                >
                  <h3>{thread.title}</h3>
                  <p>{thread.user} • {thread.date}</p>
                  <p>{thread.content}</p>
                  <p className="thread-tags">
                    <strong>Tags: </strong>
                    {thread.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`tag ${selectedTags.includes(tag) ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTag(tag);
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </p>
                  <div className="thread-actions">
                    <span>❤️ {thread.likes}</span>
                    <span>💬 {thread.comments.length}</span> {/* ✅ Fixed issue */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bottom-bar">
        <button onClick={() => navigate("/forum")} className="bottom-icon">
          <BiHome />
          <span>Home Feed</span>
        </button>

        <button onClick={() => navigate("/forum/create")} className="bottom-icon plus-btn">
          <BiPlus />
        </button>

        <button onClick={() => navigate("/my-chats")} className="bottom-icon">
          <BiMessageRounded />
          <span>My Chats</span>
        </button>
      </div>
    </div>
  );
};

export default Forum;
