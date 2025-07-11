const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const { Client, Environment } = require('square');

const taxRouter = express.Router();

// const squareClient = new Client({
//   environment: Environment.Production, // <-- Change this
//   accessToken: process.env.SQUARE_ACCESS_TOKEN,
// });

const squareClient = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_SANDBOX_ACCESS_TOKEN,
});

taxRouter.post(
  '/estimate',
  expressAsyncHandler(async (req, res) => {
    try {
      const { items, shippingPrice, shippingAddress, locationId } = req.body;

      // Build line items
      const lineItems = items.map((item, index) => ({
        name: item.name,
        quantity: item.quantity.toString(),
        basePriceMoney: {
          amount: Math.round(item.price * 100),
          currency: 'USD',
        },
        appliedTaxes: [{ taxUid: 'tax-1' }],
      }));

      // Add shipping as taxable line item
      lineItems.push({
        name: 'Shipping',
        quantity: '1',
        basePriceMoney: {
          amount: Math.round(shippingPrice * 100),
          currency: 'USD',
        },
        appliedTaxes: [{ taxUid: 'tax-1' }],
      });

      const order = {
        locationId: locationId || process.env.SQUARE_SANDBOX_LOCATION_ID,
        idempotencyKey: uuidv4(),
        taxes: [
          {
            uid: 'tax-1',
            name: 'Sales Tax',
            percentage: '9.5',
            scope: 'LINE_ITEM',
            type: 'ADDITIVE',
          },
        ],
        lineItems,
        fulfillments: [
          {
            type: 'SHIPMENT',
            shipmentDetails: {
              recipient: {
                displayName: shippingAddress.fullName,
                emailAddress: shippingAddress.email,
                address: {
                  addressLine1: shippingAddress.address,
                  locality: shippingAddress.city,
                  administrativeDistrictLevel1: shippingAddress.states,
                  postalCode: shippingAddress.postalCode,
                  country: shippingAddress.country || 'US',
                },
              },
            },
          },
        ],
      };

      console.log(
        '📤 Sending tax estimate request to Square:',
        JSON.stringify(order, null, 2)
      );

      const response = await squareClient.ordersApi.calculateOrder({ order });

      console.log(
        'Square tax response:',
        JSON.stringify(
          response,
          (_, value) => (typeof value === 'bigint' ? value.toString() : value),
          2
        )
      );

      const taxAmount = Number(
        response.result.order.totalTaxMoney?.amount || 0
      );
      const totalAmount = Number(response.result.order.totalMoney?.amount || 0);

      res.send({
        taxPrice: taxAmount / 100,
        totalPrice: totalAmount / 100,
      });
    } catch (err) {
      console.error('❌ Tax estimate error from Square:', err);
      if (err.errors) {
        return res.status(400).send({ message: err.errors[0].detail });
      }
      res.status(500).send({ message: 'Tax estimation failed.' });
    }
  })
);

module.exports = taxRouter;
