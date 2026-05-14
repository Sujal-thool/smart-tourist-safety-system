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
        fixed bottom-8 right-8 z-[1000] w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-[0_10px_25px_rgba(239,68,68,0.4)]
        ${triggered 
          ? 'bg-red-700 text-white shadow-[0_0_40px_rgba(220,38,38,0.8)] cursor-not-allowed scale-110' 
          : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer hover:scale-110 hover:shadow-[0_0_40px_rgba(239,68,68,0.8)]'
        }
      `}
    >
      {/* Listening Indicator */}
      {listening && !triggered && (
        <div className="absolute top-0 right-0 flex items-center gap-1.5 px-2 py-1 bg-white rounded-full shadow-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <Mic size={10} className="text-red-600" />
        </div>
      )}

      {/* Pulse effect background when triggered */}
      {triggered && (
        <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white"></span>
      )}
      
      {loading ? (
        <Loader2 size={32} className="animate-spin mb-1" />
      ) : (
        <ShieldAlert size={32} className={`mb-1 transition-transform duration-300 ${triggered ? 'scale-110' : ''}`} />
      )}
      
      <span className="text-xs font-bold uppercase tracking-widest leading-none">
        {triggered ? 'Sent' : 'SOS'}
      </span>
    </button>
  );
};

export default PanicButton;
