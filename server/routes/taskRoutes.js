const express = require('express');
const router = express.Router();
const {
  getTasksByVolunteer,
  getAllTasks,
  createTask,
  updateTaskStatus,
} = require('../controllers/volunteerTaskController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.get('/', protect, requireRole('admin'), getAllTasks);
router.get('/volunteer/:id', protect, getTasksByVolunteer);
router.post('/', protect, requireRole('admin'), createTask);
router.put('/:id', protect, updateTaskStatus);

module.exports = router;
