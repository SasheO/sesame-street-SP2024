import React from 'react';
import { IoMdStar, IoMdStarOutline } from "react-icons/io";
import './LocationCard.css';

const LocationCard = ({ facility, onClick }) => {
  return (
    <div className="location-card" onClick={onClick}>
      {/* ✅ Update the image source & add error handling */}
      <img 
        src={facility.photo} 
        alt={facility.name} 
        className="facility-image" 
        onError={(e) => { e.target.src = "https://via.placeholder.com/400"; }} // ✅ Default image if broken
      />

      <div className="facility-info">
        <h3>{facility.name}</h3>
        <p>{facility.address}</p>  {/* ✅ Show address instead of distance */}
        <p>Distance: {facility.distance.toFixed(2)} km</p> {/* ✅ Show distance */}
        <p>
          Hours: {facility.open_now ? "Open Now" : "Closed"}
        </p> {/* ✅ Show if hospital is open or closed */}

        {/* ✅ Display Rating Stars */}
        <div className="rating">
          {Array.from({ length: Math.floor(facility.rating || 0) }, (_, index) => (
            <IoMdStar key={index} className="rating-icon" />
          ))}
          {Array.from({ length: 5 - Math.floor(facility.rating || 0) }, (_, index) => (
            <IoMdStarOutline key={`empty-${index}`} className="rating-icon empty-star" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
