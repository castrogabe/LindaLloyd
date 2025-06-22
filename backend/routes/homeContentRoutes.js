import express from 'express';
import asyncHandler from 'express-async-handler';
import HomeContent from '../models/homeContentModel.js';
import { isAuth, isAdmin } from '../utils.js';

const router = express.Router();

// Fetch home content
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const content = await HomeContent.findOne({});
    if (!content) {
      res.json({ title: '', description: '', jumbotronText: [], h4Text: [] });
    } else {
      res.json(content);
    }
  })
);

// Update home content
router.put(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { title, description, jumbotronText, h4Text } = req.body;
    const content = await HomeContent.findOneAndUpdate(
      {},
      { title, description, jumbotronText, h4Text },
      { new: true, upsert: true }
    );
    res.json(content);
  })
);

export default router;
