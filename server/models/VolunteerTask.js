const mongoose = require('mongoose');

const volunteerTaskSchema = new mongoose.Schema(
  {
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    taskType: {
      type: String,
      enum: ['Food', 'Disaster'],
      required: true,
    },
    assignedLocation: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Assigned', 'In Progress', 'Completed'],
      default: 'Assigned',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VolunteerTask', volunteerTaskSchema);
