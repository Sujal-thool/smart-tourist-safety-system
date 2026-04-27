import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ title, onMenuClick }) => {
  const { user } = useAuth();

  return (
    <div className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-10">
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

        {/* User Profile Hook */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden border border-blue-200">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name || 'Guest User'}</p>
            <p className="text-xs text-slate-500">{user?.role || 'Tourist'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
