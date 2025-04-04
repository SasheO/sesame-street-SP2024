import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, collection, addDoc, onSnapshot, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import Header from "../shared/Header";
import { BiHeart, BiMessageRounded, BiArrowBack, BiSend } from "react-icons/bi";
import "./ForumThread.css";

const ForumThread = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
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

    return () => unsubscribe();
  }, [id, post]);

  if (!post) return <div className="error-message">⚠️ Post not found.</div>;

  // ✅ Handle new comment submission
  const handleReply = async () => {
    if (!user) {
      alert("You must be logged in to reply!");
      return;
    }

    if (!newComment.trim()) return;

    try {
      const commentsRef = collection(db, "forum", id, "comments");

      await addDoc(commentsRef, {
        user: user.displayName || user.email || "Unknown User",
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

  // ✅ Sort comments based on likes or newest
  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === "best") return b.likes - a.likes;
    return new Date(b.date?.seconds * 1000) - new Date(a.date?.seconds * 1000);
  });

  return (
    <div className="forum-thread-page">
      <Header label="Forum Post" />

      <div className="post-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <BiArrowBack className="back-icon" />
      </button>

        <h2 className="post-title">{post.title}</h2>
        <p className="post-meta">
          @{post.author} • {post.date?.seconds ? new Date(post.date.seconds * 1000).toLocaleDateString() : "Unknown Date"}
        </p>
        <p className="post-content">{post.content}</p>
        <div className="post-actions">
          <span className="action"><BiHeart /> {post.likes || 0}</span>
          <span className="action"><BiMessageRounded /> {comments.length}</span>
          
        </div>

        {user ? (
          <div className="comment-box">
            <input type="text" placeholder="Join the conversation" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            <button onClick={handleReply} aria-label="Send reply">
              <BiSend size={18} />
            </button>
          </div>
        ) : (
          <p className="login-message">🔒 <a href="/login">Log in</a> to join the conversation.</p>
        )}

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
                </div>
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
