import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 8000,
  JWT_SECRET: process.env.JWT_SECRET || 'Objetsdart',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/frontend',

  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,

  STRIPE_PUBLISHABLE_KEY:
    process.env.STRIPE_PUBLISHABLE_KEY || 'your_stripe_publishable_key',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key',

  auth: {
    user: process.env.NODE_USER,
    password: process.env.NODE_PASSWORD,
  },
};

export default config;
