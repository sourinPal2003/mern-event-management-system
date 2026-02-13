import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  durationMonths: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure unique duration value
maintenanceSchema.index({ durationMonths: 1 }, { unique: true });

export default mongoose.model('Maintenance', maintenanceSchema);
