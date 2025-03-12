import React from 'react';
import { IoMdStar, IoMdStarOutline } from "react-icons/io";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import './LocationDetails.css';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Ensure correct env variable

// ✅ Define the missing mapContainerStyle
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const LocationDetails = ({ facility, onBack }) => {
  const center = {
    lat: facility.latitude || 6.5244, // Default to San Francisco if no data
    lng: facility.longitude || 3.3792,
  };

  return (
    <div className="location-details">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h2>{facility.name}</h2>
      <p>{facility.distance}</p>
      <p>Hours: {facility.hours}</p>

      {/* ⭐ Display Star Rating */}
      <div className="rating">
        {Array.from({ length: facility.rating }, (_, index) => (
          <IoMdStar key={index} className="rating-icon" />
        ))}
        {Array.from({ length: 5 - facility.rating }, (_, index) => (
          <IoMdStarOutline key={`empty-${index}`} className="rating-icon empty-star" />
        ))}
      </div>

      {/* 🗺 Google Maps Integration */}
      <div className="map-placeholder">

          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={14}>
            <Marker position={center} />
          </GoogleMap>
      </div>
    </div>
  );
};

export default LocationDetails;
