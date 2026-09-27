const express = require('express');
const router = express.Router();

const vehicleRoutes = require('./vehicles');

router.use('/vehicles', vehicleRoutes);

module.exports = router;
