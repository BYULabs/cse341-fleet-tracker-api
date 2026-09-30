const express = require('express');
const router = express.Router();

const vehicleRoutes = require('./vehicles');
const maintenanceLogRoutes = require('./maintenanceLogs');
const userRoutes = require('./users');

router.use('/vehicles', vehicleRoutes);
router.use('/maintenance-logs', maintenanceLogRoutes);
router.use('/users', userRoutes);

module.exports = router;
