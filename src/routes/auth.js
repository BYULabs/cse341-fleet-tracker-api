const express = require('express');
const passport = require('passport');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

// Auth routes are browser flows, so they are hidden from the Swagger docs

router.get(
  '/google',
  // #swagger.ignore = true
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  // #swagger.ignore = true
  passport.authenticate('google', { failureRedirect: '/api-docs' }),
  (req, res) => {
    res.redirect('/api-docs');
  }
);

router.get('/me', isAuthenticated, (req, res) => {
  // #swagger.ignore = true
  res.status(200).json(req.user);
});

router.get('/logout', (req, res, next) => {
  // #swagger.ignore = true
  req.logout((error) => {
    if (error) return next(error);
    req.session.destroy((destroyError) => {
      if (destroyError) return next(destroyError);
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
});

module.exports = router;
