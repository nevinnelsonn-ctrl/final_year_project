const Campaign = require('../models/Campaign');

// GET /api/campaigns - list (public; optional status/type filter)
const getCampaigns = async (req, res) => {
  try {
    const { status, campaignType } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (campaignType) filter.campaignType = campaignType;

    const campaigns = await Campaign.find(filter)
      .populate('creator', 'name email')
      .sort({ createdAt: -1 });
    return res.status(200).json(campaigns);
  } catch (error) {
    console.error('Get campaigns error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/campaigns/:id - single campaign (public)
const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('creator', 'name email');
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    return res.status(200).json(campaign);
  } catch (error) {
    console.error('Get campaign error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/campaigns - create (creator or admin)
const createCampaign = async (req, res) => {
  try {
    const { title, description, goalAmount, campaignType, disasterType, location, documents } = req.body;
    if (!title || !description || goalAmount == null) {
      return res.status(400).json({ message: 'Title, description and goalAmount are required' });
    }
    const campaign = await Campaign.create({
      title,
      description,
      goalAmount: Number(goalAmount),
      campaignType: campaignType || 'Charity',
      disasterType: disasterType || '',
      location: location || '',
      documents: Array.isArray(documents) ? documents : [],
      creator: req.user._id,
    });
    const populated = await Campaign.findById(campaign._id).populate('creator', 'name email');
    return res.status(201).json(populated);
  } catch (error) {
    console.error('Create campaign error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/campaigns/:id - update (creator or admin)
const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    const isAdmin = req.user.role === 'admin';
    const isCreator = campaign.creator.toString() === req.user._id.toString();
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: 'Not allowed to update this campaign' });
    }

    const { title, description, goalAmount, campaignType, disasterType, location, documents } = req.body;
    if (title != null) campaign.title = title;
    if (description != null) campaign.description = description;
    if (goalAmount != null) campaign.goalAmount = Number(goalAmount);
    if (campaignType != null) campaign.campaignType = campaignType;
    if (disasterType != null) campaign.disasterType = disasterType;
    if (location != null) campaign.location = location;
    if (Array.isArray(documents)) campaign.documents = documents;

    await campaign.save();
    const populated = await Campaign.findById(campaign._id).populate('creator', 'name email');
    return res.status(200).json(populated);
  } catch (error) {
    console.error('Update campaign error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/campaigns/approve/:id - set status Approved/Rejected (admin only)
const approveCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Approved or Rejected' });
    }
    campaign.status = status;
    await campaign.save();
    const populated = await Campaign.findById(campaign._id).populate('creator', 'name email');
    return res.status(200).json(populated);
  } catch (error) {
    console.error('Approve campaign error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  approveCampaign,
};
