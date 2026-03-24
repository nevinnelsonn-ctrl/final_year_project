const express = require('express');
const router = express.Router();
const { getFoodDonations, createFoodDonation } = require('../controllers/foodDonationController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.get('/', getFoodDonations);
router.post('/', protect, requireRole('donor', 'admin'), createFoodDonation);

module.exports = router;
