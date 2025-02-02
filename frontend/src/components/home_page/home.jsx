import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiMap, BiMessageRoundedDetail, BiSolidUserPlus } from "react-icons/bi";
import { TbStethoscope } from "react-icons/tb";
import Header from "./homepage_components/header";
import SearchBar from "./homepage_components/searchbar";
import FeatureCard from "./HomePage_components/featurecard";
import "./home.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/");
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="home-page">
      <Header />
      <div className="content-container">
        <SearchBar />
        <div className="features-container">
          <FeatureCard Icon={BiMap} label="Healthcare near you" />
          <FeatureCard Icon={TbStethoscope} label="Chat with a doctor" />
          <FeatureCard Icon={BiMessageRoundedDetail} label="Community forum" />
          <FeatureCard Icon={BiSolidUserPlus} label="Patient requests" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
