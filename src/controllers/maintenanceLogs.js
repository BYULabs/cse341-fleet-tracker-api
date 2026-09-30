const mongoose = require('mongoose');
const MaintenanceLog = require('../models/MaintenanceLog');
const Vehicle = require('../models/Vehicle');

// Populate referenced documents; ServiceShop is only populated once its model is registered
const populateRefs = (query) => {
  query.populate('vehicleId', 'vin make model year licensePlate');
  if (mongoose.modelNames().includes('ServiceShop')) {
    query.populate('shopId');
  }
  return query;
};

// Shared error handling for known Mongoose errors
const handleError = (error, res, next) => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({ message: 'Validation failed', errors: messages });
  }
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).json({ message: `Invalid ID format for ${error.path}` });
  }
  next(error);
};

// Ensure the referenced vehicle exists before saving a log
const vehicleExists = async (vehicleId) => {
  if (!mongoose.isValidObjectId(vehicleId)) return true; // let schema validation report it
  return Boolean(await Vehicle.exists({ _id: vehicleId }));
};

// GET all maintenance logs
exports.getAllLogs = async (req, res, next) => {
  try {
    const logs = await populateRefs(MaintenanceLog.find().sort({ serviceDate: -1 }));
    res.status(200).json(logs);
  } catch (error) {
    handleError(error, res, next);
  }
};

// GET single maintenance log by ID
exports.getLogById = async (req, res, next) => {
  try {
    const log = await populateRefs(MaintenanceLog.findById(req.params.id));
    if (!log) {
      return res.status(404).json({ message: 'Maintenance log not found' });
    }
    res.status(200).json(log);
  } catch (error) {
    handleError(error, res, next);
  }
};

// POST create new maintenance log
exports.createLog = async (req, res, next) => {
  try {
    if (req.body.vehicleId && !(await vehicleExists(req.body.vehicleId))) {
      return res.status(404).json({ message: 'Referenced vehicle not found' });
    }
    const newLog = new MaintenanceLog(req.body);
    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    handleError(error, res, next);
  }
};

// PUT update maintenance log by ID
exports.updateLog = async (req, res, next) => {
  try {
    if (req.body.vehicleId && !(await vehicleExists(req.body.vehicleId))) {
      return res.status(404).json({ message: 'Referenced vehicle not found' });
    }
    const updatedLog = await MaintenanceLog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedLog) {
      return res.status(404).json({ message: 'Maintenance log not found' });
    }
    res.status(200).json(updatedLog);
  } catch (error) {
    handleError(error, res, next);
  }
};

// DELETE maintenance log by ID
exports.deleteLog = async (req, res, next) => {
  try {
    const deletedLog = await MaintenanceLog.findByIdAndDelete(req.params.id);
    if (!deletedLog) {
      return res.status(404).json({ message: 'Maintenance log not found' });
    }
    res.status(200).json({ message: 'Maintenance log successfully deleted', id: req.params.id });
  } catch (error) {
    handleError(error, res, next);
  }
};
