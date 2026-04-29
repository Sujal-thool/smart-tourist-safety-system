import express from 'express';
import { registerTouristID, updateLocation, triggerPanic, triggerBatteryAlert, triggerWeatherAlert, getAlerts, getHeatmapData } from '../controllers/touristController.js';
import { protect, policeOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/id', protect, registerTouristID);
router.post('/location', protect, updateLocation);
router.post('/panic', protect, triggerPanic);
router.post('/battery-alert', protect, triggerBatteryAlert);
router.post('/weather-alert', protect, triggerWeatherAlert);
router.get('/alerts', protect, policeOrAdmin, getAlerts);
router.get('/heatmap', protect, getHeatmapData);

export default router;
