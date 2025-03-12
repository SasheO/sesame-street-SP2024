import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Firestore functions
import { useAuth } from "../../context/AuthContext"; // ✅ Import Auth Context
import { db } from "../../firebase"; // ✅ Import Firestore DB
import Header from "../shared/Header";
import "./CreatePost.css";

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ Get authenticated user
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleCreatePost = async () => {
    if (!title.trim() || !content.trim()) {
      console.error("⚠️ Cannot save post: Missing title or content!");
      return;
    }
  
    // const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
    // const allPosts = JSON.parse(localStorage.getItem("forumPosts")) || [];
  
    // ✅ Generate a unique ID by finding the highest ID and adding 1
    //const newId = allPosts.length > 0 ? Math.max(...allPosts.map(post => post.id)) + 1 : 1;
  
    try{
    const newPost = {
      id: Date.now(), // ✅ Ensuring unique ID
      title: title.trim(),
      content: content.trim(),
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      author: user.email || "Anonymous",
      date: serverTimestamp(), // ✅ Store timestamp in Firestore
      comments: [],
      likes: 0,
    };

    // ✅ Save the post to Firestore
    await addDoc(collection(db, "forum"), newPost);
    console.log("✅ Post successfully created in Firestore!");

  
    //console.log("✅ Saving new post:", newPost);
  
    // const updatedPosts = [newPost, ...allPosts];
    // localStorage.setItem("forumPosts", JSON.stringify(updatedPosts));
  
    // // ✅ Trigger localStorage update event to refresh MyChats
    // window.dispatchEvent(new Event("storage"));
  
    // console.log("📌 Updated posts in localStorage:", updatedPosts);
  
    // navigate("/forum");
    // ✅ Navigate to the forum page after saving
      navigate("/forum");
    } catch (error) {
      console.error("❌ Error saving post:", error);
    }
  };
  

  return (
    <div className="create-post-page">
      <Header label="Carelink Forum" />
      <button className="back-button" onClick={() => navigate("/forum")}>← Back to Forum</button>

      <div className="create-post-container">
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
