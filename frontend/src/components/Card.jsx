import React from 'react';

const Card = ({ children, className = '', noPadding = false }) => {
  return (
    <div 
      className={`glassmorphism rounded-2xl overflow-hidden hover-float ${noPadding ? '' : 'p-6'} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
