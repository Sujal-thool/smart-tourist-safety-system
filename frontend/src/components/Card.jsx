import React from 'react';

const Card = ({ children, className = '', noPadding = false }) => {
  return (
    <div 
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300 ${noPadding ? '' : 'p-6'} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
