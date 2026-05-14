import React from 'react';
import Card from './Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, PieChart as PieChartIcon } from 'lucide-react';

const alertData = [
  { name: '08:00', alerts: 2 },
  { name: '10:00', alerts: 5 },
  { name: '12:00', alerts: 3 },
  { name: '14:00', alerts: 8 },
  { name: '16:00', alerts: 1 },
  { name: '18:00', alerts: 4 },
];

const incidentData = [
  { name: 'SOS', value: 4, color: '#ef4444' }, // Red
  { name: 'AI Anomaly', value: 6, color: '#f59e0b' }, // Amber
  { name: 'Geofence', value: 2, color: '#3b82f6' }, // Blue
  { name: 'Low Battery', value: 8, color: '#10b981' }, // Emerald
];

const AnalyticsPanel = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Alert Frequency Chart */}
      <Card className="flex flex-col h-full w-full">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity size={20} className="text-blue-500" /> Alert Frequency
          </h3>
          <p className="text-sm text-slate-500">Alerts triggered over time (Today)</p>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={alertData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <RechartsTooltip contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Line type="monotone" dataKey="alerts" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Incident Statistics Chart */}
      <Card className="flex flex-col h-full w-full">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <PieChartIcon size={20} className="text-indigo-500" /> Incident Statistics
          </h3>
          <p className="text-sm text-slate-500">Breakdown of alert types</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="h-[200px] w-full flex">
             <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie
                    data={incidentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {incidentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
             </ResponsiveContainer>
             <div className="w-[50%] flex flex-col justify-center gap-3 pl-4">
                {incidentData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="font-medium text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-800">{item.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPanel;
