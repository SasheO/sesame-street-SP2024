import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi"; // Import back icon
import Header from "../HomePage/HomePage_Components/Header";
import "./CreatePost.css";

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, content, tags: tags.split(",").map(tag => tag.trim()) });
    navigate("/forum"); // Redirect back to forum after posting
  };

  return (
    <div className="create-post-page">
      <Header />

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate("/forum")}>
        <BiArrowBack className="back-icon" /> Back to Forum
      </button>

      <div className="create-post-container">
        <h2>Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter a descriptive title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Content</label>
          <textarea
            placeholder="Write your post here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <label>Tags (comma separated)</label>
          <input
            type="text"
            placeholder="e.g. health, wellness, herbs"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <button type="submit" className="submit-btn">Post</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
