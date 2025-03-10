import React, { useState } from "react";
import Header from "../shared/Header";
import SearchBar from "../shared/SearchBar";
import PatientCard from "./PatientCard";
import PatientDetails from "./PatientDetails";
import mockPatients from "./mockPatients.json";
import "./DoctorPatientsPage.css";

const DoctorPatientsPage = () => {
  const [filter, setFilter] = useState("current");
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState(mockPatients);

  // Function to handle accepting a patient request
  const acceptPatient = (id) => {
    setPatients((prevPatients) =>
      prevPatients.map((p) =>
        p.id === id ? { ...p, type: "current" } : p
      )
    );
  };

  // Function to handle denying a patient request
  const denyPatient = (id) => {
    setPatients((prevPatients) =>
      prevPatients.filter((p) => p.id !== id)
    );
  };

  // Search functionality
  const handleSearchChange = (term) => {
    setSearch(term);
  };

  // Apply search filter along with category filter
  const filteredPatients = patients.filter(
    (p) => p.type === filter && p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="doctor-patients-page">
      <Header label="Doctor's Patients" />
      <SearchBar 
        placeholder="Search patients" 
        initialValue={search} 
        onSearch={handleSearchChange}
        autoSearch={true}
      />

      {selectedPatient ? (
        <PatientDetails patient={selectedPatient} onBack={() => setSelectedPatient(null)} />
      ) : (
        <div className="patient-list">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onClick={() => setSelectedPatient(patient)}
                onAccept={filter === "requests" ? () => acceptPatient(patient.id) : null}
                onDeny={filter === "requests" ? () => denyPatient(patient.id) : null}
              />
            ))
          ) : (
            <p className="no-results">No patients found</p>
          )}
        </div>
      )}

      <div className="filter-buttons">
        <button
          className={filter === "current" ? "active" : ""}
          onClick={() => setFilter("current")}
        >
          Current Patients
        </button>
        <button
          className={filter === "requests" ? "active" : ""}
          onClick={() => setFilter("requests")}
        >
          Patient Requests
        </button>
      </div>

    </div>
  );
};

export default DoctorPatientsPage;
