import React from "react";
import { IoMdStar, IoMdStarOutline, IoIosArrowBack } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
// import { Button } from "@/components/ui/button";
import "./DoctorDetails.css"

const DoctorDetails = ({ doctor, onBack }) => {
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
          <img src={doctor.image} alt={doctor.name}/>
        </div>
        <div className="doctor-info-text">
          <h2>{doctor.name}</h2>
          <p >{doctor.hospital}</p>
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

      {/* Reviews */}
      {/* <div className="mt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Reviews</h3>
          <button className="text-blue-600 text-sm">Show all</button>
        </div>
        <div className="mt-3 space-y-4">
          {doctor.reviews?.map((review, index) => (
            <div key={index} className="flex items-start gap-3">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{review.name}</p>
                <p className="text-gray-500 text-sm">{review.comment}</p>
                <p className="text-gray-400 text-xs">{review.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Contact Button */}
      <button className="contact-button">Request Contact</button>
    </div>
  );
};

export default DoctorDetails;
