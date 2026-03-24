const FoodDonation = require('../models/FoodDonation');

// GET /api/food-donations - list (public for browsing)
const getFoodDonations = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const list = await FoodDonation.find(filter)
      .populate('donor', 'name')
      .sort({ createdAt: -1 });
    return res.status(200).json(list);
  } catch (error) {
    console.error('Get food donations error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/food-donations - create (donor)
const createFoodDonation = async (req, res) => {
  try {
    const { foodType, quantity, expiryTime, pickupLocation } = req.body;
    if (!foodType || quantity == null || !expiryTime || !pickupLocation) {
      return res.status(400).json({
        message: 'foodType, quantity, expiryTime and pickupLocation are required',
      });
    }
    const donation = await FoodDonation.create({
      donor: req.user._id,
      foodType,
      quantity: Number(quantity),
      expiryTime: new Date(expiryTime),
      pickupLocation,
    });
    const populated = await FoodDonation.findById(donation._id).populate('donor', 'name');
    return res.status(201).json(populated);
  } catch (error) {
    console.error('Create food donation error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFoodDonations,
  createFoodDonation,
};
