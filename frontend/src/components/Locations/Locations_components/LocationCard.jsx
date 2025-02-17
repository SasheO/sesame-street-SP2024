import React from 'react';
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
          {"⭐".repeat(facility.rating)}
          {"☆".repeat(5 - facility.rating)}
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
