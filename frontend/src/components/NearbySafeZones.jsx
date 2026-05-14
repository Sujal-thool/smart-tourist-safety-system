import React from 'react';
import Card from './Card';
import { Shield, Building2, HeartPulse, ShieldCheck } from 'lucide-react';

const NearbySafeZones = () => {
  const safeZones = [
    { id: 1, name: "Central Police Station", type: "Police", distance: "0.8 km", icon: Shield, color: "bg-blue-100 text-blue-600" },
    { id: 2, name: "City Hospital", type: "Hospital", distance: "1.2 km", icon: HeartPulse, color: "bg-red-100 text-red-600" },
    { id: 3, name: "Downtown Registered Hotel", type: "Hotel", distance: "2.5 km", icon: Building2, color: "bg-emerald-100 text-emerald-600" },
  ];

  return (
    <Card className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck size={20} className="text-emerald-500" /> Nearby Safe Zones
        </h3>
        <button className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded-lg">
          Map
        </button>
      </div>

      <div className="space-y-4">
        {safeZones.map(zone => (
          <div key={zone.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${zone.color}`}>
                <zone.icon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{zone.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{zone.type}</p>
              </div>
            </div>
            <div className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              {zone.distance}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NearbySafeZones;
