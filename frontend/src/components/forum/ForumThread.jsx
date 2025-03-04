import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../shared/Header";
import { BiHeart, BiMessageRounded, BiShare } from "react-icons/bi";
import "./ForumThread.css";

const ForumThread = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(location.state?.post || null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [sortOrder, setSortOrder] = useState("best");

  useEffect(() => {
    if (!post) {
      const storedPosts = JSON.parse(localStorage.getItem("forumPosts")) || [];
      const foundPost = storedPosts.find((p) => String(p.id) === id);

      if (foundPost) {
        setPost(foundPost);
        setComments(Array.isArray(foundPost.comments) ? foundPost.comments : []);
      } else {
        console.error("⚠️ Post not found in storage!");
        navigate("/forum");
      }
    }
  }, [id, navigate, post]);

  if (!post) return <div className="error-message">⚠️ Post not found.</div>;

  const handleReply = () => {
    if (!newComment.trim()) return;
    const updatedComments = [...comments, { user: "You", text: newComment, date: "Just now", likes: 0, replies: [] }];
    setComments(updatedComments);
    setNewComment("");
    updateLocalStorage(updatedComments);
  };

  const handleCommentReply = (index) => {
    if (!newReply.trim()) return;
    const updatedComments = [...comments];

    if (!Array.isArray(updatedComments[index].replies)) {
      updatedComments[index].replies = [];
    }

    updatedComments[index].replies.push({ user: "You", text: newReply, date: "Just now", likes: 0 });
    setComments(updatedComments);
    setNewReply("");
    setReplyingTo(null);
    updateLocalStorage(updatedComments);
  };

  const updateLocalStorage = (updatedComments) => {
    const storedPosts = JSON.parse(localStorage.getItem("forumPosts")) || [];
    const updatedPosts = storedPosts.map((p) => (String(p.id) === String(post.id) ? { ...p, comments: updatedComments } : p));
    localStorage.setItem("forumPosts", JSON.stringify(updatedPosts));
    setPost((prevPost) => ({ ...prevPost, comments: updatedComments }));
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === "best") return b.likes - a.likes;
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="forum-thread-page">
      <Header label="Forum Post" />
      <button className="back-button" onClick={() => navigate("/forum")}>← Back to Forum</button>

      <div className="post-container">
        <h2 className="post-title">{post.title}</h2>
        <p className="post-meta">@{post.author} • {post.date}</p>
        <p className="post-content">{post.content}</p>
        <div className="post-actions">
          <span className="action"><BiHeart /> {post.likes}</span>
          <span className="action"><BiMessageRounded /> {comments.length}</span>
          <span className="action"><BiShare /></span>
        </div>
        <div className="comment-box">
          <input type="text" placeholder="Join the conversation" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
          <button onClick={handleReply}>Reply</button>
        </div>
        <div className="comments-section">
          {sortedComments.length > 0 ? (
            sortedComments.map((comment, index) => (
              <div key={`comment-${post.id}-${index}`} className="comment">
                <p><strong>@{comment.user}</strong> • {comment.date}</p>
                <p>{typeof comment.text === "string" ? comment.text : "Invalid comment"}</p>  {/* ✅ Fix applied */}
                <div className="comment-actions">
                  <span><BiHeart /> {comment.likes}</span>
                  <span className="reply-btn" onClick={() => setReplyingTo(replyingTo === index ? null : index)}>
                    <BiMessageRounded /> Reply
                  </span>
                </div>
                {replyingTo === index && (
                  <div className="reply-box">
                    <input type="text" placeholder="Write a reply..." value={newReply} onChange={(e) => setNewReply(e.target.value)} />
                    <button onClick={() => handleCommentReply(index)}>Post Reply</button>
                  </div>
                )}
                {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                  <div className="nested-replies">
                    {comment.replies.map((reply, i) => (
                      <div key={`reply-${post.id}-${index}-${i}`} className="reply">
                        <p><strong>@{reply.user}</strong> • {reply.date}</p>
                        <p>{typeof reply.text === "string" ? reply.text : "Invalid reply"}</p>  {/* ✅ Fix applied */}
                        <div className="reply-actions">
                          <span><BiHeart /> {reply.likes}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumThread;
