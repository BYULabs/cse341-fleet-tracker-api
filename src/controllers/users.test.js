jest.mock('../models/User', () => ({
  find: jest.fn(),
  findById: jest.fn()
}));

const User = require('../models/User');
const usersController = require('./users');

describe('users controller reads', () => {
  const userId = '507f1f77bcf86cd799439011';
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

  describe('getAllUsers', () => {
    test('returns all users', async () => {
      const users = [{ displayName: 'Fleet Admin' }];
      User.find.mockResolvedValue(users);

      await usersController.getAllUsers(req, res, next);

      expect(User.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    test('passes database errors to Express error middleware', async () => {
      const error = new Error('Database unavailable');
      User.find.mockRejectedValue(error);

      await usersController.getAllUsers(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getUserById', () => {
    test('returns the requested user', async () => {
      const user = { _id: userId };
      req.params.id = userId;
      User.findById.mockResolvedValue(user);

      await usersController.getUserById(req, res, next);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    test('returns 404 when the user does not exist', async () => {
      req.params.id = userId;
      User.findById.mockResolvedValue(null);

      await usersController.getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    test('passes database errors to Express error middleware', async () => {
      const error = new Error('Database unavailable');
      req.params.id = userId;
      User.findById.mockRejectedValue(error);

      await usersController.getUserById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});