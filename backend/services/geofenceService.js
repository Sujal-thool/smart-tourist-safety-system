// Simple Geo-Fencing calculation using Haversine formula
// Returns distance in kilometers
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; 
  return d;
};

// Assuming city center is at lat: 28.6139, lng: 77.2090 (Delhi, India)
// Safe radius: 50 km (Example)
const CITY_CENTER = { lat: 28.6139, lng: 77.2090 };
const SAFE_RADIUS_KM = 50;

export const checkGeoFence = (lat, lng) => {
  const distance = getDistanceFromLatLonInKm(CITY_CENTER.lat, CITY_CENTER.lng, lat, lng);
  if (distance > SAFE_RADIUS_KM) {
    return true; // Breach!
  }
  return false; // Safe
};
