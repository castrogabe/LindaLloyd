import express from 'express';
import asyncHandler from 'express-async-handler';
import FaqContent from '../models/faqContentModel.js';
import { isAuth, isAdmin } from '../utils.js';

const router = express.Router();

// Fetch FAQ content
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const content = await FaqContent.findOne({});
    res.json(content);
  })
);

// Update FAQ content
router.put(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { faqs } = req.body;
    const content = await FaqContent.findOneAndUpdate(
      {},
      { faqs },
      { new: true, upsert: true }
    );
    res.json(content);
  })
);

export default router;
