import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css"; // Make sure this file exists

const CreatePost = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", content: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send post to backend (or store locally for now)
    console.log("New Post:", post);
    navigate("/forum"); // Redirect to forum after posting
  };

  return (
    <div className="create-post-container">
      <h2>Create a Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={post.title}
          onChange={handleChange}
          placeholder="Enter post title..."
          required
        />

        <label htmlFor="content">Description</label>
        <textarea
          id="content"
          name="content"
          value={post.content}
          onChange={handleChange}
          placeholder="Write something..."
          required
        ></textarea>

        <div className="button-group">
          <button type="button" className="cancel-btn" onClick={() => navigate("/forum")}>
            Cancel
          </button>
          <button type="submit" className="post-btn">Post</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
