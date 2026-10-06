const express = require('express');
const vehiclesController = require('../controllers/vehicles');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/', vehiclesController.getAllVehicles);
router.get('/:id', vehiclesController.getVehicleById);
router.post('/', isAuthenticated, vehiclesController.createVehicle);
router.put('/:id', isAuthenticated, vehiclesController.updateVehicle);
router.delete('/:id', isAuthenticated, vehiclesController.deleteVehicle);

module.exports = router;
