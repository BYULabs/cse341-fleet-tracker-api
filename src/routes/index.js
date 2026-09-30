const express = require('express');
const router = express.Router();

const vehicleRoutes = require('./vehicles');
const userRoutes = require('./users');

router.use('/vehicles', vehicleRoutes);
router.use('/users', userRoutes);

module.exports = router;
