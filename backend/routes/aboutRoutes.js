import express from 'express';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import AboutContent from '../models/aboutContentModel.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { isAuth, isAdmin } from '../utils.js';

const aboutRouter = express.Router();

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

const uploadDir = isProduction
  ? '/var/data/uploads'
  : path.join(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  fs.chmodSync(uploadDir, 0o777);
}

// Multer setup
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

// GET /api/about - Fetch about content
aboutRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const content = await AboutContent.findOne({});
    res.json(content);
  })
);

// PUT /api/about/jumbotron - Upload jumbotron image
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
      content = new AboutContent({
        sections: [],
        jumbotronImage: { url: imageUrl, name: req.file.originalname },
      });
    } else {
      content.jumbotronImage = { url: imageUrl, name: req.file.originalname };
    }

    await content.save();
    res.json({ jumbotronImage: content.jumbotronImage });
  })
);

// DELETE /api/about/jumbotron - Remove jumbotron image
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

// PUT /api/about - Replace sections
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

// PUT /api/about/section/:sectionIndex - Update specific section
aboutRouter.put(
  '/section/:sectionIndex',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { sectionIndex } = req.params;
    const updatedSection = req.body.section;

    const content = await AboutContent.findOne({});
    const index = parseInt(sectionIndex, 10);

    if (
      content &&
      Array.isArray(content.sections) &&
      index >= 0 &&
      index < content.sections.length
    ) {
      if (!updatedSection.images) {
        updatedSection.images = [];
      }
      content.sections[index] = updatedSection;
      await content.save();
      res.json({ message: 'Section updated successfully' });
    } else {
      res.status(404).json({ message: 'Section not found' });
    }
  })
);

export default aboutRouter;
