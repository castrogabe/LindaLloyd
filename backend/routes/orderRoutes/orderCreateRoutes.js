import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Client, Environment, ApiError } from 'square';
import { randomUUID } from 'crypto';
import Order from '../../models/orderModel.js';
import Product from '../../models/productModel.js';
import config from '../../config.js';
import { getTaxRate } from '../../taxRateIndex.js';
import { isAuth } from '../../utils.js'; // include auth middleware as needed

const router = express.Router();

const squareClient = new Client({
  environment: config.isLive ? Environment.Production : Environment.Sandbox,
  accessToken: config.square.accessToken,
});

// Debug logs for Square client initialization
// console.log('--- DEBUG: orderCreateRoutes.js Client Init ---');
// console.log('DEBUG: config.isLive:', config.isLive);
// console.log(
//   'DEBUG: config.square.accessToken (first 5 chars):',
//   config.square.accessToken
//     ? config.square.accessToken.substring(0, 5)
//     : 'N/A (Token missing)'
// );
// console.log('DEBUG: config.square.locationId:', config.square.locationId);
// console.log('DEBUG: typeof squareClient:', typeof squareClient);
// console.log(
//   'DEBUG: squareClient instanceof Client:',
//   squareClient instanceof Client
// );
// console.log('--- END DEBUG: orderCreateRoutes.js Client Init ---');

router.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).send({ message: 'Order items cannot be empty' });
    }
    if (
      !shippingAddress ||
      !shippingAddress.states ||
      !shippingAddress.county
    ) {
      return res
        .status(400)
        .send({ message: 'Shipping state and county required' });
    }

    // Fetch product details for each item to get accurate price, salePrice, shippingCharge
    const itemsWithDetails = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product || item._id);
        if (!product) {
          throw new Error(
            `Product not found for ID: ${item.product || item._id}`
          );
        }
        return {
          ...item,
          product: product._id,
          price: product.price,
          salePrice: product.salePrice,
          shippingCharge: product.shippingCharge || 0,
        };
      })
    );

    // Calculate prices
    const itemsPrice = itemsWithDetails.reduce(
      (acc, item) => acc + (item.salePrice ?? item.price) * item.quantity,
      0
    );

    const shippingPrice = itemsWithDetails.reduce(
      (acc, item) => acc + (item.shippingCharge || 0) * item.quantity,
      0
    );

    // Calculate tax using your taxRateIndex
    const taxRate = getTaxRate(shippingAddress.states, shippingAddress.county);
    const taxPrice = Number((itemsPrice * taxRate).toFixed(2));

    // Total price sum
    const totalPrice = Number(
      (itemsPrice + shippingPrice + taxPrice).toFixed(2)
    );

    // Prepare Square order line items
    const squareLineItems = itemsWithDetails.map((item) => ({
      name: item.name,
      quantity: item.quantity.toString(),
      basePriceMoney: {
        amount: Math.round((item.salePrice ?? item.price) * 100),
        currency: 'USD',
      },
      // No dynamic Square taxes; we use your pre-calculated tax
    }));

    if (shippingPrice > 0) {
      squareLineItems.push({
        name: 'Shipping',
        quantity: '1',
        basePriceMoney: {
          amount: Math.round(shippingPrice * 100),
          currency: 'USD',
        },
      });
    }

    // Recipient info for Square fulfillment
    const squareRecipient = {
      emailAddress: req.user.email,
      displayName: shippingAddress.fullName,
      address: {
        addressLine1: shippingAddress.address,
        locality: shippingAddress.city,
        administrativeDistrictLevel1: shippingAddress.states,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country?.toUpperCase() || 'US',
      },
    };

    let squareOrderId = null;

    try {
      // Create Square order without Square tax objects (tax handled by your logic)
      const createOrderResponse = await squareClient.ordersApi.createOrder({
        idempotencyKey: randomUUID(),
        order: {
          locationId: config.square.locationId,
          lineItems: squareLineItems,
          fulfillments: [
            {
              type: 'SHIPMENT',
              shipmentDetails: {
                recipient: squareRecipient,
              },
            },
          ],
        },
      });

      const squareOrder = createOrderResponse.result.order;
      squareOrderId = squareOrder.id;

      // Optionally, you can log or verify Square order details here
      console.log('✅ Square order created:', squareOrderId);
    } catch (error) {
      console.error('❌ Square order creation error:', error);
      if (error instanceof ApiError) {
        console.error(
          'Square API error details:',
          JSON.stringify(error.result, null, 2)
        );
      }
      return res.status(500).send({ message: 'Square order creation failed' });
    }

    // Save order to your DB
    const newOrder = new Order({
      orderItems: itemsWithDetails.map((item) => ({
        slug: item.slug,
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        salePrice: item.salePrice,
        shippingCharge: item.shippingCharge,
        useFlatRateShipping: item.useFlatRateShipping ?? false,
        requiresShippingInvoice: item.requiresShippingInvoice ?? false,
        product: item.product,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      appliedTaxRate: taxRate,
      user: req.user._id,
      orderName: itemsWithDetails[0]?.name || 'Unnamed Order',
      squareOrderId,
    });

    const order = await newOrder.save();

    // Populate user info for response
    const populatedOrder = await Order.findById(order._id).populate(
      'user',
      'name email'
    );

    res
      .status(201)
      .send({ message: 'New Order Created', order: populatedOrder });
  })
);

export default router;
