import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../firebase";
import { BiHome, BiPlus, BiMessageRounded, BiX } from "react-icons/bi";
import Header from "../shared/Header";
import SearchBar from "../shared/SearchBar";
import "./Forum.css";
import { useAuth } from "../../context/AuthContext";

const Forum = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const fetchPosts = () => {
      const forumCollection = collection(db, "forum");
      const q = query(forumCollection, orderBy("date", "desc"));

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const postsWithExtras = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const postData = { id: docSnap.id, ...docSnap.data() };

            let likesArray = [];
            if (Array.isArray(postData.likes)) {
              likesArray = postData.likes;
            } else if (postData.likes && typeof postData.likes === "object") {
              likesArray = Object.values(postData.likes);
            }

            const commentsSnapshot = await getDocs(
              collection(db, "forum", docSnap.id, "comments")
            );
            const commentCount = commentsSnapshot.size;

            return {
              ...postData,
              id: docSnap.id,
              commentCount,
              likes: likesArray.length,
              isLiked: likesArray.includes(user?.email),
            };
          })
        );

        setThreads(postsWithExtras);
      });

      return unsubscribe;
    };

    if (user?.email) {
      const unsubscribe = fetchPosts();
      return () => unsubscribe();
    }
  }, [user]);

  const handleToggleLike = async (threadId, isCurrentlyLiked) => {
    if (!user?.email || typeof user.email !== "string") {
      console.warn("🚫 Invalid or missing user email. Aborting like toggle.");
      return;
    }

    try {
      const threadRef = doc(db, "forum", threadId);
      const updatePayload = {
        likes: isCurrentlyLiked
          ? arrayRemove(user.email)
          : arrayUnion(user.email),
      };

      await updateDoc(threadRef, updatePayload);

      setThreads((prevThreads) =>
        prevThreads.map((thread) => {
          if (thread.id === threadId) {
            const currentCount = typeof thread.likes === "number" ? thread.likes : 0;
            const newLikesCount = isCurrentlyLiked
              ? currentCount - 1
              : currentCount + 1;

            return {
              ...thread,
              likes: newLikesCount,
              isLiked: !isCurrentlyLiked,
            };
          }
          return thread;
        })
      );
    } catch (error) {
      console.error("⚠️ Error toggling like:", error);
    }
  };

  const filteredThreads = threads.filter((thread) => {
    if (!thread || !thread.title) return false;

    const matchesSearch =
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(thread.tags) &&
        thread.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every(
        (tag) => Array.isArray(thread.tags) && thread.tags.includes(tag)
      );

    return matchesSearch && matchesTags;
  });

  return (
    <div className="forum-page">
      <Header label="Carelink Forum" />
      <SearchBar
        placeholder="Search forum posts"
        onSearch={(term) => setSearchQuery(term)}
        initialValue={searchQuery}
        autoSearch={true}
      />

      {selectedTags.length > 0 && (
        <div className="selected-tags-container">
          <p>Filtering by: </p>
          {selectedTags.map((tag) => (
            <span key={tag} className="selected-tag">
              {tag}{" "}
              <BiX
                className="remove-tag"
                onClick={() =>
                  setSelectedTags(selectedTags.filter((t) => t !== tag))
                }
              />
            </span>
          ))}
          <button
            className="clear-all-tags"
            onClick={() => setSelectedTags([])}
          >
            Clear All
          </button>
        </div>
      )}

      <div className="forum-container">
        <div className="forum-sidebar">
          <h3>Forum Posts</h3>
          {filteredThreads.length === 0 ? (
            <p className="no-results">No results found</p>
          ) : (
            <div className="thread-list">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  className="thread-card"
                  onClick={() =>
                    navigate(`/forum/${thread.id}`, { state: { post: thread } })
                  }
                >
                  <h3>{thread.title}</h3>
                  <div className="thread-meta">
                    <span className="username">
                      {thread.author || "Anonymous"}
                    </span>{" "}
                    •{" "}
                    <span className="post-date">
                      {thread.date
                        ? new Date(
                            thread.date.seconds * 1000
                          ).toLocaleDateString()
                        : "Unknown Date"}
                    </span>
                  </div>
                  <p>
                    {thread.content?.length > 100 ? (
                      <>
                        {thread.content.slice(0, 100)}...
                        <button
                          className="read-more-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/forum/${thread.id}`, {
                              state: { post: thread },
                            });
                          }}
                        >
                          Read More
                        </button>
                      </>
                    ) : (
                      thread.content
                    )}
                  </p>
                  <p className="thread-tags">
                    <strong>Tags: </strong>
                    {(Array.isArray(thread.tags) ? thread.tags : []).map(
                      (tag) => (
                        <span
                          key={tag}
                          className={`tag ${
                            selectedTags.includes(tag) ? "active" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTags((prevTags) =>
                              prevTags.includes(tag)
                                ? prevTags.filter((t) => t !== tag)
                                : [...prevTags, tag]
                            );
                          }}
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </p>
                  <div className="thread-actions">
                    <span
                      className={`like-button ${
                        thread.isLiked ? "liked" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLike(thread.id, thread.isLiked);
                      }}
                    >
                      {thread.isLiked ? "💜" : "🤍"} {thread.likes}
                    </span>
                    <span>💬 {thread.commentCount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bottom-bar">
        <button onClick={() => navigate("/forum")} className="bottom-icon">
          <BiHome />
          <span>Home Feed</span>
        </button>

        <button
          onClick={() => navigate("/forum/create")}
          className="bottom-icon plus-btn"
        >
          <BiPlus />
        </button>

        <button onClick={() => navigate("/my-chats")} className="bottom-icon">
          <BiMessageRounded />
          <span>My Chats</span>
        </button>
      </div>
    </div>
  );
};

export default Forum;
