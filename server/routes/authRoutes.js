const express = require('express');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', (req, res) => {
  res.status(501).json({ message: 'Register route not implemented yet' });
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', (req, res) => {
  res.status(501).json({ message: 'Login route not implemented yet' });
});

module.exports = router;


