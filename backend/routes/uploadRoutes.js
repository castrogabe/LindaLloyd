import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Product from '../models/productModel.js';
import { fileURLToPath } from 'url';
import { isAuth, isAdmin } from '../utils.js';

// Needed for __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadRouter = express.Router();

// Use /var/data/uploads for Render (production) and ./uploads for local dev
const isProduction = process.env.NODE_ENV === 'production';
const uploadDir = isProduction
  ? '/var/data/uploads'
  : path.join(__dirname, '../uploads');

// Configure multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const cleanFilename = file.originalname
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_.-]/g, '');
    const filename = `${file.fieldname}-${Date.now()}-${cleanFilename}`;
    cb(null, filename);
  },
});

// Ensure upload directories exist
try {
  if (!fs.existsSync(uploadDir)) {
    console.log(`Creating upload directory at ${uploadDir}`);
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (error) {
  console.error('Failed to create upload directory:', error);
}

// File type filter
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) cb(null, true);
  else cb(new Error('Images only! (JPG, JPEG, PNG, GIF allowed)'));
}

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => checkFileType(file, cb),
});

// Upload multiple images
uploadRouter.post(
  '/',
  isAuth,
  isAdmin,
  upload.array('files', 10),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: 'No files uploaded.' });
    }
    const fileUrls = req.files.map((file) => `/uploads/${file.filename}`);
    res.send({ urls: fileUrls });
  }
);

// Category upload directory
const categoryUploadPath = path.join(uploadDir, 'categories');
try {
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

      fs.rename(oldPath, newPath, async (err) => {
        if (err) {
          console.error('Error moving file:', err);
          return res.status(500).send({ message: 'File move failed.' });
        }

        const fileUrl = `/uploads/categories/${req.file.filename}`;
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

// Remove category image
uploadRouter.put(
  '/category/:categoryId/remove-image',
  isAuth,
  isAdmin,
  async (req, res) => {
    try {
      const { categoryId } = req.params;
      const oneProduct = await Product.findOne({ category: categoryId });
      if (!oneProduct?.categoryImage) {
        return res.status(404).send({ message: 'Category image not found' });
      }

      const filename = path.basename(oneProduct.categoryImage);
      const imagePath = path.join(
        isProduction ? '/var/data/uploads/categories' : categoryUploadPath,
        filename
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted: ${imagePath}`);
      }

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

// Upload new category image by ID (renames file)
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

      const destDir = isProduction
        ? '/var/data/uploads/categories'
        : path.join(__dirname, '../uploads/categories');

      const filename = `${req.file.fieldname}-${Date.now()}${path.extname(
        req.file.originalname
      )}`;
      const destPath = path.join(destDir, filename);

      fs.mkdirSync(destDir, { recursive: true });
      fs.renameSync(req.file.path, destPath);

      const imageUrl = `/uploads/categories/${filename}`;
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

// Multer error handler
uploadRouter.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).send({ message: 'File upload error: ' + err.message });
  } else if (err) {
    res.status(400).send({ message: err.message });
  } else {
    next();
  }
});

export default uploadRouter;
