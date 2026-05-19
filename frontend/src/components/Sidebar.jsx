import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, Bell, Shield, MapPin } from 'lucide-react';

const Sidebar = ({ role }) => {
  const touristLinks = [
    { name: 'Dashboard', path: '/tourist/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Profile & ID', path: '/profile', icon: <User size={20} /> },
    { name: 'Explore Places', path: '/tourist/places', icon: <MapPin size={20} /> }
  ];

  const adminLinks = [
    { name: 'Police Dashboard', path: '/police/dashboard', icon: <Shield size={20} /> },
    { name: 'Active Alerts', path: '/police/alerts', icon: <Bell size={20} /> }
  ];

  const links = role === 'Police' || role === 'Admin' ? adminLinks : touristLinks;

  return (
    <div className="w-64 h-full glassmorphism flex flex-col border-r-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-20">
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-8 border-b border-slate-100/50">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <Shield className="fill-indigo-600 text-white" size={28} />
          <span className="gradient-text">SafeTrax</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-8 px-4 flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white premium-shadow translate-x-1' 
                  : 'text-slate-500 hover:bg-indigo-50/50 hover:text-indigo-600 hover:translate-x-1'
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </div>

    </div>
  );
};

export default Sidebar;
