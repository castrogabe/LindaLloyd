import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs'; // Import the fs module
import { isAdmin, isAuth } from '../utils.js';

const uploadRouter = express.Router();

// Use /var/data/uploads for Render (production) and ./uploads for local development
const isProduction = process.env.NODE_ENV === 'production';
const uploadDir = isProduction ? '/var/data/uploads' : 'uploads';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir); // Use the appropriate directory based on environment
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Ensure the upload directory exists
try {
  if (!fs.existsSync(uploadDir)) {
    console.log(`Creating upload directory at ${uploadDir}`);
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (error) {
  console.error('Failed to create upload directory:', error.message);
  throw new Error('Upload directory setup failed');
}

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

uploadRouter.post('/', isAuth, isAdmin, upload.single('file'), (req, res) => {
  if (!req.file) {
    // Handle missing file error
    return res.status(400).send({ message: 'No file uploaded.' });
  }

  // Log the uploaded file path for debugging
  // console.log('Uploaded file path:', req.file.path);

  // Construct the full URL
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${
    req.file.filename
  }`;

  // Respond with both the relative path and full URL
  res.send({
    relativePath: `/uploads/${req.file.filename}`,
    url: fileUrl,
  });
});

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
