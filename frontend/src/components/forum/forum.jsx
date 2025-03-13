import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment, getDoc } from "firebase/firestore"; 
import { db } from "../../firebase"; // ✅ Import Firestore DB
import { BiHome, BiPlus, BiMessageRounded, BiX, BiHeart } from "react-icons/bi"; // ✅ Import Icons
import Header from "../shared/Header";
import SearchBar from "../shared/SearchBar";
import "./Forum.css";

const Forum = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [threads, setThreads] = useState([]);

  // ✅ Fetch posts in real-time from Firestore
  useEffect(() => {
    const fetchPosts = () => {
      const forumCollection = collection(db, "forum");
      const q = query(forumCollection, orderBy("date", "desc"));

      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("📌 Fetched posts from Firestore:", posts);
        setThreads(posts);
      });

      return unsubscribe; // Cleanup listener when component unmounts
    };

    fetchPosts();
  }, []);
  const handleLike = async (threadId) => {
    try {
        const threadRef = doc(db, "forum", threadId);
        
        // ✅ Increment likes count only
        await updateDoc(threadRef, {
            likes: increment(1) // Directly increments likes
        });

        console.log(`✅ Liked post ${threadId}`);
    } catch (error) {
        console.error("⚠️ Error liking post:", error);
    }
};


  // ✅ Filter forum threads based on search & selected tags
  const filteredThreads = threads.filter((thread) => {
    if (!thread || !thread.title) return false;

    const matchesSearch =
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(thread.tags) && thread.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesTags =
      selectedTags.length === 0 || selectedTags.every((tag) => Array.isArray(thread.tags) && thread.tags.includes(tag));

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
              {tag} <BiX className="remove-tag" onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))} />
            </span>
          ))}
          <button className="clear-all-tags" onClick={() => setSelectedTags([])}>Clear All</button>
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
                  <p>{thread.author || "Anonymous"} • {thread.date ? new Date(thread.date.seconds * 1000).toLocaleDateString() : "Unknown Date"}</p>
                  <p>{thread.content}</p>
                  <p className="thread-tags">
                    <strong>Tags: </strong>
                    {(Array.isArray(thread.tags) ? thread.tags : []).map((tag) => (
                      <span
                        key={tag}
                        className={`tag ${selectedTags.includes(tag) ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTags((prevTags) =>
                            prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
                          );
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </p>
                  
                  {/* ✅ Like & Comment Count Centered on Same Level */}
                  <div className="thread-actions">
                    <span className="action like-action" onClick={(e) => { e.stopPropagation(); handleLike(thread.id); }}>
                      <BiHeart className="action-icon" /> {thread.likes || 0}
                    </span>
                    <span className="action comment-action">
                      <BiMessageRounded className="action-icon" /> {thread.comments || 0}
                    </span>
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
