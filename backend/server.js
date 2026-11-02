const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { testConnection, pool } = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigin === '*' ? '*' : allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root route for quick verification
app.get('/', (req, res) => {
  res.json({
    name: 'Task Management API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      health: '/api/health',
      tasks: '/api/tasks'
    }
  });
});

// Mount API routes
app.use('/api', taskRoutes);

// 404 & Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start server
const server = app.listen(PORT, async () => {
  console.log(`===============================================`);
  console.log(`🚀 Task Management Backend started on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}/api`);
  console.log(`===============================================`);

  // Verify DB connection
  await testConnection();
});

// Graceful shutdown handling
const handleGracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Gracefully closing HTTP server and MySQL pool...`);
  server.close(async () => {
    try {
      await pool.end();
      console.log('MySQL pool connections closed successfully.');
      process.exit(0);
    } catch (err) {
      console.error('Error closing MySQL pool:', err.message);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

module.exports = app;
