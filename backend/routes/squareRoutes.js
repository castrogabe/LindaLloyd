import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import axios from 'axios';
import { randomUUID } from 'crypto';
import config from '../config.js';

const squareRouter = express.Router();

squareRouter.post(
  '/create-payment',
  expressAsyncHandler(async (req, res) => {
    const { amount, sourceId, orderId } = req.body;

    try {
      const response = await axios.post(
        config.isLive
          ? 'https://connect.squareup.com/v2/payments'
          : 'https://connect.squareupsandbox.com/v2/payments',
        {
          source_id: sourceId,
          idempotency_key: randomUUID(),
          amount_money: {
            amount: Math.round(amount * 100),
            currency: 'USD',
          },
          location_id: config.square.locationId,
          note: `Order ${orderId}`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.square.accessToken}`,
          },
        }
      );

      res.send(response.data);
    } catch (error) {
      console.error(
        'Square payment error:',
        error?.response?.data || error.message
      );
      res.status(500).send({
        message: error?.response?.data?.errors?.[0]?.detail || 'Payment failed',
      });
    }
  })
);

squareRouter.get('/key', (req, res) => {
  res.send({
    appId: config.square.appId,
    locationId: config.square.locationId,
  });
});

export default squareRouter;
