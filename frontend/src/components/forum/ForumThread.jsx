import React, { useState } from "react";
import "./ForumThread.css";

const ForumThread = ({ thread, goBack }) => {
  const [comment, setComment] = useState("");

  const handleCommentSubmit = () => {
    alert("Posting comment: " + comment);
    setComment("");
  };

  return (
    <div className="thread-page">
      <button className="back-button" onClick={goBack}>← Back</button>

      <div className="thread-header">
        <h2>{thread.title}</h2>
        <p className="thread-meta">r/threadname • {thread.date}</p>
        <p className="thread-user">{thread.user}</p>
        <p className="thread-content">{thread.content}</p>
        <div className="thread-actions">
          <span>❤️ {thread.likes}</span>
          <span>💬 {thread.comments}</span>
        </div>
      </div>

      {/* Join the conversation */}
      <div className="join-conversation">
        <input 
          type="text" 
          placeholder="Join the conversation..." 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleCommentSubmit}>Post</button>
      </div>

      {/* Sorting and search bar */}
      <div className="comment-options">
        <select>
          <option>Sort by: Best</option>
          <option>Sort by: New</option>
          <option>Sort by: Old</option>
        </select>
        <input type="text" placeholder="Search comments" />
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        {thread.replies.map((reply, index) => (
          <div key={index} className="comment">
            <div className="comment-header">
              <p className="comment-user">{reply.user} • {reply.time}</p>
              <p>{reply.content}</p>
              <div className="comment-actions">
                <span>❤️ {reply.likes}</span>
                <button>Reply</button>
              </div>
            </div>

            {/* Nested Replies */}
            {reply.replies && (
              <div className="nested-comments">
                {reply.replies.map((subReply, subIndex) => (
                  <div key={subIndex} className="nested-comment">
                    <p className="comment-user">{subReply.user} • {subReply.time}</p>
                    <p>{subReply.content}</p>
                    <div className="comment-actions">
                      <span>❤️ {subReply.likes}</span>
                      <button>Reply</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumThread;
