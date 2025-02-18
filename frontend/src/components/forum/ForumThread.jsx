import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import "./ForumThread.css";

const ForumThread = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const thread = location.state?.thread; // Get the thread data from state

  if (!thread) {
    return <p>Thread not found.</p>;
  }

  return (
    <div className="thread-page">
      <button className="back-button" onClick={() => navigate("/forum")}>
        <BiArrowBack /> Back to Forum
      </button>
      <h2>{thread.title}</h2>
      <p>{thread.user} • {thread.date}</p>
      <p>{thread.content}</p>
      <div className="thread-actions">
        <span>❤️ {thread.likes}</span>
        <span>💬 {thread.comments}</span>
      </div>

      {/* Replies Section */}
      <div className="replies-container">
        {thread.replies?.map((reply, index) => (
          <div key={index} className="reply">
            <p><strong>{reply.user}</strong> • {reply.time}</p>
            <p>{reply.content}</p>
            <div className="reply-actions">
              <span>❤️ {reply.likes}</span>
              <button>Reply</button>
            </div>
            {reply.replies?.map((subReply, subIndex) => (
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

      {/* Comment Box */}
      <div className="comment-box">
        <input type="text" placeholder="Write a reply..." />
        <button>Post</button>
      </div>
    </div>
  );
};

export default ForumThread;
