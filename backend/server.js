import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import config from './config.js';
import fs from 'fs';
import seedRouter from './routes/seedRoutes.js';
import stripeRouter from './routes/stripeRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import emailRouter from './routes/emailRoutes.js';
import homeContentRouter from './routes/homeContentRoutes.js';
import aboutRouter from './routes/aboutRoutes.js';
import designRouter from './routes/designRoutes.js';
import faqRouter from './routes/faqRoutes.js';
import productMagContentRouter from './routes/productMagContentRoutes.js';
import cors from 'cors';
import { fileURLToPath } from 'url';

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine whether we're in production or development
const isProduction = process.env.NODE_ENV === 'production';

// Use /var/data/uploads for Render (production) and ./uploads for local development
const uploadDir = isProduction
  ? '/var/data/uploads'
  : path.join(__dirname, 'uploads');

// Ensure the upload directory exists
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    fs.chmodSync(uploadDir, 0o777); // Grant full permissions
  }
} catch (error) {
  console.error('Failed to create upload directory:', error.message);
  throw new Error('Upload directory setup failed');
}

const app = express();

// Endpoint to list uploaded files (for debugging)
app.get('/list-uploads', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory');
    }
    res.send(files);
  });
});

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log('connected to db');
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB Connection Error:', err.message);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/paypal', (req, res) => {
  res.send(config.PAYPAL_CLIENT_ID || 'sb');
});

app.use('/uploads', express.static('/var/data/uploads')); // This should serve the uploads folder from the persistent disk

app.use(
  cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Allow credentials to be sent with requests
  })
);

// Routes
app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/messages', messageRouter);
app.use('/api/emails', emailRouter);
app.use('/api/homecontent', homeContentRouter);
app.use('/api/about', aboutRouter);
app.use('/api/design', designRouter);
app.use('/api/faqs', faqRouter);
app.use('/api/productmagcontent', productMagContentRouter);

// This must come before your React app routing
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// React app serving
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = config.PORT || 8000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
