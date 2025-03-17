import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext"; // ✅ Import authentication context
import "./SlideOutMenu.css";
import SearchBar from "./SearchBar";

const SlideOutMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // ✅ Get user session from AuthContext

  // Define visible pages based on authentication status
  let menuItems = [
    { name: "Home", path: "/" }, // ✅ Always show Home
    { name: "Healthcare near you", path: "/locations" },
    { name: "Community forum", path: "/forum" },
  ];

  if (user) {
    if (user.role === "patient") {
      menuItems.push({ name: "Chat with a doctor", path: "/doctor" });
    } else if (user.role === "doctor") {
      menuItems.push({ name: "Patient requests", path: "/doctor-patients" });
    }
  }

  return (
    <div className={`slide-out-menu ${isOpen ? "open" : ""}`} data-testid="slideout-menu">
      <div className="menu-content">
        <IoClose className="close-btn" aria-label="Close icon" onClick={onClose} />
        <SearchBar placeholder="How can we help you?" showMicrophoneIcon={false} />
        <div className="menu-items">
          {menuItems.map((page) => (
            <div
              key={page.path}
              className={`menu-item ${location.pathname === page.path ? "active" : ""}`}
              onClick={() => {
                navigate(page.path);
                onClose();
              }}
            >
              {page.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlideOutMenu;
