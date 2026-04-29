import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Panic', 'GeoFenceBreach', 'Anomaly', 'LowBattery', 'Weather'], required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String },
  anomalyScore: { type: Number }
}, { timestamps: true });

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
