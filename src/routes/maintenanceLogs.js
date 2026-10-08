const express = require('express');
const maintenanceLogsController = require('../controllers/maintenanceLogs');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/', maintenanceLogsController.getAllLogs);
router.get('/:id', maintenanceLogsController.getLogById);
router.post('/', isAuthenticated, maintenanceLogsController.createLog);
router.put('/:id', isAuthenticated, maintenanceLogsController.updateLog);
router.delete('/:id', isAuthenticated, maintenanceLogsController.deleteLog);

module.exports = router;
