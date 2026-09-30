const express = require('express');
const router = express.Router();

const vehicleRoutes = require('./vehicles');
const maintenanceLogRoutes = require('./maintenanceLogs');

router.use('/vehicles', vehicleRoutes);
router.use('/maintenance-logs', maintenanceLogRoutes);

module.exports = router;
