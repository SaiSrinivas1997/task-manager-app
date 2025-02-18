const express = require('express');
const Task = require('../models/taskModel');
const Assignment = require('../models/assignmentModel');
const User = require('../models/userModel');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Create Task (Only Authenticated Users)
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { title, description, assignees, status, priority, deadline } = req.body;

    const newTask = await Task.create({
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      deadline,
    });

    if (assignees && assignees.length > 0) {
      const assignments = assignees.map(userId => ({
        userId,
        taskId: newTask.id,
        assignedDate: new Date(),
      }));
      await Assignment.bulkCreate(assignments);
    }

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err });
  }
});

// ✅ Get all tasks (Only Authenticated Users)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let tasks;
    
    if (req.user.role === 'admin') {
      // Admins can see all tasks
      tasks = await Task.findAll({
        include: [
          {
            model: User,
            as: 'assignees',
            attributes: ['id', 'username', 'email'],
            through: { attributes: [] },
          }
        ],
      });
    } else {
      // Regular users only see their assigned tasks
      tasks = await Task.findAll({
        include: [
          {
            model: User,
            as: 'assignees',
            attributes: ['id', 'username', 'email'],
            through: { attributes: [] },
            where: { id: req.user.userId },
          }
        ],
      });
    }

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err });
  }
});

// ✅ Get a single task by ID (Only Assigned Users or Admins)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: User,
          as: 'assignees',
          attributes: ['id', 'username', 'email'],
          through: { attributes: [] },
        }
      ],
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the user is assigned or an admin
    const isAssigned = task.assignees.some(user => user.id === req.user.userId);
    if (!isAssigned && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching task', error: err });
  }
});

// ✅ Update task (Only Assigned Users or Admins)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, assignees, status, priority, deadline } = req.body;
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the user is assigned or an admin
    const assignments = await Assignment.findAll({ where: { taskId: task.id } });
    const assignedUsers = assignments.map(a => a.userId);
    if (!assignedUsers.includes(req.user.userId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await task.update({ title, description, status, priority, deadline });

    if (assignees && assignees.length > 0) {
      await Assignment.destroy({ where: { taskId: task.id } });
      const newAssignments = assignees.map(userId => ({
        userId,
        taskId: task.id,
        assignedDate: new Date(),
      }));
      await Assignment.bulkCreate(newAssignments);
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err });
  }
});

// ✅ Delete task (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Assignment.destroy({ where: { taskId: task.id } });
    await task.destroy();

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err });
  }
});

module.exports = router; 