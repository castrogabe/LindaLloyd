const express = require('express');
const asyncHandler = require('express-async-handler');
const HomeContent = require('../models/homeContentModel');
const { isAuth, isAdmin } = require('../utils.js');

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

module.exports = router;
