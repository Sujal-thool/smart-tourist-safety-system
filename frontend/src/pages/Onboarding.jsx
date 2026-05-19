import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ShieldCheck, UserCircle, Globe, CreditCard, ChevronRight, Loader2 } from 'lucide-react';

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    nationality: '',
    documentType: 'Passport',
    documentNumber: '',
    personalPhone: '',
    emergencyPhone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateDocumentNumber = () => {
    const { documentType, documentNumber } = formData;
    if (documentType === 'National ID') {
      if (!/^\d{12}$/.test(documentNumber)) {
        return "National ID (Aadhaar) must be exactly 12 digits.";
      }
    } else if (documentType === 'Passport') {
      if (!/^[A-Z0-9]{8,9}$/i.test(documentNumber)) {
        return "Passport number must be 8-9 alphanumeric characters.";
      }
    } else if (documentType === "Driver's License") {
      if (!/^[A-Z0-9]{10,16}$/i.test(documentNumber)) {
        return "Driver's License must be 10-16 alphanumeric characters.";
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errorMsg = validateDocumentNumber();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }
    
    setLoading(true);
    
    try {
      // Create Digital ID in backend
      await api.post('/tourist/id', formData);
      
      // Simulate ID generation animation wait
      setTimeout(() => {
        setLoading(false);
        navigate('/tourist/dashboard');
      }, 1500);
      
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create Digital ID');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 font-sans">
      
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative">
        
        {/* Header Ribbon */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

        <div className="px-8 pt-10 pb-6 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
            <ShieldCheck size={32} className="text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Complete Your Profile</h2>
          <p className="text-slate-500 mt-2 font-medium">Create your verified Digital Tourist ID to access advanced safety features.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-10">
          
          <div className="space-y-6">
            
            {/* Personal Details Section */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-4">
                <UserCircle size={18} className="text-blue-500" /> Personal Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-700 text-xs font-semibold ml-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-slate-700 text-xs font-semibold ml-1">Nationality</label>
                  <div className="relative">
                    <Globe size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="nationality"
                      placeholder="e.g. American, British"
                      value={formData.nationality}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-700 text-xs font-semibold ml-1">Personal Phone</label>
                  <input
                    type="text"
                    name="personalPhone"
                    placeholder="+1 234 567 890"
                    value={formData.personalPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-slate-700 text-xs font-semibold ml-1">Emergency Contact</label>
                  <input
                    type="text"
                    name="emergencyPhone"
                    placeholder="+1 987 654 321"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Verification Documents Section */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-4">
                <CreditCard size={18} className="text-emerald-500" /> Identity Verification
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-700 text-xs font-semibold ml-1">Document Type</label>
                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Passport">Passport</option>
                    <option value="National ID">National ID Card</option>
                    <option value="Driver's License">Driver's License</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-slate-700 text-xs font-semibold ml-1">Document Number</label>
                  <input
                    type="text"
                    name="documentNumber"
                    placeholder="Enter ID Number"
                    value={formData.documentNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-transform: uppercase"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Advanced Feature Callout */}
            <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl flex gap-4 items-start">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 shrink-0 mt-0.5">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-indigo-900 text-sm">Blockchain Encryption Enabled</h4>
                <p className="text-indigo-700 text-xs mt-1 leading-relaxed">
                  Your identity data will be securely anchored to the blockchain, ensuring tamper-proof verification for local authorities while maintaining privacy.
                </p>
              </div>
            </div>

          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm shadow-blue-600/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generating Verifiable ID...
                </>
              ) : (
                <>
                  Generate Digital ID <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default Onboarding;
