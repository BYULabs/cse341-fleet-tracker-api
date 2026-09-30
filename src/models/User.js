const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  oauthId: {
    type: String,
    required: [true, 'OAuth ID is required'],
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: [true, 'A display name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    match: [/.+@.+\..+/, 'Email must be a valid email address']
  },
  role: {
    type: String,
    enum: ['Fleet Manager', 'Driver'],
    default: 'Driver'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
