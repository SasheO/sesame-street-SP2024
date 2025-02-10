import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import "./SlideOutMenu.css";
import SearchBar from "./SearchBar";

const pages = [
  { name: "Home", path: "/" },
  { name: "Healthcare near you", path: "/locations" },
  { name: "Community forum", path: "/forum" },
];

const SlideOutMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`slide-out-menu ${isOpen ? "open" : ""}`}
    data-testid="slideout-menu">
      
      <div className="menu-content">
        <IoClose className="close-btn" aria-label="Close icon" onClick={onClose}/>
        <SearchBar placeholder="How can we help you?" showMicrophoneIcon={false}/>
        <div className="menu-items">
          {pages.map((page) => (
            <div
              key={page.path}
              className={`menu-item ${location.pathname === page.path ? "active" : ""}`}
              onClick={() => { navigate(page.path); onClose(); }}
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
