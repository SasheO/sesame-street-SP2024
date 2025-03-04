import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiMap, BiMessageRoundedDetail, BiSolidUserPlus } from "react-icons/bi";
import { TbStethoscope } from "react-icons/tb";
import Header from "../shared/Header";
import SearchBar from "../shared/SearchBar";
import FeatureCard from "./HomePage_components/FeatureCard";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const query = new URLSearchParams(location.search).get("q") || "";

  const handleSearch = (term) => {
    if (term.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(term)}`);
    }
  };

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/");
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

  return (
    <div>
      <Header label="Carelink Home" />
      <SearchBar placeholder="Find a simple remedy" onSearch={handleSearch} initialValue={query} />
      <div className="features-container">
        <FeatureCard Icon={BiMap} label="Healthcare near you" onClick={() => navigate("/locations")} />
        
        {/* ✅ Hide 'Chat with a doctor' if user is a doctor */}
        {user?.role !== "doctor" && (
          <FeatureCard Icon={TbStethoscope} label="Chat with a doctor" onClick={() => navigate("/doctor")}/>
        )}

        <FeatureCard Icon={BiMessageRoundedDetail} label="Community forum" onClick={() => navigate("/forum")} />

        {/* ✅ Hide 'Patient Requests' if user is a patient */}
        {user?.role !== "patient" && (
          <FeatureCard Icon={BiSolidUserPlus} label="Patient requests" onClick={() => navigate("/doctor-patients?view=requests")} />
        )}
      </div>
    </div>
  );
}

export default HomePage;
