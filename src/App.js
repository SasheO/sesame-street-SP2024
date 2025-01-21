import React from 'react';
import { BiMap, BiMessageRoundedDetail, BiSolidUserPlus} from 'react-icons/bi';
import { TbStethoscope } from "react-icons/tb";
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FeatureCard from './components/FeatureCard';
import './App.css';

function App() {
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

export default App;
