const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');

// POST /api/donations - create donation (donor; optional anonymous)
const createDonation = async (req, res) => {
  try {
    const { campaignId, amount, anonymous } = req.body;
    if (!campaignId || amount == null || amount < 1) {
      return res.status(400).json({ message: 'campaignId and amount (min 1) are required' });
    }
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    if (campaign.status !== 'Approved') {
      return res.status(400).json({ message: 'Can only donate to approved campaigns' });
    }

    const donation = await Donation.create({
      campaign: campaignId,
      donor: req.user._id,
      amount: Number(amount),
      paymentStatus: 'Success',
    });

    campaign.raisedAmount += Number(amount);
    await campaign.save();

    const populated = await Donation.findById(donation._id)
      .populate('campaign', 'title goalAmount raisedAmount')
      .populate('donor', 'name email');
    return res.status(201).json(populated);
  } catch (error) {
    console.error('Create donation error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/donations/user/:id - history for user (self or admin)
const getDonationsByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const donations = await Donation.find({ donor: userId })
      .populate('campaign', 'title goalAmount raisedAmount status')
      .sort({ createdAt: -1 });
    return res.status(200).json(donations);
  } catch (error) {
    console.error('Get user donations error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/donations/campaign/:id - donations for campaign (creator or admin)
const getDonationsByCampaign = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    const isCreator = campaign.creator.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isCreator) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const donations = await Donation.find({ campaign: campaignId })
      .populate('donor', 'name email')
      .sort({ createdAt: -1 });
    return res.status(200).json(donations);
  } catch (error) {
    console.error('Get campaign donations error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createDonation,
  getDonationsByUser,
  getDonationsByCampaign,
};
