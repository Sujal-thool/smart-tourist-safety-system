import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ title, onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-20 bg-white/70 backdrop-blur-xl border-b border-white/40 flex items-center justify-between px-6 sticky top-0 z-10 shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={24} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 pl-6 border-l border-slate-200 hover:opacity-80 transition-opacity focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden border border-blue-200">
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
