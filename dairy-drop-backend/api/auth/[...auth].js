import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import { connectToDatabase } from '../../../src/db/connection.js';
import { env } from '../../../src/config/env.js';
import router from '../../../src/routes/index.js';
import { notFound } from '../../../src/middlewares/not-found.middleware.js';
import { errorHandler } from '../../../src/middlewares/error.middleware.js';
import mongoose from 'mongoose';

// Store the app instance to avoid recreating it on every invocation (for performance in serverless environment)
let cached = {
  app: null,
  dbConnected: false
};

async function initApp() {
  // Check if JWT_SECRET is secure in production
  if (env.NODE_ENV === 'production' && env.JWT_SECRET === 'change-me') {
    console.warn('Warning: insecure JWT_SECRET in production. Please update your environment variables.');
  }

  // Connect to database if not already connected
  if (!cached.dbConnected) {
    try {
      await connectToDatabase();
      cached.dbConnected = true;
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  // Create the Express app if not already created
  if (!cached.app) {
    const app = express();

    // Apply all middleware directly
    app.disable('x-powered-by');
    app.use(helmet());

    // CORS: allow configured origin(s)
    const origins = (env.CORS_ORIGIN || '*').split(',').map((o) => o.trim());
    app.use(cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (origins.includes('*') || origins.includes(origin)) return cb(null, true);
        return cb(new Error('CORS not allowed'), false);
      },
      credentials: true,
    }));

    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(hpp());
    app.use(compression());

    const logFormat = env.NODE_ENV === 'production' ? 'combined' : 'dev';
    app.use(morgan(logFormat));

    // Basic rate limiter
    const limiter = rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false
    });
    app.use(limiter);

    // Add the root route
    app.get('/', (_req, res) => {
      res.json({ name: 'Dairy Drop API', status: 'ok' });
    });

    // Mount API with "/api" prefix
    app.use('/api', router);

    app.use(notFound);
    app.use(errorHandler);

    cached.app = app;
  }

  return cached.app;
}

export default async function handler(req, res) {
  try {
    // Initialize the app
    const app = await initApp();

    // Handle the request with the Express app
    await new Promise((resolve, reject) => {
      app(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};