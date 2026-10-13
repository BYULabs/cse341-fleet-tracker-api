const express = require('express');
const serviceShopsController = require('../controllers/serviceShops');
const { isAuthenticated } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

router.get('/', serviceShopsController.getAllServiceShops);
router.get('/:id', serviceShopsController.getServiceShopById);
router.post(
  '/',
  isAuthenticated,
  body('shopName').notEmpty().withMessage('Shop name is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be a number between 0 and 5'),
  handleValidationErrors,
  serviceShopsController.createServiceShop
);
router.put(
  '/:id',
  isAuthenticated,
  body('shopName').optional().notEmpty().withMessage('Shop name is required'),
  body('phone').optional().notEmpty().withMessage('Phone number is required'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be a number between 0 and 5'),
  handleValidationErrors,
  serviceShopsController.updateServiceShop
);
router.delete('/:id', isAuthenticated, serviceShopsController.deleteServiceShop);

module.exports = router;
