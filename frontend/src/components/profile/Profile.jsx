import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiHome } from "react-icons/bi";
import { useAuth } from "../../context/AuthContext";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { signOut, deleteUser, updateEmail } from "firebase/auth";
import "./profile.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


const Profile = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ name: "", email: "", bio: "", profilePic: "" });

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
        setUpdatedUser({
          name: userData.first_name + " " + userData.surname,
          email: userData.email,
          bio: userData.bio || "",
          profilePic: userData.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        });
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      if (!auth.currentUser) {
        console.error("❌ No authenticated user found.");
        return;
      }

      const nameParts = updatedUser.name.trim().split(" ");
      const firstName = nameParts[0];
      const surname = nameParts.slice(1).join(" ");

      await updateDoc(doc(db, "users", user.uid), {
        first_name: firstName,
        surname: surname,
        bio: updatedUser.bio,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
      });

      if (updatedUser.email !== user.email) {
        try {
          await updateEmail(auth.currentUser, updatedUser.email);
          console.log("✅ Email updated in Firebase Auth");
        } catch (error) {
          console.error("❌ Error updating email:", error);
        }
      }

      setIsEditing(false);
      console.log("✅ Profile updated successfully");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
    }
  };

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const storage = getStorage();
    const storageRef = ref(storage, `profile_pictures/${user.uid}`);
  
    try {
      // Upload file to Firebase Storage
      await uploadBytes(storageRef, file);
      console.log("✅ Image uploaded to Firebase Storage");
  
      // Get the image URL from Storage
      const downloadURL = await getDownloadURL(storageRef);
  
      // Update Firestore with the new profile picture URL
      await updateDoc(doc(db, "users", user.uid), { profilePic: downloadURL });
  
      // Update UI
      setUpdatedUser((prev) => ({ ...prev, profilePic: downloadURL }));
      console.log("✅ Profile picture updated successfully");
  
    } catch (error) {
      console.error("❌ Error uploading profile picture:", error);
      alert("⚠️ Error uploading profile picture. Please try again.");
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

      <div className="profile-pic-wrapper">
        <label htmlFor="profile-pic-upload" className="profile-pic-label">
          <img
            src={updatedUser.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            alt="Profile"
            className="profile-picture"
          />
          {isEditing && <span className="edit-icon">📷</span>}
        </label>
        {isEditing && <input type="file" id="profile-pic-upload" accept="image/*" onChange={handleProfilePicChange} />}
      </div>


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
