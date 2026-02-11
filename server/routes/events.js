import express from 'express';
import Event from '../models/Event.js';
import Membership from '../models/Membership.js';
import Transaction from '../models/Transaction.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Create event (admin only)
router.post('/create', isAdmin, async (req, res) => {
  try {
    const { eventName, eventDate, location, description, capacity } = req.body;

    // Validation
    if (!eventName || !eventDate || !location || !description || !capacity) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newEvent = new Event({
      eventName,
      eventDate,
      location,
      description,
      capacity,
      status: 'upcoming'
    });

    await newEvent.save();

    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all events
router.get('/list', isAuthenticated, async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single event
router.get('/get/:id', isAuthenticated, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update event (admin only)
router.put('/update/:id', isAdmin, async (req, res) => {
  try {
    const { eventName, eventDate, location, description, capacity, status } = req.body;

    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (eventName) event.eventName = eventName;
    if (eventDate) event.eventDate = eventDate;
    if (location) event.location = location;
    if (description) event.description = description;
    if (capacity) event.capacity = capacity;
    if (status) event.status = status;

    event.updatedAt = Date.now();
    await event.save();

    res.json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete event (admin only)
router.delete('/delete/:id', isAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register member for event
router.post('/register/:id', isAuthenticated, async (req, res) => {
  try {
    const { membershipNumber } = req.body;

    // Validate membership number
    if (!membershipNumber) {
      return res.status(400).json({ message: 'Membership number is required' });
    }

    // Check if event exists
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event is full
    if (event.registrations >= event.capacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }

    // Verify membership exists and is active
    const membership = await Membership.findOne({ membershipNumber });
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    if (membership.status !== 'active') {
      return res.status(400).json({ message: 'Membership is not active' });
    }

    // Check membership hasn't expired
    const today = new Date();
    if (membership.endDate < today) {
      membership.status = 'expired';
      await membership.save();
      return res.status(400).json({ message: 'Membership has expired' });
    }

    // Check if already registered
    if (event.registeredMembers.some(m => m.membershipNumber === membershipNumber)) {
      return res.status(400).json({ message: 'Member is already registered for this event' });
    }

    // Add member to registered members list
    event.registeredMembers.push({ membershipNumber });
    event.registrations += 1;
    event.updatedAt = Date.now();
    await event.save();

    // Create transaction record for event registration
    const transactionId = `TXN-${Date.now()}`;
    await Transaction.create({
      transactionId,
      membershipNumber,
      type: 'event',
      description: `Registered for event: ${event.eventName}`,
      amount: 0,
      paymentMethod: 'free',
      status: 'completed'
    });

    res.json({
      message: 'Successfully registered for the event',
      event
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get registered members for an event
router.get('/members/:id', isAuthenticated, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Get member details for each registered member
    const memberDetails = await Promise.all(
      event.registeredMembers.map(async (reg) => {
        const member = await Membership.findOne({ membershipNumber: reg.membershipNumber });
        return {
          membershipNumber: reg.membershipNumber,
          name: member ? `${member.firstName} ${member.lastName}` : 'Unknown',
          email: member ? member.email : 'N/A',
          phone: member ? member.phone : 'N/A',
          registeredAt: reg.registeredAt
        };
      })
    );

    res.json({
      eventName: event.eventName,
      totalRegistrations: event.registrations,
      members: memberDetails
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unregister member from event
router.post('/unregister/:id', isAuthenticated, async (req, res) => {
  try {
    const { membershipNumber } = req.body;

    // Validate membership number
    if (!membershipNumber) {
      return res.status(400).json({ message: 'Membership number is required' });
    }

    // Check if event exists
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check registrations
    if (event.registrations <= 0) {
      return res.status(400).json({ message: 'No registrations to remove' });
    }

    // Verify membership exists
    const membership = await Membership.findOne({ membershipNumber });
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    // Check if member is registered
    const memberIndex = event.registeredMembers.findIndex(m => m.membershipNumber === membershipNumber);
    if (memberIndex === -1) {
      return res.status(400).json({ message: 'Member is not registered for this event' });
    }

    // Remove member from registered members list
    event.registeredMembers.splice(memberIndex, 1);
    event.registrations = Math.max(0, event.registrations - 1);
    event.updatedAt = Date.now();
    await event.save();

    // Create transaction record for event unregistration
    const transactionId = `TXN-${Date.now()}`;
    await Transaction.create({
      transactionId,
      membershipNumber,
      type: 'event',
      description: `Unregistered from event: ${event.eventName}`,
      amount: 0,
      paymentMethod: 'free',
      status: 'completed'
    });

    res.json({
      message: 'Successfully unregistered from the event',
      event
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
