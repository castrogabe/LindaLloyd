const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Order = require('../models/orderModel.js');
const User = require('../models/userModel.js');
const Product = require('../models/productModel.js');
const { randomUUID } = require('crypto');
const { Client, Environment, ApiError } = require('square');

const {
  isAuth,
  isAdmin,
  transporter,
  sendAdminSMS,
  payOrderEmailTemplate,
  shipOrderEmailTemplate,
  sendShippingConfirmationEmail,
} = require('../utils.js');
const config = require('../config');

// ===> PLACE THE getImageUrl FUNCTION HERE <===
function getImageUrl(imagePath) {
  // Replace with your actual base URL where images are served
  // Example: 'https://yourdomain.com' or 'http://localhost:8000' for development
  return `${config.baseUrl || ''}${imagePath}`;
}
// ===========================================

const orderRouter = express.Router();

const PAGE_SIZE = 12;

const squareClient = new Client({
  environment: config.isLive ? Environment.Production : Environment.Sandbox,
  accessToken: config.square.accessToken,
});

// Add this helper function somewhere accessible if not already defined (e.g., at the top of your file)
function bigIntReplacer(key, value) {
  if (typeof value === 'bigint') {
    return value.toString(); // Convert BigInt to string for JSON serialization
  }
  return value;
}

orderRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const orders = await Order.find()
      .populate('user', 'name email')
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countOrders = await Order.countDocuments();
    res.send({
      orders,
      totalOrders: countOrders,
      page,
      pages: Math.ceil(countOrders / pageSize),
    });
  })
);

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name');
    res.send(orders);
  })
);

orderRouter.get(
  '/test-sms',
  expressAsyncHandler(async (req, res) => {
    await sendAdminSMS({
      subject: `${updatedOrder.orderName} - New Paid Order`,
      message: `Total: $${updatedOrder.totalPrice.toFixed(2)}`,
      customerName: updatedOrder.user.name,
      orderName: updatedOrder.orderName,
    });
    res.send({ message: 'Test SMS sent' });
  })
);

