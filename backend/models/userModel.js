const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connectPostgresDB'); // Ensure this is the correct Sequelize connection

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID, // Use UUID for better scalability
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Ensures the email is valid
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'), // Use ENUM instead of STRING for better validation
    defaultValue: 'user',
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePicture: {
    type: DataTypes.STRING, // Can be a URL to the image
    allowNull: true,
  }
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt
});

module.exports = User;
