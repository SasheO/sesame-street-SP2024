import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../shared/Header";
import SearchBar from "../shared/SearchBar";
import "../forum/Forum.css";
import { db } from "../../firebase";
import { BiHome, BiPlus, BiMessageRounded, BiTrash } from "react-icons/bi";
import { useAuth } from "../../context/AuthContext";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const MyChats = () => {
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserPosts = async () => {
      const currentUserEmail = (user?.email || "").toLowerCase();

      try {
        const forumSnapshot = await getDocs(collection(db, "forum"));

        const allPosts = await Promise.all(
          forumSnapshot.docs.map(async (postDoc) => {
            const postData = { docId: postDoc.id, ...postDoc.data() }; // ✅ Save Firestore doc ID
            const commentsSnapshot = await getDocs(collection(db, "forum", postDoc.id, "comments"));
            const comments = commentsSnapshot.docs.map((commentDoc) => ({
              id: commentDoc.id,
              ...commentDoc.data(),
            }));

            return { ...postData, comments };
          })
        );

        const userRelatedPosts = allPosts.filter((post) => {
          const authorMatch = post.author?.toLowerCase() === currentUserEmail;
          const commentMatch = Array.isArray(post.comments) &&
            post.comments.some((comment) => comment.user?.toLowerCase() === currentUserEmail);
          return authorMatch || commentMatch;
        });

        setUserPosts(userRelatedPosts);
      } catch (error) {
        console.error("❌ Error loading MyChats:", error);
      }
    };

    if (user?.email) {
      fetchUserPosts();
    }
  }, [user]);

  const handleDeletePost = async (docId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      console.log("🗑️ Deleting post with docId:", docId);

      const postRef = doc(db, "forum", docId);
      await deleteDoc(postRef);

      console.log("✅ Post deleted successfully");

      setUserPosts((prev) => prev.filter((post) => post.docId !== docId));
    } catch (error) {
      console.error("❌ Error deleting post:", error.message || error);
    }
  };

  const filteredPosts = userPosts.filter(
    (post) =>
      post.title &&
      typeof post.title === "string" &&
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="forum-container">
      <Header label="CareLink" />
      <SearchBar placeholder="Search chats" onSearch={(term) => setSearchTerm(term)} />
      <h3 style={{ textAlign: "center", marginBottom: "15px" }}>My Forum Posts and Replies</h3>

      {filteredPosts.length === 0 ? (
        <p className="no-chats">No conversations started yet</p>
      ) : (
        <div className="thread-list">
          {filteredPosts.map((post) => (
            <div key={post.docId} className="thread-card">
              <div onClick={() => navigate(`/forum/${post.docId}`, { state: { post } })}>
                <h3>{post.title}</h3>
                <p>{post.content?.substring(0, 50)}...</p>
                <span className="thread-meta">
                  {post.author} • {post.date?.seconds ? new Date(post.date.seconds * 1000).toLocaleDateString() : "Unknown Date"}
                </span>
                <div className="thread-actions">
                  <span className="like-button">❤️ {post.likes || 0}</span>
                  <span className="like-button">💬 {post.comments?.length || 0}</span>
                </div>
              </div>
              {post.author?.toLowerCase() === user?.email?.toLowerCase() && (
                <span
                  className="like-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePost(post.docId);
                  }}
                  style={{ cursor: "pointer", color: "red", marginTop: "10px", display: "inline-block" }}
                >
                  <BiTrash /> Delete
                </span>
              )}
            </div>
          ))}
        </div>
      )}

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
