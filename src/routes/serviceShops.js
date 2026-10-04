const express = require('express');
const serviceShopsController = require('../controllers/serviceShops');

const router = express.Router();

router.get('/', serviceShopsController.getAllServiceShops);
router.get('/:id', serviceShopsController.getServiceShopById);
router.post('/', serviceShopsController.createServiceShop);
router.put('/:id', serviceShopsController.updateServiceShop);
router.delete('/:id', serviceShopsController.deleteServiceShop);

module.exports = router;
