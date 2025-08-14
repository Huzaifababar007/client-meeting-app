const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');

// CREATE
router.post('/', async (req, res) => {
  try {
    const meeting = new Meeting(req.body);
    const saved = await meeting.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ all
router.get('/', async (_req, res) => {
  try {
    const meetings = await Meeting.find().sort({ dateTime: 1 }).populate('clientId');
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// READ one
router.get('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id).populate('clientId');
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const updated = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meeting deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