orderRouter.get(
  '/sold',
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ isPaid: true }).populate('user', 'name');
    const soldProducts = [];
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        soldProducts.push({
          _id: item._id,
          name: item.name,
          image: item.image,
          slug: item.slug,
          user: order.user?.name || 'Unknown',
          orderId: order._id,
          soldDate: order.paidAt,
        });
      });
    });
    res.json(soldProducts);
  })
);

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems.length === 0) {
      return res.status(400).send({ message: 'Cart is empty' });
    }

    const orderNameFromFirstItem = orderItems?.[0]?.name || 'Unnamed Order';

    const itemsWithProductDetails = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product || item._id);
        if (!product) {
          throw new Error(
            `Product with ID ${item.product || item._id} not found.`
          );
        }
        return {
          ...item,
          product: product._id,
          shippingCharge: product.shippingCharge || 0,
          price: product.price,
          salePrice: product.salePrice,
        };
      })
    );

    const definitiveItemsPrice = itemsWithProductDetails.reduce(
      (a, c) => a + (c.salePrice || c.price) * c.quantity,
      0
    );
    const definitiveShippingPrice = itemsWithProductDetails.reduce(
      (acc, item) => acc + (item.shippingCharge || 0) * item.quantity,
      0
    );

    const squareLineItems = itemsWithProductDetails.map((item) => ({
      name: item.name,
      quantity: item.quantity.toString(),
      basePriceMoney: {
        amount: Math.round((item.salePrice || item.price) * 100),
        currency: 'USD',
      },
      appliedTaxes: [
        {
          taxUid: 'tax-1',
        },
      ],
    }));

    if (definitiveShippingPrice > 0) {
      squareLineItems.push({
        name: 'Shipping',
        quantity: '1',
        basePriceMoney: {
          amount: Math.round(definitiveShippingPrice * 100),
          currency: 'USD',
        },
        appliedTaxes: [
          {
            taxUid: 'tax-1',
          },
        ],
      });
    }

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

    let actualTaxPrice = 0;
    let actualTotalPrice = 0;
    let squareOrderId = null;

    try {
      const createOrderRequest = {
        idempotencyKey: randomUUID(),
        order: {
          locationId: config.square.locationId,
          taxes: [
            {
              uid: 'tax-1',
              name: 'Sales Tax',
              percentage: '9.5',
              type: 'ADDITIVE',
              scope: 'LINE_ITEM',
            },
          ],
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
      };

      const { result } = await squareClient.ordersApi.createOrder(
        createOrderRequest
      );
      const squareOrder = result.order;

      actualTaxPrice = Number(squareOrder.totalTaxMoney?.amount || 0n) / 100;
      actualTotalPrice = Number(squareOrder.totalMoney?.amount || 0n) / 100;
      squareOrderId = squareOrder.id;
    } catch (squareError) {
      console.error('🔥 Square API Order Creation/Tax Calculation Error:');
      console.error(
        JSON.stringify(
          squareError.response?.data || squareError.message,
          bigIntReplacer,
          2
        )
      );
      actualTaxPrice = 0;
      actualTotalPrice = definitiveItemsPrice + definitiveShippingPrice;
      return res.status(500).send({
        message:
          'Failed to create order. Please try again. If the problem persists, contact support.',
        details: JSON.stringify(
          squareError.response?.data?.errors?.[0]?.detail ||
            squareError.message,
          bigIntReplacer
        ),
      });
    }

    const newOrder = new Order({
      orderItems: itemsWithProductDetails.map((x) => ({
        ...x,
        product: x._id,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice: definitiveItemsPrice,
      shippingPrice: definitiveShippingPrice,
      taxPrice: actualTaxPrice,
      totalPrice: actualTotalPrice,
      appliedTaxRate:
        definitiveItemsPrice + definitiveShippingPrice > 0
          ? Number(
              (
                (actualTaxPrice * 100) /
                (definitiveItemsPrice + definitiveShippingPrice)
              ).toFixed(2)
            )
          : 0,
      user: req.user._id,
      orderName: orderNameFromFirstItem,
      squareOrderId,
    });

    const order = await newOrder.save();
    const populatedOrder = await Order.findById(order._id).populate(
      'user',
      'name email'
    );
    res
      .status(201)
      .send({ message: 'New Order Created', order: populatedOrder });
  })
);

orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      { $group: { _id: null, numUsers: { $sum: 1 } } },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    console.log('Shipping invoice being sent to:', order?.user?.email);

    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id || 'square',
        status: req.body.status || 'COMPLETED',
        email_address: req.body.email_address || order.user.email,
      };
      const updatedOrder = await order.save();
      for (const item of updatedOrder.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock -= item.quantity;
          product.sold += item.quantity;
          await product.save();
        }
      }
      await sendAdminSMS({
        subject: `${updatedOrder.orderName} - New Paid Order`,
        message: `Total: $${updatedOrder.totalPrice.toFixed(2)}`,
        customerName: updatedOrder.user.name,
        imageUrl: 'https://lindalloyd.onrender.com/images/logo.png',
        orderName: updatedOrder.orderName,
      });
      const customerEmail = order.user.email;
      const purchaseDetails = payOrderEmailTemplate(order);
      const emailContent = {
        from: 'lindalloydantiques@gmail.com',
        to: customerEmail,
        subject: 'Purchase Receipt from lindalloyd.com (via Square)',
        html: purchaseDetails,
      };
      try {
        const info = await transporter.sendMail(emailContent);
        console.log('Email sent:', info.messageId);
        res.send({ message: 'Order Paid', order: updatedOrder });
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Failed to send email' });
      }
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/shipped',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );
    if (!order) {
      return res.status(404).send({ message: 'Order Not Found' });
    }

    // ✅ NEW: Block shipping if invoice exists but not paid
    if (order.shippingInvoiceUrl && !order.shippingInvoicePaid) {
      return res.status(400).json({
        message:
          'Shipping invoice must be paid before shipment can be confirmed.',
      });
    }

    // ✅ Existing validation for shipping details
    if (
      !req.body.deliveryDays ||
      !req.body.carrierName ||
      !req.body.trackingNumber
    ) {
      return res
        .status(400)
        .json({ message: 'All shipping fields are required.' });
    }

    // ✅ Proceed with shipping
    order.isShipped = true;
    order.shippedAt = Date.now();
    order.deliveryDays = req.body.deliveryDays;
    order.carrierName = req.body.carrierName;
    order.trackingNumber = req.body.trackingNumber;

    const customerEmail = order.user.email;
    const shippingDetails = shipOrderEmailTemplate(order);
    const emailContent = {
      from: 'lindalloydantiques@gmail.com',
      to: customerEmail,
      subject: 'Shipping notification from lindalloyd.com',
      html: shippingDetails,
    };

    try {
      const updatedOrder = await order.save();
      await sendShippingConfirmationEmail(req, updatedOrder);
      res.send({ message: 'Order Shipped', order: updatedOrder });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).send({ message: 'Failed to ship order' });
    }
  })
);

