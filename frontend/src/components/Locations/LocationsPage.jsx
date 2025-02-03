import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../shared/SearchBar';
import Header from '../shared/Header';
import LocationCard from './Locations_components/LocationCard';
import LocationDetails from './Locations_components/LocationDetails';
import './LocationsPage.css';

// Dummy data for healthcare facilities
const facilities = [
  {
    id: 1,
    name: "Children’s National Hospital",
    distance: "2 km",
    hours: "24 hrs",
    rating: 4,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "St. Mary’s Specialist Clinic",
    distance: "1.5 km",
    hours: "9 AM - 9 PM",
    rating: 5,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Gbagada General Hospital",
    distance: "5 km",
    hours: "24 hrs",
    rating: 3,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "Lagos University Teaching Hospital",
    distance: "7 km",
    hours: "6 AM - 9 PM",
    rating: 4,
    image: "https://via.placeholder.com/150",
  },
];

const LocationsPage  = ({ onClick }) => {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="locations-page" onClick={onClick}>
        <Header label="Carelink"/>
        <SearchBar placeholder="Hospitals near me" />
        <button className="back-button" onClick={() => navigate('/')}>← Back to Home</button>

        {selectedFacility ? (
        <LocationDetails
          facility={selectedFacility}
          onBack={() => setSelectedFacility(null)}
        />
      ) : (
        <div className="facility-list">
          {facilities.map((facility) => (
            <LocationCard
              key={facility.id}
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
