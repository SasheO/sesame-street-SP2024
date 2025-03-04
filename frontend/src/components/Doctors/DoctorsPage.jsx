import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import SearchBar from "../shared/SearchBar";
import Header from "../shared/Header";
import DoctorCard from "./Doctors_components/DoctorCard";
import DoctorDetails from "./Doctors_components/DoctorDetails";
import DummyDoctors from "./DummyDoctors.json";
import "./DoctorsPage.css";

const DoctorsPage = ({ onClick }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [search, setSearch] = useState("");
  const [showRequested, setShowRequested] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (term) => {
    setSearch(term);
  };

  // First filter doctors by category, then by search term
  const doctorsToShow = DummyDoctors.filter((doctor) =>
    showRequested ? doctor.requested : !doctor.requested
  ).filter((doctor) => doctor.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="doctors-page" onClick={onClick}>
      <Header label="Carelink" />

      {selectedDoctor ? (
        <DoctorDetails doctor={selectedDoctor} onBack={() => setSelectedDoctor(null)} />
      ) : (
        <>
          <SearchBar 
            placeholder="Have a doctor in mind?" 
            initialValue={search} 
            onSearch={handleSearchChange}
            autoSearch={true}
          />
          <div className="doctor-list">
            {doctorsToShow.length > 0 ? (
              doctorsToShow.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onClick={() => setSelectedDoctor(doctor)}
                />
              ))
            ) : (
              <p className="no-results">No doctors found</p>
            )}
          </div>

          {/* Toggle Buttons */}
          <div className="toggle-buttons">
            <button
              className={`toggle-button ${!showRequested ? "active" : ""}`}
              onClick={() => setShowRequested(false)}
            >
              Available Doctors
            </button>
            <button
              className={`toggle-button ${showRequested ? "active" : ""}`}
              onClick={() => setShowRequested(true)}
            >
              Requested Doctors
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorsPage;
