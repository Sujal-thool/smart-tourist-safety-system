import mongoose from 'mongoose';

const touristIdSchema = new mongoose.Schema({
  tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  documentType: { type: String, enum: ['Aadhaar', 'Passport'], required: true },
  documentNumber: { type: String, required: true },
  fullName: { type: String, required: true },
  nationality: { type: String, required: true },
  blockchainHash: { type: String, required: true } // Mock digital ID hash
}, { timestamps: true });

const TouristID = mongoose.model('TouristID', touristIdSchema);
export default TouristID;
