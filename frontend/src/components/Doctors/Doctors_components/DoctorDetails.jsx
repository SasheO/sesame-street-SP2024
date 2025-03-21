import React, { useState, useEffect } from "react";
import { IoMdStar, IoMdStarOutline, IoIosArrowBack } from "react-icons/io";
import { IoTrashOutline, IoClose } from "react-icons/io5";
import "./DoctorDetails.css";

const DoctorDetails = ({ doctor, onBack, onDoctorRequest, onDeleteDoctorRequest, existingRequest }) => {
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [patientName, setPatientName] = useState(existingRequest?.name || "");
  const [patientEmail, setPatientEmail] = useState(existingRequest?.email || "");
  const [patientPhone, setPatientPhone] = useState(existingRequest?.phone || "");
  const [patientCondition, setPatientCondition] = useState(existingRequest?.condition || "");
  const [patientExtraDetails, setPatientExtraDetails] = useState(existingRequest?.extraDetails || "");

  useEffect(() => {
    // Load the existing request when doctor details are opened
    if (existingRequest) {
      setPatientName(existingRequest.name);
      setPatientEmail(existingRequest.email);
      setPatientPhone(existingRequest.phone);
      setPatientCondition(existingRequest.condition);
      setPatientExtraDetails(existingRequest.extraDetails);
    }
  }, [existingRequest]);

  // Handle doctor request submission
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setShowRequestForm(false);

    // Mark doctor as requested
    doctor.requested = true;

    // Create a corresponding patient request
    const updatedRequest = {
      id: doctor.id,
      name: patientName,
      email: patientEmail,
      phone: patientPhone,
      condition: patientCondition,
      extraDetails: patientExtraDetails,
      image: doctor.image,
      type: "requests",
    };

    // Pass the updated request to the parent component
    onDoctorRequest(updatedRequest);
  };


  // Handle delete request
  const handleDelete = () => {
    setShowConfirmDelete(false);
    onDeleteDoctorRequest(doctor.id);
    onBack();
  };

  // Handle edit request
  const handleEditClick = () => {
    setShowReviewForm(false);
    setShowRequestForm(true); // Change both values at once
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
        <IoIosArrowBack data-testid="back-icon" className="icons" onClick={onBack} />
        {doctor.requested && <IoTrashOutline className="icons" onClick={() => setShowConfirmDelete(true)}/>}
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
      <div className="buttons-container">
        <button className={buttonClass} onClick={handleClick}>{buttonText}</button>
        {doctor.requested && !doctor.accepted && (
          <button className="buttons-in-container" onClick={() => setShowReviewForm(true)}>View Request</button>
        )}
      </div>

      {/* Confirm delete Popup */}
      {showConfirmDelete && (
        <div className="popup">
          <div className="popup-content">
            <IoClose className="icons" onClick={() => setShowConfirmDelete(false)} />
            <h3>Are you sure you want to delete this doctor's contact?</h3>
            <p>You will have to go request again if you want to contact this doctor in the future.</p>
            <div className="confirm-buttons">
              <button className="confirm-button" onClick={handleDelete}>Yes</button>
              <button className="cancel-button" onClick={() => setShowConfirmDelete(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Doctor Popup */}
      {showContactPopup && (
        <div className="popup">
          <div className="popup-content">
            <IoClose className="icons" onClick={() => setShowContactPopup(false)} />
            <h3>Contact {doctor.name}</h3>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
      )}

      {/* Request Doctor Form Popup */}
      {showRequestForm && (
        <div className="popup">
          <div className="popup-content">
            <IoClose className="icons" onClick={() => setShowRequestForm(false)} />
            <h3>Request to Speak with {doctor.name}</h3>
            <form onSubmit={handleRequestSubmit}>
              <label class="form-label">Name:</label>
              <input type="text" 
              placeholder="Enter your name" 
              value={patientName} 
              onChange={(e) => setPatientName(e.target.value)}
              required />

              <label class="form-label">Email:</label>
              <input type="email" 
              placeholder="Enter your email" 
              value={patientEmail} 
              onChange={(e) => setPatientEmail(e.target.value)}
              required />

              <label class="form-label">Phone Number:</label>
              <input type="tel" 
              placeholder="Enter your phone number" 
              value={patientPhone} 
              onChange={(e) => setPatientPhone(e.target.value)}
              required />

              <label class="form-label">Previous Health Conditions:</label>
              <input type="text" 
              placeholder="Enter any health condition(s) you have" 
              value={patientCondition} 
              onChange={(e) => setPatientCondition(e.target.value)}/>

              <label class="form-label">Reason for Appointment:</label>
              <textarea placeholder="Describe your current symptoms" 
              value={patientExtraDetails} 
              onChange={(e) => setPatientExtraDetails(e.target.value)}
              required></textarea>

              <button type="submit">Submit Request</button>
            </form>
          </div>
        </div>
      )}

      {/* Review submitted request Popup */}
      {showReviewForm && (
        <div className="popup">
          <div className="popup-content">
            <IoClose className="icons" onClick={() => setShowReviewForm(false)} />
              <label class="form-label">Name:</label>
              <p> {patientName} </p>

              <label class="form-label">Email:</label>
              <p> {patientEmail} </p>

              <label class="form-label">Phone Number:</label>
              <p> {patientPhone} </p>

              <label class="form-label">Previous Health Conditions:</label>
              <p> {patientCondition} </p>

              <label class="form-label">Reason for Appointment:</label>
              <p> {patientExtraDetails} </p>

            <div className="confirm-buttons">
              <button onClick={() => handleEditClick()}>Edit Form</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDetails;
