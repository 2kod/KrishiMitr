const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const runMigration = require('./db/migrate');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const mandiRoutes = require('./routes/mandiRoutes');
const scanRoutes = require('./routes/scanRoutes');
const storeRoutes = require('./routes/storeRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded leaf images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'KrishiMitra PERN API Gateway',
    timestamp: new Date().toISOString(),
    postgres: 'connected'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/mandi', mandiRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/store', storeRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Express server after ensuring DB schema is ready
runMigration()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 KrishiMitra Express API Server running on http://localhost:${PORT}`);
      console.log(`📋 API Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('Fatal: Could not initialize database before server start', err);
    process.exit(1);
  });
