import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { getTaxRate } from '../taxRateIndex.js';

const taxRouter = express.Router();

taxRouter.post(
  '/estimate',
  expressAsyncHandler(async (req, res) => {
    const { itemsPrice, states, county } = req.body;

    if (itemsPrice === undefined || !states || !county) {
      console.error('❌ Missing data:', { itemsPrice, states, county });
      return res.status(400).send({ message: 'Missing tax estimate data' });
    }

    // console.log('📩 Estimating tax for:', { itemsPrice, states, county });

    try {
      const normalizedState = states.trim().toUpperCase();
      const normalizedCounty = county.trim();
      const taxRate = getTaxRate(normalizedState, normalizedCounty);
      const taxPrice = Number((itemsPrice * taxRate).toFixed(2));
      // console.log(`✅ Tax estimate: ${taxRate} => $${taxPrice}`);

      res.send({ taxRate, taxPrice });
    } catch (err) {
      console.error('🔥 getTaxRate error:', err);
      return res.status(500).send({ message: 'Tax calculation error' });
    }
  })
);

export default taxRouter;
