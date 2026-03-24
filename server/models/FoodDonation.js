const mongoose = require('mongoose');

const foodDonationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    foodType: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    expiryTime: {
      type: Date,
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Picked', 'Delivered'],
      default: 'Available',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FoodDonation', foodDonationSchema);
