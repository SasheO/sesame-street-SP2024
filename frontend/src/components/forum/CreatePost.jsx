import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../shared/Header";

const CreatePost = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", content: "", tags: "" });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!post.title || !post.content) return;
    
    // Simulate post creation
    setSuccess(true);
    
    // Simulate navigation after 1s to give UI time to update
    setTimeout(() => navigate("/forum"), 1000);
  };

  return (
    <div className="create-post-page">
      <Header label="Carelink Forum"/>

      <button className="back-button" onClick={() => navigate("/forum")}>
        ← Back to Forum
      </button>
      
      <div className="create-post-container">
        <h2>Create a New Post</h2>
        {success ? (
          <p className="success-message">Post created successfully!</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Title</label>
            <input
              placeholder="Enter a descriptive title..."
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
            
            <label>Content</label>
            <textarea
              placeholder="Write your post here..."
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
            />
            
            <label>Tags (comma separated)</label>
            <input
              placeholder="e.g. health, wellness, herbs"
              value={post.tags}
              onChange={(e) => setPost({ ...post, tags: e.target.value })}
            />

            <button className="submit-btn" type="submit">Post</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
