const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    // 'role' will determine access level throughout the app
    // Allowed values: 'donor', 'creator', 'admin'
    role: {
      type: String,
      enum: ['donor', 'creator', 'admin'],
      default: 'donor',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', userSchema);

