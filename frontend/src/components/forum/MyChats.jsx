import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../shared/Header";
import SearchBar from "../shared/SearchBar";
import "./MyChats.css";
import { BiHome, BiPlus, BiMessageRounded, BiTrash } from "react-icons/bi";

const MyChats = () => {
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUserPosts = () => {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
      const allPosts = JSON.parse(localStorage.getItem("forumPosts")) || [];

      console.log("📌 Loaded posts from localStorage:", allPosts);

      // ✅ Ensure every post has valid fields before adding to userPosts
      const userRelatedPosts = allPosts.filter((post) => {
        if (!post || !post.title || typeof post.title !== "string") return false; // Ensure valid title
        if (typeof post.author !== "string") return false;
        if (!Array.isArray(post.comments)) post.comments = [];

        return (
          post.author === loggedInUser.email ||
          (Array.isArray(post.comments) && post.comments.some(comment => comment.user === loggedInUser.email))
        );
      });

      console.log("📌 MyChats Loaded Posts:", userRelatedPosts);
      setUserPosts(userRelatedPosts);
    };

    fetchUserPosts();

    // ✅ Listen for localStorage updates and refresh MyChats
    const handleStorageChange = () => {
      console.log("🔄 Storage Updated, Re-fetching MyChats...");
      fetchUserPosts();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  const handleDeletePost = (postId) => {
    const allPosts = JSON.parse(localStorage.getItem("forumPosts")) || [];
    const updatedPosts = allPosts.filter((post) => post.id !== postId);

    localStorage.setItem("forumPosts", JSON.stringify(updatedPosts));

    // Update MyChats UI immediately
    setUserPosts(updatedPosts.filter((post) =>
      post.author === JSON.parse(localStorage.getItem("loggedInUser")).email
    ));

    // ✅ Trigger update for all components
    window.dispatchEvent(new Event("storage"));
  };
  
  // ✅ Ensure post.title exists before calling `.toLowerCase()`
  const filteredPosts = userPosts.filter(
    (post) => post.title && typeof post.title === "string" && post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="my-chats-page">
      <Header label="CareLink" />
      <SearchBar placeholder="Search chats" onSearch={(term) => setSearchTerm(term)} />

      {filteredPosts.length === 0 ? (
        <p className="no-chats">No conversations started yet</p>
      ) : (
        <div className="chat-list">
          {filteredPosts.map((post) => (
            <div key={post.id} className="chat-card">
              <div onClick={() => navigate(`/forum/${post.id}`, { state: { post } })}>
                <h3>{post.title}</h3>
                <p>{post.content.substring(0, 50)}...</p>
              </div>
              <BiTrash className="delete-icon" onClick={() => handleDeletePost(post.id)} />
            </div>
          ))}
        </div>
      )}

      {/* Navigation Bar */}
      <div className="bottom-bar">
        <button onClick={() => navigate("/forum")} className="bottom-icon">
          <BiHome />
          <span>Home Feed</span>
        </button>

        <button onClick={() => navigate("/forum/create")} className="bottom-icon plus-btn">
          <BiPlus />
        </button>

        <button
          onClick={() => navigate("/my-chats")}
          className={`bottom-icon ${window.location.pathname === "/my-chats" ? "active" : ""}`}
        >
          <BiMessageRounded />
          <span>My Chats</span>
        </button>
      </div>
    </div>
  );
};

export default MyChats;
