import TouristID from '../models/TouristID.js';
import Location from '../models/Location.js';
import Alert from '../models/Alert.js';
import User from '../models/User.js';
import { generateBlockchainHash } from '../services/blockchainService.js';
import { checkGeoFence } from '../services/geofenceService.js';
import { sendEmergencySMS } from '../services/smsService.js';
import { checkSevereWeather } from '../services/weatherService.js';
import { io } from '../server.js';

// @desc    Register Digital Tourist ID (KYC)
// @route   POST /api/v1/tourist/id
// @access  Private (Tourist)
export const registerTouristID = async (req, res) => {
  const { documentType, documentNumber, fullName, nationality, personalPhone, emergencyPhone } = req.body;
  try {
    const kycData = { documentType, documentNumber, fullName, nationality, timestamp: Date.now() };
    const blockchainHash = await generateBlockchainHash(kycData); // Mocks blockchain anchoring
    
    const touristId = await TouristID.create({
      tourist: req.user._id,
      documentType,
      documentNumber,
      fullName,
      nationality,
      personalPhone,
      emergencyPhone,
      blockchainHash
    });
    
    res.status(201).json(touristId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Digital Tourist ID (KYC)
// @route   GET /api/v1/tourist/id
// @access  Private (Tourist)
export const getTouristID = async (req, res) => {
  try {
    const touristId = await TouristID.findOne({ tourist: req.user._id });
    if (!touristId) {
      return res.status(404).json({ message: 'Digital ID not found' });
    }
    res.json(touristId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Digital Tourist ID
// @route   PUT /api/v1/tourist/id
// @access  Private (Tourist)
export const updateTouristID = async (req, res) => {
  const { fullName, nationality, personalPhone, emergencyPhone } = req.body;
  try {
    const touristId = await TouristID.findOne({ tourist: req.user._id });
    if (!touristId) {
      return res.status(404).json({ message: 'Digital ID not found' });
    }
    
    if (fullName) touristId.fullName = fullName;
    if (nationality) touristId.nationality = nationality;
    if (personalPhone) touristId.personalPhone = personalPhone;
    if (emergencyPhone) touristId.emergencyPhone = emergencyPhone;
    
    await touristId.save();
    
    res.json(touristId);
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
    io.emit('location_update', { touristId: req.user._id, touristName: req.user.name, lat, lng });

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
      const touristInfo = await TouristID.findOne({ tourist: req.user._id });
      sendEmergencySMS('GeoFence Breach', alert.message, lat, lng, touristInfo?.emergencyPhone);
    }

    // 2. AI ANOMALY DETECTION (Machine Learning Service)
    const recentLocations = await Location.find({ tourist: req.user._id })
      .sort({ timestamp: -1 })
      .limit(2);
    
    if (recentLocations.length >= 2) {
      const curr = recentLocations[0];
      const prev = recentLocations[1];
      
      const timeDiffSeconds = (curr.timestamp - prev.timestamp) / 1000;
      
      // Calculate distance in meters (approximate)
      const R = 6371e3; // metres
      const φ1 = prev.coordinates.lat * Math.PI/180;
      const φ2 = curr.coordinates.lat * Math.PI/180;
      const Δφ = (curr.coordinates.lat - prev.coordinates.lat) * Math.PI/180;
      const Δλ = (curr.coordinates.lng - prev.coordinates.lng) * Math.PI/180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      const speed = timeDiffSeconds > 0 ? distance / timeDiffSeconds : 0;

      try {
        // Call FastAPI ML Service
        const mlResponse = await fetch('http://127.0.0.1:8000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latitude: lat,
            longitude: lng,
            time_diff: timeDiffSeconds,
            speed: speed
          })
        });

        if (mlResponse.ok) {
          const mlData = await mlResponse.json();
          if (mlData.anomaly) {
            const alert = await Alert.create({
              tourist: req.user._id,
              type: 'Anomaly',
              location: { lat, lng },
              message: `Abnormal movement detected by AI (Score: ${mlData.score.toFixed(2)}).`,
              anomalyScore: mlData.score
            });
            io.emit('new_alert', alert);
            const touristInfo = await TouristID.findOne({ tourist: req.user._id });
            sendEmergencySMS('AI Anomaly', alert.message, lat, lng, touristInfo?.emergencyPhone);
          }
        }
      } catch (err) {
        console.error('ML Service unreachable:', err.message);
      }
    }

    // 3. SEVERE WEATHER CHECK
    const weatherResult = await checkSevereWeather(lat, lng);
    if (weatherResult.isSevere) {
      // Check if we already sent a weather alert recently to avoid spamming
      const recentWeatherAlert = await Alert.findOne({
        tourist: req.user._id,
        type: 'Weather',
        createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Last 1 hour
      });

      if (!recentWeatherAlert) {
        const alert = await Alert.create({
          tourist: req.user._id,
          type: 'Weather',
          location: { lat, lng },
          message: weatherResult.message
        });
        io.emit('new_alert', alert);
        const touristInfo = await TouristID.findOne({ tourist: req.user._id });
        sendEmergencySMS('Weather Warning', alert.message, lat, lng, touristInfo?.emergencyPhone);
      }
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
    const touristInfo = await TouristID.findOne({ tourist: req.user._id });
    sendEmergencySMS('PANIC SOS', alert.message, lat, lng, touristInfo?.emergencyPhone);
    
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Trigger Low Battery Alert
// @route   POST /api/v1/tourist/battery-alert
// @access  Private
export const triggerBatteryAlert = async (req, res) => {
  const { lat, lng, batteryLevel } = req.body;
  try {
    const alert = await Alert.create({
      tourist: req.user._id,
      type: 'LowBattery',
      location: { lat, lng },
      message: `CRITICAL: Tourist battery critically low (${Math.round(batteryLevel * 100)}%). Sending last known location.`
    });
    
    io.emit('new_alert', alert);
    const touristInfo = await TouristID.findOne({ tourist: req.user._id });
    sendEmergencySMS('Low Battery', alert.message, lat, lng, touristInfo?.emergencyPhone);
    
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Trigger Weather Alert
// @route   POST /api/v1/tourist/weather-alert
// @access  Private
export const triggerWeatherAlert = async (req, res) => {
  const { lat, lng, severity } = req.body;
  try {
    const alert = await Alert.create({
      tourist: req.user._id,
      type: 'Weather',
      location: { lat: lat || 0, lng: lng || 0 },
      message: `SEVERE WEATHER WARNING: ${severity} weather detected in the area. Seek shelter immediately.`
    });
    
    io.emit('new_alert', alert);
    const touristInfo = await TouristID.findOne({ tourist: req.user._id });
    sendEmergencySMS('Weather Warning', alert.message, lat || 0, lng || 0, touristInfo?.emergencyPhone);
    
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

// @desc    Get historical anomaly/panic data for Heatmap
// @route   GET /api/v1/tourist/heatmap
// @access  Private
export const getHeatmapData = async (req, res) => {
  try {
    // Fetch recent alerts of type Panic, Anomaly, LowBattery to generate heatmap points
    const alerts = await Alert.find({
      type: { $in: ['Panic', 'Anomaly', 'LowBattery'] }
    }).select('location type createdAt');
    
    // Map to simple array of [lat, lng, intensity]
    const heatmapPoints = alerts.map(a => {
      // higher intensity for panic
      const intensity = a.type === 'Panic' ? 1.0 : (a.type === 'Anomaly' ? 0.6 : 0.3);
      return [a.location.lat, a.location.lng, intensity];
    });

    res.json(heatmapPoints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active tourists (within last 30 minutes)
// @route   GET /api/v1/tourist/active
// @access  Private (Police/Admin)
export const getActiveTourists = async (req, res) => {
  try {
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    const activeLocations = await Location.aggregate([
      { $match: { timestamp: { $gte: thirtyMinsAgo } } },
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$tourist", lat: { $first: "$coordinates.lat" }, lng: { $first: "$coordinates.lng" }, timestamp: { $first: "$timestamp" } } }
    ]);
    
    const touristsMap = {};
    for (const loc of activeLocations) {
      const user = await User.findById(loc._id);
      if (user) {
        touristsMap[loc._id] = { name: user.name, lat: loc.lat, lng: loc.lng, timestamp: loc.timestamp, status: 'Safe' };
      }
    }
    res.json(touristsMap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get alerts for the logged-in tourist
// @route   GET /api/v1/tourist/my-alerts
// @access  Private (Tourist)
export const getMyAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ tourist: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
