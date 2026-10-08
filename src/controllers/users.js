const User = require('../models/User');
const handleError = require('../utils/handleError');

// GET all users
exports.getAllUsers = async (req, res, next) => {
  /* #swagger.tags = ['Users'] */
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    handleError(error, res, next);
  }
};

// GET single user by ID
exports.getUserById = async (req, res, next) => {
  /* #swagger.tags = ['Users'] */
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    handleError(error, res, next);
  }
};

// POST create new user
exports.createUser = async (req, res, next) => {
  /* #swagger.tags = ['Users']
     #swagger.security = [{ "cookieAuth": [] }]
     #swagger.responses[401] = { description: 'Not logged in' } */
  try {
    const { oauthId, displayName, email, role } = req.body;
    const newUser = new User({ oauthId, displayName, email, role });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A user with this OAuth ID or email already exists' });
    }
    handleError(error, res, next);
  }
};

// PUT update user by ID
exports.updateUser = async (req, res, next) => {
  /* #swagger.tags = ['Users']
     #swagger.security = [{ "cookieAuth": [] }]
     #swagger.responses[401] = { description: 'Not logged in' } */
  try {
    const { oauthId, displayName, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { oauthId, displayName, email, role },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A user with this OAuth ID or email already exists' });
    }
    handleError(error, res, next);
  }
};

exports.deleteUser = async (req, res, next) => {
  /* #swagger.tags = ['Users']
     #swagger.security = [{ "cookieAuth": [] }]
     #swagger.responses[401] = { description: 'Not logged in' } */
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    handleError(error, res, next);
  }
};
