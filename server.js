/**
 * Main server file for the day planning application
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { getDbConnection } = require('./database/connection');
require('dotenv').config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

// Create data directory if it doesn't exist
const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create log directory if it doesn't exist
const logDir = path.resolve(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Import API routes
const { router: authRouter, authenticateToken } = require('./api/auth');
const usersRouter = require('./api/users');
const activitiesRouter = require('./api/activities');

// API routes
app.use('/api/auth', authRouter);

// Public routes (no authentication required)
app.use('/api/users', usersRouter);
app.use('/api/activities', activitiesRouter);

// Protected routes (require authentication)
app.use('/api/admin/users', authenticateToken, usersRouter);
app.use('/api/admin/activities', authenticateToken, activitiesRouter);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const db = await getDbConnection();
    await db.get('SELECT 1');
    res.json({ 
      status: 'ok', 
      message: 'Server is running and database is connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Test endpoint to check if the server is running
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working correctly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('=========================================');
  console.log('Day Planning Application Server');
  console.log('Developed by: Jesse Hummel, Remco Pruim, Tjitte Timmerman, Casper Oudman');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database path: ${process.env.DB_PATH || path.join(dataDir, 'day-planning-app.db')}`);
  console.log('=========================================');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Write to error log file
  const timestamp = new Date().toISOString();
  const errorLogPath = path.join(logDir, 'uncaught-exceptions.log');
  fs.appendFileSync(errorLogPath, `[${timestamp}] ${error.stack}\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Write to error log file
  const timestamp = new Date().toISOString();
  const errorLogPath = path.join(logDir, 'unhandled-rejections.log');
  fs.appendFileSync(errorLogPath, `[${timestamp}] Reason: ${reason}\n`);
});