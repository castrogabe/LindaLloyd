import express from 'express';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import { isAuth, isAdmin } from '../utils.js';
import AboutContent from '../models/aboutContentModel.js';

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

const aboutRouter = express.Router();

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
    res.json({ jumbotronImage: content.jumbotronImage });
  })
);

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
aboutRouter.put(
  '/',
  isAuth,
  isAdmin,
  upload.array('images', 10), // Allow multiple images to be uploaded at once
  asyncHandler(async (req, res) => {
    const { sections } = req.body;

    // Map through sections and update images if new files are provided
    const updatedSections = sections.map((section, sectionIndex) => {
      const images = section.images.map((image, imgIndex) => {
        const uploadedFile = req.files && req.files[imgIndex];

        return {
          url: uploadedFile ? `/uploads/${uploadedFile.filename}` : image.url,
          name: image.name || '',
        };
      });

      return { ...section, images };
    });

    const content = await AboutContent.findOneAndUpdate(
      {},
      { sections: updatedSections },
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

export default aboutRouter;
