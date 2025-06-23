const express = require('express');
const asyncHandler = require('express-async-handler');
const ProductMagContent = require('../models/productMagContentModel');
const { isAuth, isAdmin } = require('../utils.js');

const productMagRouter = express.Router();

// Fetch productMag content
productMagRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const content = await ProductMagContent.findOne({});
    res.json(content);
  })
);

// Update productMag content
productMagRouter.put(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { sections } = req.body;
    const content = await ProductMagContent.findOneAndUpdate(
      {},
      { sections },
      { new: true, upsert: true }
    );
    res.json(content);
  })
);

module.exports = productMagRouter;
