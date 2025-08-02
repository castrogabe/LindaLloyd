import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../../models/orderModel.js';
import { isAuth, isAdmin } from '../../utils.js';

const router = express.Router();

// GET /:id - Fetch a single order by its ID
router.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

// DELETE /:id - Delete an order
router.delete(
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

export default router;
