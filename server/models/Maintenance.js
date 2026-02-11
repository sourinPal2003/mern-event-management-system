import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({

  type: {
    type: String,
    enum: ['maintenance', 'membership_duration'],
    default: 'maintenance'
  },

  title: {
    type: String,
    required: function() {
      return this.type === 'maintenance';
    }
  },
  description: {
    type: String,
    required: function() {
      return this.type === 'maintenance';
    }
  },
  category: {
    type: String,
    enum: ['facility', 'equipment', 'cleaning', 'repairs', 'other'],
    required: function() {
      return this.type === 'maintenance';
    }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTo: {
    type: String,
    default: null
  },
  cost: {
    type: Number,
    default: 0
  },
  scheduledDate: {
    type: Date,
    required: function() {
      return this.type === 'maintenance';
    }
  },
  completionDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  },

  durationMonths: {
    type: Number,
    required: function() {
      return this.type === 'membership_duration';
    },
    sparse: true
  },
  price: {
    type: Number,
    required: function() {
      return this.type === 'membership_duration';
    }
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

maintenanceSchema.index(
  { type: 1, durationMonths: 1 },
  { 
    unique: true,
    partialFilterExpression: { type: 'membership_duration' }
  }
);

export default mongoose.model('Maintenance', maintenanceSchema);
