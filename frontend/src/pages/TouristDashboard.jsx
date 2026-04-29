import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import SafetyScore from '../components/SafetyScore';
import PanicButton from '../components/PanicButton';
import AlertCard from '../components/AlertCard';
import MapView from '../components/MapView';
import BatteryMonitor from '../components/BatteryMonitor';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, MapPin, Activity } from 'lucide-react';
import io from 'socket.io-client';
import api from '../services/api';

const socket = io('http://localhost:5000');

const TouristDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [safeRouteEnd, setSafeRouteEnd] = useState(null);

  useEffect(() => {
    // Join socket room
    if (user?._id) {
      socket.emit('join', { role: 'Tourist', userId: user._id });
    }

    // Listen for alerts
    socket.on('new_alert', (alert) => {
      if (alert.tourist === user?._id || alert.tourist?._id === user?._id) {
        setRecentAlerts(prev => [
          {
            id: alert._id,
            title: alert.type === 'Anomaly' ? 'AI Alert' : alert.type,
            message: alert.message,
            type: alert.type === 'Safe' ? 'safe' : (alert.type === 'Weather' ? 'info' : (alert.type === 'Panic' ? 'danger' : 'warning')),
            time: 'Just now'
          },
          ...prev
        ]);
      }
    });

    // Track geolocation
    let watchId;
    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          // Send to backend
          try {
            await api.post('/tourist/location', { lat: latitude, lng: longitude });
          } catch (error) {
            console.error('Error updating location:', error);
          }
        },
        (error) => console.error('Geolocation error:', error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }

    return () => {
      socket.off('new_alert');
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [user]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-800/20 backdrop-blur-sm z-20 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar role="Tourist" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        <Navbar title="Dashboard" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            
            {/* Welcome Banner */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                Hello, {user?.name || 'Traveler'}! 👋
              </h2>
              <p className="text-slate-500 mt-1">Here is your safety overview for today.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              
              {/* Left Column (Main Info & Map) */}
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                
                {/* Top Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="flex items-center justify-center sm:justify-start gap-6">
                    <SafetyScore score={92} />
                  </Card>
                  
                  <Card className="flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-slate-500 font-medium mb-2">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <MapPin size={20} className="text-blue-500" />
                      </div>
                      Current Zone
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Downtown Safe District</h3>
                    <p className="text-sm text-emerald-600 font-semibold mt-2 flex items-center gap-1.5 bg-emerald-50 w-max px-3 py-1 rounded-full">
                      <ShieldCheck size={16} /> Monitored by security
                    </p>
                  </Card>
                </div>

                {/* Map Section */}
                <Card noPadding className="h-[400px] flex flex-col relative w-full">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white absolute top-0 left-0 w-full z-10 shadow-sm">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <div className="p-1.5 bg-blue-50 rounded-md">
                        <Activity size={18} className="text-blue-600" /> 
                      </div>
                      Live Location Tracking
                    </h3>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          if (safeRouteEnd) {
                            setSafeRouteEnd(null);
                          } else if (location && location.lat !== 0) {
                            // Dynamically set hotel to be ~500m away from current location
                            setSafeRouteEnd({ 
                              lat: location.lat + 0.005, 
                              lng: location.lng + 0.005 
                            });
                          } else {
                            alert("Waiting for GPS location...");
                          }
                        }}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${safeRouteEnd ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                      >
                        {safeRouteEnd ? 'Cancel Route' : 'Route to Hotel'}
                      </button>
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 w-full h-full pt-[60px] z-0">
                    <MapView location={location} safeRouteEnd={safeRouteEnd} />
                  </div>
                </Card>

              </div>

              {/* Right Column (Actions & Alerts) */}
              <div className="space-y-6 md:space-y-8">
                
                {/* Panic Button Area */}
                <div>
                  <PanicButton location={location} />
                </div>

                {/* Recent Alerts Feed */}
                <Card className="h-[400px] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      Recent Alerts
                    </h3>
                    <button className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded-lg">
                      View all
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    {recentAlerts.length > 0 ? (
                      recentAlerts.map(alert => (
                        <AlertCard 
                          key={alert.id}
                          title={alert.title}
                          message={alert.message}
                          type={alert.type}
                          time={alert.time}
                        />
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                        <div className="p-4 bg-slate-50 rounded-full">
                          <ShieldCheck size={40} className="text-slate-300" />
                        </div>
                        <p className="font-medium text-sm">All clear! No alerts.</p>
                      </div>
                    )}
                  </div>
                </Card>

              </div>
            </div>
          </div>
        </main>
      </div>
      <BatteryMonitor location={location} />
    </div>
  );
};

export default TouristDashboard;
