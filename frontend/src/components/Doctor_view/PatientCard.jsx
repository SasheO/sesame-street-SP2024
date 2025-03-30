import React from "react";
import "./PatientCard.css";

const PatientCard = ({ patient, onClick, onAccept, onDeny }) => {
  return (
    <div className="patient-card" onClick={onClick}>
      <img src={patient.image} alt={patient.name} className="patient-image" />
      <div className="patient-info">
        <h3>{patient.name}</h3>
        <p>{patient.condition}</p>

        {patient.type === "current" && (
          <p className="alert-level">Alert Level: {patient.alertLevel}</p>
        )}

        <div className="buttons-container">
          {onAccept && (
            <button
              className="accept-button"
              onClick={(e) => {
                e.stopPropagation();
                onAccept();
              }}
            >
              Accept
            </button>
          )}

          {onDeny && (
            <button
              className="deny-button"
              onClick={(e) => {
                e.stopPropagation();
                onDeny();
              }}>
              Deny
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
