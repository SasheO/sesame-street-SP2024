import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ name: "", email: "", bio: "", contact: "", notifications: false, profilePic: "" });

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/");
    } else {
      setUser(loggedInUser);
      setUpdatedUser(loggedInUser);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: type === "checkbox" ? checked : value });
  };

  const handleSave = () => {
    setUser(updatedUser);
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map(u => (u.email === updatedUser.email ? updatedUser : u));
    localStorage.setItem("users", JSON.stringify(users));

    setEditing(false);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedUser({ ...updatedUser, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      <div className="top-bar">
        <button className="home-button" onClick={() => navigate("/home")}>🏠 Home</button>
      </div>

      <h2>Profile</h2>

      <div className="profile-picture">
        <img src={user?.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt="Profile" />
        {editing && <input type="file" accept="image/*" onChange={handleProfilePicChange} />}
      </div>

      <div className="profile-details">
        <label>Name:</label>
        {editing ? <input type="text" name="name" value={updatedUser.name} onChange={handleChange} /> : <p>{user?.name}</p>}

        <label>Email:</label>
        <p>{user?.email}</p>

        <label>Bio:</label>
        {editing ? <textarea name="bio" value={updatedUser.bio} onChange={handleChange} /> : <p>{user?.bio || "No bio yet."}</p>}

        <label>Contact Info:</label>
        {editing ? <input type="text" name="contact" value={updatedUser.contact} onChange={handleChange} /> : <p>{user?.contact || "No contact info yet."}</p>}

        <label>Notifications:</label>
        {editing ? (
          <input type="checkbox" name="notifications" checked={updatedUser.notifications} onChange={handleChange} />
        ) : (
          <p>{user?.notifications ? "Enabled" : "Disabled"}</p>
        )}
      </div>

      {editing ? (
        <button className="save-button" onClick={handleSave}>Save Changes</button>
      ) : (
        <button className="edit-button" onClick={() => setEditing(true)}>Edit Profile</button>
      )}

      <button className="logout-button" onClick={() => { localStorage.removeItem("loggedInUser"); navigate("/"); }}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
