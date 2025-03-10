import React, { useState } from "react";
import { IoMdStar, IoMdStarOutline, IoIosArrowBack } from "react-icons/io";
import { IoTrashOutline, IoClose } from "react-icons/io5";
import "./DoctorDetails.css";

const DoctorDetails = ({ doctor, onBack, onDoctorRequest }) => {
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientCondition, setpatientCondition] = useState("");
  const [patientExtraDetails, setPatientExtraDetails] = useState("");

  // Handle doctor request submission
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setShowRequestForm(false);

    // Mark doctor as requested
    doctor.requested = true;

    // Create a corresponding patient request
    const newPatientRequest = {
      id: Date.now(), // Unique ID
      name: patientName || `Request for ${doctor.name}`, // change to current user's name
      condition: patientCondition || "Pending Review",
      alertLevel: "Low",
      type: "requests", // Ensures it appears under Patient Requests
      image: doctor.image,
    };

    // Pass new patient request to DoctorPatientsPage
    onDoctorRequest(newPatientRequest);
  };

  // Determine button text and class
  let buttonText = "Request Doctor";
  let buttonClass = "contact-button request";
  let handleClick = () => setShowRequestForm(true);

  if (doctor.requested) {
    buttonText = doctor.accepted ? "Contact Doctor" : "Doctor Requested";
    buttonClass = doctor.accepted ? "contact-button request" : "contact-button requested";
    handleClick = doctor.accepted ? () => setShowContactPopup(true) : () => {};
  }

  return (
    <div className="doctor-details">
      {/* Header */}
      <div className="icons-container">
        <IoIosArrowBack className="back-icon" onClick={onBack} />
        <IoTrashOutline className="trash-icon" />
      </div>

      {/* Doctor Info */}
      <div className="doctor-info-container">
        <div className="doctor-info-image">
          <img src={doctor.image} alt={doctor.name} />
        </div>
        <div className="doctor-info-text">
          <h2>{doctor.name}</h2>
          <p>{doctor.hospital}</p>
          <p>{doctor.specialty}</p>
          <p>{doctor.patients} patients</p>
          <div className="rating">
            {Array.from({ length: doctor.rating }, (_, index) => (
              <IoMdStar key={index} className="positive-rating" />
            ))}
            {Array.from({ length: 5 - doctor.rating }, (_, index) => (
              <IoMdStarOutline key={index} className="negative-rating" />
            ))}
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bio">
        <h3 className="bio-header">Bio</h3>
        <p className="bio-text">{doctor.bio}</p>
      </div>

      {/* Contact Button */}
      <button className={buttonClass} onClick={handleClick}>{buttonText}</button>

      {/* Contact Doctor Popup */}
      {showContactPopup && (
        <div className="popup">
          <div className="popup-content">
            <IoClose className="close-btn" onClick={() => setShowContactPopup(false)} />
            <h3>Contact {doctor.name}</h3>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
      )}

      {/* Request Doctor Form Popup */}
      {showRequestForm && (
        <div className="popup">
          <div className="popup-content">
            <IoClose className="close-btn" onClick={() => setShowRequestForm(false)} />
            <h3>Request to Speak with {doctor.name}</h3>
            <form onSubmit={handleRequestSubmit}>
              <label>Name:</label>
              <input type="text" 
              placeholder="Enter your name" 
              value={patientName} 
              onChange={(e) => setPatientName(e.target.value)}
              required />

              <label>Email:</label>
              <input type="email" 
              placeholder="Enter your email" 
              value={patientEmail} 
              onChange={(e) => setPatientEmail(e.target.value)}
              required />

              <label>Phone Number:</label>
              <input type="tel" 
              placeholder="Enter your phone number" 
              value={patientPhone} 
              onChange={(e) => setPatientPhone(e.target.value)}
              required />

              <label>Health Conditions:</label>
              <input type="text" 
              placeholder="Enter your health condition(s)" 
              value={patientCondition} 
              onChange={(e) => setpatientCondition(e.target.value)}
              required />

              <label>Reason for Appointment:</label>
              <textarea placeholder="Describe your symptoms" 
              value={patientExtraDetails} 
              onChange={(e) => setPatientExtraDetails(e.target.value)}
              required></textarea>

              <button type="submit">Submit Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDetails;
