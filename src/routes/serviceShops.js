const express = require('express');
const serviceShopsController = require('../controllers/serviceShops');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/', serviceShopsController.getAllServiceShops);
router.get('/:id', serviceShopsController.getServiceShopById);
router.post('/', isAuthenticated, serviceShopsController.createServiceShop);
router.put('/:id', isAuthenticated, serviceShopsController.updateServiceShop);
router.delete('/:id', isAuthenticated, serviceShopsController.deleteServiceShop);

module.exports = router;
