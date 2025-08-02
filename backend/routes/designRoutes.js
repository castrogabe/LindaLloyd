import express from 'express';
import asyncHandler from 'express-async-handler';
import DesignContent from '../models/designContentModel.js';
import { isAuth, isAdmin } from '../utils.js';

const designRouter = express.Router();

// GET /api/design - Fetch design content
designRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const content = await DesignContent.findOne({});
    res.json(content);
  })
);

// PUT /api/design - Update design content
designRouter.put(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { sections } = req.body;
    const content = await DesignContent.findOneAndUpdate(
      {},
      { sections },
      { new: true, upsert: true }
    );
    res.json(content);
  })
);

export default designRouter;
