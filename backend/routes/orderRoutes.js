const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Order = require('../models/orderModel.js');
const User = require('../models/userModel.js');
const Product = require('../models/productModel.js');
const {
  isAuth,
  isAdmin,
  payOrderEmailTemplate,
  shipOrderEmailTemplate,
  sendShippingConfirmationEmail,
  transporter,
} = require('../utils.js');

const orderRouter = express.Router();

const PAGE_SIZE = 12; // 12 items per page

orderRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const orders = await Order.find()
      .populate('user', 'name email') // Populate user with name and email
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

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order });
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
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
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
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
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
    const order = await Order.findById(req.params.id);
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
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      // Update count in stock for each item in the order
      const updatedOrder = await order.save();
      for (const index in updatedOrder.orderItems) {
        const item = updatedOrder.orderItems[index];
        const product = await Product.findById(item.product);
        product.countInStock -= item.quantity; // Subtract the value of item.quantity from countInStock
        product.sold += item.quantity;
        await product.save();
      }

      // Send email notification based on payment method
      const customerEmail = order.user.email;
      let emailContent = {}; // Define emailContent variable
      if (order.paymentMethod === 'PayPal') {
        // Define purchaseDetails for PayPal
        const purchaseDetails = payOrderEmailTemplate(order);
        emailContent = {
          from: 'lindalloydantantiques@gmail.com',
          to: customerEmail,
          subject: 'PayPal Purchase Receipt from lindalloyd.com', // email subject
          html: purchaseDetails,
        };
      } else if (order.paymentMethod === 'Stripe') {
        // Define purchaseDetails for Stripe
        const purchaseDetails = payOrderEmailTemplate(order);
        emailContent = {
          from: 'lindalloydantantiques@gmail.com',
          to: customerEmail,
          subject: 'Stripe Purchase Receipt from lindalloyd.com', // email subject
          html: purchaseDetails,
        };
      }
      try {
        // Send the email using the transporter
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

// ****************** send shipping confirmation email ************************************
orderRouter.put(
  '/:id/shipped',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order) {
      res.status(404).send({ message: 'Order Not Found' });
      return;
    }

    order.isShipped = true;
    order.shippedAt = Date.now();
    order.deliveryDays = req.body.deliveryDays;
    order.carrierName = req.body.carrierName;
    order.trackingNumber = req.body.trackingNumber;

    // send shipping confirmation email to customer when the order ships
    const customerEmail = order.user.email;
    const shippingDetails = shipOrderEmailTemplate(order);

    // Create email content for the shipping confirmation
    const emailContent = {
      from: 'lindalloydantantiques@gmail.com',
      to: customerEmail,
      subject: 'Shipping notification from lindalloyd.com', // email subject
      html: shippingDetails,
    };

    try {
      // Update and save the order
      const updatedOrder = await order.save();

      // console.log('Delivery Days:', order.deliveryDays);
      // console.log('Carrier Name:', order.carrierName);
      // console.log('Tracking Number:', order.trackingNumber);

      // Call the sendShippingConfirmationEmail function with the updatedOrder as an argument
      await sendShippingConfirmationEmail(req, updatedOrder);

      // Log a success message or do something else
      // console.log('Shipping confirmation email sent successfully.');

      res.send({ message: 'Order Shipped', order: updatedOrder });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).send({ message: 'Failed to ship order' });
    }
  })
);

// ***********************************************************************************

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
