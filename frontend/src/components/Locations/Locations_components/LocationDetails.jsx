import React, { useEffect, useState } from "react";
import { IoMdStar, IoMdStarOutline } from "react-icons/io";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
import "./LocationDetails.css";

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // ✅ Ensure API key is set

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const LocationDetails = ({ facility, userLocation, onBack }) => {
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState("");

  // ✅ Ensure valid coordinates for destination
  const destination = facility.latitude && facility.longitude ? { 
    lat: parseFloat(facility.latitude), 
    lng: parseFloat(facility.longitude) 
  } : null;

  console.log("User Location:", userLocation);
  console.log("Destination:", destination);

  useEffect(() => {
    if (!userLocation || !destination) {
      setError("User location or destination is missing.");
      return;
    }

    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://routes.googleapis.com/directions/v2:computeRoutes`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": MAPS_API_KEY, // ✅ Using API key
              "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
            },
            body: JSON.stringify({
              origin: { location: { latLng: { latitude: userLocation.lat, longitude: userLocation.lng } } },
              destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
              travelMode: "DRIVE"
            })
          }
        );

        const data = await response.json();
        console.log("Routes API Response:", data);

        if (data.routes && data.routes.length > 0) {
          const decodedPath = window.google.maps.geometry.encoding.decodePath(
            data.routes[0].polyline.encodedPolyline
          );

          setDirections(decodedPath);
        } else {
          setError("No route found.");
        }
      } catch (error) {
        console.error("Error fetching route:", error);
        setError("Route service unavailable.");
      }
    };

    fetchRoute();
  }, [userLocation, destination]);

  return (
    <div className="location-details">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h2>{facility.name}</h2>
      <p><strong>Distance:</strong> {facility.distance ? facility.distance.toFixed(2) : "Unknown"} km</p>
      <p><strong>Hours:</strong> {facility.hours || "No data available"}</p>

      {/* ⭐ Display Star Rating */}
      <div className="rating">
        {Array.from({ length: Math.floor(facility.rating || 0) }, (_, index) => (
          <IoMdStar key={index} className="rating-icon" />
        ))}
        {Array.from({ length: 5 - Math.floor(facility.rating || 0) }, (_, index) => (
          <IoMdStarOutline key={`empty-${index}`} className="rating-icon empty-star" />
        ))}
      </div>

      {/* 🚨 Show Error if Route Fails */}
      {error && <p className="error-message">{error}</p>}

      {/* 🗺 Google Maps with Route */}
      <LoadScript googleMapsApiKey={MAPS_API_KEY}>
        <GoogleMap 
          mapContainerStyle={mapContainerStyle} 
          center={userLocation || destination} 
          zoom={14}
        >
          {/* ✅ Show the Driving Route */}
          {directions && (
            <Polyline
              path={directions}
              options={{
                strokeColor: "#007bff",
                strokeOpacity: 0.8,
                strokeWeight: 4,
              }}
            />
          )}

          {/* ✅ Show Markers for User & Destination */}
          {userLocation && <Marker position={userLocation} label="You" />}
          {destination && <Marker position={destination} label="Hospital" />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default LocationDetails;
