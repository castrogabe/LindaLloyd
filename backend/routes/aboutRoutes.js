const express = require('express');
const asyncHandler = require('express-async-handler');
const AboutContent = require('../models/aboutContentModel');
const { isAuth, isAdmin } = require('../utils.js');

const router = express.Router();

// Fetch about content
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const content = await AboutContent.findOne({});
    res.json(content);
  })
);

// Update about content
router.put(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { sections } = req.body;
    const content = await AboutContent.findOneAndUpdate(
      {},
      { sections },
      { new: true, upsert: true }
    );
    res.json(content);
  })
);

module.exports = router;
