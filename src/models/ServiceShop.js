const mongoose = require('mongoose');

const serviceShopSchema = new mongoose.Schema({
  shopName: {
    type: String,
    trim: true,
    required: [true, 'Shop name is required']
  },
  phone: {
    type: String,
    trim: true,
    required: [true, 'Phone number is required'],
    match: [/^[+]?[\d\s\-()]{8,20}$/, 'Phone number must be between 8 and 20 digits']
  },
  address: {
    type: String,
    trim: true,
    required: false
  },
  specialty: {
    type: String,
    trim: true,
    required: false
  },
  rating: {
    type: Number,
    required: false,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ServiceShop', serviceShopSchema);
