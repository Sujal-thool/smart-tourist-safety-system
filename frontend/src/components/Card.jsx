import React from 'react';

const Card = ({ children, className = '', noPadding = false }) => {
  return (
    <div 
      className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100/60 overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-blue-100/50 transition-all duration-300 ease-out ${noPadding ? '' : 'p-6'} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
