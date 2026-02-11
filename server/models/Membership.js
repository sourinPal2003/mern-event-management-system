import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema({
  membershipNumber: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true,
    default: '6 months'
  },
  durationMonths: {
    type: Number,
    required: true,
    default: 6
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
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

// Middleware to calculate endDate before saving
membershipSchema.pre('validate', function(next) {
  if (!this.endDate || this.isModified('duration') || this.isModified('startDate')) {
    const start = new Date(this.startDate);
    const end = new Date(start);
    
    if (this.duration === '6 months') {
      end.setMonth(end.getMonth() + 6);
    } else if (this.duration === '1 year') {
      end.setFullYear(end.getFullYear() + 1);
    } else if (this.duration === '2 years') {
      end.setFullYear(end.getFullYear() + 2);
    }
    
    this.endDate = end;
  }
  next();
});

export default mongoose.model('Membership', membershipSchema);
