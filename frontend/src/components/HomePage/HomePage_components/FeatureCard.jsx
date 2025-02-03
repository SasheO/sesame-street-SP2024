import React from 'react';

const FeatureCard = ({ Icon, label, onClick}) => {
  return (
    <div className="feature-card" onClick={onClick}>
      <Icon aria-label={`Icon for ${label}`} className="feature-icon" />
      <p className="feature-label">{label}</p>
    </div>
  );
};

export default FeatureCard;
