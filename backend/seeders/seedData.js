const mongoose = require('mongoose');
const Client = require('../models/Client');
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const demoClients = [
  {
    fullName: "John Smith",
    email: "john.smith@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Solutions",
    address: "123 Business Ave, Tech City, TC 12345",
    notes: "Key decision maker for enterprise solutions"
  },
  {
    fullName: "Sarah Johnson",
    email: "sarah.johnson@innovate.com",
    phone: "+1 (555) 234-5678",
    company: "Innovate Inc",
    address: "456 Innovation St, Startup City, SC 67890",
    notes: "Interested in AI and machine learning solutions"
  },
  {
    fullName: "Michael Brown",
    email: "michael.brown@global.com",
    phone: "+1 (555) 345-6789",
    company: "Global Enterprises",
    address: "789 Corporate Blvd, Business District, BD 11111",
    notes: "Looking for scalable cloud solutions"
  },
  {
    fullName: "Emily Davis",
    email: "emily.davis@creative.com",
    phone: "+1 (555) 456-7890",
    company: "Creative Studios",
    address: "321 Design Way, Creative Hub, CH 22222",
    notes: "Needs creative software solutions"
  },
  {
    fullName: "David Wilson",
    email: "david.wilson@finance.com",
    phone: "+1 (555) 567-8901",
    company: "Finance First",
    address: "654 Money Lane, Financial District, FD 33333",
    notes: "Requires secure financial software"
  }
];

const demoMeetings = [
  {
    title: "Initial Consultation",
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    location: "Conference Room A",
    notes: "Discuss project requirements and timeline",
    status: "Scheduled"
  },
  {
    title: "Product Demo",
    dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    location: "Virtual Meeting",
    notes: "Showcase new features and capabilities",
    status: "Scheduled"
  },
  {
    title: "Contract Review",
    dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    location: "Board Room",
    notes: "Review and finalize contract terms",
    status: "Scheduled"
  },
  {
    title: "Follow-up Meeting",
    dateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    location: "Coffee Shop",
    notes: "Check on project progress and address concerns",
    status: "Completed"
  },
  {
    title: "Project Kickoff",
    dateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    location: "Office",
    notes: "Official project start and team introduction",
    status: "Completed"
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
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/client-meeting-app');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Client.deleteMany({});
    await Meeting.deleteMany({});
    await User.deleteMany({ email: demoUser.email });
    console.log('Cleared existing data');

    // Create demo user
    const hashedPassword = await bcrypt.hash(demoUser.password, 10);
    const user = new User({ ...demoUser, password: hashedPassword });
    await user.save();
    console.log('Created demo user');

    // Create demo clients with userId
    const createdClients = await Client.insertMany(
      demoClients.map(client => ({ ...client, userId: user._id }))
    );
    console.log('Created demo clients');

    // Create demo meetings with userId and clientId
    const demoMeetingsWithClients = demoMeetings.map((meeting, index) => ({
      ...meeting,
      userId: user._id,
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

if (require.main === module) {
  seedData();
}

module.exports = seedData;
