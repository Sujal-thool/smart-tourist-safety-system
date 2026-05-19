import express from 'express';
import { registerTouristID, getTouristID, updateTouristID, updateLocation, triggerPanic, triggerBatteryAlert, triggerWeatherAlert, getAlerts, getHeatmapData, getActiveTourists, getMyAlerts } from '../controllers/touristController.js';
import { protect, policeOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/id', protect, registerTouristID);
router.get('/id', protect, getTouristID);
router.put('/id', protect, updateTouristID);
router.post('/location', protect, updateLocation);
router.post('/panic', protect, triggerPanic);
router.post('/battery-alert', protect, triggerBatteryAlert);
router.post('/weather-alert', protect, triggerWeatherAlert);
router.get('/alerts', protect, policeOrAdmin, getAlerts);
router.get('/active', protect, policeOrAdmin, getActiveTourists);
router.get('/my-alerts', protect, getMyAlerts);

export default router;
