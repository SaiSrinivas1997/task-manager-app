const express = require('express');
const router = express.Router();
const { Assignment, User, Task } = require('../models'); // Import models

// ✅ Create a new assignment
router.post('/create', async (req, res) => {
  try {
    const { userId, taskId, priority, status, deadline } = req.body;

    // Validate if user and task exist
    const user = await User.findByPk(userId);
    const task = await Task.findByPk(taskId);
    if (!user || !task) {
      return res.status(404).json({ message: 'User or Task not found' });
    }

    const assignment = await Assignment.create({
      userId,
      taskId,
      priority,
      status,
      deadline
    });

    res.status(201).json({ message: 'Assignment created', assignment });
  } catch (err) {
    res.status(500).json({ message: 'Error creating assignment', error: err.message });
  }
});

// ✅ Get all assignments (Include User & Task details)
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: [
        { model: User, attributes: ['id', 'username', 'email'] },
        { model: Task, attributes: ['id', 'title', 'description'] }
      ]
    });
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assignments', error: err.message });
  }
});

// ✅ Get assignments for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const assignments = await Assignment.findAll({
      where: { userId: req.params.userId },
      include: [{ model: Task, attributes: ['id', 'title', 'description'] }]
    });

    if (!assignments.length) {
      return res.status(404).json({ message: 'No assignments found for this user' });
    }

    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assignments', error: err.message });
  }
});

// ✅ Get assignments for a specific task
router.get('/task/:taskId', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const assignments = await Assignment.findAll({
      where: { taskId: req.params.taskId },
      include: [{ model: User, attributes: ['id', 'username', 'email'] }]
    });

    if (!assignments.length) {
      return res.status(404).json({ message: 'No assignments found for this task' });
    }

    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching 
