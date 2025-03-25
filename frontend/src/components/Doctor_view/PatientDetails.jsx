import React, { useState } from 'react';
import { IoIosArrowBack, IoMdCall } from "react-icons/io";
import { PiDotsThreeVerticalBold, PiNotePencilBold } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import './PatientDetails.css';

const PatientDetails = ({ patient, onBack, editable, onAccept, onDeny }) => {
  if (!patient) {
    return <p>No patient selected.</p>;
  }

  const [showPatientsPopup, setShowPatientsPopup] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [notes, setNotes] = useState(patient.notes.join("\n") || "");
  const [isEditing, setIsEditing] = useState(false);

  const saveNotes = () => {
    setIsEditing(false);
    // Optional: Persist notes to backend here
  };

  return (
    <div className="patient-details">
      {/* Top Bar */}
      <div className="icons-container">
        <IoIosArrowBack className="icons" onClick={onBack} />
        <PiDotsThreeVerticalBold className="icons" onClick={() => setShowPatientsPopup(true)} />
      </div>

      {/* Popup */}
      {showPatientsPopup && (
        <div className="popup">
          <div className="popup-content">
            <IoClose className="icons" onClick={() => setShowPatientsPopup(false)} />
            <p>Mark patient as healthy</p>
            <p>Delete patient</p>
          </div>
        </div>
      )}

      {/* Patient Info */}
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

      {/* Notes */}
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

      {/* Edit + Contact Buttons */}
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

      {/* Accept/Deny Buttons for Requests */}
      {patient.type === "requests" && (
        <div className="buttons-container">
          {onAccept && (
            <button className="accept-button" onClick={() => onAccept(patient.id)}>
              Accept
            </button>
          )}
          {onDeny && (
            <button className="deny-button" onClick={() => onDeny(patient.id)}>
              Deny
            </button>
          )}
        </div>
      )}

      {/* Contact Popup */}
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
