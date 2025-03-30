import React, { useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { IoIosArrowBack } from "react-icons/io";
import "./LocationDetails.css";

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const purpleMarker = "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";


const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const LocationDetails = ({ facility, userLocation, onBack }) => {
  const [directionResult, setDirectionResult] = useState(null);
  const [error, setError] = useState("");

  // Ensure valid coordinates for destination
  const destination =
    facility.latitude && facility.longitude
      ? {
          lat: parseFloat(facility.latitude),
          lng: parseFloat(facility.longitude),
        }
      : null;

  console.log("User Location:", userLocation);
  console.log("Destination:", destination);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: MAPS_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <div className="location-details">
      <IoIosArrowBack className="icons" onClick={onBack} />
      <h2>{facility.name}</h2>
      <p>
        <strong>Distance:</strong>{" "}
        {facility.distance ? facility.distance.toFixed(2) : "Unknown"} km
      </p>
      <p>
        <strong>Hours:</strong> {facility.hours || "No data available"}
      </p>

      {error && <p className="error-message">{error}</p>}

      {/* 🗺 Google Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || destination || { lat: 38.92126, lng: -77.02134 }}
        zoom={14}
      >
        {userLocation && destination && !directionResult && (
          <DirectionsService
            options={{
              destination,
              origin: userLocation,
              travelMode: "DRIVING",
            }}
            callback={(result, status) => {
              if (status === "OK") {
                setDirectionResult(result);
              } else {
                console.error("Directions request failed due to " + status);
                setError("Route service unavailable.");
              }
            }}
          />
        )}

      {directionResult && (
        <DirectionsRenderer
          options={{
            directions: directionResult,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: "#6979F8",
              strokeOpacity: 0.9,
              strokeWeight: 5,
            },
          }}
          />
        )}

        {userLocation && <Marker position={userLocation} label="You" icon = {purpleMarker}/>}
        {destination && <Marker position={destination} label="Hospital" icon = {purpleMarker} />}
      </GoogleMap>
    </div>
  );
};

export default LocationDetails;
