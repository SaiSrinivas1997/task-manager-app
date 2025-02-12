const express = require('express');
const Task = require('../models/Task');
const Assignment = require('../models/Assignment');
const User = require('../models/User'); // Import User model for relations
const router = express.Router();

// ✅ Create Task
router.post('/create', async (req, res) => {
  try {
    const { title, description, assignees, status, priority, deadline } = req.body;
    
    const newTask = await Task.create({
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      deadline,
    });

    // If assignees exist, create assignments
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

// ✅ Get all tasks with assignees
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [
        {
          model: User,
          as: 'assignees',
          attributes: ['id', 'username', 'email'],
          through: { attributes: [] }, // Exclude Assignment table data
        }
      ],
    });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err });
  }
});

// ✅ Get task by ID with assignees
router.get('/:id', async (req, res) => {
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
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching task', error: err });
  }
});

// ✅ Update task (including assignees)
router.put('/:id', async (req, res) => {
  try {
    const { title, description, assignees, status, priority, deadline } = req.body;

    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task details
    await task.update({ title, description, status, priority, deadline });

    // Update assignees (replacing old ones)
    if (assignees && assignees.length > 0) {
      await Assignment.destroy({ where: { taskId: task.id } }); // Remove old assignments
      const assignments = assignees.map(userId => ({
        userId,
        taskId: task.id,
        assignedDate: new Date(),
      }));
      await Assignment.bulkCreate(assignments);
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err });
  }
});

// ✅ Delete task (also removes assignments)
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Assignment.destroy({ where: { taskId: task.id } }); // Remove related assignments
    await task.destroy(); // Delete task

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err });
  }
});

module.exports = router;
