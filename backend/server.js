const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Set default MongoDB URI if not provided
if (!process.env.MONGO_URI) {
  process.env.MONGO_URI = 'mongodb://localhost:27017/client-meeting-app';
}

// Set default JWT secret if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-super-secret-jwt-key-2024';
}

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: /^http:\/\/localhost:\d+$/,
  credentials: true
}));
app.use(express.json()); // ✅ Necessary for JSON body parsing

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clients', require('./routes/clientRoutes')); // ✅ Make sure this line exists
app.use('/api/meetings', require('./routes/meetingRoutes'));

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
