import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Phone, Calendar, UserRound, Edit2, Check, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [touristIdData, setTouristIdData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', nationality: '' });

  useEffect(() => {
    const fetchTouristId = async () => {
      try {
        const res = await api.get('/tourist/id');
        setTouristIdData(res.data);
        setEditForm({ fullName: res.data.fullName, nationality: res.data.nationality });
      } catch (err) {
        console.error("Failed to fetch Tourist ID", err);
      }
    };
    if (user?.role === 'Tourist') {
      fetchTouristId();
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const res = await api.put('/tourist/id', editForm);
      setTouristIdData(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update Tourist ID", err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-800/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar role={user?.role || "Tourist"} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <Navbar title="Profile & Digital ID" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Your Digital Passport</h2>
              <p className="text-slate-500 mt-1">Manage your identity and verifiable credentials securely on the blockchain.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              
              {/* Left Column: Digital ID Card */}
              <div className="md:col-span-1">
                <Card className="flex flex-col items-center text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                  
                  <div className="relative mt-8 mb-4">
                    <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
                      <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <UserRound size={40} />
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-emerald-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white">
                      <ShieldCheck size={12} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800">{touristIdData?.fullName || user?.name || "Jane Tourist"}</h3>
                  <p className="text-sm text-slate-500 font-medium">Tourist ID: {touristIdData?.documentNumber || "TID-948274"}</p>
                  
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded-full tracking-wider border border-blue-100">
                    <ShieldCheck size={14} /> KYC Verified
                  </div>

                  <div className="w-full border-t border-slate-100 mt-6 pt-6 flex flex-col items-center">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-3">Scan to verify ID</p>
                    <div className="p-3 bg-white border border-slate-200 shadow-[0_0_10px_rgba(0,0,0,0.05)] rounded-xl group-hover:scale-105 transition-transform duration-300">
                      {touristIdData?.blockchainHash ? (
                        <QRCodeSVG value={touristIdData.blockchainHash} size={120} />
                      ) : (
                        <div className="w-[120px] h-[120px] bg-slate-100 animate-pulse rounded-lg"></div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column: Details */}
              <div className="md:col-span-2 space-y-6 md:space-y-8">
                
                <Card>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      Personal Information
                    </h3>
                    {!isEditing ? (
                      <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                        <Edit2 size={14} /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => { setIsEditing(false); setEditForm({ fullName: touristIdData?.fullName, nationality: touristIdData?.nationality }); }} className="flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                          <X size={14} /> Cancel
                        </button>
                        <button onClick={handleSave} className="flex items-center gap-1 text-xs font-semibold text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
                          <Check size={14} /> Save
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Full Name</p>
                      {isEditing ? (
                        <input type="text" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                      ) : (
                        <p className="font-medium text-slate-800">{touristIdData?.fullName || user?.name || "Jane Doe Tourist"}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Nationality</p>
                      {isEditing ? (
                        <input type="text" value={editForm.nationality} onChange={e => setEditForm({...editForm, nationality: e.target.value})} className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                      ) : (
                        <p className="font-medium text-slate-800">{touristIdData?.nationality || "Not Specified"}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 hover:text-blue-500 transition-colors">
                        <Mail size={14} className="inline mr-1 -mt-0.5" /> Email Address
                      </p>
                      <p className="font-medium text-slate-800">{user?.email || "jane@example.com"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 hover:text-blue-500 transition-colors">
                        <Phone size={14} className="inline mr-1 -mt-0.5" /> Emergency Contact
                      </p>
                      <p className="font-medium text-slate-800">+1 234 567 890</p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Calendar size={20} className="text-blue-500" /> Current Itinerary
                  </h3>
                  
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                    {/* Timeline Item 1 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mx-[-6px] md:mx-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm ml-6 md:ml-0">
                        <h4 className="font-bold text-slate-800">Arrival & Hotel Check-in</h4>
                        <p className="text-sm text-slate-500 mt-1">Downtown Central Plaza Hotel</p>
                        <time className="text-xs font-semibold text-blue-600 mt-2 block">Oct 12, 10:00 AM</time>
                      </div>
                    </div>
                    
                    {/* Timeline Item 2 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group opacity-50">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-slate-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mx-[-6px] md:mx-0 px-2"/>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm ml-6 md:ml-0">
                        <h4 className="font-bold text-slate-800">Museum Tour</h4>
                        <p className="text-sm text-slate-500 mt-1">National Arts Gallery</p>
                        <time className="text-xs font-semibold text-slate-400 mt-2 block">Oct 14, 02:00 PM</time>
                      </div>
                    </div>
                  </div>

                </Card>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
