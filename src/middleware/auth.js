// Only allow the request through when a user is logged in via OAuth
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'You must be logged in to access this resource' });
};

module.exports = { isAuthenticated };
