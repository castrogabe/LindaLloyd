import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../../models/orderModel.js';

const router = express.Router();

// GET /sold - List of sold products
router.get(
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

export default router;
