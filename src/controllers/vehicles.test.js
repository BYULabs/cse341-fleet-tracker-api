jest.mock('../models/Vehicle', () => jest.fn());
jest.mock('../models/MaintenanceLog', () => ({ countDocuments: jest.fn() }));

const Vehicle = require('../models/Vehicle');
const MaintenanceLog = require('../models/MaintenanceLog');
const vehiclesController = require('./vehicles');

describe('vehicles controller', () => {
  const vehicleId = '507f1f77bcf86cd799439011';
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();
    Vehicle.mockReset();
    Vehicle.find = jest.fn();
    Vehicle.findById = jest.fn();
    Vehicle.findByIdAndUpdate = jest.fn();
    Vehicle.findByIdAndDelete = jest.fn();
    MaintenanceLog.countDocuments = jest.fn();

    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('getAllVehicles', () => {
    test('returns all vehicles', async () => {
      const vehicles = [{ vin: '1HGCM82633A004352' }];
      Vehicle.find.mockResolvedValue(vehicles);

      await vehiclesController.getAllVehicles(req, res, next);

      expect(Vehicle.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(vehicles);
    });

    test('passes database errors to Express error middleware', async () => {
      const error = new Error('Database unavailable');
      Vehicle.find.mockRejectedValue(error);

      await vehiclesController.getAllVehicles(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getVehicleById', () => {
    test('returns the requested vehicle', async () => {
      const vehicle = { _id: vehicleId };
      req.params.id = vehicleId;
      Vehicle.findById.mockResolvedValue(vehicle);

      await vehiclesController.getVehicleById(req, res, next);

      expect(Vehicle.findById).toHaveBeenCalledWith(vehicleId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(vehicle);
    });

    test('returns 404 when the vehicle does not exist', async () => {
      req.params.id = vehicleId;
      Vehicle.findById.mockResolvedValue(null);

      await vehiclesController.getVehicleById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Vehicle not found' });
    });
  });

  describe('createVehicle', () => {
    test('creates a vehicle and returns 201', async () => {
      const vehicleData = {
        vin: '1HGCM82633A004352',
        make: 'Honda',
        model: 'Accord',
        year: 2020,
        licensePlate: 'ABC 123',
        mileage: 25000,
        fuelType: 'Gasoline',
        status: 'Active'
      };
      const savedVehicle = { _id: vehicleId, ...vehicleData };
      const save = jest.fn().mockResolvedValue(savedVehicle);
      Vehicle.mockImplementation(() => ({ save }));
      req.body = vehicleData;

      await vehiclesController.createVehicle(req, res, next);

      expect(Vehicle).toHaveBeenCalledWith(vehicleData);
      expect(save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedVehicle);
    });

    test('returns 400 when the VIN already exists', async () => {
      const save = jest.fn().mockRejectedValue({ code: 11000 });
      Vehicle.mockImplementation(() => ({ save }));

      await vehiclesController.createVehicle(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'A vehicle with this VIN already exists'
      });
    });
  });

  describe('updateVehicle', () => {
    test('updates a vehicle and enables validation', async () => {
      const updatedVehicle = { _id: vehicleId, make: 'Honda' };
      req.params.id = vehicleId;
      req.body = { make: 'Honda' };
      Vehicle.findByIdAndUpdate.mockResolvedValue(updatedVehicle);

      await vehiclesController.updateVehicle(req, res, next);

      expect(Vehicle.findByIdAndUpdate).toHaveBeenCalledWith(
        vehicleId,
        {
          vin: undefined,
          make: 'Honda',
          model: undefined,
          year: undefined,
          licensePlate: undefined,
          mileage: undefined,
          fuelType: undefined,
          status: undefined
        },
        { new: true, runValidators: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedVehicle);
    });

    test('returns 404 when the vehicle does not exist', async () => {
      req.params.id = vehicleId;
      Vehicle.findByIdAndUpdate.mockResolvedValue(null);

      await vehiclesController.updateVehicle(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Vehicle not found' });
    });
  });

  describe('deleteVehicle', () => {
    test('returns 400 for an invalid vehicle ID', async () => {
      req.params.id = 'not-an-object-id';

      await vehiclesController.deleteVehicle(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid Vehicle ID format'
      });
      expect(MaintenanceLog.countDocuments).not.toHaveBeenCalled();
    });

    test('prevents deletion when maintenance logs exist', async () => {
      req.params.id = vehicleId;
      MaintenanceLog.countDocuments.mockResolvedValue(2);

      await vehiclesController.deleteVehicle(req, res, next);

      expect(MaintenanceLog.countDocuments).toHaveBeenCalledWith({
        vehicleId
      });
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Cannot delete vehicle with 2 maintenance log(s); delete its logs first'
      });
      expect(Vehicle.findByIdAndDelete).not.toHaveBeenCalled();
    });

    test('returns 404 when the vehicle to delete does not exist', async () => {
      req.params.id = vehicleId;
      MaintenanceLog.countDocuments.mockResolvedValue(0);
      Vehicle.findByIdAndDelete.mockResolvedValue(null);

      await vehiclesController.deleteVehicle(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Vehicle not found' });
    });

    test('deletes a vehicle with no maintenance logs', async () => {
      req.params.id = vehicleId;
      MaintenanceLog.countDocuments.mockResolvedValue(0);
      Vehicle.findByIdAndDelete.mockResolvedValue({ _id: vehicleId });

      await vehiclesController.deleteVehicle(req, res, next);

      expect(Vehicle.findByIdAndDelete).toHaveBeenCalledWith(vehicleId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Vehicle successfully deleted',
        id: vehicleId
      });
    });
  });
});