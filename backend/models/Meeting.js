const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;


