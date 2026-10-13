const express = require('express');
const maintenanceLogsController = require('../controllers/maintenanceLogs');
const { isAuthenticated } = require('../middleware/auth');
const {
  maintenanceLogCreateRules,
  maintenanceLogUpdateRules,
  validateRequest
} = require('../middleware/validation');

const router = express.Router();

router.get('/', maintenanceLogsController.getAllLogs);
router.get('/:id', maintenanceLogsController.getLogById);
router.post(
  '/',
  isAuthenticated,
  ...maintenanceLogCreateRules,
  validateRequest,
  maintenanceLogsController.createLog
);
router.put(
  '/:id',
  isAuthenticated,
  ...maintenanceLogUpdateRules,
  validateRequest,
  maintenanceLogsController.updateLog
);
router.delete('/:id', isAuthenticated, maintenanceLogsController.deleteLog);

module.exports = router;
