import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { randomUUID } from 'crypto';
import { Client, Environment, ApiError } from 'square';
import Order from '../../models/orderModel.js';
import {
  isAuth,
  isAdmin,
  transporter,
  getImageUrl,
  bigIntReplacer,
  shipOrderEmailTemplate,
  sendShippingConfirmationEmail,
  shippingInvoiceEmailTemplate,
} from '../../utils.js';
import config from '../../config.js';
import { getTaxRate } from '../../taxRateIndex.js';

const router = express.Router();

// Initialize Square Client directly here (no services folder)
const squareClient = new Client({
  environment: config.isLive ? Environment.Production : Environment.Sandbox,
  accessToken: config.square.accessToken,
});

const ordersApi = squareClient.ordersApi;
const invoicesApi = squareClient.invoicesApi;
const customersApi = squareClient.customersApi;

// --- PUT /:id/shipped --- mark flat-rate shipping as shipped
router.put(
  '/:id/shipped',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );
    if (!order) return res.status(404).send({ message: 'Order Not Found' });

    if (order.shippingInvoiceUrl && !order.shippingInvoicePaid) {
      return res.status(400).json({
        message:
          'Shipping invoice must be paid before shipment can be confirmed.',
      });
    }

    const { deliveryDays, carrierName, trackingNumber } = req.body;
    if (!deliveryDays || !carrierName || !trackingNumber) {
      return res
        .status(400)
        .json({ message: 'All shipping fields are required.' });
    }

    order.flatRateShippingDetails = {
      isShipped: true,
      shippedAt: new Date(),
      deliveryDays,
      carrierName,
      trackingNumber,
    };

    order.isFullyShipped =
      (order.invoiceShippingDetails?.isShipped || false) &&
      (order.flatRateShippingDetails?.isShipped || false);

    try {
      const updatedOrder = await order.save();
      await sendShippingConfirmationEmail(req, updatedOrder, 'flatRate');
      res.send({ message: 'Order Shipped', order: updatedOrder });
    } catch (error) {
      console.error('❌ Error shipping order:', error);
      res.status(500).send({ message: 'Failed to ship order' });
    }
  })
);

// --- PUT /:id/mark-invoice-shipped --- mark invoice shipping items as shipped
router.put(
  '/:id/mark-invoice-shipped',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );
    if (!order) return res.status(404).send({ message: 'Order not found' });

    const { carrierName, trackingNumber, deliveryDays } = req.body;
    if (!deliveryDays || !carrierName || !trackingNumber) {
      return res
        .status(400)
        .json({ message: 'All shipping fields are required.' });
    }

    order.invoiceShippingDetails = {
      isShipped: true,
      shippedAt: new Date(),
      carrierName,
      trackingNumber,
      deliveryDays,
    };

    order.isFullyShipped =
      (order.invoiceShippingDetails?.isShipped || false) &&
      (order.flatRateShippingDetails?.isShipped || false);

    try {
      const updatedOrder = await order.save(); // Optionally send email here
      await sendShippingConfirmationEmail(req, updatedOrder, 'invoice');
      res.send({
        message: 'Invoice items marked as shipped',
        order: updatedOrder,
      });
    } catch (error) {
      console.error('❌ Failed to mark invoice items as shipped:', error);
      res.status(500).send({ message: 'Failed to mark invoice items shipped' });
    }
  })
);

