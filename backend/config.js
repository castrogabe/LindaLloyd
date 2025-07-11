const dotenv = require('dotenv');
dotenv.config();

const isLive = process.env.NODE_ENV === 'production';

const config = {
  isLive,
  PORT: process.env.PORT || 8000,
  JWT_SECRET: process.env.JWT_SECRET || 'Objetsdart',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/frontend',

  // Ensure this is correct and present
  baseUrl: isLive
    ? process.env.BASE_URL_PRODUCTION // e.g., https://lindalloyd.onrender.com
    : process.env.BASE_URL_DEVELOPMENT ||
      `http://localhost:${process.env.PORT || 8000}`,

  auth: {
    user: process.env.NODE_USER,
    password: process.env.NODE_PASSWORD,
  },

  square: {
    accessToken: isLive
      ? process.env.SQUARE_ACCESS_TOKEN
      : process.env.SQUARE_SANDBOX_ACCESS_TOKEN,
    appId: isLive
      ? process.env.SQUARE_APP_ID
      : process.env.SQUARE_SANDBOX_APP_ID,
    locationId: isLive
      ? process.env.SQUARE_LOCATION_ID
      : process.env.SQUARE_SANDBOX_LOCATION_ID,
    taxUid: isLive
      ? process.env.SQUARE_TAX_UID
      : process.env.SQUARE_SANDBOX_TAX_UID,
  },

  mailchimp: {
    apiKey: process.env.MAILCHIMP_API_KEY,
    audienceId: process.env.MAILCHIMP_AUDIENCE_ID,
    serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX,
  },
};

module.exports = config;
