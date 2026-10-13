const express = require('express');
const usersController = require('../controllers/users');
const { isAuthenticated } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.post(
  '/',
  isAuthenticated,
  body('oauthId').notEmpty().withMessage('OAuth ID is required'),
  body('displayName').notEmpty().withMessage('Display name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('role')
    .optional()
    .isIn(['Fleet Manager', 'Driver'])
    .withMessage('Role must be either Fleet Manager or Driver'),
  handleValidationErrors,
  usersController.createUser
);
router.put(
  '/:id',
  isAuthenticated,
  body('oauthId').optional().notEmpty().withMessage('OAuth ID is required'),
  body('displayName').optional().notEmpty().withMessage('Display name is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('role')
    .optional()
    .isIn(['Fleet Manager', 'Driver'])
    .withMessage('Role must be either Fleet Manager or Driver'),
  handleValidationErrors,
  usersController.updateUser
);
router.delete('/:id', isAuthenticated, usersController.deleteUser);

module.exports = router;
