import React, { useState } from 'react';
import { IoIosArrowBack, IoMdCall } from "react-icons/io";
import { PiDotsThreeVerticalBold, PiNotePencilBold } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import './PatientDetails.css';

const PatientDetails = ({ patient, onBack }) => {
  if (!patient) {
    return <p>No patient selected.</p>;
  }
  const [showPatientsPopup, setShowPatientsPopup] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [notes, setNotes] = useState(patient.notes.join("\n") || ""); // Store all notes in one field
  const [isEditing, setIsEditing] = useState(false);

  // Function to save edited notes
  const saveNotes = () => {
    setIsEditing(false);
  };

  return (
    <div className="patient-details">

      <div className="icons-container">
        <IoIosArrowBack className="icons" onClick={onBack} />
        <PiDotsThreeVerticalBold className="icons" onClick= {() => setShowPatientsPopup(true)} />
      </div>

      {/* Delete Patient or Mark as Healthy Popup */}
      {showPatientsPopup && (
        <div className="popup">
          <div className="popup-content">
            <IoClose className="icons" onClick={() => setShowPatientsPopup(false)} />
            <p>Mark patient as healthy</p>
            <p>Delete patient</p>
          </div>
        </div>
      )}

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

      <div className="patients-buttons-container">
        <button className="edit-notes-btn" onClick={() => setIsEditing(!isEditing)}>
          <PiNotePencilBold className="button-icons"/>
          {isEditing ? "Save Notes" : "Edit Notes"}
        </button>

        <button className="edit-notes-btn" onClick={() => setShowContactPopup(true)}>
          <IoMdCall className="button-icons"/>
          Contact Patient
        </button>

        {/* <IoMdCall className="icons" onClick={() => setShowContactPopup(true)}/> */}
      </div>
      
      {showContactPopup && (
        <div className="popup">
          <div className="popup-content">
            <IoClose className="icons" onClick={() => setShowContactPopup(false)} />
            <h3>Contact {patient.name}</h3>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
