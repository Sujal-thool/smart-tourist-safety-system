import React, { useState } from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';
import api from '../services/api';

const PanicButton = ({ location }) => {
  const [loading, setLoading] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const handlePanic = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      await api.post('/tourist/panic', { 
        lat: location?.lat || 0, 
        lng: location?.lng || 0 
      });
      setTriggered(true);
      setTimeout(() => setTriggered(false), 5000); // Reset UI after 5 seconds but police knows
    } catch (error) {
      alert('Failed to send SOS. Please call local authorities manually.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePanic}
      disabled={loading || triggered}
      className={`
        relative overflow-hidden group w-full p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300
        ${triggered 
          ? 'bg-red-600 text-white shadow-[0_0_40px_rgba(220,38,38,0.6)] cursor-not-allowed' 
          : 'bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border-2 border-red-200 hover:border-transparent cursor-pointer shadow-sm hover:shadow-xl hover:shadow-red-500/30'
        }
      `}
    >
      {/* Pulse effect background when triggered */}
      {triggered && (
        <span className="absolute inset-0 rounded-2xl animate-ping opacity-20 bg-white"></span>
      )}
      
      {loading ? (
        <Loader2 size={48} className="animate-spin" />
      ) : (
        <ShieldAlert size={48} className={`transition-transform duration-300 ${triggered ? 'scale-110' : 'group-hover:scale-110'}`} />
      )}
      
      <div>
        <h3 className="text-lg font-bold">
          {triggered ? 'SOS BROADCASTED' : 'EMERGENCY SOS'}
        </h3>
        <p className={`text-xs font-medium mt-1 ${triggered ? 'text-red-100' : 'text-red-400 group-hover:text-red-100'}`}>
          {triggered ? 'Police dispatched to your location' : 'Tap to instantly alert authorities'}
        </p>
      </div>
    </button>
  );
};

export default PanicButton;
