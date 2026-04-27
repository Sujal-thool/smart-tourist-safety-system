import React from 'react';

const SafetyScore = ({ score = 100 }) => {
  // Determine color based on score
  let colorClass = 'text-emerald-500';
  let strokeClass = 'stroke-emerald-500';
  let statusText = 'Safe Zone';
  
  if (score < 70) {
    colorClass = 'text-amber-500';
    strokeClass = 'stroke-amber-500';
    statusText = 'Caution Zone';
  }
  if (score < 40) {
    colorClass = 'text-red-500';
    strokeClass = 'stroke-red-500';
    statusText = 'Danger Zone';
  }

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100"
          />
          {/* Progress Circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${strokeClass} transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className={`text-2xl font-bold ${colorClass}`}>
          {score}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-slate-800">Safety Index</h3>
        <div className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-slate-100 ${colorClass}`}>
          {statusText}
        </div>
      </div>
    </div>
  );
};

export default SafetyScore;
