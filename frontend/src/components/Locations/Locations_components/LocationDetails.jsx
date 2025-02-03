import React from 'react';
import './LocationDetails.css';

const LocationDetails = ({ facility, onBack }) => {
  return (
    <div className="location-details">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h2>{facility.name}</h2>
      <p>{facility.distance}</p>
      <p>Hours: {facility.hours}</p>
      <div className="rating">
        {"⭐".repeat(facility.rating)}
        {"☆".repeat(5 - facility.rating)}
      </div>
      <div className="map-placeholder">
        <p>Map goes here (use Google Maps or similar library)</p>
      </div>
    </div>
  );
};

export default LocationDetails;
