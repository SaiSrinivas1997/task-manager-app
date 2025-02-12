// Use environment variables for database URIs
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

// Import database connection functions
const { connectPostgresDB } = require('./config/connectPostgresDB');

// Middleware
app.use(cors());
app.use(express.json());

// Database connections
connectPostgresDB();   // Connect to PostgreSQL

// Import routes here (e.g., task routes)
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/assignment', require('./routes/assignmentRoutes'));

// Export the app
module.exports = app;
