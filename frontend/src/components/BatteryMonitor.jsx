import React, { useEffect } from 'react';
import api from '../services/api';

const BatteryMonitor = ({ location }) => {
  useEffect(() => {
    let batteryManager = null;

    const handleBatteryChange = () => {
      if (!batteryManager) return;
      
      const level = batteryManager.level;
      const isCharging = batteryManager.charging;
      
      // If battery drops to or below 5% and not charging
      if (level <= 0.05 && !isCharging) {
        if (location) {
          api.post('/tourist/battery-alert', {
            lat: location.lat,
            lng: location.lng,
            batteryLevel: level
          }).catch(err => console.error("Battery alert failed:", err));
        }
      }
    };

    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        batteryManager = battery;
        battery.addEventListener('levelchange', handleBatteryChange);
        battery.addEventListener('chargingchange', handleBatteryChange);
        // Initial check just in case
        handleBatteryChange();
      });
    }

    return () => {
      if (batteryManager) {
        batteryManager.removeEventListener('levelchange', handleBatteryChange);
        batteryManager.removeEventListener('chargingchange', handleBatteryChange);
      }
    };
  }, [location]);

  return null; // Silent component
};

export default BatteryMonitor;
