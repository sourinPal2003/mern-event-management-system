import express from 'express';
import Maintenance from '../models/Maintenance.js';
import { isAdmin, isAuthenticated } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// ===== MEMBERSHIP DURATION ENDPOINTS =====

// Get all membership durations
router.get('/durations', isAuthenticated, async (req, res) => {
  try {
    const durations = await Maintenance.find().sort({ durationMonths: 1 });
    res.json(durations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create membership duration (admin only)
router.post('/durations', isAdmin, async (req, res) => {
  try {
    const { durationMonths, price } = req.body;

    if (!durationMonths || price === undefined) {
      return res.status(400).json({ message: 'Duration (in months) and price are required' });
    }

    if (durationMonths <= 0) {
      return res.status(400).json({ message: 'Duration must be greater than 0' });
    }

    if (price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    const existing = await Maintenance.findOne({ durationMonths });
    if (existing) return res.status(409).json({ message: 'This duration already exists' });

    const newDuration = new Maintenance({ durationMonths, price });
    await newDuration.save();

    res.status(201).json({ message: 'Membership duration created successfully', duration: newDuration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update membership duration (admin only)
router.put('/durations/:id', isAdmin, async (req, res) => {
  try {
    const { durationMonths, price } = req.body;

    let duration = await Maintenance.findById(req.params.id);
    if (!duration) return res.status(404).json({ message: 'Duration not found' });

    if (durationMonths !== undefined) {
      if (durationMonths <= 0) return res.status(400).json({ message: 'Duration must be greater than 0' });

      const existing = await Maintenance.findOne({ durationMonths, _id: { $ne: req.params.id } });
      if (existing) return res.status(409).json({ message: 'This duration value already exists' });

      duration.durationMonths = durationMonths;
    }

    if (price !== undefined) {
      if (price < 0) return res.status(400).json({ message: 'Price cannot be negative' });
      duration.price = price;
    }

    duration.updatedAt = Date.now();
    await duration.save();

    res.json({ message: 'Membership duration updated successfully', duration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete membership duration (admin only)
router.delete('/durations/:id', isAdmin, async (req, res) => {
  try {
    const duration = await Maintenance.findByIdAndDelete(req.params.id);
    if (!duration) return res.status(404).json({ message: 'Duration not found' });
    res.json({ message: 'Membership duration deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===== USER VERIFICATION MANAGEMENT (admin only) =====

// Get all users (admin only)
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle user verification (admin only)
router.put('/users/:id/verify', isAdmin, async (req, res) => {
  try {
    const { verified } = req.body;
    if (typeof verified !== 'boolean') return res.status(400).json({ message: 'Invalid verified value' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Admin cannot be unverified
    if (user.role === 'admin' && verified === false) {
      return res.status(400).json({ message: 'Cannot change verification for admin' });
    }

    user.verified = verified;
    await user.save();

    res.json({ message: 'User verification updated', user: { id: user._id, username: user.username, email: user.email, role: user.role, verified: user.verified } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
