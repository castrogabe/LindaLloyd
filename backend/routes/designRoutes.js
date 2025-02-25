const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const DesignContent = require('../models/designContentModel');
const { isAuth, isAdmin } = require('../utils.js');

const designRouter = express.Router();

// Fetch design content
designRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const content = await DesignContent.findOne({});
    res.json(content);
  })
);

// Update design content
designRouter.put(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { sections } = req.body;
    const content = await DesignContent.findOneAndUpdate(
      {},
      { sections },
      { new: true, upsert: true }
    );
    res.json(content);
  })
);

module.exports = designRouter;
