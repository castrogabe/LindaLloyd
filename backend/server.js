const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const config = require('./config.js');
const seedRouter = require('./routes/seedRoutes.js');
const productRouter = require('./routes/productRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const orderRouter = require('./routes/orderRoutes.js');
const uploadRouter = require('./routes/uploadRoutes.js');
const messageRouter = require('./routes/messageRoutes.js');
const emailRouter = require('./routes/emailRoutes.js');
const homeContentRouter = require('./routes/homeContentRoutes.js');
const aboutRouter = require('./routes/aboutRoutes.js');
const designRouter = require('./routes/designRoutes.js');
const faqRouter = require('./routes/faqRoutes.js');
const productMagContentRouter = require('./routes/productMagContentRoutes.js');
const subscribeRouter = require('./routes/subscribeRoutes.js');
const squareRouter = require('./routes/squareRoutes.js');

const app = express();

const isProduction = process.env.NODE_ENV === 'production';
const __dirnameCustom = path.resolve(); // Use path.resolve() for CommonJS

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
    if (err) {
      return res.status(500).send('Unable to scan directory');
    }
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

mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
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

app.use('/uploads', express.static(uploadDir));

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Routes
app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/messages', messageRouter);
app.use('/api/emails', emailRouter);
app.use('/api/homecontent', homeContentRouter);
app.use('/api/about', aboutRouter);
app.use('/api/design', designRouter);
app.use('/api/faqs', faqRouter);
app.use('/api/productmagcontent', productMagContentRouter);
app.use('/api/subscribe', subscribeRouter);
app.use('/api/square', squareRouter);

// React app serving
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
);

// Error middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Start server
const port = config.PORT || 8000;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
