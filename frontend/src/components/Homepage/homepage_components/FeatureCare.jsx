import React from 'react';

const FeatureCard = ({ Icon, label, onClick }) => {
  return (
    <div 
      className="feature-card" 
      onClick={onClick} 
      style={{ cursor: "pointer" }} // Makes it clear that it's clickable
    >
      <Icon className="feature-icon" />
      <p className="feature-label">{label}</p>
    </div>
  );
};


export default FeatureCard;