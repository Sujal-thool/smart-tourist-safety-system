import React, { useState, useEffect } from 'react';
import { Menu, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Navbar = ({ title, onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        if (!user) return;
        const endpoint = user.role === 'Admin' || user.role === 'Police' ? '/tourist/alerts' : '/tourist/my-alerts';
        const res = await api.get(endpoint);
        setAlerts(res.data.slice(0, 4)); // Only show top 4 in navbar
      } catch (err) {
        console.error('Failed to fetch navbar alerts', err);
      }
    };
    fetchAlerts();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-20 glassmorphism flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold gradient-text">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsDropdownOpen(false); }}
            className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Bell size={24} />
            {alerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-800 text-sm">Notifications</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">{alerts.length} New</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {alerts.length > 0 ? (
                  alerts.map(a => (
                    <div key={a._id} className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{a.type} Alert</span>
                        <span className="text-[10px] font-semibold text-slate-400">{new Date(a.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{a.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center flex flex-col items-center gap-2">
                    <div className="p-3 bg-slate-50 rounded-full text-slate-300">
                      <Bell size={24} />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">You're all caught up!</p>
                  </div>
                )}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-center">
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">View All Activity</button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setIsDropdownOpen(!isDropdownOpen); setIsNotifOpen(false); }}
            className="flex items-center gap-3 pl-6 border-l border-slate-200 hover:opacity-80 transition-opacity focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-50 flex items-center justify-center text-indigo-600 font-bold overflow-hidden border border-indigo-200 shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:flex sm:items-center sm:gap-2 text-left">
              <div>
                <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-slate-500">{user?.role || 'Tourist'}</p>
              </div>
              <ChevronDown size={16} className="text-slate-400 ml-1" />
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                <span className="font-medium text-sm">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
