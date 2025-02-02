const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); // Sequelize connection

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
  },
});

module.exports = User;
