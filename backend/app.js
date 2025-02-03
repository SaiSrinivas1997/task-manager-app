// Use environment variables for database URIs
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

// Import database connection functions
const connectMongoDB = require('./config/connectMongoDB');
const { connectPostgresDB } = require('./config/connectPostgresDB');

// Middleware
app.use(cors());
app.use(express.json());

// Database connections
connectMongoDB();      // Connect to MongoDB
connectPostgresDB();   // Connect to PostgreSQL

// Import routes here (e.g., task routes)
app.use('/api/tasks', require('./routes/taskRoutes'));

// Export the app
module.exports = app;
