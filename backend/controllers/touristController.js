import TouristID from '../models/TouristID.js';
import Location from '../models/Location.js';
import Alert from '../models/Alert.js';
import { generateBlockchainHash } from '../services/blockchainService.js';
import { checkGeoFence } from '../services/geofenceService.js';
import { detectAnomaly } from '../services/aiService.js';
import { io } from '../server.js';

// @desc    Register Digital Tourist ID (KYC)
// @route   POST /api/v1/tourist/id
// @access  Private (Tourist)
export const registerTouristID = async (req, res) => {
  const { documentType, documentNumber, fullName, nationality } = req.body;
  try {
    const kycData = { documentType, documentNumber, fullName, nationality, timestamp: Date.now() };
    const blockchainHash = generateBlockchainHash(kycData); // Mocks blockchain anchoring
    
    const touristId = await TouristID.create({
      tourist: req.user._id,
      documentType,
      documentNumber,
      fullName,
      nationality,
      blockchainHash
    });
    
    res.status(201).json(touristId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Location (GPS Tracking)
// @route   POST /api/v1/tourist/location
// @access  Private
export const updateLocation = async (req, res) => {
  const { lat, lng } = req.body;
  try {
    const location = await Location.create({
      tourist: req.user._id,
      coordinates: { lat, lng }
    });
    
    // Broadcast location to police dashboard instantly via WebSocket
    io.emit('location_update', { touristId: req.user._id, lat, lng });

    // 1. GEO-FENCING CHECK
    const isBreached = checkGeoFence(lat, lng);
    if (isBreached) {
      const alert = await Alert.create({
        tourist: req.user._id,
        type: 'GeoFenceBreach',
        location: { lat, lng },
        message: 'Tourist breached the 50km safe zone radius.'
      });
      io.emit('new_alert', alert); // Notify police
    }

    // 2. AI ANOMALY DETECTION (Mock)
    // Fetch last 5 locations for this tourist
    const recentLocations = await Location.find({ tourist: req.user._id })
      .sort({ timestamp: -1 })
      .limit(5);
    
    const anomaly = detectAnomaly(recentLocations);
    if (anomaly.anomalous) {
      const alert = await Alert.create({
        tourist: req.user._id,
        type: 'Anomaly',
        location: { lat, lng },
        message: anomaly.reason
      });
      io.emit('new_alert', alert);
    }

    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Trigger Panic Button
// @route   POST /api/v1/tourist/panic
// @access  Private
export const triggerPanic = async (req, res) => {
  const { lat, lng } = req.body;
  try {
    const alert = await Alert.create({
      tourist: req.user._id,
      type: 'Panic',
      location: { lat, lng },
      message: 'EMERGENCY: Panic button triggered by tourist!'
    });
    
    // Instantly notify everyone on the WebSocket (Police/Admin)
    io.emit('new_alert', alert);
    
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active alerts (For Police Dashboard)
// @route   GET /api/v1/tourist/alerts
// @access  Private (Police/Admin)
export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ status: 'Pending' })
      .populate('tourist', 'name email')
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
