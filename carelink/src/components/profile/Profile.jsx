import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiHome } from "react-icons/bi";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ name: "", email: "", bio: "" });

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/");
    } else {
      setUser(loggedInUser);
      setUpdatedUser({ name: loggedInUser.name, email: loggedInUser.email, bio: loggedInUser.bio || "" });
    }
  }, [navigate]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    const updatedUserData = { ...user, ...updatedUser };
    setUser(updatedUserData);
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUserData));
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      let users = JSON.parse(localStorage.getItem("users")) || [];
      users = users.filter((u) => u.email !== user.email);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.removeItem("loggedInUser");
      navigate("/");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>Profile</h2>

      <img
        src={user?.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
        alt="Profile"
        className="profile-picture"
      />

      <div className="home-icon-container">
        <BiHome className="home-icon" onClick={() => navigate("/home")} />
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
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Bio:</strong> {user.bio || "No bio set"}</p>
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
