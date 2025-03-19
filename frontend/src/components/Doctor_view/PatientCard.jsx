import React from "react";
import "./PatientCard.css";

const PatientCard = ({ patient, onClick, onAccept, onDeny }) => {
  return (
    <div className="patient-card" onClick={onClick}>
      <img src={patient.image} alt={patient.name} className="patient-image" />
      <div className="patient-info">
        <h3>{patient.name}</h3>
        <p>{patient.condition}</p>
        <p className="alert-level">Alert Level: {patient.alertLevel}</p>

        {onAccept && onDeny && (
          <div className="action-buttons">
            <button className="accept-btn" onClick={(e) => { 
              e.stopPropagation(); 
              onAccept(patient.id); // Pass patient ID to accept function
            }}>Accept</button>

            <button className="deny-btn" onClick={(e) => { 
              e.stopPropagation(); 
              onDeny(patient.id); // Pass patient ID to deny function
            }}>Deny</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientCard;
