const mongoose = require('mongoose');

const SERVICE_TYPES = [
  'Oil Change',
  'Tire Rotation',
  'Brake Service',
  'Inspection',
  'Engine Repair',
  'Transmission',
  'Battery',
  'Other'
];

const maintenanceLogSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle ID is required']
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceShop',
      required: [true, 'Service shop ID is required']
    },
    serviceDate: {
      type: Date,
      required: [true, 'Service date is required']
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      enum: {
        values: SERVICE_TYPES,
        message: `Service type must be one of: ${SERVICE_TYPES.join(', ')}`
      }
    },
    cost: {
      type: Number,
      required: [true, 'Cost is required'],
      min: [0, 'Cost cannot be negative']
    },
    odometerReading: {
      type: Number,
      required: [true, 'Odometer reading is required'],
      min: [0, 'Odometer reading cannot be negative']
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);
