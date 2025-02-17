import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../shared/SearchBar';
import Header from '../shared/Header';
import LocationCard from './Locations_components/LocationCard';
import LocationDetails from './Locations_components/LocationDetails';
import DummyLocations from './DummyLocations.json';
import './LocationsPage.css';

const LocationsPage  = ({ onClick }) => {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="locations-page" onClick={onClick}>
      <Header label="Carelink" />
      <SearchBar placeholder="Hospitals near me" />

      {selectedFacility ? (
        <LocationDetails
          facility={selectedFacility}
          onBack={() => setSelectedFacility(null)}
        />
      ) : (
        <div className="facility-list">
          {DummyLocations.map((facility) => (
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
