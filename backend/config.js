const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 8000,
  JWT_SECRET: process.env.JWT_SECRET || 'Objetsdart',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/lindalloyd',

  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,

  STRIPE_PUBLISHABLE_KEY:
    process.env.STRIPE_PUBLISHABLE_KEY || 'your_stripe_publishable_key',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key',

  NODE_USER: process.env.NODE_USER,
  NODE_PASSWORD: process.env.NODE_PASSWORD,
};
