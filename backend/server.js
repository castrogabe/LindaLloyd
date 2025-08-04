import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import fs from 'fs';
import cors from 'cors';
import config from './config.js';

// Route imports
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import emailRouter from './routes/emailRoutes.js';
import homeContentRouter from './routes/homeContentRoutes.js';
import aboutRouter from './routes/aboutRoutes.js';
import designRouter from './routes/designRoutes.js';
import faqRouter from './routes/faqRoutes.js';
import productMagContentRouter from './routes/productMagContentRoutes.js';
import subscribeRouter from './routes/subscribeRoutes.js';
import squareRouter from './routes/squareRoutes.js';
import taxRouter from './routes/taxRoutes.js';

// --- Setup ---
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Debug middleware ---
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/users/address')) {
    // console.log(`\n--- GLOBAL DEBUG: Request to ${req.originalUrl} ---`);
    // console.log('Timestamp:', new Date().toISOString());
    // console.log('Method:', req.method);
    // console.log(
    // 'Authorization Header:',
    //  req.headers.authorization ? 'Present' : 'Missing'
    // );
    // console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

const isProduction = process.env.NODE_ENV === 'production';
const __dirnameCustom = path.resolve();

const uploadDir = isProduction
  ? '/var/data/uploads'
  : path.join(__dirnameCustom, 'uploads');

const categoryUploadPath = path.join(uploadDir, 'categories');
if (!fs.existsSync(categoryUploadPath)) {
  fs.mkdirSync(categoryUploadPath, { recursive: true });
  fs.chmodSync(categoryUploadPath, 0o777);
}

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    fs.chmodSync(uploadDir, 0o777);
  }
} catch (error) {
  console.error('Failed to create upload directory:', error.message);
  throw new Error('Upload directory setup failed');
}

app.get('/list-uploads', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).send('Unable to scan directory');
    res.send(files);
  });
});

app.get('/debug-uploads', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res
        .status(500)
        .send({ message: 'Cannot list files', error: err.message });
    }
    res.send({ files });
  });
});

// --- DB connection ---
mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// --- Route mounting ---
app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRouter);
app.use('/api/emails', emailRouter);
app.use('/api/homecontent', homeContentRouter);
app.use('/api/about', aboutRouter);
app.use('/api/design', designRouter);
app.use('/api/faqs', faqRouter);
app.use('/api/productmagcontent', productMagContentRouter);
app.use('/api/subscribe', subscribeRouter);
app.use('/api/tax', taxRouter);
app.use('/api/square', squareRouter);

// --- Serve frontend ---
const rootDir = path.resolve();

app.use(express.static(path.join(rootDir, 'frontend', 'build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(rootDir, 'frontend', 'build', 'index.html'))
);

// --- Error handler ---
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// --- Start server ---
const port = config.PORT || 8000;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
