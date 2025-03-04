import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../shared/Header";
import SearchBar from "../shared/SearchBar";
import PatientCard from "./PatientCard";
import PatientDetails from "./PatientDetails";
import mockPatients from "./mockPatients.json";
import "./DoctorPatientsPage.css";

const DoctorPatientsPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("current");
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

  return (
    <div className="doctor-patients-page">
      <Header label="Doctor's Patients" />
      <SearchBar placeholder="Search patients" />

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

      {selectedPatient ? (
        <PatientDetails patient={selectedPatient} onBack={() => setSelectedPatient(null)} />
      ) : (
        <div className="patient-list">
          {patients
            .filter((p) => p.type === filter)
            .map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onClick={() => setSelectedPatient(patient)}
                onAccept={filter === "requests" ? () => acceptPatient(patient.id) : null}
                onDeny={filter === "requests" ? () => denyPatient(patient.id) : null}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPatientsPage;
