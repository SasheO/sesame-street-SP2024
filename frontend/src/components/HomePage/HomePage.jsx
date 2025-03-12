import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiMap, BiMessageRoundedDetail, BiSolidUserPlus } from "react-icons/bi";
import { TbStethoscope } from "react-icons/tb";
import Header from "../shared/Header";
import SearchBar from "../shared/SearchBar";
import FeatureCard from "./HomePage_components/FeatureCard";
import "./HomePage.css";
import { useAuth } from "../../context/AuthContext"; // ✅ Use Firebase session handling

function HomePage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // ✅ Get user session from AuthContext

  const query = new URLSearchParams(location.search).get("q") || "";

  const handleSearch = (term) => {
    if (term.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(term)}`);
    }
  };

  // ✅ Redirect to login page if user is not logged in (inside useEffect)
  useEffect(() => {
    console.log("User state in HomePage:", user, "Loading:", loading);
    console.log("User role:", user?.role);
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // ✅ If loading, show a loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header label="Carelink Home" />
      <SearchBar placeholder="Find a simple remedy" onSearch={handleSearch} initialValue={query} />
      <div className="features-container">
        <FeatureCard Icon={BiMap} label="Healthcare near you" onClick={() => navigate("/locations")} />
        
        {/* ✅ Hide 'Chat with a doctor' if user is a doctor */}
        {user?.role !== "doctor" && (
          <FeatureCard Icon={TbStethoscope} label="Chat with a doctor" onClick={() => navigate("/doctor")} />
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
