import React from 'react';
import { BiMap, BiMessageRoundedDetail, BiSolidUserPlus} from 'react-icons/bi';
import { TbStethoscope } from "react-icons/tb";
import Header from './HomePage_components/Header';
import SearchBar from './HomePage_components/SearchBar';
import FeatureCard from './HomePage_components/FeatureCard';
import './HomePage.css';

function HomePage() {
  return (
    <div>
      <Header />
      <SearchBar />
      <div className="features-container">
        <FeatureCard Icon={BiMap} label="Healthcare near you" />
        <FeatureCard Icon={TbStethoscope} label="Chat with a doctor" />
        <FeatureCard Icon={BiMessageRoundedDetail} label="Community forum" />
        <FeatureCard Icon={BiSolidUserPlus} label="Patient requests" />
      </div>
    </div>
  );
}

export default HomePage;
