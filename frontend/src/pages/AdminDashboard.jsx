import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import AlertCard from '../components/AlertCard';
import { Users, AlertTriangle, Map, ShieldAlert, CheckCircle2 } from 'lucide-react';

const AdminDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Mock Data
  const stats = [
    { label: 'Active Tourists', value: '1,248', icon: <Users size={24} className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Active Alerts', value: '3', icon: <AlertTriangle size={24} className="text-red-500" />, bg: 'bg-red-50' },
    { label: 'Risk Zones', value: '2', icon: <Map size={24} className="text-amber-500" />, bg: 'bg-amber-50' },
    { label: 'Resolved Today', value: '45', icon: <CheckCircle2 size={24} className="text-emerald-500" />, bg: 'bg-emerald-50' }
  ];

  const tourists = [
    { id: 'TID-9482', name: 'John Doe', location: 'North District', status: 'Safe' },
    { id: 'TID-1934', name: 'Alice Smith', location: 'Downtown', status: 'Warning' },
    { id: 'TID-0092', name: 'Robert Li', location: 'East Suburbs', status: 'Danger' },
    { id: 'TID-5611', name: 'Emma Watson', location: 'West Mall', status: 'Safe' }
  ];

  const alerts = [
    { id: 1, title: 'Geofence Breach', message: 'TID-1934 crossed safe zone.', type: 'warning', time: '5m ago' },
    { id: 2, title: 'SOS Triggered', message: 'TID-0092 activated Panic button!', type: 'danger', time: '12m ago' },
    { id: 3, title: 'AI Anomaly', message: 'Unusual movement rate detected for TID-3421.', type: 'warning', time: '1h ago' },
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
              <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2">
                Download Report
              </button>
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
                
                {/* Tourists Table */}
                <Card className="flex flex-col" noPadding>
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h3 className="font-bold text-slate-800 text-lg">Active Tourists Live Feed</h3>
                    <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Filter</button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tourist ID</th>
                          <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                          <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                          <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {tourists.map((t, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-6 text-sm font-medium text-blue-600">{t.id}</td>
                            <td className="py-4 px-6 text-sm text-slate-800 font-medium">{t.name}</td>
                            <td className="py-4 px-6 text-sm text-slate-500">{t.location}</td>
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
                        ))}
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
                    {alerts.map(alert => (
                      <div key={alert.id} className={`p-4 rounded-xl border ${alert.type === 'danger' ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-800/50 border-slate-700'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`text-sm font-bold ${alert.type === 'danger' ? 'text-red-400' : 'text-amber-400'}`}>
                            {alert.title}
                          </h4>
                          <span className="text-xs text-slate-400 font-medium">{alert.time}</span>
                        </div>
                        <p className="text-sm text-slate-300 mb-4">{alert.message}</p>
                        <div className="flex gap-2">
                          <button className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-white transition-colors">Investigate</button>
                          {alert.type === 'danger' && (
                            <button className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all">Dispatch Patrol</button>
                          )}
                        </div>
                      </div>
                    ))}
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
