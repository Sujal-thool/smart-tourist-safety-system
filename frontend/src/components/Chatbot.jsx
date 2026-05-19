import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

const Chatbot = ({ location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am your SafeTrax AI Assistant. I can help with emergency contacts, local guidelines, and safety info. How can I assist you?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: input, isBot: false }];
    setMessages(newMessages);
    const userInput = input;
    setInput('');

    // Simulate AI thinking and responding
    setTimeout(() => {
      const botResponse = generateResponse(userInput);
      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    }, 800);
  };

  const generateResponse = (originalText) => {
    const text = originalText.toLowerCase();
    if (text.includes('police') || text.includes('emergency') || text.includes('help')) {
      return "If this is an emergency, press the red SOS button on your dashboard immediately! You can also dial 112 for the local police.";
    } else if (text.includes('hospital') || text.includes('doctor') || text.includes('medical')) {
      return "The nearest registered safe hospital is City Care Hospital, located 2.4km away. Would you like me to map the route?";
    } else if (text.includes('safe') || text.includes('danger')) {
      return "Based on your current GPS location, you are in a safe zone. There are no active warnings in your immediate vicinity.";
    } else if (text.includes('id') || text.includes('profile')) {
      return "You can view or share your Blockchain Digital ID by navigating to 'Profile & ID' from the sidebar menu.";
    } else if (text.includes('places') || text.includes('visit') || text.includes('explore')) {
       return "Maharashtra has beautiful spots! I recommend checking out the Hazur Sahib Gurudwara or the historical forts nearby. Check the 'Explore Places' tab for more!";
    } else if (text.includes('location') || text.includes('where am i') || text.includes('my location')) {
       if (location && location.lat !== 0) {
         return `Your current GPS coordinates are Latitude: ${location.lat.toFixed(4)}, Longitude: ${location.lng.toFixed(4)}. You can see your live position on the map in the dashboard.`;
       } else {
         return "I'm still waiting to receive your GPS signal. Please ensure location services are enabled on your device.";
       }
    } else {
      return `You asked about "${originalText}". As your AI assistant, I can tell you that we prioritize your safety above all else. For specific details regarding this, please check your local dashboard widgets or contact the local tourist helpline.`;
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-[100] p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center ${isOpen ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'}`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-[100] w-80 sm:w-96 h-[500px] max-h-[70vh] bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 flex flex-col overflow-hidden fade-in-up">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">SafeTrax Assistant</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Online
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.isBot 
                    ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm' 
                    : 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about safety, places..." 
                className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-2.5 text-sm transition-all outline-none"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
