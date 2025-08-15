const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to extract user ID from token
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// CREATE
router.post('/', authenticateUser, async (req, res) => {
  try {
    const meeting = new Meeting({
      ...req.body,
      userId: req.userId
    });
    const saved = await meeting.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ all meetings for current user
router.get('/', authenticateUser, async (req, res) => {
  try {
    console.log('Fetching meetings for userId:', req.userId);
    const meetings = await Meeting.find({ userId: req.userId })
      .sort({ dateTime: 1 });
    console.log('Found meetings:', meetings.length);
    res.json(meetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

// READ one meeting
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
    res.json(meeting);
  } catch (error) {
    console.error('Error fetching meeting:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// UPDATE
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const updated = await Meeting.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    
    res.json({ message: 'Meeting deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


