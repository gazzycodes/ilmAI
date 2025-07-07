const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const apiRoutes = require('./routes/api');
const logger = require('./utils/logger');
const processManager = require('./utils/processManager');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'LLMAI API is running' });
});

// API routes
app.use('/api', apiRoutes);

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Application error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Function to start server with port fallback
async function startServer(port) {
  try {
    // Find a free port
    const freePort = await processManager.findFreePort(port);
    
    const server = app.listen(freePort, () => {
      logger.info(`Server running on port ${freePort}`);
      logger.info(`Open your browser and navigate to http://localhost:${freePort}`);
    });

    // Handle server errors
    server.on('error', (err) => {
      logger.error('Server error:', err);
      process.exit(1);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      logger.info('Shutting down server...');
      server.close(() => {
        logger.info('Server shut down successfully');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer(PORT); 