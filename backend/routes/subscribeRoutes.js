const express = require('express');
const Subscriber = require('../models/subscribeModel');
const axios = require('axios');

const subscribeRouter = express.Router();

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

subscribeRouter.post('/', async (req, res) => {
  const email = req.body.email?.toLowerCase();
  // console.log('Received email:', email);
  // console.log('Request body:', req.body);

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    await axios.post(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
      { email_address: email, status: 'subscribed' },
      {
        headers: {
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(201).json({ message: 'Subscription successful' });
  } catch (error) {
    console.error(
      'Mailchimp subscribe error:',
      error.response?.data || error.message
    );

    if (error.response && error.response.data.title === 'Member Exists') {
      return res.status(400).json({ message: 'Email already subscribed' });
    }
    res.status(500).json({ message: 'Server error. Try again later.' });
  }
});

module.exports = subscribeRouter;
