const ServiceShop = require('../models/ServiceShop');
const handleError = require('../utils/handleError');

// GET all service shops
exports.getAllServiceShops = async (req, res, next) => {
  /* #swagger.tags = ['ServiceShops'] */
  try {
    const serviceShops = await ServiceShop.find();
    res.status(200).json(serviceShops);
  } catch (error) {
    handleError(error, res, next);
  }
};

// GET a single service shop by ID
exports.getServiceShopById = async (req, res, next) => {
  /* #swagger.tags = ['ServiceShops'] */
  try {
    const serviceShop = await ServiceShop.findById(req.params.id);
    if (!serviceShop) {
      return res.status(404).json({ message: 'Service shop not found' });
    }
    res.status(200).json(serviceShop);
  } catch (error) {
    handleError(error, res, next);
  }
};

// POST a new service shop
exports.createServiceShop = async (req, res, next) => {
  /* #swagger.tags = ['ServiceShops'] */
  try {
    const { shopName, phone, address, specialty, rating } = req.body;
    const serviceShop = new ServiceShop({
      shopName,
      phone,
      address,
      specialty,
      rating
    });
    await serviceShop.save();
    res.status(201).json(serviceShop);
  } catch (error) {
    handleError(error, res, next);
  }
};

// UPDATE a service shop by ID
exports.updateServiceShop = async (req, res, next) => {
  /* #swagger.tags = ['ServiceShops'] */
  try {
    const { shopName, phone, address, specialty, rating } = req.body;
    const serviceShop = await ServiceShop.findByIdAndUpdate(
      req.params.id,
      { shopName, phone, address, specialty, rating },
      { new: true, runValidators: true }
    );
    if (!serviceShop) {
      return res.status(404).json({ message: 'Service shop not found' });
    }
    res.status(200).json(serviceShop);
  } catch (error) {
    handleError(error, res, next);
  }
};

// DELETE a service shop by ID
exports.deleteServiceShop = async (req, res, next) => {
  /* #swagger.tags = ['ServiceShops'] */
  try {
    const serviceShop = await ServiceShop.findByIdAndDelete(req.params.id);
    if (!serviceShop) {
      return res.status(404).json({ message: 'Service shop not found' });
    }
    res.status(200).json({ message: 'Service shop deleted successfully' });
  } catch (error) {
    handleError(error, res, next);
  }
};
