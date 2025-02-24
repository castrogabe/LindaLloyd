const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 8000,
  JWT_SECRET: process.env.JWT_SECRET || 'Objetsdart',
  MONGODB_URL: process.env.MONGODB_URI || 'mongodb://localhost/frontend',

  auth: process.env.NODE_USER,
  auth: process.env.NODE_PASSWORD,
};
