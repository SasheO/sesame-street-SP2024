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

  // ✅ Debugging: Check user state
  useEffect(() => {
    console.log("HomePage Check - User:", user);
    console.log("HomePage Check - Loading State:", loading);
    console.log("HomePage Check - User Role:", user?.role);
  }, [user, loading]);

  // ✅ If loading, show a loading state
  if (loading ) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header label="Carelink Home" />
      <SearchBar placeholder="Find a simple remedy" onSearch={handleSearch} initialValue={query} />
      <div className="features-container">
        {/* ✅ Always show these two features */}
        <FeatureCard Icon={BiMap} label="Hospitals near you" onClick={() => navigate("/locations")} />
        <FeatureCard Icon={BiMessageRoundedDetail} label="Community forum" onClick={() => navigate("/forum")} />

        
        {/* {user && user.role && user.role !== "doctor" && ( */}
          <FeatureCard Icon={TbStethoscope} label="Doctors" onClick={() => navigate("/doctor")} />
        {/* )} */}

        {/* {user && user.role && user.role !== "patient" && ( */}
          <FeatureCard Icon={BiSolidUserPlus} label="Patients" onClick={() => navigate("/doctor-patients?view=requests")} />
        {/* )} */}
      </div>
    </div>
  );
}

export default HomePage;
