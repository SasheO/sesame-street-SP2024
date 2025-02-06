import React from "react";
import { useNavigate } from "react-router-dom";
import { BiHome, BiPlus, BiMessageRounded } from "react-icons/bi";
import Header from "../shared/Header";
import SearchBar from "../shared/SearchBar";
import "./Forum.css";

const Forum = () => {
  const navigate = useNavigate();

  return (
    <div className="forum-container">
      {/* Full-width header */}
      <div>
        <Header label="Carelink Forum"/>
      </div>

      <SearchBar />

      <div className="forum-content">
        <h2>*forum posts*</h2>
        {/* Forum discussions and posts will go here */}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bottom-nav">
        <button className="nav-button" onClick={() => navigate("/")}>
          <BiHome />
        </button>
        <button className="nav-button" onClick={() => console.log("Create new thread")}>
          <BiPlus />
        </button>
        <button className="nav-button" onClick={() => console.log("Open messages")}>
          <BiMessageRounded />
        </button>
      </div>
    </div>
  );
};

export default Forum;
