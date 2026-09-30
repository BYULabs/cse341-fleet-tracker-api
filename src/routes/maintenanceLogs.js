const express = require('express');
const maintenanceLogsController = require('../controllers/maintenanceLogs');

const router = express.Router();

router.get('/', maintenanceLogsController.getAllLogs);
router.get('/:id', maintenanceLogsController.getLogById);
router.post('/', maintenanceLogsController.createLog);
router.put('/:id', maintenanceLogsController.updateLog);
router.delete('/:id', maintenanceLogsController.deleteLog);

module.exports = router;
