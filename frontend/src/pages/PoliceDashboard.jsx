import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { ShieldAlert, Bell, LogOut, Navigation } from 'lucide-react';

const socket = io('http://localhost:5000');
const CITY_CENTER = { lat: 28.6139, lng: 77.2090 };
const SAFE_RADIUS_METERS = 50000; // 50km

const PoliceDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [tourists, setTourists] = useState({}); // { touristId: { lat, lng } }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !userData || (userData.role !== 'Police' && userData.role !== 'Admin')) {
      navigate('/login');
      return;
    }
    setUser(userData);
    
    // Fetch initial alerts
    axios.get('http://localhost:5000/api/v1/tourist/alerts', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setAlerts(res.data)).catch(console.error);

    // Socket listeners
    socket.emit('join', { role: 'Police', userId: userData._id });

    socket.on('location_update', (data) => {
      setTourists(prev => ({
        ...prev,
        [data.touristId]: { lat: data.lat, lng: data.lng, timestamp: Date.now() }
      }));
    });

    socket.on('new_alert', (alert) => {
      setAlerts(prev => [alert, ...prev]);
    });

    return () => {
      socket.off('location_update');
      socket.off('new_alert');
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) return <p className="p-8 text-center text-gray-500">Loading Dashboard...</p>;

  return (
    <div className="min-h-screen flex flex-col h-screen bg-gray-50 overflow-hidden text-gray-800">
      {/* HEADER */}
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center shadow-lg z-10">
        <div className="flex items-center space-x-3">
          <ShieldAlert size={32} className="text-yellow-400" />
          <h1 className="text-2xl font-bold tracking-wide">Police Command Center</h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{user.name}</span>
            <span className="bg-yellow-400 text-blue-900 px-2 py-0.5 rounded text-sm font-bold">Officer</span>
          </div>
          <button onClick={handleLogout} className="text-blue-200 hover:text-white transition flex items-center">
            <LogOut size={20} className="mr-1" /> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR: Alerts List */}
        <div className="w-1/3 max-w-sm bg-white border-r shadow-xl flex flex-col z-10">
          <div className="p-4 bg-red-50 border-b border-red-100 flex items-center text-red-700 font-bold">
            <Bell className="mr-2 animate-pulse" /> Live Emergency Alerts
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {alerts.length === 0 ? (
              <p className="text-center text-gray-400 italic mt-10">No active alerts.</p>
            ) : (
              alerts.map(alert => (
                <div key={alert._id} className="p-4 rounded-lg bg-red-50 border-l-4 border-red-500 shadow-sm transition hover:shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-red-700 text-sm uppercase tracking-wide flex items-center">
                      <AlertOctagon size={16} className="mr-1" /> {alert.type}
                    </span>
                    <span className="text-xs text-gray-500">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-gray-800 font-medium mb-1">{alert.message}</p>
                  {alert.tourist?.name && <p className="text-sm text-gray-600">Tourist: <span className="font-semibold">{alert.tourist.name}</span></p>}
                  <div className="mt-3 pt-3 border-t border-red-200/50 text-xs text-gray-500 flex justify-between">
                    <div>
                      Lat: {alert.location.lat.toFixed(4)}<br/>
                      Lng: {alert.location.lng.toFixed(4)}
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-bold shadow">
                      Dispatch
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MAP VIEW */}
        <div className="flex-1 relative">
          <MapContainer center={[CITY_CENTER.lat, CITY_CENTER.lng]} zoom={11} className="w-full h-full">
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {/* Safe Zone Geofence Visualization */}
            <Circle 
              center={[CITY_CENTER.lat, CITY_CENTER.lng]} 
              radius={SAFE_RADIUS_METERS} 
              pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.05, weight: 1 }}
            />
            
            {/* Live Tourist Markers */}
            {Object.keys(tourists).map(id => (
              <Marker key={id} position={[tourists[id].lat, tourists[id].lng]}>
                <Popup>
                  <div className="font-medium text-gray-800">
                    <p className="font-bold border-b pb-1 mb-1 flex items-center">
                      <Navigation size={14} className="mr-1 text-blue-600" /> Live Target
                    </p>
                    <p className="text-xs text-gray-600">ID: {id.substring(0,8)}...</p>
                    <p className="text-xs text-gray-600">Updated: {new Date(tourists[id].timestamp).toLocaleTimeString()}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Alert Markers (Red) */}
            {alerts.map(alert => (
              <Circle 
                key={`alert-${alert._id}`}
                center={[alert.location.lat, alert.location.lng]} 
                radius={200}
                pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.5, weight: 2 }}
              >
                <Popup>EMERGENCY: {alert.type}</Popup>
              </Circle>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;
