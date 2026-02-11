import express from 'express';
import Membership from '../models/Membership.js';
import Transaction from '../models/Transaction.js';
import Maintenance from '../models/Maintenance.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Add new membership
router.post('/add', isAuthenticated, async (req, res) => {
  try {
    const { membershipNumber, firstName, lastName, email, phone, address, durationId } = req.body;

    // Validation
    if (!membershipNumber || !firstName || !lastName || !email || !phone || !address || !durationId) {
      return res.status(400).json({ message: 'All fields are required, including duration' });
    }

    // Check if membership number already exists
    const existingMembership = await Membership.findOne({ membershipNumber });
    if (existingMembership) {
      return res.status(409).json({ message: 'Membership number already exists' });
    }

    // Get duration and price details
    const duration = await Maintenance.findById(durationId);
    if (!duration || duration.type !== 'membership_duration') {
      return res.status(400).json({ message: 'Invalid duration selected' });
    }
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + duration.durationMonths);

    const newMembership = new Membership({
      membershipNumber,
      firstName,
      lastName,
      email,
      phone,
      address,
      duration: `${duration.durationMonths} months`,
      durationMonths: duration.durationMonths,
      startDate,
      endDate
    });

    await newMembership.save();

    // Create transaction record with price from duration
    const transactionId = `TXN-${Date.now()}`;
    await Transaction.create({
      transactionId,
      membershipNumber,
      type: 'membership',
      description: `New ${duration.durationMonths} months membership created for ${firstName} ${lastName}`,
      amount: duration.price,
      paymentMethod: 'cash',
      status: 'completed'
    });

    res.status(201).json({
      message: 'Membership added successfully',
      membership: newMembership
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get membership by number
router.get('/get/:membershipNumber', isAuthenticated, async (req, res) => {
  try {
    const membership = await Membership.findOne({ membershipNumber: req.params.membershipNumber });

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    res.json(membership);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update membership
router.put('/update/:membershipNumber', isAuthenticated, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, durationId, action } = req.body;

    const membership = await Membership.findOne({ membershipNumber: req.params.membershipNumber });

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    // Handle cancellation
    if (action === 'cancel') {
      membership.status = 'cancelled';
      await membership.save();

      // Create transaction for cancellation
      const transactionId = `TXN-${Date.now()}`;
      await Transaction.create({
        transactionId,
        membershipNumber: req.params.membershipNumber,
        type: 'membership',
        description: 'Membership cancelled',
        amount: 0,
        paymentMethod: 'cash',
        status: 'completed'
      });

      return res.json({
        message: 'Membership cancelled successfully',
        membership
      });
    }

    // Handle extension
    if (action === 'extend') {
      if (!durationId) {
        return res.status(400).json({ message: 'Duration ID is required for extension' });
      }

      // Get duration details
      const duration = await Maintenance.findById(durationId);
      if (!duration || duration.type !== 'membership_duration') {
        return res.status(400).json({ message: 'Invalid duration selected' });
      }

      const newEndDate = new Date(membership.endDate);
      newEndDate.setMonth(newEndDate.getMonth() + duration.durationMonths);

      membership.endDate = newEndDate;
      membership.duration = `${duration.durationMonths} months`;
      membership.durationMonths = duration.durationMonths;
      membership.status = 'active';
      await membership.save();

      // Create transaction for extension
      const transactionId = `TXN-${Date.now()}`;
      await Transaction.create({
        transactionId,
        membershipNumber: req.params.membershipNumber,
        type: 'membership',
        description: `Membership extended by ${duration.durationMonths} months`,
        amount: duration.price,
        paymentMethod: 'cash',
        status: 'completed'
      });

      return res.json({
        message: 'Membership extended successfully',
        membership
      });
    }

    // Regular update
    if (firstName) membership.firstName = firstName;
    if (lastName) membership.lastName = lastName;
    if (email) membership.email = email;
    if (phone) membership.phone = phone;
    if (address) membership.address = address;

    membership.updatedAt = Date.now();
    await membership.save();

    res.json({
      message: 'Membership updated successfully',
      membership
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all memberships
router.get('/list/all', isAuthenticated, async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
