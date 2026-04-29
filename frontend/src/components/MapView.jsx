import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const SAFE_RADIUS_METERS = 50000; // 50km

// Helper component to center map when location changes
const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat !== 0 && lng !== 0) {
      map.setView([lat, lng], 13);
    }
  }, [lat, lng, map]);
  return null;
};

import 'leaflet.heat';
import 'leaflet-routing-machine';
import api from '../services/api';

const HeatmapLayer = () => {
  const map = useMap();
  useEffect(() => {
    let heatLayer;
    api.get('/tourist/heatmap').then(res => {
      const data = res.data; // [[lat, lng, intensity], ...]
      if (data && data.length > 0) {
        heatLayer = L.heatLayer(data, { radius: 35, blur: 25, maxZoom: 17 }).addTo(map);
      }
    }).catch(err => console.error("Heatmap fetch error:", err));
    
    return () => {
      if (heatLayer) map.removeLayer(heatLayer);
    };
  }, [map]);
  return null;
};

const RoutingLayer = ({ start, end }) => {
  const map = useMap();
  useEffect(() => {
    if (!start || !end || start.lat === 0) return;
    
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: false,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: '#3b82f6', opacity: 0.8, weight: 6 }]
      },
      createMarker: () => null // Don't create default routing markers
    }).addTo(map);

    // Hide the default routing instruction box
    const container = routingControl.getContainer();
    if (container) {
      container.style.display = 'none';
    }

    return () => {
      if (routingControl) map.removeControl(routingControl);
    };
  }, [map, start, end]);
  return null;
};

const MapView = ({ location, markers = [], geofenceCenter = null, showHeatmap = false, safeRouteEnd = null }) => {
  const defaultCenter = location?.lat !== 0 ? [location.lat, location.lng] : [28.6139, 77.2090]; // Default to a city center

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden z-0">
      <MapContainer center={defaultCenter} zoom={13} className="w-full h-full">
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* Heatmap Layer */}
        {showHeatmap && <HeatmapLayer />}

        {/* Routing Layer */}
        {safeRouteEnd && <RoutingLayer start={location} end={safeRouteEnd} />}

        {location && location.lat !== 0 && (
          <>
            <RecenterAutomatically lat={location.lat} lng={location.lng} />
            <Marker position={[location.lat, location.lng]}>
              <Popup>You are here</Popup>
            </Marker>
          </>
        )}

        {/* Other markers (e.g., active tourists or alerts) */}
        {markers.map((marker, idx) => (
          marker.type === 'alert' ? (
            <Circle 
              key={`alert-${idx}`}
              center={[marker.lat, marker.lng]} 
              radius={200}
              pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.5, weight: 2 }}
            >
              <Popup>{marker.popupText}</Popup>
            </Circle>
          ) : (
            <Marker key={`marker-${idx}`} position={[marker.lat, marker.lng]}>
              <Popup>{marker.popupText}</Popup>
            </Marker>
          )
        ))}

        {/* Geofence Zone */}
        {geofenceCenter && (
          <Circle 
            center={[geofenceCenter.lat, geofenceCenter.lng]} 
            radius={SAFE_RADIUS_METERS} 
            pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.05, weight: 1 }}
          />
        )}
      </MapContainer>
      
      <div className="absolute bottom-4 left-4 z-[400] flex flex-col gap-2">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md text-xs font-medium text-slate-600">
          Live Tracking Active
        </div>
        {showHeatmap && (
          <div className="bg-red-500/90 text-white backdrop-blur-sm px-4 py-2 rounded-xl shadow-md text-xs font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Danger Heatmap Overlay
          </div>
        )}
        {safeRouteEnd && (
          <div className="bg-blue-500/90 text-white backdrop-blur-sm px-4 py-2 rounded-xl shadow-md text-xs font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Routing to Registered Hotel
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
