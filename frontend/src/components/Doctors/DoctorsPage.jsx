import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import SearchBar from "../shared/SearchBar";
import Header from "../shared/Header";
import DoctorCard from "./Doctors_components/DoctorCard";
import DoctorDetails from "./Doctors_components/DoctorDetails";
import DummyDoctors from "./DummyDoctors.json";
import "./DoctorsPage.css";

const DoctorsPage  = ({ onClick }) => {

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredDoctors = DummyDoctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="doctors-page" onClick={onClick}>
      <Header label="Carelink" />
      <SearchBar placeholder="Search for a doctor..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {selectedDoctor ? (
        <DoctorDetails doctor={selectedDoctor} onBack={() => setSelectedDoctor(null)} />
      ) : (
        <div className="doctor-list">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onClick={() => setSelectedDoctor(doctor)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorsPage;