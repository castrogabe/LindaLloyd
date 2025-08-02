import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../../models/orderModel.js';
import Product from '../../models/productModel.js';
import {
  isAuth,
  sendAdminSMS,
  transporter,
  payOrderEmailTemplate,
} from '../../utils.js';

const router = express.Router();

// PUT /:id/pay - Mark an order as paid
router.put(
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

// PUT /:id/shipping-invoice-paid - Mark a separate shipping invoice as paid
router.put(
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

export default router;
