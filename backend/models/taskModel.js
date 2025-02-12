// models/Task.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectPostgresDB'); 

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID, // Use UUID for unique task identification
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT, // Using TEXT instead of STRING for longer descriptions
    allowNull: false,
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users', // Ensure 'Users' table exists
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
    defaultValue: 'pending',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Task;
