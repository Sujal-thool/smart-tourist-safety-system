import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  timestamp: { type: Date, default: Date.now }
});

// Index for geo-queries if needed
const Location = mongoose.model('Location', locationSchema);
export default Location;
