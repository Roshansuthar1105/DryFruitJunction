const path = require('path');
require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');

// Route files
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const VisitorRoutes = require('./routes/VisitorRoutes');
// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/visitors', VisitorRoutes);
// Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Mount routers (add this after other router mounts)
// Error handler middleware
// app.use(errorHandler);

module.exports = app;