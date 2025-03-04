import React, { useState } from "react";
import { IoMdStar, IoMdStarOutline, IoIosArrowBack } from "react-icons/io";
import { IoTrashOutline, IoClose } from "react-icons/io5";
import "./DoctorDetails.css";

const DoctorDetails = ({ doctor, onBack }) => {
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);

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
            <IoClose className="close-btn" aria-label="Close icon" onClick={() => setShowContactPopup(false)}/>
            <h3>Contact {doctor.name}</h3>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
      )}

      {/* Request Doctor Form Popup */}
      {showRequestForm && (
        <div className="popup">
          <div className="popup-content">
          <IoClose className="close-btn" aria-label="Close icon" onClick={() => setShowRequestForm(false)}/>
            <h3>Request to Speak with {doctor.name}</h3>
            <form>
              <label>Name:</label>
              <input type="text" placeholder="Enter your name" required />

              <label>Email:</label>
              <input type="email" placeholder="Enter your email" required />

              <label>Phone Number:</label>
              <input type="email" placeholder="Enter your phone number" required />

              <label>Reason for Appointment:</label>
              <textarea placeholder="Enter your reason" required></textarea>

              <button type="submit">Submit Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDetails;
