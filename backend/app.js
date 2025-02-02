const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectMongoDB = require('./config/dbConfig'); // MongoDB
const { connectPostgresDB } = require('./config/dbConfig'); // PostgreSQL

dotenv.config(); // Load environment variables

const app = express();
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Enable JSON body parsing

// Connect to MongoDB and PostgreSQL
connectMongoDB();
connectPostgresDB();

// Simple test route
app.get('/', (req, res) => {
  res.send('Task Management App API');
});

// Set server to listen on specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
