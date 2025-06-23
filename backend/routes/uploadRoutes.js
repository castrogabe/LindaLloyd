const express = require('express');
const multer = require('multer');
const path = require('path');
const { isAdmin, isAuth } = require('../utils.js');
const fs = require('fs');
const Product = require('../models/productModel.js');

const uploadRouter = express.Router();

// Use /var/data/uploads for Render (production) and ./uploads for local development
const isProduction = process.env.NODE_ENV === 'production';
const uploadDir = isProduction ? '/var/data/uploads' : 'uploads';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const cleanFilename = file.originalname
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_.-]/g, ''); // Remove unsafe characters

    const filename = `${file.fieldname}-${Date.now()}-${cleanFilename}`;
    cb(null, filename);
  },
});

// Ensure the upload directory exists
try {
  if (!fs.existsSync(uploadDir)) {
    console.log(`Creating upload directory at ${uploadDir}`);
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (error) {
  console.error('Failed to create upload directory:', error);
}

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only! (JPG, JPEG, PNG, GIF allowed)'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Upload multiple images endpoint
uploadRouter.post(
  '/',
  isAuth,
  isAdmin,
  upload.array('files', 10),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: 'No files uploaded.' });
    }

    // Map through uploaded files and return their paths
    const fileUrls = req.files.map((file) => `/uploads/${file.filename}`);

    res.send({ urls: fileUrls });
  }
);

// Ensure upload directory and subdirectories exist
const categoryUploadPath = path.join(uploadDir, 'categories');

try {
  if (!fs.existsSync(uploadDir)) {
    console.log(`Creating base upload directory at ${uploadDir}`);
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  if (!fs.existsSync(categoryUploadPath)) {
    console.log(`Creating categories directory at ${categoryUploadPath}`);
    fs.mkdirSync(categoryUploadPath, { recursive: true });
  }
} catch (error) {
  console.error('Failed to create upload directories:', error.message);
}

// Upload single category image
uploadRouter.post(
  '/category',
  isAuth,
  isAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded.' });
      }

      const { categoryId } = req.body;
      if (!categoryId) {
        return res.status(400).send({ message: 'Category ID is required' });
      }

      const oldPath = req.file.path;
      const newPath = path.join(categoryUploadPath, req.file.filename);

      // Move the file
      fs.rename(oldPath, newPath, async (err) => {
        if (err) {
          console.error('Error moving file:', err);
          return res.status(500).send({ message: 'File move failed.' });
        }

        const fileUrl = `/uploads/categories/${req.file.filename}`;

        // ✅ Update all products in that category with new image
        const updated = await Product.updateMany(
          { category: categoryId },
          { $set: { categoryImage: fileUrl } }
        );

        res.send({
          image: fileUrl,
          message: `Category image updated for ${updated.modifiedCount} product(s).`,
        });
      });
    } catch (err) {
      console.error('Upload category image error:', err);
      res.status(500).send({ message: 'Failed to upload category image' });
    }
  }
);

// DELETE category image from DB and disk
uploadRouter.put(
  '/category/:categoryId/remove-image',
  isAuth,
  isAdmin,
  async (req, res) => {
    try {
      const { categoryId } = req.params;

      // Find one product with this category to get the image path
      const oneProduct = await Product.findOne({ category: categoryId });
      if (!oneProduct || !oneProduct.categoryImage) {
        return res.status(404).send({ message: 'Category image not found' });
      }

      const categoryImagePath = oneProduct.categoryImage; // e.g. '/uploads/categories/accessories.png'

      // Construct full server path
      const filename = path.basename(categoryImagePath);
      const imagePath = path.join('/var/data/uploads/categories', filename);

      // Delete file if it exists
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted: ${imagePath}`);
      }

      // Remove categoryImage field from all products in that category
      const updated = await Product.updateMany(
        { category: categoryId },
        { $unset: { categoryImage: '' } }
      );

      res.send({
        message: `Image removed and ${updated.modifiedCount} product(s) updated.`,
      });
    } catch (err) {
      console.error('Error removing category image:', err);
      res.status(500).send({ message: 'Failed to remove category image' });
    }
  }
);

uploadRouter.put(
  '/category/:categoryId/image',
  isAuth,
  isAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      const { categoryId } = req.params;

      if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded.' });
      }

      // Move uploaded file to categories folder
      const uploadDir =
        process.env.NODE_ENV === 'production'
          ? '/var/data/uploads/categories'
          : 'uploads/categories';
      const filename = `${req.file.fieldname}-${Date.now()}${path.extname(
        req.file.originalname
      )}`;
      const destPath = path.join(uploadDir, filename);

      // Ensure directory exists
      fs.mkdirSync(uploadDir, { recursive: true });
      fs.renameSync(req.file.path, destPath);

      const imageUrl = `/uploads/categories/${filename}`;

      // ✅ Update all products with this category
      const result = await Product.updateMany(
        { category: categoryId },
        { $set: { categoryImage: imageUrl } }
      );
      res.send({
        image: imageUrl,
        message: `${result.modifiedCount} product(s) updated with new category image.`,
      });
    } catch (err) {
      console.error('Failed to update category image:', err);
      res.status(500).send({ message: 'Category image update failed.' });
    }
  }
);

uploadRouter.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).send({ message: 'File upload error: ' + err.message });
  } else if (err) {
    res.status(400).send({ message: err.message });
  } else {
    next();
  }
});

module.exports = uploadRouter;
