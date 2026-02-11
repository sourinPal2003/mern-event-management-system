import express from 'express';
import Maintenance from '../models/Maintenance.js';
import { isAdmin, isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// ===== MEMBERSHIP DURATION ENDPOINTS (for admin to manage pricing) =====

// Get all membership durations (public or authenticated)
router.get('/durations', isAuthenticated, async (req, res) => {
  try {
    const durations = await Maintenance.find({ type: 'membership_duration' }).sort({ durationMonths: 1 });
    res.json(durations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create membership duration (admin only)
router.post('/durations', isAdmin, async (req, res) => {
  try {
    const { durationMonths, price } = req.body;

    // Validation
    if (!durationMonths || price === undefined) {
      return res.status(400).json({ message: 'Duration (in months) and price are required' });
    }

    if (durationMonths <= 0) {
      return res.status(400).json({ message: 'Duration must be greater than 0' });
    }

    if (price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    // Check if duration already exists
    const existing = await Maintenance.findOne({ type: 'membership_duration', durationMonths });
    if (existing) {
      return res.status(409).json({ message: 'This duration already exists' });
    }

    const newDuration = new Maintenance({
      type: 'membership_duration',
      durationMonths,
      price
    });

    await newDuration.save();

    res.status(201).json({
      message: 'Membership duration created successfully',
      duration: newDuration
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update membership duration (admin only)
router.put('/durations/:id', isAdmin, async (req, res) => {
  try {
    const { durationMonths, price } = req.body;

    let duration = await Maintenance.findById(req.params.id);

    if (!duration) {
      return res.status(404).json({ message: 'Duration not found' });
    }

    if (duration.type !== 'membership_duration') {
      return res.status(400).json({ message: 'This is not a membership duration record' });
    }

    if (durationMonths !== undefined) {
      if (durationMonths <= 0) {
        return res.status(400).json({ message: 'Duration must be greater than 0' });
      }

      // Check if new duration value already exists (except current record)
      const existing = await Maintenance.findOne({
        type: 'membership_duration',
        durationMonths,
        _id: { $ne: req.params.id }
      });
      if (existing) {
        return res.status(409).json({ message: 'This duration value already exists' });
      }

      duration.durationMonths = durationMonths;
    }

    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({ message: 'Price cannot be negative' });
      }
      duration.price = price;
    }

    duration.updatedAt = Date.now();
    await duration.save();

    res.json({
      message: 'Membership duration updated successfully',
      duration
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete membership duration (admin only)
router.delete('/durations/:id', isAdmin, async (req, res) => {
  try {
    const duration = await Maintenance.findByIdAndDelete(req.params.id);

    if (!duration) {
      return res.status(404).json({ message: 'Duration not found' });
    }

    if (duration.type !== 'membership_duration') {
      return res.status(400).json({ message: 'This is not a membership duration record' });
    }

    res.json({ message: 'Membership duration deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===== MAINTENANCE TASK ENDPOINTS =====

// Create maintenance task (admin only)
router.post('/create', isAdmin, async (req, res) => {
  try {
    const { title, description, category, priority, scheduledDate, cost, assignedTo } = req.body;

    // Validation
    if (!title || !description || !category || !scheduledDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newMaintenance = new Maintenance({
      type: 'maintenance',
      title,
      description,
      category,
      priority: priority || 'medium',
      scheduledDate,
      cost: cost || 0,
      assignedTo: assignedTo || null,
      status: 'pending'
    });

    await newMaintenance.save();

    res.status(201).json({
      message: 'Maintenance request created successfully',
      maintenance: newMaintenance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all maintenance tasks
router.get('/list', isAdmin, async (req, res) => {
  try {
    const maintenance = await Maintenance.find({ type: 'maintenance' }).sort({ scheduledDate: 1 });
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single maintenance task
router.get('/get/:id', isAdmin, async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }

    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update maintenance task
router.put('/update/:id', isAdmin, async (req, res) => {
  try {
    const { title, description, category, priority, status, assignedTo, cost, scheduledDate, completionDate, notes } = req.body;

    let maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }

    if (title) maintenance.title = title;
    if (description) maintenance.description = description;
    if (category) maintenance.category = category;
    if (priority) maintenance.priority = priority;
    if (status) maintenance.status = status;
    if (assignedTo) maintenance.assignedTo = assignedTo;
    if (cost !== undefined) maintenance.cost = cost;
    if (scheduledDate) maintenance.scheduledDate = scheduledDate;
    if (completionDate) maintenance.completionDate = completionDate;
    if (notes) maintenance.notes = notes;

    maintenance.updatedAt = Date.now();
    await maintenance.save();

    res.json({
      message: 'Maintenance request updated successfully',
      maintenance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete maintenance task
router.delete('/delete/:id', isAdmin, async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);

    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }

    res.json({ message: 'Maintenance request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
