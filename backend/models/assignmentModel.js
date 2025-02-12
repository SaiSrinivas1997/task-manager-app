const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connectPostgresDB');
const User = require('./User');  // Ensure correct model import
const Task = require('./Task');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users', // Matches the table name in the database
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  taskId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Tasks',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  assignedDate: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
    defaultValue: 'pending',
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: true,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: true,
});

// **Establish Many-to-Many Relationship**
User.belongsToMany(Task, { through: Assignment, foreignKey: 'userId', as: 'tasks' });
Task.belongsToMany(User, { through: Assignment, foreignKey: 'taskId', as: 'assignees' });

module.exports = Assignment;
