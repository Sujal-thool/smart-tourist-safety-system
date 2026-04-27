import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Bell, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ role }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const touristLinks = [
    { name: 'Dashboard', path: '/tourist/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Profile & ID', path: '/profile', icon: <User size={20} /> }
  ];

  const adminLinks = [
    { name: 'Police Dashboard', path: '/police/dashboard', icon: <Shield size={20} /> },
    { name: 'Active Alerts', path: '/police/alerts', icon: <Bell size={20} /> }
  ];

  const links = role === 'Police' || role === 'Admin' ? adminLinks : touristLinks;

  return (
    <div className="w-64 h-full bg-white flex flex-col border-r border-slate-100 shadow-sm">
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-8 border-b border-slate-50">
        <div className="flex items-center gap-3 text-blue-600 font-bold text-xl tracking-tight">
          <Shield className="fill-blue-600 text-white" size={28} />
          SafeTrax
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-8 px-4 flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-50">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-500 hover:bg-red-50 hover:text-red-500 w-full transition-all duration-200"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
