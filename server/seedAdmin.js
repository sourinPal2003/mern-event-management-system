import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/event-management';

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB for seeding');

    const email = 'admin@test.com';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin user already exists:', email);
      await mongoose.disconnect();
      return;
    }

    const admin = new User({
      username: 'admin',
      email,
      password: 'Admin@123',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created:', email);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Seeding error:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
}

seedAdmin();
