import React from 'react';
import { IoMdStar } from "react-icons/io";
import { IoMdStarOutline } from "react-icons/io";
import './LocationCard.css';

const LocationCard = ({ facility, onClick }) => {
  return (
    <div className="location-card" onClick={onClick}>
      
      <img src={facility.image} 
        alt={facility.name} 
        className="facility-image" />
      <div className="facility-info">
        <h3>{facility.name}</h3>
        <p>{facility.distance}</p>
        <p>Hours: {facility.hours}</p>
        <div className="rating">
          {Array.from({ length: facility.rating }, (_, index) => (
            <IoMdStar key={index} className="rating-icon" />
          ))}
          {Array.from({ length: 5 - facility.rating }, (_, index) => (
            <IoMdStarOutline key={`empty-${index}`} className="rating-icon empty-star" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
