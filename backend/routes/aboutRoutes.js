const express = require('express');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const { isAuth, isAdmin } = require('../utils.js');
const AboutContent = require('../models/aboutContentModel');
const path = require('path');
const fs = require('fs');

const aboutRouter = express.Router();

const isProduction = process.env.NODE_ENV === 'production';

const uploadDir = isProduction
  ? '/var/data/uploads'
  : path.join(__dirname, '../uploads');

// Ensure upload dir exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  fs.chmodSync(uploadDir, 0o777);
}

// ✅ Multer with diskStorage to /uploads or /var/data/uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Fetch about content
aboutRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const content = await AboutContent.findOne({});
    res.json(content);
  })
);

// Update Jumbotron Image
aboutRouter.put(
  '/jumbotron',
  isAuth,
  isAdmin,
  upload.single('jumbotronImage'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    let content = await AboutContent.findOne({});

    if (!content) {
      // Create a new document if none exists
      content = new AboutContent({
        sections: [],
        jumbotronImage: { url: imageUrl, name: req.file.originalname },
      });
    } else {
      // Update existing document's jumbotron image
      content.jumbotronImage = { url: imageUrl, name: req.file.originalname };
    }

    await content.save();

    // ✅ Ensure response includes full image object
    res.json({ jumbotronImage: content.jumbotronImage });
  })
);

// DELETE jumbotron
aboutRouter.delete(
  '/jumbotron',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const content = await AboutContent.findOne({});
    if (content) {
      content.jumbotronImage = null;
      await content.save();
      res.json({ message: 'Jumbotron image deleted successfully' });
    } else {
      res.status(404).json({ message: 'About content not found' });
    }
  })
);

// Update about content (with multiple image upload)
// PUT full content (optional multi-image support)
aboutRouter.put(
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

// Update a specific section by index
aboutRouter.put(
  '/section/:sectionIndex',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { sectionIndex } = req.params;
    const updatedSection = req.body.section;

    // Retrieve the current content document
    const content = await AboutContent.findOne({});
    if (content && content.sections[sectionIndex]) {
      // Initialize images array if it's missing
      if (!updatedSection.images) {
        updatedSection.images = [];
      }
      content.sections[sectionIndex] = updatedSection; // Update the specific section
      await content.save(); // Save the changes
      res.json({ message: 'Section updated successfully' });
    } else {
      res.status(404).json({ message: 'Section not found' });
    }
  })
);

module.exports = aboutRouter;
