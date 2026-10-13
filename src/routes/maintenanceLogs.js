const express = require('express');
const maintenanceLogsController = require('../controllers/maintenanceLogs');
const { isAuthenticated } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

router.get('/', maintenanceLogsController.getAllLogs);
router.get('/:id', maintenanceLogsController.getLogById);
router.post(
  '/',
  isAuthenticated,
  body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
  body('shopId').notEmpty().withMessage('Service shop ID is required'),
  body('serviceDate').isISO8601().toDate().withMessage('Valid service date is required'),
  body('serviceType')
    .notEmpty()
    .withMessage('Service type is required')
    .isIn([
      'Oil Change',
      'Tire Rotation',
      'Brake Service',
      'Inspection',
      'Engine Repair',
      'Transmission',
      'Battery',
      'Other'
    ])
    .withMessage(
      'Service type must be one of: Oil Change, Tire Rotation, Brake Service, Inspection, Engine Repair, Transmission, Battery, Other'
    ),
  body('cost').isFloat({ min: 0 }).withMessage('Cost must be a non-negative number'),
  body('odometerReading')
    .isFloat({ min: 0 })
    .withMessage('Odometer reading must be a non-negative number'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  handleValidationErrors,
  maintenanceLogsController.createLog
);
router.put(
  '/:id',
  isAuthenticated,
  body('vehicleId').optional().notEmpty().withMessage('Vehicle ID is required'),
  body('shopId').optional().notEmpty().withMessage('Service shop ID is required'),
  body('serviceDate').optional().isISO8601().toDate().withMessage('Valid service date is required'),
  body('serviceType')
    .optional()
    .notEmpty()
    .withMessage('Service type is required')
    .isIn([
      'Oil Change',
      'Tire Rotation',
      'Brake Service',
      'Inspection',
      'Engine Repair',
      'Transmission',
      'Battery',
      'Other'
    ])
    .withMessage(
      'Service type must be one of: Oil Change, Tire Rotation, Brake Service, Inspection, Engine Repair, Transmission, Battery, Other'
    ),
  body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a non-negative number'),
  body('odometerReading')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Odometer reading must be a non-negative number'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  handleValidationErrors,
  maintenanceLogsController.updateLog
);
router.delete('/:id', isAuthenticated, maintenanceLogsController.deleteLog);

module.exports = router;
