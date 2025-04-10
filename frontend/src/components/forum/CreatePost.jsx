import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import Header from "../shared/Header";
import "./CreatePost.css";
import { BiArrowBack } from "react-icons/bi";

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleCreatePost = async () => {
    if (!title.trim() || !content.trim()) {
      console.error("⚠️ Cannot save post: Missing title or content!");
      return;
    }

    try {
      const newPost = {
        title: title.trim(),
        content: content.trim(),
        tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
        author: user.email || "Anonymous",
        date: serverTimestamp(),
        comments: [],
        likes: [],
      };

      await addDoc(collection(db, "forum"), newPost);
      console.log("✅ Post successfully created in Firestore!");

      navigate("/forum");
    } catch (error) {
      console.error("❌ Error saving post:", error);
    }
  };

  return (
    <div className="create-post-page">
      <Header label="Carelink Forum" />
      <div className="create-post-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <BiArrowBack className="back-icon" />
      </button>
        <h2>Create a New Post</h2>

        <div className="input-group">
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter a descriptive title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Content</label>
          <textarea
            placeholder="Write your post here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            placeholder="e.g. health, wellness, herbal"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <button onClick={handleCreatePost} className="submit-post">Post</button>
      </div>
    </div>
  );
};

export default CreatePost;
