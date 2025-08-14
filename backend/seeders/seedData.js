const mongoose = require('mongoose');
const Client = require('../models/Client');
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const demoClients = [
  {
    fullName: "John Smith",
    email: "john.smith@techcorp.com",
    company: "TechCorp Solutions",
    phone: "+1 (555) 123-4567"
  },
  {
    fullName: "Sarah Johnson",
    email: "sarah.johnson@innovate.com",
    company: "Innovate Labs",
    phone: "+1 (555) 234-5678"
  },
  {
    fullName: "Michael Chen",
    email: "michael.chen@startup.io",
    company: "Startup.io",
    phone: "+1 (555) 345-6789"
  },
  {
    fullName: "Emily Davis",
    email: "emily.davis@enterprise.com",
    company: "Enterprise Solutions",
    phone: "+1 (555) 456-7890"
  },
  {
    fullName: "David Wilson",
    email: "david.wilson@consulting.com",
    company: "Wilson Consulting",
    phone: "+1 (555) 567-8901"
  }
];

const demoMeetings = [
  {
    title: "Project Kickoff Meeting",
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    location: "Conference Room A",
    notes: "Initial project discussion and timeline planning"
  },
  {
    title: "Quarterly Review",
    dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    location: "Virtual Meeting",
    notes: "Q4 performance review and Q1 planning"
  },
  {
    title: "Product Demo",
    dateTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    location: "Demo Room",
    notes: "New feature demonstration and feedback session"
  },
  {
    title: "Contract Negotiation",
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    location: "Board Room",
    notes: "Contract terms discussion and finalization"
  },
  {
    title: "Strategy Planning",
    dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    location: "Strategy Room",
    notes: "Long-term strategy planning and goal setting"
  }
];

const demoUser = {
  fullName: "Demo User",
  email: "demo@example.com",
  password: "demo123",
  phone: "+1 (555) 999-8888"
};

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/client-meeting-app');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Client.deleteMany({});
    await Meeting.deleteMany({});
    await User.deleteMany({ email: demoUser.email });
    console.log('Cleared existing data');

    // Create demo user
    const hashedPassword = await bcrypt.hash(demoUser.password, 10);
    const user = new User({
      ...demoUser,
      password: hashedPassword
    });
    await user.save();
    console.log('Created demo user');

    // Create demo clients
    const createdClients = await Client.insertMany(demoClients);
    console.log('Created demo clients');

    // Create demo meetings with client references
    const demoMeetingsWithClients = demoMeetings.map((meeting, index) => ({
      ...meeting,
      clientId: createdClients[index % createdClients.length]._id
    }));

    await Meeting.insertMany(demoMeetingsWithClients);
    console.log('Created demo meetings');

    console.log('✅ Database seeded successfully!');
    console.log('Demo user credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: demo123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
