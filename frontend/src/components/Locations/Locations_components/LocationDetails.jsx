import React from 'react';
import { IoMdStar } from "react-icons/io";
import { IoMdStarOutline } from "react-icons/io";
import './LocationDetails.css';

const LocationDetails = ({ facility, onBack }) => {
  return (
    <div className="location-details">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h2>{facility.name}</h2>
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
      <div className="map-placeholder">
        <p>Map goes here (use Google Maps or similar library)</p>
      </div>
    </div>
  );
};

export default LocationDetails;
