const express = require('express');
const asyncHandler = require('express-async-handler');
const HomeContent = require('../models/homeContentModel');
const { isAuth, isAdmin } = require('../utils.js');

const homeRouter = express.Router(); // ✅ corrected name

// Fetch home content
homeRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const content = await HomeContent.findOne({});
    if (!content) {
      res.json({ title: '', description: '', jumbotronImages: [], h4Text: [] });
    } else {
      res.json(content);
    }
  })
);

// Update home content
homeRouter.put(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { title, description, jumbotronImages, h4Text } = req.body;
    const content = await HomeContent.findOneAndUpdate(
      {},
      { title, description, jumbotronImages, h4Text },
      { new: true, upsert: true }
    );
    res.json(content);
  })
);

module.exports = homeRouter; // ✅ export with correct name
