const Vehicle = require('../models/Vehicle');

// GET all vehicles
exports.getAllVehicles = async (req, res, next) => {
  /* #swagger.tags = ['Vehicles'] */
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    next(error);
  }
};

// GET single vehicle by ID
exports.getVehicleById = async (req, res, next) => {
  /* #swagger.tags = ['Vehicles'] */
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Vehicle ID format' });
    }
    next(error);
  }
};

// POST create new vehicle
exports.createVehicle = async (req, res, next) => {
  /* #swagger.tags = ['Vehicles'] */
  try {
    const { vin, make, model, year, licensePlate, mileage, fuelType, status } = req.body;
    const newVehicle = new Vehicle({
      vin,
      make,
      model,
      year,
      licensePlate,
      mileage,
      fuelType,
      status
    });
    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A vehicle with this VIN already exists' });
    }
    next(error);
  }
};

// PUT update vehicle by ID
exports.updateVehicle = async (req, res, next) => {
  /* #swagger.tags = ['Vehicles'] */
  try {
    const { vin, make, model, year, licensePlate, mileage, fuelType, status } = req.body;
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { vin, make, model, year, licensePlate, mileage, fuelType, status },
      { new: true, runValidators: true }
    );
    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(updatedVehicle);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A vehicle with this VIN already exists' });
    }
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Vehicle ID format' });
    }
    next(error);
  }
};

// DELETE vehicle by ID
exports.deleteVehicle = async (req, res, next) => {
  /* #swagger.tags = ['Vehicles'] */
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle successfully deleted', id: req.params.id });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Vehicle ID format' });
    }
    next(error);
  }
};
