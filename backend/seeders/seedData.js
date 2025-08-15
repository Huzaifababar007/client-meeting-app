const mongoose = require('mongoose');
const Client = require('../models/Client');
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const demoUser = {
  fullName: "Demo User",
  email: "demo@example.com",
  password: "demo123",
  phone: "+1 (555) 999-8888"
};

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/client-meeting-app');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Client.deleteMany({});
    await Meeting.deleteMany({});
    await User.deleteMany({ email: demoUser.email });
    console.log('Cleared existing data');

    // Create demo user only (no clients or meetings)
    const hashedPassword = await bcrypt.hash(demoUser.password, 10);
    const user = new User({ ...demoUser, password: hashedPassword });
    await user.save();
    console.log('Created demo user');

    console.log('✅ Database seeded successfully!');
    console.log('Demo user credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: demo123');
    console.log('Note: Demo user starts with empty data');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

if (require.main === module) {
  seedData();
}

module.exports = seedData;
