import React, { useState, useEffect } from 'react';
import Card from './Card';
import { CloudSun, Wind, Thermometer, AlertTriangle, Droplets } from 'lucide-react';

const WeatherWidget = ({ location }) => {
  // Simulate fetching weather data
  const [weather, setWeather] = useState({
    temp: 34,
    condition: 'Partly Cloudy',
    aqi: 145,
    humidity: 60,
    uvIndex: 8
  });

  useEffect(() => {
    // In a real app, fetch from openweathermap or weatherapi based on location.lat and location.lng
    if (location && location.lat !== 0) {
      // simulate network request
      const timer = setTimeout(() => {
        setWeather({
          temp: 36,
          condition: 'Sunny & Hot',
          aqi: 180, // Poor
          humidity: 45,
          uvIndex: 9 // Very High
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  // Determine severity and colors
  const isAqiPoor = weather.aqi > 150;
  const isTempHigh = weather.temp > 35;
  
  return (
    <Card className="flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <CloudSun size={120} />
      </div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <CloudSun className="text-blue-500" size={24} />
          Local Environment
        </h3>
        <span className="text-xs font-semibold px-2.5 py-1 bg-white rounded-full shadow-sm text-slate-600 border border-slate-100">
          Live Advisory
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
        {/* Temperature */}
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-100/60 shadow-sm flex flex-col justify-center hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <Thermometer size={16} /> <span className="text-xs font-semibold uppercase tracking-wider">Temp</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-800">{weather.temp}°</span>
            <span className="text-sm font-medium text-slate-500">C</span>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">{weather.condition}</p>
        </div>

        {/* AQI */}
        <div className={`backdrop-blur-sm p-4 rounded-xl border shadow-sm flex flex-col justify-center hover:-translate-y-1 transition-transform ${isAqiPoor ? 'bg-orange-50/80 border-orange-200' : 'bg-white/80 border-slate-100/60'}`}>
          <div className={`flex items-center gap-1.5 mb-1 ${isAqiPoor ? 'text-orange-600' : 'text-slate-500'}`}>
            <Wind size={16} /> <span className="text-xs font-semibold uppercase tracking-wider">AQI</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-bold ${isAqiPoor ? 'text-orange-700' : 'text-slate-800'}`}>{weather.aqi}</span>
          </div>
          <p className={`text-xs font-medium mt-1 ${isAqiPoor ? 'text-orange-600' : 'text-slate-500'}`}>
            {isAqiPoor ? 'Poor Quality' : 'Moderate'}
          </p>
        </div>

        {/* UV Index */}
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-100/60 shadow-sm flex flex-col justify-center hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <CloudSun size={16} /> <span className="text-xs font-semibold uppercase tracking-wider">UV Index</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-800">{weather.uvIndex}</span>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">Very High</p>
        </div>

        {/* Humidity */}
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-100/60 shadow-sm flex flex-col justify-center hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <Droplets size={16} /> <span className="text-xs font-semibold uppercase tracking-wider">Humidity</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-800">{weather.humidity}</span>
            <span className="text-sm font-medium text-slate-500">%</span>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">Normal</p>
        </div>
      </div>

      {/* Advisory Banner */}
      {(isAqiPoor || isTempHigh) && (
        <div className="mt-4 bg-orange-100/50 border border-orange-200/60 rounded-xl p-3 flex items-start gap-3 relative z-10">
          <div className="p-1.5 bg-orange-500 rounded-lg shrink-0 mt-0.5">
            <AlertTriangle size={18} className="text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-orange-900">Safety Advisory</h4>
            <p className="text-xs text-orange-800 mt-0.5 leading-relaxed font-medium">
              {isTempHigh && "Extreme heat detected. Stay hydrated and avoid direct sunlight. "}
              {isAqiPoor && "Air quality is poor. Sensitive groups should wear masks outdoors."}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default WeatherWidget;
