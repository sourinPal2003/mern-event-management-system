import express from 'express';
import Membership from '../models/Membership.js';
import Event from '../models/Event.js';
import Transaction from '../models/Transaction.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get membership reports
router.get('/memberships', isAuthenticated, async (req, res) => {
  try {
    const memberships = await Membership.find();

    const stats = {
      total: memberships.length,
      active: memberships.filter(m => m.status === 'active').length,
      expired: memberships.filter(m => m.status === 'expired').length,
      cancelled: memberships.filter(m => m.status === 'cancelled').length,
      data: memberships
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event reports
router.get('/events', isAuthenticated, async (req, res) => {
  try {
    const events = await Event.find();

    const stats = {
      total: events.length,
      upcoming: events.filter(e => e.status === 'upcoming').length,
      ongoing: events.filter(e => e.status === 'ongoing').length,
      completed: events.filter(e => e.status === 'completed').length,
      cancelled: events.filter(e => e.status === 'cancelled').length,
      totalCapacity: events.reduce((sum, e) => sum + e.capacity, 0),
      totalRegistrations: events.reduce((sum, e) => sum + e.registrations, 0),
      data: events
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get financial reports (admin only)
router.get('/financial', isAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find();

    const stats = {
      totalTransactions: transactions.length,
      totalRevenue: transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      byType: {
        membership: transactions.filter(t => t.type === 'membership').length,
        event: transactions.filter(t => t.type === 'event').length,
        other: transactions.filter(t => t.type === 'other').length
      },
      byPaymentMethod: {
        cash: transactions.filter(t => t.paymentMethod === 'cash').length,
        card: transactions.filter(t => t.paymentMethod === 'card').length,
        online: transactions.filter(t => t.paymentMethod === 'online').length
      },
      byStatus: {
        pending: transactions.filter(t => t.status === 'pending').length,
        completed: transactions.filter(t => t.status === 'completed').length,
        failed: transactions.filter(t => t.status === 'failed').length,
        cancelled: transactions.filter(t => t.status === 'cancelled').length
      },
      data: transactions
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard summary (authenticated users)
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const memberships = await Membership.find();
    const events = await Event.find();
    const transactions = await Transaction.find();

    const isAdmin = req.session.role === 'admin';

    const summary = {
      memberships: {
        total: memberships.length,
        active: memberships.filter(m => m.status === 'active').length,
        expired: memberships.filter(m => m.status === 'expired').length
      },
      events: {
        total: events.length,
        upcoming: events.filter(e => e.status === 'upcoming').length,
        completed: events.filter(e => e.status === 'completed').length
      },
      ...(isAdmin && {
        financials: {
          totalRevenue: transactions
            .filter(t => t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0),
          transactionCount: transactions.length
        }
      })
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
