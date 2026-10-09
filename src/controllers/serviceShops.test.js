jest.mock('../models/ServiceShop', () => ({
  find: jest.fn(),
  findById: jest.fn()
}));

const ServiceShop = require('../models/ServiceShop');
const serviceShopsController = require('./serviceShops');

describe('service shops controller reads', () => {
  const shopId = '507f1f77bcf86cd799439011';
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('getAllServiceShops', () => {
    test('returns all service shops', async () => {
      const serviceShops = [{ shopName: 'Fleet Garage' }];
      ServiceShop.find.mockResolvedValue(serviceShops);

      await serviceShopsController.getAllServiceShops(req, res, next);

      expect(ServiceShop.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(serviceShops);
    });

    test('passes database errors to Express error middleware', async () => {
      const error = new Error('Database unavailable');
      ServiceShop.find.mockRejectedValue(error);

      await serviceShopsController.getAllServiceShops(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getServiceShopById', () => {
    test('returns the requested service shop', async () => {
      const serviceShop = { _id: shopId };
      req.params.id = shopId;
      ServiceShop.findById.mockResolvedValue(serviceShop);

      await serviceShopsController.getServiceShopById(req, res, next);

      expect(ServiceShop.findById).toHaveBeenCalledWith(shopId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(serviceShop);
    });

    test('returns 404 when the service shop does not exist', async () => {
      req.params.id = shopId;
      ServiceShop.findById.mockResolvedValue(null);

      await serviceShopsController.getServiceShopById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Service shop not found' });
    });

    test('passes database errors to Express error middleware', async () => {
      const error = new Error('Database unavailable');
      req.params.id = shopId;
      ServiceShop.findById.mockRejectedValue(error);

      await serviceShopsController.getServiceShopById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});