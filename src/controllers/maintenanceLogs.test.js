jest.mock('mongoose', () => ({ modelNames: jest.fn() }));
jest.mock('../models/MaintenanceLog', () => ({
  find: jest.fn(),
  findById: jest.fn()
}));
jest.mock('../models/Vehicle', () => ({}));

const mongoose = require('mongoose');
const MaintenanceLog = require('../models/MaintenanceLog');
const maintenanceLogsController = require('./maintenanceLogs');

const createQuery = (result) => ({
  populate: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  then: (resolve, reject) => Promise.resolve(result).then(resolve, reject)
});

describe('maintenance logs controller reads', () => {
  const logId = '507f1f77bcf86cd799439011';
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();
    mongoose.modelNames.mockReturnValue([]);
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('getAllLogs', () => {
    test('returns all maintenance logs with their references populated and sorted', async () => {
      const logs = [{ serviceType: 'Oil change' }];
      const query = createQuery(logs);
      mongoose.modelNames.mockReturnValue(['ServiceShop']);
      MaintenanceLog.find.mockReturnValue(query);

      await maintenanceLogsController.getAllLogs(req, res, next);

      expect(MaintenanceLog.find).toHaveBeenCalled();
      expect(query.sort).toHaveBeenCalledWith({ serviceDate: -1 });
      expect(query.populate).toHaveBeenNthCalledWith(
        1,
        'vehicleId',
        'vin make model year licensePlate'
      );
      expect(query.populate).toHaveBeenNthCalledWith(2, 'shopId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(logs);
    });

    test('passes database errors to Express error middleware', async () => {
      const error = new Error('Database unavailable');
      MaintenanceLog.find.mockReturnValue(createQuery(Promise.reject(error)));

      await maintenanceLogsController.getAllLogs(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getLogById', () => {
    test('returns the requested maintenance log', async () => {
      const log = { _id: logId };
      const query = createQuery(log);
      req.params.id = logId;
      MaintenanceLog.findById.mockReturnValue(query);

      await maintenanceLogsController.getLogById(req, res, next);

      expect(MaintenanceLog.findById).toHaveBeenCalledWith(logId);
      expect(query.populate).toHaveBeenCalledWith(
        'vehicleId',
        'vin make model year licensePlate'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(log);
    });

    test('returns 404 when the maintenance log does not exist', async () => {
      req.params.id = logId;
      MaintenanceLog.findById.mockReturnValue(createQuery(null));

      await maintenanceLogsController.getLogById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Maintenance log not found' });
    });

    test('passes database errors to Express error middleware', async () => {
      const error = new Error('Database unavailable');
      req.params.id = logId;
      MaintenanceLog.findById.mockReturnValue(createQuery(Promise.reject(error)));

      await maintenanceLogsController.getLogById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});