const mongoose = require('mongoose');

const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Other'];
const STATUSES = ['Active', 'In Maintenance', 'Out of Service', 'Retired'];

const vehicleSchema = new mongoose.Schema(
  {
    vin: {
      type: String,
      required: [true, 'VIN is required'],
      unique: true,
      uppercase: true,
      trim: true,
      // 17 characters, excluding I, O and Q
      match: [/^[A-HJ-NPR-Z0-9]{17}$/, 'VIN must be 17 valid characters']
    },
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1886, 'Year must be 1886 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be more than one year in the future']
    },
    licensePlate: {
      type: String,
      required: [true, 'License plate is required'],
      uppercase: true,
      trim: true
    },
    mileage: {
      type: Number,
      required: [true, 'Mileage is required'],
      min: [0, 'Mileage cannot be negative']
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: {
        values: FUEL_TYPES,
        message: `Fuel type must be one of: ${FUEL_TYPES.join(', ')}`
      }
    },
    status: {
      type: String,
      enum: {
        values: STATUSES,
        message: `Status must be one of: ${STATUSES.join(', ')}`
      },
      default: 'Active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
