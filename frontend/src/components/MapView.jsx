import React from 'react';

const MapView = ({ location, markers = [] }) => {
  // Static placeholder for Leaflet/Google Maps
  // Since we're doing UI implementation and to avoid external map API key requirements,
  // we'll build a beautiful static placeholder map UI that simulates a real map.
  
  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden" 
         style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      
      {/* Simulated Map Background Overlay */}
      <div className="absolute inset-0 bg-blue-50/50 backdrop-blur-[2px]"></div>

      {/* Central Marker (Current User) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full animate-ping absolute"></div>
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
          </div>
          <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white"></div>
        </div>
        <div className="mt-2 px-3 py-1 bg-slate-800 text-white text-xs font-semibold rounded-full shadow-lg whitespace-nowrap">
          You are here
        </div>
      </div>

      {/* Geofence Circle Simulation */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-emerald-400 bg-emerald-400/10 rounded-full pointer-events-none"></div>

      {/* Map Controls UI Overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="w-10 h-10 bg-white shadow-md rounded-xl flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">
          +
        </button>
        <button className="w-10 h-10 bg-white shadow-md rounded-xl flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">
          -
        </button>
      </div>
      
      <div className="absolute bottom-4 left-4">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md text-xs font-medium text-slate-600">
          Live Tracking Active
        </div>
      </div>
    </div>
  );
};

export default MapView;
