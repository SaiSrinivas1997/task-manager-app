const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const User = require('./userModel');
const Task = require('./taskModel');

const Assignment = sequelize.define('Assignment', {});

User.belongsToMany(Task, { through: Assignment });
Task.belongsToMany(User, { through: Assignment });

module.exports = Assignment;
