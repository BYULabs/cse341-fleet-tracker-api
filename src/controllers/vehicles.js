exports.getAllVehicles = async (req, res, next) => {
  try {
    res.status(200).json({ message: 'GET all vehicles' });
  } catch (error) {
    next(error);
  }
};

exports.createVehicle = async (req, res, next) => {
  try {
    res.status(201).json({ message: 'POST vehicle' });
  } catch (error) {
    next(error);
  }
};