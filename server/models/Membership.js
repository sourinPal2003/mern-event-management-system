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
  try {
    const start = this.startDate ? new Date(this.startDate) : new Date();

    // Recalculate endDate when missing or when durationMonths/startDate change
    if (!this.endDate || this.isModified('durationMonths') || this.isModified('startDate')) {
      const months = Number(this.durationMonths || 0);
      const end = new Date(start);
      end.setMonth(end.getMonth() + months);
      this.endDate = end;
    }

    // Update status based on endDate
    const now = new Date();
    if (this.endDate && new Date(this.endDate) < now) {
      this.status = 'expired';
    } else {
      // don't override 'cancelled'
      if (this.status !== 'cancelled') this.status = 'active';
    }

    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('Membership', membershipSchema);
