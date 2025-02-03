const { Sequelize } = require('sequelize');

// PostgreSQL connection
const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: 'postgres',
  logging: false, // Set to true for debugging
});

const connectPostgresDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
  }
};

module.exports = { sequelize, connectPostgresDB };
