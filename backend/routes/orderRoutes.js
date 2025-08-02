import express from 'express';
import adminRoutes from './orderRoutes/AdminRoutes.js';
import orderCreateRoutes from './orderRoutes/OrderCreateRoutes.js';
import orderDetailsRoutes from './orderRoutes/OrderDetailsRoutes.js';
import orderMineRoutes from './orderRoutes/OrderMineRoutes.js';
import orderPaymentRoutes from './orderRoutes/OrderPaymentRoutes.js';
import orderSoldRoutes from './orderRoutes/OrderSoldRoutes.js';
import orderSummaryRoutes from './orderRoutes/OrderSummaryRoutes.js';
import adminShippingRoutes from './orderRoutes/AdminShippingRoutes.js';
import testRoutes from './orderRoutes/TestRoutes.js';

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
