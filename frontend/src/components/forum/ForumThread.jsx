import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, collection, addDoc, onSnapshot, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext"; // ✅ Use AuthContext instead of Firebase Auth directly
import { db } from "../../firebase"; // ✅ Firestore Database Import
import Header from "../shared/Header";
import { BiHeart, BiMessageRounded, BiShare } from "react-icons/bi";
import "./ForumThread.css";

const ForumThread = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth(); // ✅ Get user from AuthContext
  const [post, setPost] = useState(location.state?.post || null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [sortOrder, setSortOrder] = useState("best");

  // ✅ Fetch post details from Firestore if not available in state
  useEffect(() => {
    if (!post) {
      const fetchPost = async () => {
        try {
          const postRef = doc(db, "forum", id);
          const postSnap = await getDoc(postRef);

          if (postSnap.exists()) {
            setPost({ id: postSnap.id, ...postSnap.data() });
          } else {
            console.error("⚠️ Post not found in Firestore!");
            navigate("/forum");
          }
        } catch (error) {
          console.error("Error fetching post:", error);
        }
      };

      fetchPost();
    }
  }, [id, navigate, post]);

  // ✅ Fetch comments in real-time
  useEffect(() => {
    if (!post) return;

    const commentsRef = collection(db, "forum", id, "comments");

    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const loadedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setComments(loadedComments);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [id, post]);

  if (!post) return <div className="error-message">⚠️ Post not found.</div>;

  // ✅ Handle new comment submission (Only If Logged In)
  const handleReply = async () => {
    if (!user) {
      alert("You must be logged in to reply!");
      return;
    }

    if (!newComment.trim()) return;

    try {
      const commentsRef = collection(db, "forum", id, "comments");

      await addDoc(commentsRef, {
        user: user.displayName || user.email || "Unknown User", // ✅ Use email if displayName is null
        text: newComment,
        date: serverTimestamp(),
        likes: [],
        replies: [],
      });

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // ✅ Handle comment reply (Only If Logged In)
  const handleCommentReply = async (commentId) => {
    if (!user) {
      alert("You must be logged in to reply!");
      return;
    }

    if (!newReply.trim()) return;

    try {
      const commentRef = doc(db, "forum", id, "comments", commentId);

      await updateDoc(commentRef, {
        replies: arrayUnion({
          user: user.displayName || user.email || "Unknown User", // ✅ Use email if displayName is null
          text: newReply,
          date: new Date().toISOString(),
          likes: 0,
        }),
      });

      setNewReply("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // ✅ Sort comments based on likes or newest
  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === "best") return b.likes - a.likes;
    return new Date(b.date?.seconds * 1000) - new Date(a.date?.seconds * 1000);
  });

  return (
    <div className="forum-thread-page">
      <Header label="Forum Post" />
      <button className="back-button" onClick={() => navigate("/forum")}>← Back to Forum</button>

      <div className="post-container">
        <h2 className="post-title">{post.title}</h2>
        <p className="post-meta">
          @{post.author} • {post.date?.seconds ? new Date(post.date.seconds * 1000).toLocaleDateString() : "Unknown Date"}
        </p>
        <p className="post-content">{post.content}</p>
        <div className="post-actions">
          <span className="action"><BiHeart /> {post.likes || 0}</span>
          <span className="action"><BiMessageRounded /> {comments.length}</span>
          <span className="action"><BiShare /></span>
        </div>

        {/* ✅ Show comment box only if logged in */}
        {user ? (
          <div className="comment-box">
            <input type="text" placeholder="Join the conversation" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            <button onClick={handleReply}>Reply</button>
          </div>
        ) : (
          <p className="login-message">🔒 <a href="/login">Log in</a> to join the conversation.</p>
        )}

        {/* ✅ Comments Section */}
        <div className="comments-section">
          {sortedComments.length > 0 ? (
            sortedComments.map((comment) => (
              <div key={comment.id} className="comment">
                <p><strong>@{comment.user}</strong> • 
                  {comment.date?.seconds ? new Date(comment.date.seconds * 1000).toLocaleDateString() : "Unknown Date"}
                </p>
                <p>{typeof comment.text === "string" ? comment.text : "Invalid comment"}</p>
                <div className="comment-actions">
                  <span><BiHeart /> {comment.likes}</span>

                  {/* ✅ Only allow logged-in users to reply */}
                  {user && (
                    <span className="reply-btn" onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}>
                      <BiMessageRounded /> Reply
                    </span>
                  )}
                </div>

                {/* ✅ Reply Input (Only If Logged In) */}
                {user && replyingTo === comment.id && (
                  <div className="reply-box">
                    <input type="text" placeholder="Write a reply..." value={newReply} onChange={(e) => setNewReply(e.target.value)} />
                    <button onClick={() => handleCommentReply(comment.id)}>Post Reply</button>
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
