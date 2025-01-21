import React from 'react';

const FeatureCard = ({ Icon, label }) => {
  return (
    <div className="feature-card">
      <Icon className="feature-icon" />
      <p className="feature-label">{label}</p>
    </div>
  );
};

export default FeatureCard;