// --- PUT /:id/shipping-price --- create and send separate shipping invoice via Square
router.put(
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

    const separateShippingPrice = Number(req.body.shippingPrice) || 0;

    // Update order shipping prices and totals
    order.separateShippingPrice = separateShippingPrice;
    order.shippingPrice =
      (Number(order.flatShippingPrice) || 0) + separateShippingPrice;
    order.totalPrice =
      (Number(order.itemsPrice) || 0) +
      (Number(order.taxPrice) || 0) +
      order.shippingPrice;

    await order.save();

    // Create or retrieve Square customer
    let customerId;
    try {
      const customerResponse = await customersApi.createCustomer({
        givenName: order.user.name,
        emailAddress: order.user.email,
      });
      customerId = customerResponse.result.customer?.id;

      if (!customerId) {
        console.error('❌ No customer ID returned by Square');
        return res
          .status(500)
          .send({ message: 'Square customer creation returned no ID' });
      }
      console.log('✅ Square customer created:', customerId);
    } catch (err) {
      console.error('❌ Failed to create Square customer:', err);
      return res
        .status(500)
        .send({ message: 'Square customer creation failed' });
    }

    // Create Square order for shipping invoice
    let squareOrderId;
    try {
      const squareOrderResponse = await ordersApi.createOrder({
        idempotencyKey: `${order._id}-shipping-${Date.now()}`,
        order: {
          locationId: config.square.locationId,
          lineItems: [
            {
              name: `Shipping for Order ${order._id}`,
              quantity: '1',
              basePriceMoney: {
                amount: Math.round(separateShippingPrice * 100),
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
      console.error('❌ Failed to create Square order:', err);
      return res.status(500).send({ message: 'Square order creation failed' });
    }

    // Create and publish invoice
    let invoiceCreated, publishedInvoice;
    try {
      const dueDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const invoicePayload = {
        invoice: {
          locationId: config.square.locationId,
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

      invoiceCreated = await invoicesApi.createInvoice(invoicePayload);
      console.log(
        '✅ Invoice Created:',
        JSON.stringify(invoiceCreated.result.invoice, bigIntReplacer, 2)
      );

      const publishPayload = {
        version: invoiceCreated.result.invoice.version,
        idempotencyKey: `${order._id}-publish-${Date.now()}`,
      };

      publishedInvoice = await invoicesApi.publishInvoice(
        invoiceCreated.result.invoice.id,
        publishPayload
      );
      console.log(
        '✅ Invoice Published:',
        publishedInvoice.result.invoice.publicUrl
      );
    } catch (err) {
      console.error('❌ Failed to create or publish invoice:', err);
      if (err instanceof ApiError) {
        console.error(
          '🔍 Square API Error:',
          JSON.stringify(err.result, bigIntReplacer, 2)
        );
      }
      return res.status(500).send({
        message: 'Invoice creation or publish failed',
        error: err.message,
      });
    }

    // Update order with invoice URL and sent status
    order.shippingInvoiceUrl = publishedInvoice.result.invoice.publicUrl;
    order.shippingInvoiceSent = true;
    const updatedOrder = await order.save();

    // Send email notification with invoice link
    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US');
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
          <p><a href="${
            order.shippingInvoiceUrl
          }" style="font-size:16px;color:#3366cc;">Pay Shipping Charge</a></p>
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
      // Do not fail route on email error
    }

    // Send updated order to client
    const populatedOrder = await Order.findById(updatedOrder._id).populate(
      'user',
      'name email'
    );
    res.send({
      message: 'Shipping price updated and invoice sent',
      order: populatedOrder,
    });
  })
);

// --- PUT /:id/separate-shipping --- update separate shipping details (carrier, tracking, delivery days)
router.put(
  '/:id/separate-shipping',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send({ message: 'Order not found' });

    const { carrierName, trackingNumber, deliveryDays } = req.body;
    if (!deliveryDays || !carrierName || !trackingNumber) {
      return res
        .status(400)
        .json({ message: 'All shipping fields are required.' });
    }

    order.separateShippingDetails = {
      carrierName,
      trackingNumber,
      deliveryDays,
    };

    await order.save();
    res.send({ message: 'Separate shipping details updated', order });
  })
);

// --- PUT /:id/mark-flat-rate-shipped --- mark flat-rate shipping as shipped
router.put(
  '/:id/mark-flat-rate-shipped',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );
    if (!order) return res.status(404).send({ message: 'Order not found' });

    const { carrierName, trackingNumber, deliveryDays } = req.body;
    if (!deliveryDays || !carrierName || !trackingNumber) {
      return res
        .status(400)
        .json({ message: 'All shipping fields are required.' });
    }

    order.flatRateShippingDetails = {
      isShipped: true,
      shippedAt: new Date(),
      carrierName,
      trackingNumber,
      deliveryDays,
    };

    order.isFullyShipped =
      (order.invoiceShippingDetails?.isShipped || false) &&
      (order.flatRateShippingDetails?.isShipped || false);

    try {
      const updatedOrder = await order.save();
      await sendShippingConfirmationEmail(req, updatedOrder, 'flatRate');
      res.send({
        message: 'Flat rate shipment marked as shipped',
        order: updatedOrder,
      });
    } catch (error) {
      console.error('❌ Failed to mark flat-rate shipment as shipped:', error);
      res.status(500).send({ message: 'Failed to ship flat-rate items' });
    }
  })
);

// --- GET /test-shipping-email --- send test emails for shipping notification
router.get(
  '/test-shipping-email',
  expressAsyncHandler(async (req, res) => {
    const fakeOrder = {
      _id: 'TEST123',
      user: { name: 'Gabe', email: 'gabewebdevelopment@gmail.com' },
      createdAt: new Date(),
      invoiceShippingDetails: {
        deliveryDays: '7',
        carrierName: 'FEDX',
        trackingNumber: 'INV12345',
        isShipped: true,
        shippedAt: new Date(),
      },
      flatRateShippingDetails: {
        deliveryDays: '3',
        carrierName: 'USPS',
        trackingNumber: 'FLAT67890',
        isShipped: true,
        shippedAt: new Date(),
      },
      shippingAddress: {
        fullName: 'Test User',
        address: '123 Test St',
        city: 'Testville',
        states: 'CA',
        country: 'US',
        postalCode: '90210',
      },
      orderItems: [
        {
          name: 'Ceramic Jar',
          quantity: 1,
          price: 50,
          image: '/images/1.png',
          requiresShippingInvoice: true,
          useFlatRateShipping: false,
          shippingCharge: 0,
        },
        {
          name: 'Apollo Bust',
          quantity: 1,
          price: 50,
          image: '/images/5.png',
          requiresShippingInvoice: false,
          useFlatRateShipping: true,
          shippingCharge: 20,
        },
      ],
      itemsPrice: 100,
      taxPrice: 10,
      shippingPrice: 20,
      totalPrice: 130,
      paymentMethod: 'Square',
    };

    try {
      await sendShippingConfirmationEmail(req, fakeOrder, 'invoice');
      await sendShippingConfirmationEmail(req, fakeOrder, 'flatRate');

      res.send('✅ Test shipping emails triggered');
    } catch (err) {
      console.error('❌ Test email failed:', err);
      res.status(500).send('❌ Email failed');
    }
  })
);

export default router;
