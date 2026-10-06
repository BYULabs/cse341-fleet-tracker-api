const express = require('express');
const router = express.Router();

const vehicleRoutes = require('./vehicles');
const maintenanceLogRoutes = require('./maintenanceLogs');
const userRoutes = require('./users');
const serviceShopRoutes = require('./serviceShops');
const authRoutes = require('./auth');

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/maintenance-logs', maintenanceLogRoutes);
router.use('/users', userRoutes);
router.use('/service-shops', serviceShopRoutes);

module.exports = router;
