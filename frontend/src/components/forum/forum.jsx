import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiHome, BiPlus, BiMessageRounded } from "react-icons/bi";
import Header from "../HomePage/HomePage_Components/Header";
import SearchBar from "../HomePage/HomePage_Components/SearchBar_Components/SearchBar";
import ForumThread from "./ForumThread"; // Import ForumThread component
import "./Forum.css";

const mockThreads = [
  {
    id: 1,
    title: "Local herbs for migraine",
    user: "@username1",
    date: "Dec 1, 2023",
    content: "Natural remedies may help prevent the onset of migraine attacks...",
    likes: 3456,
    comments: 254,
    replies: [
      {
        user: "@username1",
        time: "12h ago",
        content: "I found it really helpful to drink a ginger tea every night before bed.",
        likes: 423,
        replies: [
          {
            user: "@username2",
            time: "2h ago",
            content: "Same here! I did a warm brew at night and an ice tea in the morning.",
            likes: 76,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "What type of herb is this?",
    user: "@username2",
    date: "Jan 23, 2024",
    content: "I came across this plant, does anyone know what this is?",
    likes: 2540,
    comments: 156,
    replies: [],
  },
];

const Forum = () => {
  const navigate = useNavigate();
  const [selectedThread, setSelectedThread] = useState(null);

  const handleThreadClick = (thread) => {
    setSelectedThread(thread);
  };

  return (
    <div className="forum-page">
      <Header />
      <SearchBar />
      <div className="forum-content">
        {!selectedThread ? (
          <div className="thread-list">
            {mockThreads.map((thread) => (
              <div
                key={thread.id}
                className="thread-card"
                onClick={() => handleThreadClick(thread)}
              >
                <h3>{thread.title}</h3>
                <p>{thread.user} • {thread.date}</p>
                <p>{thread.content}</p>
                <div className="thread-actions">
                  <span>❤️ {thread.likes}</span>
                  <span>💬 {thread.comments}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="thread-view">
            <button className="back-button" onClick={() => setSelectedThread(null)}>← Back</button>
            <h2>{selectedThread.title}</h2>
            <p>{selectedThread.user} • {selectedThread.date}</p>
            <p>{selectedThread.content}</p>
            <div className="thread-actions">
              <span>❤️ {selectedThread.likes}</span>
              <span>💬 {selectedThread.comments}</span>
            </div>
            <div className="comment-section">
              <input type="text" placeholder="Join the conversation..." />
            </div>
            {selectedThread.replies.map((reply, index) => (
              <div key={index} className="reply">
                <p><strong>{reply.user}</strong> • {reply.time}</p>
                <p>{reply.content}</p>
                <div className="reply-actions">
                  <span>❤️ {reply.likes}</span>
                  <button>Reply</button>
                </div>
                {reply.replies && reply.replies.map((subReply, subIndex) => (
                  <div key={subIndex} className="sub-reply">
                    <p><strong>{subReply.user}</strong> • {subReply.time}</p>
                    <p>{subReply.content}</p>
                    <div className="reply-actions">
                      <span>❤️ {subReply.likes}</span>
                      <button>Reply</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bottom-bar">
        <BiHome onClick={() => navigate("/home")} className="bottom-icon" />
        <BiPlus onClick={() => navigate("/forum/create")} className="bottom-icon" /> 
        <BiMessageRounded className="bottom-icon" />
      </div>
    </div>
  );
};

export default Forum;