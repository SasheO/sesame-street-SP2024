import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../shared/SearchBar';
import Header from '../shared/Header';
import LocationCard from './Locations_components/LocationCard';
import LocationDetails from './Locations_components/LocationDetails';
import './LocationsPage.css';

const FIREBASE_FUNCTION_URL = "https://getnearbyhospitals-jpiptb5loq-uc.a.run.app";

const LocationsPage = ({ onClick }) => {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [userLocation, setUserLocation] = useState(null); // ✅ Define userLocation state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** ✅ Function to Get User's Location */
  const fetchUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User Location:", latitude, longitude);  
          setUserLocation({ lat: latitude, lng: longitude }); // ✅ Update state
          fetchHospitals(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  /** ✅ Function to Fetch Hospitals */
  const fetchHospitals = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await axios.get(`${FIREBASE_FUNCTION_URL}?lat=${lat}&lng=${lng}`, {
        headers: { "Content-Type": "application/json" },
        mode: 'cors'
      });

      console.log("API Response:", response.data);
      setFacilities(response.data);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setError("Failed to fetch hospitals. Try again later.");
    }
    setLoading(false);
  };

  /** ✅ Ensure `fetchUserLocation` runs when the component loads */
  useEffect(() => {
    fetchUserLocation();
  }, []); 

  return (
    <div className="locations-page" onClick={onClick}>
      <Header label="Carelink" />
      <SearchBar placeholder="Hospitals near me" />

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading hospitals...</p>}

      {!loading && facilities.length === 0 && <p>No hospitals found.</p>}

      {selectedFacility ? (
        <LocationDetails
          facility={selectedFacility}
          userLocation={userLocation} // ✅ Now it is defined
          onBack={() => setSelectedFacility(null)}
        />
      ) : (
        <div className="facility-list">
          {facilities.map((facility) => (
            <LocationCard
              key={facility.place_id}
              facility={facility}
              onClick={() => setSelectedFacility(facility)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationsPage;
