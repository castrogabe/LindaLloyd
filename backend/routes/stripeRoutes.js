const Stripe = require('stripe');
const express = require('express');
const config = require('../config.js');
const Order = require('../models/orderModel.js');

const stripe = Stripe(config.STRIPE_SECRET_KEY);

const stripeRouter = express.Router();

stripeRouter.get('/secret/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      '_id name email'
    );
    if (!order) {
      return res.status(404).send({ error: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalPrice * 100, // Amount in cents
      currency: 'usd', // Currency type (USD in this case)
      metadata: { integration_check: 'accept_a_payment' }, // Metadata for integration check
    });

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: paymentIntent.created,
      email_address: order.user.email,
    };
    await order.save();

    res.send({ order, client_secret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).send({ error: 'Failed to retrieve client secret' });
  }
});

stripeRouter.get('/key', (req, res) => {
  res.send(config.STRIPE_PUBLISHABLE_KEY);
});

module.exports = stripeRouter;
