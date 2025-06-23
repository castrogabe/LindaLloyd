const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Order = require('../models/orderModel.js');
const User = require('../models/userModel.js');
const Product = require('../models/productModel.js');

const {
  isAuth,
  isAdmin,
  transporter,
  sendAdminSMS,
  payOrderEmailTemplate,
  shipOrderEmailTemplate,
  sendShippingConfirmationEmail,
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
    const orderNameFromFirstItem =
      req.body.orderItems?.[0]?.name || 'Unnamed Order';

    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
      orderName: orderNameFromFirstItem,
    });

    const order = await newOrder.save();

    const populatedOrder = await Order.findById(order._id).populate(
      'user',
      'name email'
    );

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
        id: req.body.id || 'square',
        status: req.body.status || 'COMPLETED',
        email_address: req.body.email_address || order.user.email,
      };

      // Update count in stock for each item in the order
      const updatedOrder = await order.save();
      for (const item of updatedOrder.orderItems) {
        const product = await Product.findById(item.product);
        product.countInStock -= item.quantity;
        product.sold += item.quantity;
        await product.save();
      }

      console.log('🧾 Order Name:', order.orderName);

      // Send SMS after payment is successful
      await sendAdminSMS({
        subject: `${updatedOrder.orderName} - New Paid Order`,
        message: `Total: $${updatedOrder.totalPrice.toFixed(2)}`,
        customerName: updatedOrder.user.name,
        imageUrl: 'https://lindalloyd.onrender.com/images/logo.png',
        orderName: updatedOrder.orderName,
      });

      // Send email notification based on payment method
      const customerEmail = order.user.email;
      const purchaseDetails = payOrderEmailTemplate(order);
      const emailContent = {
        from: 'lindalloydantantiques@gmail.com',
        to: customerEmail,
        subject: `Purchase Receipt from lindalloyd.com (via Square)`,
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
      res.status(404).send({ message: 'Order Not Found' });
      return;
    }

    order.isShipped = true;
    order.shippedAt = Date.now();
    order.deliveryDays = req.body.deliveryDays;
    order.carrierName = req.body.carrierName;
    order.trackingNumber = req.body.trackingNumber;

    const customerEmail = order.user.email;
    const shippingDetails = shipOrderEmailTemplate(order);

    const emailContent = {
      from: 'lindalloydantantiques@gmail.com',
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
