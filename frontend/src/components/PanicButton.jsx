import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, Loader2, Mic } from 'lucide-react';
import api from '../services/api';

const PanicButton = ({ location }) => {
  const [loading, setLoading] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [listening, setListening] = useState(false);

  const handlePanic = useCallback(async () => {
    if (loading || triggered) return;
    
    setLoading(true);
    try {
      await api.post('/tourist/panic', { 
        lat: location?.lat || 0, 
        lng: location?.lng || 0 
      });
      setTriggered(true);
      setTimeout(() => setTriggered(false), 5000); // Reset UI after 5 seconds but police knows
    } catch {
      alert('Failed to send SOS. Please call local authorities manually.');
    } finally {
      setLoading(false);
    }
  }, [loading, triggered, location]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true; // Use interim results for faster response
    recognition.lang = 'en-US'; // Defaulting to English, can be expanded later based on user prefs

    recognition.onstart = () => setListening(true);
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ')
        .toLowerCase();
      
      // Trigger panic if safe words are detected
      if (transcript.includes('help') || transcript.includes('emergency')) {
        handlePanic();
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      // Auto-restart listening to keep it always active
      try {
        recognition.start();
      } catch {
        setListening(false);
      }
    };

    // Start listening
    try {
      recognition.start();
    } catch {
      console.error("Failed to start speech recognition");
    }

    return () => {
      recognition.stop();
    };
  }, [handlePanic]);

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
      {/* Listening Indicator */}
      {listening && !triggered && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-red-100 rounded-full group-hover:bg-red-500 transition-colors">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 group-hover:bg-white transition-colors"></span>
          </span>
          <Mic size={12} className="text-red-600 group-hover:text-white transition-colors" />
        </div>
      )}

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
          {triggered ? 'Police dispatched to your location' : 'Say "Help" or tap to alert authorities'}
        </p>
      </div>
    </button>
  );
};

export default PanicButton;
