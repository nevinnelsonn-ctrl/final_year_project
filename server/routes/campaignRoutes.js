const express = require('express');
const router = express.Router();
const {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  approveCampaign,
} = require('../controllers/campaignController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// Public
router.get('/', getCampaigns);
router.get('/:id', getCampaignById);

// Protected: creator or admin can create
router.post('/', protect, requireRole('creator', 'admin'), createCampaign);
// Protected: creator or admin can update
router.put('/:id', protect, updateCampaign);
// Admin only: approve/reject
router.put('/approve/:id', protect, requireRole('admin'), approveCampaign);

module.exports = router;
