const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config.js');
const seedRouter = require('./routes/seedRoutes.js');
const productRouter = require('./routes/productRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const orderRouter = require('./routes/orderRoutes.js');
const uploadRouter = require('./routes/uploadRoutes.js');
const stripeRouter = require('./routes/stripeRoutes.js');
const messageRouter = require('./routes/messageRoutes.js');
const emailRouter = require('./routes/emailRoutes.js');
const aboutRouter = require('./routes/aboutRoutes.js');
const designRouter = require('./routes/designRoutes.js');
const faqRouter = require('./routes/faqRoutes.js');
const homeContentRouter = require('./routes/homeContentRoutes.js');
const productMagContentRouter = require('./routes/productMagContentRoutes.js');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/paypal', (req, res) => {
  res.send(config.PAYPAL_CLIENT_ID || 'sb');
});

// Serve the uploads directory statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Allow credentials to be sent with requests
  })
);

// routes
app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/messages', messageRouter);
app.use('/api/emails', emailRouter);
app.use('/api/about', aboutRouter);
app.use('/api/design', designRouter);
app.use('/api/faqs', faqRouter);
app.use('/api/homecontent', homeContentRouter);
app.use('/api/productmagcontent', productMagContentRouter);

// Serve frontend build directory
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(frontendBuildPath));
app.get('*', (req, res) =>
  res.sendFile(path.join(frontendBuildPath, 'index.html'))
);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: err.message });
});

const port = config.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
