import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiHome } from "react-icons/bi";
import { useAuth } from "../../context/AuthContext"; // ✅ Import Auth Context
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { signOut, deleteUser } from "firebase/auth";
import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // ✅ Get user session from Firebase
  //const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ name: "", email: "", bio: "" });

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    } else if (user) {
      fetchUserData();
    }
  }, [user, loading, navigate]);

  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUpdatedUser({ name: userData.first_name + " " + userData.surname, email: userData.email, bio: userData.bio || "" });
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), { bio: updatedUser.bio });
      setIsEditing(false);
      console.log("✅ Bio updated successfully in Firestore");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      try {
        await deleteDoc(doc(db, "users", user.uid));
        await deleteUser(auth.currentUser);
        navigate("/");
      } catch (error) {
        console.error("❌ Error deleting account:", error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div className="profile-container">
      <h2>Profile</h2>

      <img
        src={user?.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
        alt="Profile"
        className="profile-picture"
      />

      <div className="home-icon-container">
        <BiHome className="home-icon" onClick={() => navigate("/")} />
      </div>

      {isEditing ? (
        <div className="profile-form">
          <label htmlFor="name">Name:</label>
          <input id="name" type="text" value={updatedUser.name} onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })} />

          <label htmlFor="email">Email:</label>
          <input id="email" type="email" value={updatedUser.email} disabled />

          <label htmlFor="bio">Bio:</label>
          <textarea id="bio" value={updatedUser.bio} onChange={(e) => setUpdatedUser({ ...updatedUser, bio: e.target.value })} />

          <button className="save-button" onClick={handleSave}>Save Changes</button>
        </div>
      ) : (
        <div className="profile-details">
          <p><strong>Name:</strong> {updatedUser.name} </p>
          <p><strong>Email:</strong> {updatedUser.email}</p>
          <p><strong>Bio:</strong> {updatedUser.bio || "No bio set"}</p>
        </div>
      )}

      <div className="profile-actions">
        {!isEditing && <button className="edit-button" onClick={handleEdit}>Edit Profile</button>}
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        <button className="delete-button" onClick={handleDelete}>Delete Account</button>
      </div>
    </div>
  );
};

export default Profile;
