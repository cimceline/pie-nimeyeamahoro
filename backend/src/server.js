import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'mongo-sanitize';
import sanitizeHtml from 'sanitize-html';
import hpp from 'hpp';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config/index.js';
import { logger } from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';
import { startScheduler } from './utils/scheduler.js';
import { maintenanceMiddleware, loadMaintenanceMode } from './middleware/maintenance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy for rate limiting behind reverse proxies
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// Data sanitization against NoSQL injection
app.use((req, res, next) => {
  if (req.body) mongoSanitize(req.body);
  if (req.query) mongoSanitize(req.query);
  if (req.params) mongoSanitize(req.params);
  next();
});

// Data sanitization against XSS
const sanitizeObject = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = sanitizeHtml(obj[key], { allowedTags: [], allowedAttributes: {} });
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
};
app.use((req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
});

// Prevent HTTP parameter pollution
app.use(hpp());

// HTTP request logging
if (config.isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  }));
}

// Rate limiting is applied per-route-group in routes/index.js
// Public read endpoints get readLimiter, mutations get writeLimiter, auth gets authLimiter

// Cache-Control headers for public read-only GET endpoints
const publicCachePaths = [
  '/api/profile/public', '/api/education', '/api/skills', '/api/experience',
  '/api/expertise', '/api/publications', '/api/projects', '/api/research-projects',
  '/api/services', '/api/resources', '/api/articles',
  '/api/faqs', '/api/testimonials',
  '/api/academic-titles', '/api/research-interests',
];
app.use((req, res, next) => {
  if (req.method === 'GET' && publicCachePaths.some((p) => req.path.startsWith(p))) {
    res.set('Cache-Control', 'public, max-age=300');
  }
  if (req.method === 'GET' && req.path.startsWith('/api/settings/public')) {
    res.set('Cache-Control', 'public, max-age=600');
  }
  next();
});

// Static files for uploads
app.use('/uploads', express.static(path.resolve(config.uploadDir)));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
  });
});

// Maintenance mode middleware
app.use(maintenanceMiddleware);

app.use('/api', apiRouter);

// 404 handler
app.use(notFoundHandler);

// Central error handler
app.use(errorHandler);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('Connected to MongoDB');
    await loadMaintenanceMode();

    const server = app.listen(config.port, () => {
      logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
      startScheduler();
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      server.close(async () => {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed');
        process.exit(0);
      });

      // Force shutdown after 10s
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Rejection:', err.message);
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err.message);
      process.exit(1);
    });

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
