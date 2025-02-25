const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 8000,
  JWT_SECRET: process.env.JWT_SECRET || 'Objetsdart',
  MONGODB_URL: process.env.MONGODB_URI || 'mongodb://localhost/frontend',

  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || 'sb',

  STRIPE_PUBLISHABLE_KEY:
    process.env.STRIPE_PUBLISHABLE_KEY || 'your_stripe_publishable_key',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key',

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'name',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || 'apiKey',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'secretAccessKey',
  CLOUDINARY_URL: process.env.CLOUDINARY_URL || 'secretKey',

  auth: process.env.NODE_USER,
  auth: process.env.NODE_PASSWORD,
};