// ShippingPrice
const ordersApi = squareClient.ordersApi;
const locationId = config.square.locationId;

// --- ShippingPrice Route ---
orderRouter.put(
  '/:id/shipping-price',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user');
    if (!order) {
      return res.status(404).send({ message: 'Order Not Found' });
    }

    if (order.shippingInvoiceSent) {
      return res
        .status(400)
        .send({ message: 'Shipping invoice already sent for this order.' });
    }

    console.log('📍 Square locationId:', locationId);

    order.shippingPrice = req.body.shippingPrice;
    order.totalPrice = order.itemsPrice + order.taxPrice + order.shippingPrice;
    await order.save();

    try {
      // 1. Create Square customer
      let customerId;
      try {
        const customerResponse = await squareClient.customersApi.createCustomer(
          {
            givenName: order.user.name,
            emailAddress: order.user.email,
          }
        );
        customerId = customerResponse.result.customer?.id;

        if (!customerId) {
          console.error('❌ No customer ID returned by Square');
          return res
            .status(500)
            .send({ message: 'Square customer creation returned no ID' });
        }

        console.log('✅ Square customer created:', customerId);
      } catch (err) {
        console.error(
          '❌ Failed to create Square customer:',
          err.response?.data || err.message
        );
        return res
          .status(500)
          .send({ message: 'Square customer creation failed' });
      }

      // 2. Create Square order
      let squareOrderId;
      try {
        const squareOrderResponse = await ordersApi.createOrder({
          idempotencyKey: `${order._id}-shipping-${Date.now()}`,
          order: {
            locationId,
            lineItems: [
              {
                name: `Shipping for Order ${order._id}`,
                quantity: '1',
                basePriceMoney: {
                  amount: Math.round(order.shippingPrice * 100),
                  currency: 'USD',
                },
              },
            ],
          },
        });
        squareOrderId = squareOrderResponse.result.order.id;
        console.log(
          '📦 Square Order Response:',
          JSON.stringify(squareOrderResponse.result, bigIntReplacer, 2)
        );
      } catch (err) {
        console.error(
          '❌ Failed to create Square order:',
          err.response?.data || err.message
        );
        return res
          .status(500)
          .send({ message: 'Square order creation failed' });
      }

      // 3. Create & Publish Invoice (Consolidated and Corrected)
      let invoiceCreated, publishedInvoice; // Declare here once
      try {
        const dueDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        const invoicePayload = {
          invoice: {
            locationId,
            orderId: squareOrderId,
            primaryRecipient: {
              customerId,
            },
            deliveryMethod: 'EMAIL',
            paymentRequests: [
              {
                requestType: 'BALANCE',
                dueDate,
              },
            ],
            title: `Shipping Charge for Order ${order._id}`,
            description: 'Please pay to complete shipping.',
            acceptedPaymentMethods: {
              card: true,
            },
          },
          idempotencyKey: `${order._id}-${Date.now()}`,
        };

        console.log(
          '🧾 Creating Invoice with payload:',
          JSON.stringify(invoicePayload, null, 2) // Payload itself doesn't have BigInts usually, so null is fine here
        );

        invoiceCreated = await squareClient.invoicesApi.createInvoice(
          invoicePayload
        );

        // Debugging log for verification - ensure bigIntReplacer is used here
        console.log(
          '✅ Invoice Created Response (for verification):',
          JSON.stringify(invoiceCreated.result.invoice, bigIntReplacer, 2)
        );

        // --- CRITICAL FIX: The publishPayload should have 'version' at the top level ---
        const publishPayload = {
          version: invoiceCreated.result.invoice.version, // Correct: version directly here
          idempotencyKey: `${order._id}-publish-${Date.now()}`,
        };

        publishedInvoice = await squareClient.invoicesApi.publishInvoice(
          invoiceCreated.result.invoice.id, // This is the invoice ID
          publishPayload // This is the request body for publishing
        );

        console.log(
          '✅ Invoice Published:',
          publishedInvoice.result.invoice.publicUrl
        );
      } catch (err) {
        console.error('❌ Failed to create or publish invoice:');

        // Ensure all error logs use bigIntReplacer if they might stringify a Square response
        if (err instanceof ApiError) {
          console.error(
            '🔍 Square API Error:',
            JSON.stringify(err.result, bigIntReplacer, 2)
          );
        } else if (err.response?.body) {
          console.error(
            '🔍 Raw response body:',
            JSON.stringify(err.response.body, bigIntReplacer, 2)
          );
        } else if (err.response?.text) {
          console.error('🔍 Raw response text:', err.response.text);
        } else {
          console.error('🛑 Error Message:', err.message);
        }

        // Apply bigIntReplacer for the error response sent to client
        return res.status(500).send({
          message: 'Invoice creation or publish failed',
          error: err.result
            ? JSON.parse(JSON.stringify(err.result, bigIntReplacer))
            : err.message,
        });
      }

      // 4. Update Order
      const squareShippingInvoiceUrl =
        publishedInvoice.result.invoice.publicUrl;
      order.shippingInvoiceUrl = squareShippingInvoiceUrl;
      order.shippingInvoiceSent = true;
      const updatedOrder = await order.save(); // <--- This is where updatedOrder is defined

      // 5. Send Email
      const formattedDate = new Date(order.createdAt).toLocaleDateString(
        'en-US'
      );
      try {
        await transporter.sendMail({
          to: order.user.email,
          subject: `Updated Shipping Invoice for Order ${order._id}`,
          html: `
            <p>Hello ${order.user.name},</p>
            <h2>Purchase Order ${order._id} (${formattedDate})</h2>
            <p>Thank you for your purchase. This invoice is for the shipping cost only. Your items and tax were paid at checkout.</p>
            <h3>Paid at Checkout</h3>
            <p><strong>Items Total:</strong> $${order.itemsPrice.toFixed(
              2
            )} (Paid)</p>
            <p><strong>Tax:</strong> $${order.taxPrice.toFixed(2)} (Paid)</p>
            <h3>Shipping Invoice</h3>
            <p><strong>Shipping Charge:</strong> $${order.shippingPrice.toFixed(
              2
            )}</p>
            <p><a href="${squareShippingInvoiceUrl}" style="font-size:16px;color:#3366cc;">Pay Shipping Charge</a></p>
            <h3>Items in This Order</h3>
            <table cellpadding="5" cellspacing="0" border="0">
              <thead>
                <tr>
                  <th align="left">Image</th>
                  <th align="left">Name</th>
                  <th align="center">Quantity</th>
                  <th align="right">Price</th>
                </tr>
              </thead>
              <tbody>
                ${order.orderItems
                  .map(
                    (item) => `
                    <tr>
                      <td><img src="${getImageUrl(item.image)}" alt="${
                      item.name
                    }" width="50" height="50" /></td>
                      <td>${item.name}</td>
                      <td align="center">${item.quantity}</td>
                      <td align="right">$${item.price.toFixed(2)}</td>
                    </tr>`
                  )
                  .join('\n')}
              </tbody>
            </table>
            <p>Please email me at sweetwatertc@yahoo.com if you have any questions.</p>
          `,
        });
      } catch (err) {
        console.error('❌ Email failed:', err.message);
        // Don't fail the route if email fails
        // Continue to send success response to client for the API call
      }

      // --- CRITICAL FIX: Send the updated order back to the client ---
      // This should be outside the email try-catch, but still within the main
      // outer try-catch for the entire shipping-price route.
      // Ensure 'updatedOrder' is populated correctly if needed by the frontend.
      const populatedUpdatedOrder = await Order.findById(
        updatedOrder._id
      ).populate('user', 'name email');

      res.send({
        message: 'Shipping price updated and invoice sent',
        order: populatedUpdatedOrder, // <-- Send the full updated order
      });
    } catch (outerError) {
      // This catch handles errors from Square API calls or initial order save
      console.error('❌ Unexpected Error:', outerError.message);
      res
        .status(500)
        .send({ message: 'Unexpected error in shipping invoice route.' });
    }
  })
);

orderRouter.put(
  '/:id/shipping-invoice-paid',
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send({ message: 'Order Not Found' });
    }

    order.shippingInvoicePaid = true;
    order.shippingPaidAt = Date.now();
    await order.save();

    res.send({ message: 'Shipping invoice marked as paid', order });
  })
);

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: 'Order Deleted' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

module.exports = orderRouter;
