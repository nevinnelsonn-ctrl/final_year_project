const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.get('/', protect, requireRole('admin'), getUsers);

module.exports = router;
