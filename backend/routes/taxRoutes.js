const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const { getTaxRate } = require('../taxRateIndex.js');

const taxRouter = express.Router();

taxRouter.post(
  '/estimate',
  expressAsyncHandler(async (req, res) => {
    const { itemsPrice, states, county } = req.body;

    if (!itemsPrice || !states || !county) {
      console.error('❌ Missing data:', { itemsPrice, states, county });
      return res.status(400).send({ message: 'Missing tax estimate data' });
    }

    console.log('📩 Estimating tax for:', { itemsPrice, states, county });

    let taxRate = 0;
    try {
      taxRate = getTaxRate(states, county);
    } catch (err) {
      console.error('🔥 getTaxRate error:', err.message);
      return res.status(500).send({ message: 'Tax calculation error' });
    }

    const taxPrice = Number((itemsPrice * taxRate).toFixed(2));
    console.log(`✅ Tax estimate: ${taxRate} => $${taxPrice}`);

    res.send({ taxRate, taxPrice });
  })
);

module.exports = taxRouter;
