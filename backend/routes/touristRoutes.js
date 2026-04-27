import express from 'express';
import { registerTouristID, updateLocation, triggerPanic, getAlerts } from '../controllers/touristController.js';
import { protect, policeOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/id', protect, registerTouristID);
router.post('/location', protect, updateLocation);
router.post('/panic', protect, triggerPanic);
router.get('/alerts', protect, policeOrAdmin, getAlerts);

export default router;
