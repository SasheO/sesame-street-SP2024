import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BiMap, BiMessageRoundedDetail, BiSolidUserPlus} from 'react-icons/bi';
import { TbStethoscope } from "react-icons/tb";
import Header from '../shared/Header';
import SearchBar from '../shared/SearchBar';
import FeatureCard from './HomePage_components/FeatureCard';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  return (
    <div>
      <Header label="Carelink Home"/>
      <SearchBar placeholder="Find a simple remedy"/>
      <div className="features-container">
        <FeatureCard Icon={BiMap} label="Healthcare near you" onClick={() => navigate('/locations')}/>
        <FeatureCard Icon={TbStethoscope} label="Chat with a doctor" />
        <FeatureCard Icon={BiMessageRoundedDetail} label="Community forum" onClick={() => navigate('/forum')}/>
        <FeatureCard Icon={BiSolidUserPlus} label="Patient requests" />
      </div>
    </div>
  );
}

export default HomePage;
