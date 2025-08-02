// routes/orderRoutes/AdminRoutes.js
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../../models/orderModel.js';
import User from '../../models/userModel.js'; // Required for User.aggregate
import {
  isAuth,
  isAdmin,
  transporter,
  payOrderEmailTemplate,
  sendShippingConfirmationEmail,
} from '../../utils.js';

const router = express.Router();

const PAGE_SIZE = 12; // Consider moving this to a global config/constants file

// GET /admin - Admin-specific paginated order list
router.get(
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

// GET / - Admin, all orders (simple list)
router.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name');
    res.send(orders);
  })
);

// Resend purchase confirmation email
router.put(
  '/:id/resend-purchase-confirmation',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );
    if (!order) return res.status(404).send({ message: 'Order Not Found' });

    try {
      const customerEmail = order.user.email;
      const emailContent = {
        from: 'lindalloydantiques@gmail.com',
        to: customerEmail,
        subject: `Order Confirmation for ${order._id}`,
        html: payOrderEmailTemplate(order),
      };
      await transporter.sendMail(emailContent);
      res.send({ message: 'Purchase confirmation email resent' });
    } catch (err) {
      console.error('Resend email error:', err);
      res.status(500).send({
        message: 'Failed to resend purchase confirmation email',
        error: err.message,
      });
    }
  })
);

// Resend flat-rate shipping confirmation email
router.put(
  '/:id/resend-flat-rate-shipping',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );
    if (!order) return res.status(404).send({ message: 'Order Not Found' });

    try {
      await sendShippingConfirmationEmail(req, order, 'flatRate');
      res.send({ message: 'Flat rate shipping confirmation email resent' });
    } catch (err) {
      console.error('Resend email error:', err);
      res.status(500).send({
        message: 'Failed to resend flat rate shipping email',
        error: err.message,
      });
    }
  })
);

// Resend invoice shipping confirmation email
router.put(
  '/:id/resend-invoice-shipping',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );
    if (!order) return res.status(404).send({ message: 'Order Not Found' });

    try {
      await sendShippingConfirmationEmail(req, order, 'invoice');
      res.send({ message: 'Invoice shipping confirmation email resent' });
    } catch (err) {
      console.error('Resend email error:', err);
      res.status(500).send({
        message: 'Failed to resend invoice shipping email',
        error: err.message,
      });
    }
  })
);

export default router;
