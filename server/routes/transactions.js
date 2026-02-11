import express from 'express';
import Transaction from '../models/Transaction.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Get all transactions (with filters)
router.get('/list', isAuthenticated, async (req, res) => {
  try {
    const { type, status, membershipNumber } = req.query;

    let filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (membershipNumber) filter.membershipNumber = membershipNumber;

    const transactions = await Transaction.find(filter).sort({ transactionDate: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single transaction
router.get('/get/:id', isAuthenticated, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create transaction (internal use, usually via membership/event operations)
router.post('/create', isAuthenticated, async (req, res) => {
  try {
    const { transactionId, membershipNumber, type, description, amount, paymentMethod, status } = req.body;

    // Validation
    if (!transactionId || !membershipNumber || !type || !amount) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const newTransaction = new Transaction({
      transactionId,
      membershipNumber,
      type,
      description,
      amount,
      paymentMethod: paymentMethod || 'cash',
      status: status || 'completed'
    });

    await newTransaction.save();

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: newTransaction
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transactions by membership number
router.get('/membership/:membershipNumber', isAuthenticated, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      membershipNumber: req.params.membershipNumber
    }).sort({ transactionDate: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
