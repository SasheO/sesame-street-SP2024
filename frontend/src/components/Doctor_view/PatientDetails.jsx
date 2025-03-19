import React, { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import './PatientDetails.css';

const PatientDetails = ({ patient, onBack }) => {
  if (!patient) {
    return <p>No patient selected.</p>;
  }

  const [notes, setNotes] = useState(patient.notes.join("\n") || ""); // Store all notes in one field
  const [isEditing, setIsEditing] = useState(false);

  // Function to save edited notes
  const saveNotes = () => {
    setIsEditing(false);
  };

  return (
    <div className="patient-details">
      <IoIosArrowBack className="back-icon" onClick={onBack} />

      <div className="patient-info-container">
        <div className="patient-info-image">
          <img src={patient.image} alt={patient.name} />
        </div>
        <div className="patient-info-text">
          <h2>{patient.name}</h2>
          <p>{patient.condition}</p>
          <p className="alert-level">Alert Level: {patient.alertLevel}</p>
        </div>
      </div>

        <h3>Notes</h3>
        {isEditing ? (
          <textarea
            className="notes-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
            
      ) : (
        <p className="notes-display">{notes || "No notes yet..."}</p>
      )}

      <button className="edit-notes-btn" onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? "Save Notes" : "Edit Notes"}
      </button>
    </div>
  );
};

export default PatientDetails;
