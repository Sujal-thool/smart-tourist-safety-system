import React from 'react';
import { X, PhoneCall, ShieldAlert, MessageSquareWarning, Fingerprint } from 'lucide-react';

const EmergencyControlsModal = ({ isOpen, onClose, tourist }) => {
  if (!isOpen || !tourist) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Emergency Controls</h3>
            <p className="text-xs text-slate-500 mt-0.5">Managing actions for Tourist ID: {tourist.id.substring(0,8)}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Grid */}
        <div className="p-6 grid grid-cols-1 gap-4">
          
          <button className="flex items-center gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50 hover:bg-blue-100 hover:border-blue-200 transition-all text-left group">
            <div className="p-3 bg-white rounded-lg text-blue-600 shadow-sm group-hover:scale-105 transition-transform">
              <PhoneCall size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Contact Tourist</h4>
              <p className="text-xs text-slate-500 mt-1">Initiate a direct VOIP call or SMS</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-4 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200 transition-all text-left group">
            <div className="p-3 bg-white rounded-lg text-red-600 shadow-sm group-hover:scale-105 transition-transform">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Dispatch Help</h4>
              <p className="text-xs text-slate-500 mt-1">Send nearest patrol unit to location</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50 hover:bg-amber-100 hover:border-amber-200 transition-all text-left group">
            <div className="p-3 bg-white rounded-lg text-amber-600 shadow-sm group-hover:scale-105 transition-transform">
              <MessageSquareWarning size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Send Warning</h4>
              <p className="text-xs text-slate-500 mt-1">Push urgent alert to their device</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-4 rounded-xl border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-200 transition-all text-left group">
            <div className="p-3 bg-white rounded-lg text-emerald-600 shadow-sm group-hover:scale-105 transition-transform">
              <Fingerprint size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Verify Identity</h4>
              <p className="text-xs text-slate-500 mt-1">Check blockchain Digital ID & KYC</p>
            </div>
          </button>

        </div>
        
        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors text-sm"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyControlsModal;
