// Shared error handling for known Mongoose errors
const handleError = (error, res, next) => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({ message: 'Validation failed', errors: messages });
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ message: `Invalid value for ${error.path}` });
  }
  next(error);
};

module.exports = handleError;
