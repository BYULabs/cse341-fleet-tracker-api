const express = require('express');
const vehiclesController = require('../controllers/vehicles');
const { isAuthenticated } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

router.get('/', vehiclesController.getAllVehicles);
router.get('/:id', vehiclesController.getVehicleById);
router.post(
  '/',
  isAuthenticated,
  body('vin').notEmpty().withMessage('VIN is required'),
  body('make').notEmpty().withMessage('Make is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('year')
    .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
    .withMessage('Year must be a valid integer'),
  body('licensePlate').notEmpty().withMessage('License plate is required'),
  body('mileage').isFloat({ min: 0 }).withMessage('Mileage must be a non-negative number'),
  body('fuelType')
    .isIn(['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Other'])
    .withMessage('Fuel type must be one of: Gasoline, Diesel, Electric, Hybrid, Other'),
  handleValidationErrors,
  vehiclesController.createVehicle
);
router.put(
  '/:id',
  isAuthenticated,
  body('vin').optional().notEmpty().withMessage('VIN is required'),
  body('make').optional().notEmpty().withMessage('Make is required'),
  body('model').optional().notEmpty().withMessage('Model is required'),
  body('year')
    .optional()
    .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
    .withMessage('Year must be a valid integer'),
  body('licensePlate').optional().notEmpty().withMessage('License plate is required'),
  body('mileage')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Mileage must be a non-negative number'),
  body('fuelType')
    .optional()
    .isIn(['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Other'])
    .withMessage('Fuel type must be one of: Gasoline, Diesel, Electric, Hybrid, Other'),
  body('status')
    .optional()
    .isIn(['Active', 'In Maintenance', 'Out of Service', 'Retired'])
    .withMessage('Status must be one of: Active, In Maintenance, Out of Service, Retired'),
  handleValidationErrors,
  vehiclesController.updateVehicle
);
router.delete('/:id', isAuthenticated, vehiclesController.deleteVehicle);

module.exports = router;
