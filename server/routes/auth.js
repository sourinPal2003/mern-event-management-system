import express from 'express';
import User from '../models/User.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword, role } = req.body;

  
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }

   
    const newUser = new User({
      username,
      email,
      password,
      role: role || 'user'
    });

    // Admin accounts are considered verified by default
    if (newUser.role === 'admin') newUser.verified = true;

    await newUser.save();

    // Do not auto-login regular users until verified by admin
    if (newUser.role === 'admin') {
      req.session.userId = newUser._id;
      req.session.username = newUser.username;
      req.session.role = newUser.role;
      return res.status(201).json({
        message: 'Admin user registered and logged in',
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          verified: newUser.verified
        }
      });
    }

    res.status(201).json({
      message: 'User registered successfully. Awaiting admin verification.',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        verified: newUser.verified
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

   
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Only allow login if verified, except for admins
    if (user.role !== 'admin' && !user.verified) {
      return res.status(403).json({ message: 'Account not verified by admin' });
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.role = user.role;

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        verified: user.verified
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
});

export default router;
