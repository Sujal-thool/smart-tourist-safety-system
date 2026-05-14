import React from 'react';
import Card from './Card';
import { MapPin, Navigation, ShieldAlert, ShieldCheck, Activity } from 'lucide-react';

const SafetyStatusPanel = ({ location }) => {
  // Mock data for now, ideally derived from backend/AI
  const isSafeZone = true;
  const speed = location?.lat !== 0 ? "3.2 km/h (Walking)" : "Stationary";
  const aiStatus = "Normal Activity";

  return (
    <Card className="flex flex-col gap-4 relative overflow-hidden">
      {/* Background Accent */}
      <div className={`absolute top-0 left-0 w-full h-1 ${isSafeZone ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
      
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
        <Activity size={20} className="text-blue-500" /> Safety Status
      </h3>
      
      <div className="space-y-4">
        {/* Location Status */}
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg mt-0.5 ${isSafeZone ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {isSafeZone ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-0.5">Zone Status</p>
            <p className={`text-sm font-semibold ${isSafeZone ? 'text-emerald-700' : 'text-red-700'}`}>
              {isSafeZone ? 'Safe Zone (Downtown)' : 'High Risk Area'}
            </p>
          </div>
        </div>

        {/* Current Location / Speed */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mt-0.5">
            <Navigation size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-0.5">Movement</p>
            <p className="text-sm font-semibold text-slate-700">
              {speed}
            </p>
          </div>
        </div>

        {/* AI Anomaly */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 mt-0.5">
            <Activity size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-0.5">AI Analysis</p>
            <p className="text-sm font-semibold text-slate-700">
              {aiStatus}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SafetyStatusPanel;
