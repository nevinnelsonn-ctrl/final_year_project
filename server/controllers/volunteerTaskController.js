const VolunteerTask = require('../models/VolunteerTask');

// GET /api/tasks/volunteer/:id - tasks for volunteer (self or admin)
const getTasksByVolunteer = async (req, res) => {
  try {
    const volunteerId = req.params.id;
    if (req.user._id.toString() !== volunteerId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const tasks = await VolunteerTask.find({ volunteer: volunteerId })
      .sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Get volunteer tasks error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/tasks - all tasks (admin only)
const getAllTasks = async (req, res) => {
  try {
    const tasks = await VolunteerTask.find()
      .populate('volunteer', 'name email role')
      .sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Get all tasks error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/tasks - assign task to volunteer (admin only)
const createTask = async (req, res) => {
  try {
    const { volunteerId, taskType, assignedLocation } = req.body;
    if (!volunteerId || !taskType || !assignedLocation) {
      return res.status(400).json({
        message: 'volunteerId, taskType and assignedLocation are required',
      });
    }
    if (!['Food', 'Disaster'].includes(taskType)) {
      return res.status(400).json({ message: 'taskType must be Food or Disaster' });
    }
    const User = require('../models/User');
    const volunteer = await User.findById(volunteerId).select('role');
    if (!volunteer) return res.status(404).json({ message: 'User not found' });
    if (volunteer.role !== 'volunteer') {
      return res.status(400).json({ message: 'User must have volunteer role' });
    }
    const task = await VolunteerTask.create({
      volunteer: volunteerId,
      taskType,
      assignedLocation: String(assignedLocation).trim(),
    });
    const populated = await VolunteerTask.findById(task._id).populate(
      'volunteer',
      'name email'
    );
    return res.status(201).json(populated);
  } catch (error) {
    console.error('Create task error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/tasks/:id - update task status (volunteer for own task, or admin)
const updateTaskStatus = async (req, res) => {
  try {
    const task = await VolunteerTask.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const isAdmin = req.user.role === 'admin';
    const isVolunteer = task.volunteer.toString() === req.user._id.toString();
    if (!isAdmin && !isVolunteer) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { status } = req.body;
    if (!['Assigned', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({
        message: 'Status must be Assigned, In Progress, or Completed',
      });
    }
    task.status = status;
    await task.save();
    const populated = await VolunteerTask.findById(task._id).populate(
      'volunteer',
      'name email'
    );
    return res.status(200).json(populated);
  } catch (error) {
    console.error('Update task error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTasksByVolunteer,
  getAllTasks,
  createTask,
  updateTaskStatus,
};
