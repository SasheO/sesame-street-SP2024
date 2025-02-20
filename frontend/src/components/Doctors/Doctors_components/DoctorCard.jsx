import React from 'react';
import { IoMdStar } from "react-icons/io";
import { IoMdStarOutline } from "react-icons/io";
import './DoctorCard.css';

const DoctorCard = ({ doctor, onClick }) => {
  return (
    <div className="doctor-card" onClick={onClick}>
      
      <img src={doctor.image} 
        alt={doctor.name} 
        className="doctor-image" />
      <div className="doctor-info">
        <h3>{doctor.name}</h3>
        <p>{doctor.specialty}</p>
        <p>Hours: {doctor.patients}</p>
        <div className="rating">
          {Array.from({ length: doctor.rating }, (_, index) => (
            <IoMdStar key={index} className="rating-icon" />
          ))}
          {Array.from({ length: 5 - doctor.rating }, (_, index) => (
            <IoMdStarOutline key={`empty-${index}`} className="rating-icon empty-star" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
