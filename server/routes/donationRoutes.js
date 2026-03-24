const express = require('express');
const router = express.Router();
const {
  createDonation,
  getDonationsByUser,
  getDonationsByCampaign,
} = require('../controllers/donationController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.post('/', protect, requireRole('donor', 'admin'), createDonation);
router.get('/user/:id', protect, getDonationsByUser);
router.get('/campaign/:id', protect, getDonationsByCampaign);

module.exports = router;
