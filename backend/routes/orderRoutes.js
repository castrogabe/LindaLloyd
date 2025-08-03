import express from 'express';
import adminRoutes from './orderRoutes/adminRoutes.js';
import orderCreateRoutes from './orderRoutes/orderCreateRoutes.js';
import orderDetailsRoutes from './orderRoutes/orderDetailsRoutes.js';
import orderMineRoutes from './orderRoutes/orderMineRoutes.js';
import orderPaymentRoutes from './orderRoutes/orderPaymentRoutes.js';
import orderSoldRoutes from './orderRoutes/orderSoldRoutes.js';
import orderSummaryRoutes from './orderRoutes/orderSummaryRoutes.js';
import adminShippingRoutes from './orderRoutes/adminShippingRoutes.js';
import testRoutes from './orderRoutes/testRoutes.js';

const orderRouter = express.Router();

// === Use the modular routes. Order matters! ===
// General admin/summary/test/sold routes (more specific paths)
orderRouter.use('/', adminRoutes);
orderRouter.use('/', orderSoldRoutes);
orderRouter.use('/', orderSummaryRoutes);
orderRouter.use('/', orderMineRoutes); // '/mine' is specific
orderRouter.use('/', testRoutes);

// Order creation
orderRouter.use('/', orderCreateRoutes);

// Payment and Shipping actions (often target specific IDs)
orderRouter.use('/', orderPaymentRoutes);
orderRouter.use('/', adminShippingRoutes); // All admin shipping actions

// Specific order details and deletion (catch-all for /:id should be last)
orderRouter.use('/', orderDetailsRoutes);

export default orderRouter;
