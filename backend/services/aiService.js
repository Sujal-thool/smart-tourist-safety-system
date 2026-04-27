/**
 * Simulates Anomaly Detection for Tourists.
 * In a real scenario, this would use an ML model (e.g., Python service integration)
 * Here we check for:
 * 1. Sudden large jumps (simulate by checking speed if we had last location)
 * 2. This function takes an array of recent location points
 */
export const detectAnomaly = (recentLocations) => {
  if (!recentLocations || recentLocations.length < 2) return false;
  
  // Rule: Sudden Deviation Check 
  // If the tourist moved more than 1 degree of lat/lng in a very short time
  const latest = recentLocations[0];
  const previous = recentLocations[1];
  
  const latDiff = Math.abs(latest.coordinates.lat - previous.coordinates.lat);
  const lngDiff = Math.abs(latest.coordinates.lng - previous.coordinates.lng);
  
  if (latDiff > 0.05 || lngDiff > 0.05) {
    return { anomalous: true, reason: 'Sudden high-speed deviation detected' };
  }
  
  // Further stationary AI checks could go here.
  return { anomalous: false };
};
