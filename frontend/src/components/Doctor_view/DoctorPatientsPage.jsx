import React, { useState, useEffect } from "react";
import Header from "../shared/Header";
import SearchBar from "../shared/SearchBar";
import PatientCard from "./PatientCard";
import PatientDetails from "./PatientDetails";
import mockPatients from "./mockPatients.json";
import "./DoctorPatientsPage.css";

const DoctorPatientsPage = ({ doctorRequests = [], updateDoctorStatus }) => {
  const [filter, setFilter] = useState("current");
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([...mockPatients, ...doctorRequests]);

  // Automatically update patient list when new requests come in
  useEffect(() => {
    setPatients([...mockPatients, ...doctorRequests]);
  }, [doctorRequests]);

  const acceptPatient = (id) => {
    // Update the patient's type to "current"
    const updatedPatients = patients.map((p) =>
      p.id === id ? { ...p, type: "current" } : p
    );

    setPatients(updatedPatients);
    updateDoctorStatus(id, "accepted");

    // Find and open updated patient
    const acceptedPatient = updatedPatients.find((p) => p.id === id);

    // Set as selected patient (after update is applied)
    setTimeout(() => {
      setSelectedPatient(acceptedPatient);
    }, 0);

    setFilter("current"); // Optionally switch to current tab
  };

  const denyPatient = (id) => {
    // Remove the patient from list
    const updatedPatients = patients.filter((p) => p.id !== id);
    setPatients(updatedPatients);
    updateDoctorStatus(id, "denied");

    // If denied while viewing details, go back
    if (selectedPatient?.id === id) {
      setSelectedPatient(null);
    }
  };

  const handleSearchChange = (term) => {
    setSearch(term);
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.type === filter &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="doctor-patients-page">
      <Header label="Doctor's Patients" />

      {selectedPatient ? (
        <PatientDetails
          patient={selectedPatient}
          onBack={() => setSelectedPatient(null)}
          editable={selectedPatient?.type === "current"}
          onAccept={acceptPatient}
          onDeny={denyPatient}
        />
      ) : (
        <>
          <SearchBar
            placeholder="Search patients"
            initialValue={search}
            onSearch={handleSearchChange}
            autoSearch={true}
          />

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
        </>
      )}
    </div>
  );
};

export default DoctorPatientsPage;
