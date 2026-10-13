const { body, validationResult } = require('express-validator');

const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Other'];
const VEHICLE_STATUSES = ['Active', 'In Maintenance', 'Out of Service', 'Retired'];
const SERVICE_TYPES = [
  'Oil Change',
  'Tire Rotation',
  'Brake Service',
  'Inspection',
  'Engine Repair',
  'Transmission',
  'Battery',
  'Other'
];

const optional = (field) => body(field).optional();

const vehicleCreateRules = [
  body('vin')
    .trim()
    .notEmpty()
    .withMessage('VIN is required')
    .bail()
    .matches(/^[A-HJ-NPR-Z0-9]{17}$/)
    .withMessage('VIN must be 17 valid characters'),
  body('make').trim().notEmpty().withMessage('Make is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year')
    .exists({ values: 'undefined' })
    .withMessage('Year is required')
    .bail()
    .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be an integer between 1886 and ${new Date().getFullYear() + 1}`)
    .toInt(),
  body('licensePlate').trim().notEmpty().withMessage('License plate is required'),
  body('mileage')
    .exists({ values: 'undefined' })
    .withMessage('Mileage is required')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('Mileage must be a nonnegative number')
    .toFloat(),
  body('fuelType')
    .isIn(FUEL_TYPES)
    .withMessage(`Fuel type must be one of: ${FUEL_TYPES.join(', ')}`),
  body('status')
    .optional()
    .isIn(VEHICLE_STATUSES)
    .withMessage(`Status must be one of: ${VEHICLE_STATUSES.join(', ')}`)
];

const vehicleUpdateRules = [
  optional('vin')
    .trim()
    .notEmpty()
    .withMessage('VIN cannot be empty')
    .bail()
    .matches(/^[A-HJ-NPR-Z0-9]{17}$/)
    .withMessage('VIN must be 17 valid characters'),
  optional('make').trim().notEmpty().withMessage('Make cannot be empty'),
  optional('model').trim().notEmpty().withMessage('Model cannot be empty'),
  optional('year')
    .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be an integer between 1886 and ${new Date().getFullYear() + 1}`)
    .toInt(),
  optional('licensePlate').trim().notEmpty().withMessage('License plate cannot be empty'),
  optional('mileage')
    .isFloat({ min: 0 })
    .withMessage('Mileage must be a nonnegative number')
    .toFloat(),
  optional('fuelType')
    .isIn(FUEL_TYPES)
    .withMessage(`Fuel type must be one of: ${FUEL_TYPES.join(', ')}`),
  optional('status')
    .isIn(VEHICLE_STATUSES)
    .withMessage(`Status must be one of: ${VEHICLE_STATUSES.join(', ')}`)
];

const maintenanceLogCreateRules = [
  body('vehicleId').isMongoId().withMessage('Vehicle ID must be a valid MongoDB ID'),
  body('shopId').isMongoId().withMessage('Service shop ID must be a valid MongoDB ID'),
  body('serviceDate')
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage('Service date must be a valid ISO 8601 date'),
  body('serviceType')
    .isIn(SERVICE_TYPES)
    .withMessage(`Service type must be one of: ${SERVICE_TYPES.join(', ')}`),
  body('cost')
    .exists({ values: 'undefined' })
    .withMessage('Cost is required')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a nonnegative number')
    .toFloat(),
  body('odometerReading')
    .exists({ values: 'undefined' })
    .withMessage('Odometer reading is required')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('Odometer reading must be a nonnegative number')
    .toFloat(),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

const maintenanceLogUpdateRules = [
  optional('vehicleId').isMongoId().withMessage('Vehicle ID must be a valid MongoDB ID'),
  optional('shopId').isMongoId().withMessage('Service shop ID must be a valid MongoDB ID'),
  optional('serviceDate')
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage('Service date must be a valid ISO 8601 date'),
  optional('serviceType')
    .isIn(SERVICE_TYPES)
    .withMessage(`Service type must be one of: ${SERVICE_TYPES.join(', ')}`),
  optional('cost').isFloat({ min: 0 }).withMessage('Cost must be a nonnegative number').toFloat(),
  optional('odometerReading')
    .isFloat({ min: 0 })
    .withMessage('Odometer reading must be a nonnegative number')
    .toFloat(),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

module.exports = {
  vehicleCreateRules,
  vehicleUpdateRules,
  maintenanceLogCreateRules,
  maintenanceLogUpdateRules,
  validateRequest
};
