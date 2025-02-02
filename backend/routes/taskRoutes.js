const express = require('express');
const Task = require('../models/taskModel');
const router = express.Router();

// Create a new task
router.post('/', async (req, res) => {
  const { title, description, status, dueDate, assignedTo } = req.body;

  try {
    const newTask = new Task({ title, description, status, dueDate, assignedTo });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: 'Error creating task', error: err });
  }
});

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate, assignedTo } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, {
      title,
      description,
      status,
      dueDate,
      assignedTo,
    }, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: 'Error updating task', error: err });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err });
  }
});

module.exports = router;
