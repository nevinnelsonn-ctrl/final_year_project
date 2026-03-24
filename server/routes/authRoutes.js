const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate, isRequired, minLength, isEmail } = require('../middleware/validate');

// Public
router.post(
  '/register',
  validate({
    name: [isRequired],
    email: [isRequired, isEmail],
    password: [isRequired, minLength(6)],
  }),
  registerUser
);
router.post(
  '/login',
  validate({
    email: [isRequired, isEmail],
    password: [isRequired],
  }),
  loginUser
);

// Private (requires valid JWT)
router.get('/me', protect, getMe);

module.exports = router;
