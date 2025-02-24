import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 8000,
  JWT_SECRET: process.env.JWT_SECRET || 'collecting',
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || 'sb',
  MONGODB_URL: process.env.MONGODB_URI || 'mongodb://localhost/frontend',

  CLOUDINARY_CLOUD_NAME: 'dqwurwyuf',
  CLOUDINARY_API_KEY: process.env.key || 'apiKey',
  CLOUDINARY_URL: process.env.cloudinary || 'secretKey',
  CLOUDINARY_API_SECRET: process.envCloudinary || 'secretAccessKey',

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key',
  STRIPE_PUBLISHABLE_KEY:
    process.env.STRIPE_PUBLISHABLE_KEY || 'your_stripe_publishable_key',

  auth: process.env.NODE_USER || 'username',
  auth: process.env.NODE_PASSWORD || 'password',
};
