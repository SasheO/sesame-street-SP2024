import React, { useState } from 'react';
import { IoIosArrowBack, IoMdCall } from "react-icons/io";
import { PiDotsThreeVerticalBold, PiNotePencilBold } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import './PatientDetails.css';

const PatientDetails = ({ patient, onBack, editable, onAccept, onDeny, onClick }) => {
  if (!patient) return <p>No patient selected.</p>;

  const [showPatientsPopup, setShowPatientsPopup] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [notes, setNotes] = useState(patient.notes.join("\n") || "");
  const [isEditing, setIsEditing] = useState(false);
  const [alertLevel, setAlertLevel] = useState(patient.alertLevel || "");

  const isRequested = patient.type === "requests";
  const isCurrent = patient.type === "current";

  const saveNotes = () => {
    setIsEditing(false);
    // Optional: persist alertLevel and notes to backend/state here
  };

  const handleDenyClick = () => {
    if (onDeny) {
      onDeny(patient.id);
      setShowPatientsPopup(false);
      onBack(); // Optional: go back after action
    }
  };

  return (
    <div className="patient-details">
      {/* Top controls */}
      <div className="icons-container">
        <IoIosArrowBack className="icons" onClick={onBack} />
        <PiDotsThreeVerticalBold className="icons" onClick={() => setShowPatientsPopup(true)} />
      </div>

      {/* Popup */}
      {showPatientsPopup && (
        <div className="popup">
          <div className="popup-content">
            <IoClose className="icons" onClick={() => setShowPatientsPopup(false)} />
              <div className="menu-items" onClick={onClick}>
                <p onClick={handleDenyClick}>Mark patient as healthy</p>
                <p onClick={handleDenyClick}>Delete patient</p>
              </div>
          </div>
        </div>
      )}

      {/* Patient header */}
      <div className="patient-info-container">
        <div className="patient-info-image">
          <img src={patient.image} alt={patient.name} />
        </div>
        <div className="patient-info-text">
          <h2>{patient.name}</h2>
          <p>{patient.condition}</p>

          {isCurrent && (
            <>
              {isEditing ? (
                <div className="alert-dropdown">
                  <label htmlFor="alert-select"><strong>Alert Level: </strong></label>
                  <select
                    id="alert-select"
                    value={alertLevel}
                    onChange={(e) => setAlertLevel(e.target.value)}
                  >
                    <option value="✔️">✔️ Normal</option>
                    <option value="⚠️">⚠️ Caution</option>
                    <option value="❗">❗ High Alert</option>
                  </select>
                </div>
              ) : (
                <p className="alert-level"><strong>Alert Level:</strong> {alertLevel}</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Form Fields (always shown) */}
      <div className="request-info">
        <p><strong>Name:</strong> {patient.name}</p>
        <p><strong>Email:</strong> {patient.email}</p>
        <p><strong>Phone Number:</strong> {patient.phone}</p>
        <p><strong>Previous Health Conditions:</strong> {patient.conditions}</p>
        <p><strong>Reason for Appointment:</strong> {patient.reason}</p>
      </div>

      {/* Accept/Deny buttons for requested patients */}
      {isRequested && (
        <div className="buttons-container">
          {onAccept && (
            <button className="buttons-in-container accept" onClick={() => onAccept(patient.id)}>
              Accept
            </button>
          )}
          {onDeny && (
            <button className="buttons-in-container deny" onClick={() => onDeny(patient.id)}>
              Deny
            </button>
          )}
        </div>
      )}

      {/* Notes + Contact for current patients */}
      {isCurrent && (
        <>
          <h3>Notes</h3>
          {editable && isEditing ? (
            <textarea
              className="notes-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          ) : (
            <p className="notes-display">{notes || "No notes yet..."}</p>
          )}

          <div className="buttons-container">
            {editable && (
              <button
                className="buttons-in-container edit-button"
                onClick={() => {
                  if (isEditing) saveNotes();
                  setIsEditing(!isEditing);
                }}
              >
                <PiNotePencilBold className="button-icons" />
                {isEditing ? "Save Notes" : "Edit Notes"}
              </button>
            )}

            <button
              className="buttons-in-container contact-button"
              onClick={() => setShowContactPopup(true)}
            >
              <IoMdCall className="button-icons" />
              Contact Patient
            </button>
          </div>

          {showContactPopup && (
            <div className="popup">
              <div className="popup-content">
                <IoClose className="icons" onClick={() => setShowContactPopup(false)} />
                <h3>Contact {patient.name}</h3>
                <p>Phone: {patient.phone || "(123) 456-7890"}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PatientDetails;
