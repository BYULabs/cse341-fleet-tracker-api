const User = require('../models/User');

// GET all users
exports.getAllUsers = async (req, res, next) => {
  /* #swagger.tags = ['Users'] */
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
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
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid User ID format' });
    }
    next(error);
  }
};

// POST create new user
exports.createUser = async (req, res, next) => {
  /* #swagger.tags = ['Users'] */
  try {
    const { oauthId, displayName, email, role } = req.body;
    const newUser = new User({ oauthId, displayName, email, role });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A user with this OAuth ID or email already exists' });
    }
    next(error);
  }
};

// PUT update user by ID
exports.updateUser = async (req, res, next) => {
  /* #swagger.tags = ['Users'] */
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
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  /* #swagger.tags = ['Users'] */
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid User ID format' });
    }
    next(error);
  }
};
