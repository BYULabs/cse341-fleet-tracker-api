const express = require('express');
const vehiclesController = require('../controllers/vehicles');
const { isAuthenticated } = require('../middleware/auth');
const {
  vehicleCreateRules,
  vehicleUpdateRules,
  validateRequest
} = require('../middleware/validation');

const router = express.Router();

router.get('/', vehiclesController.getAllVehicles);
router.get('/:id', vehiclesController.getVehicleById);
router.post(
  '/',
  isAuthenticated,
  ...vehicleCreateRules,
  validateRequest,
  vehiclesController.createVehicle
);
router.put(
  '/:id',
  isAuthenticated,
  ...vehicleUpdateRules,
  validateRequest,
  vehiclesController.updateVehicle
);
router.delete('/:id', isAuthenticated, vehiclesController.deleteVehicle);

module.exports = router;
