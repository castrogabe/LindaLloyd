import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../../models/orderModel.js';
import { isAuth } from '../../utils.js';

const router = express.Router();

// GET /mine - Orders specific to the authenticated user's OrderHistory
router.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.send(
      orders.map((order) => ({
        _id: order._id,
        createdAt: order.createdAt,
        itemsPrice: order.itemsPrice,
        taxPrice: order.taxPrice,
        shippingPrice: order.shippingPrice,
        totalPrice: order.totalPrice,
        isPaid: order.isPaid,
        paidAt: order.paidAt,
        paymentMethod: order.paymentMethod,
        orderItems: order.orderItems,
        shippingAddress: order.shippingAddress,
        invoiceShippingDetails: order.invoiceShippingDetails || {},
        flatRateShippingDetails: order.flatRateShippingDetails || {},
        isFullyShipped: order.isFullyShipped,
        separateShippingPrice: order.separateShippingPrice,
        shippingPaidAt: order.shippingPaidAt,
      }))
    );
  })
);

export default router;
