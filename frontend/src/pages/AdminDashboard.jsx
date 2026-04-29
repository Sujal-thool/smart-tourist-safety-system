import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import MapView from '../components/MapView';
import { Users, AlertTriangle, Map, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import api from '../services/api';

const socket = io('http://localhost:5000');

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const [alerts, setAlerts] = useState([]);
  const [tourists, setTourists] = useState({});

  useEffect(() => {
    // Fetch initial alerts
    const fetchAlerts = async () => {
      try {
        const res = await api.get('/tourist/alerts');
        setAlerts(res.data);
      } catch (err) {
        console.error('Failed to fetch alerts', err);
      }
    };
    fetchAlerts();

    if (user?._id) {
      socket.emit('join', { role: 'Police', userId: user._id });
    }

    socket.on('location_update', (data) => {
      setTourists(prev => ({
        ...prev,
        [data.touristId]: { lat: data.lat, lng: data.lng, timestamp: Date.now(), status: 'Safe' }
      }));
    });

    socket.on('new_alert', (alert) => {
      setAlerts(prev => [alert, ...prev]);
      if (alert.tourist && alert.tourist._id) {
        setTourists(prev => ({
          ...prev,
          [alert.tourist._id]: { 
            ...prev[alert.tourist._id], 
            status: alert.type === 'Panic' ? 'Danger' : 'Warning' 
          }
        }));
      }
    });

    return () => {
      socket.off('location_update');
      socket.off('new_alert');
    };
  }, [user]);

  // Derived stats
  const stats = [
    { label: 'Active Tourists', value: Object.keys(tourists).length, icon: <Users size={24} className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Active Alerts', value: alerts.length, icon: <AlertTriangle size={24} className="text-red-500" />, bg: 'bg-red-50' },
    { label: 'Risk Zones', value: '1', icon: <Map size={24} className="text-amber-500" />, bg: 'bg-amber-50' },
    { label: 'Resolved Today', value: '12', icon: <CheckCircle2 size={24} className="text-emerald-500" />, bg: 'bg-emerald-50' }
  ];

  // Map markers
  const mapMarkers = [
    ...Object.entries(tourists).map(([id, t]) => ({
      lat: t.lat,
      lng: t.lng,
      type: t.status === 'Danger' ? 'alert' : 'user',
      popupText: `Tourist ID: ${id.substring(0,6)}... (${t.status})`
    })),
    ...alerts.map(a => ({
      lat: a.location?.lat || 0,
      lng: a.location?.lng || 0,
      type: 'alert',
      popupText: `ALERT: ${a.type}`
    })).filter(m => m.lat !== 0)
  ];

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
        <Sidebar role="Police" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <Navbar title="Police Admin Console" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">System Overview</h2>
                <p className="text-slate-500">Real-time monitoring and incident response.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={async () => {
                    try {
                      await api.post('/tourist/weather-alert', { lat: 28.6139, lng: 77.2090, severity: 'Extreme Heat' });
                      alert('Weather alert broadcasted successfully!');
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  Broadcast Weather
                </button>
                <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2">
                  Download Report
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, i) => (
                <Card key={i} className="flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <h4 className="text-3xl font-bold text-slate-800">{stat.value}</h4>
                    <p className="text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              
              {/* Left Column (Table & Map) */}
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                
                {/* Map View Area */}
                <Card className="h-[400px] flex flex-col relative w-full z-0" noPadding>
                   <MapView location={{lat: 0, lng: 0}} markers={mapMarkers} geofenceCenter={{lat: 28.6139, lng: 77.2090}} showHeatmap={true} />
                </Card>

                {/* Tourists Table */}
                <Card className="flex flex-col" noPadding>
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h3 className="font-bold text-slate-800 text-lg">Active Tourists Live Feed</h3>
                    <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Filter</button>
                  </div>
                  
                  <div className="overflow-x-auto max-h-[300px]">
                    <table className="w-full text-left border-collapse relative">
                      <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
                        <tr className="border-b border-slate-100">
                          <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tourist ID</th>
                          <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                          <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {Object.keys(tourists).length === 0 ? (
                           <tr><td colSpan="4" className="text-center py-4 text-sm text-slate-500">No active tourists detected</td></tr>
                        ) : (
                          Object.entries(tourists).map(([id, t], idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="py-4 px-6 text-sm font-medium text-blue-600">{id.substring(0,8)}</td>
                              <td className="py-4 px-6 text-sm text-slate-500">{t.lat.toFixed(4)}, {t.lng.toFixed(4)}</td>
                              <td className="py-4 px-6">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                  ${t.status === 'Safe' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                    t.status === 'Warning' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                    'bg-red-50 text-red-700 border-red-200'
                                  }`}>
                                  {t.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button className="text-slate-400 hover:text-blue-600 text-sm font-medium">View</button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>

              </div>

              {/* Right Column (Alerts Panel) */}
              <div className="space-y-6 md:space-y-8">
                <Card className="h-[600px] flex flex-col bg-slate-900 border-slate-800 shadow-xl" noPadding>
                  <div className="p-6 border-b border-slate-800/50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <ShieldAlert className="text-red-500" size={24} /> Incident Feed
                    </h3>
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {alerts.length === 0 ? (
                      <p className="text-slate-400 text-center mt-10 text-sm">No active alerts.</p>
                    ) : (
                      alerts.map(alert => {
                        const isDanger = alert.type === 'Panic' || alert.type === 'Anomaly';
                        return (
                          <div key={alert._id} className={`p-4 rounded-xl border ${isDanger ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-800/50 border-slate-700'}`}>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className={`text-sm font-bold ${isDanger ? 'text-red-400' : 'text-amber-400'}`}>
                                {alert.type}
                              </h4>
                              <span className="text-xs text-slate-400 font-medium">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-sm text-slate-300 mb-4">{alert.message}</p>
                            <div className="flex gap-2">
                              <button className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-white transition-colors">Investigate</button>
                              {isDanger && (
                                <button className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all">Dispatch Patrol</button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
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

export default AdminDashboard;
