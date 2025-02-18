const express = require('express');
const router = express.Router();
//const { Assignment, User, Task } = require('../models');
const User = require('../models/userModel');
const Task = require('../models/taskModel');
const Assignment = require('../models/assignmentModel');

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

    // Create the assignment
    const assignment = await Assignment.create({
      userId,
      taskId,
      priority,
      status,
      deadline,
    });

    res.status(201).json({ message: 'Assignment created successfully', assignment });
  } catch (err) {
    res.status(500).json({ message: 'Error creating assignment', error: err.message });
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
    res.status(500).json({ message: 'Error fetching assignments', error: err.message });
  }
});

// ✅ Update an assignment
router.put('/:id', async (req, res) => {
  try {
    const { userId, taskId, priority, status, deadline } = req.body;

    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if the user and task exist before updating the assignment
    const user = await User.findByPk(userId);
    const task = await Task.findByPk(taskId);
    if (!user || !task) {
      return res.status(404).json({ message: 'User or Task not found' });
    }

    await assignment.update({
      userId,
      taskId,
      priority,
      status,
      deadline
    });

    res.status(200).json({ message: 'Assignment updated', assignment });
  } catch (err) {
    res.status(500).json({ message: 'Error updating assignment', error: err.message });
  }
});

// ✅ Delete an assignment
router.delete('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await assignment.destroy();

    res.status(200).json({ message: 'Assignment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting assignment', error: err.message });
  }
});

module.exports = router;
