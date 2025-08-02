import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { sendAdminSMS } from '../../utils.js';

const router = express.Router();

// GET /test-sms - Test SMS functionality
router.get(
  '/test-sms',
  expressAsyncHandler(async (req, res) => {
    await sendAdminSMS({
      subject: `Test Order - New Paid Order`,
      message: `Total: $99.99`,
      customerName: 'Test User',
      orderName: 'Order #Test',
    });
    res.send({ message: 'Test SMS sent' });
  })
);

export default router;
