import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import hpp from 'hpp';
import { connectToDatabase } from '../src/db/connection.js'; // Fixed path
import { env } from '../src/config/env.js';                 // Fixed path
import router from '../src/routes/index.js';                // Fixed path
import { notFound } from '../src/middlewares/not-found.middleware.js';
import { errorHandler } from '../src/middlewares/error.middleware.js';
import mongoose from 'mongoose';

const app = express();

// Standard Middleware
app.disable('x-powered-by');
app.use(helmet());

const origins = (env.CORS_ORIGIN || '*').split(',').map((o) => o.trim());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || origins.includes('*') || origins.includes(origin)) return cb(null, true);
    return cb(new Error('CORS not allowed'), false);
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(hpp());
app.use(compression());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => res.json({ name: 'Dairy Drop API', status: 'ok' }));
app.use('/api', router);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Serverless Handler
export default async function handler(req, res) {
  try {
    // 1. Ensure DB is connected
    if (mongoose.connection.readyState !== 1) {
      await connectToDatabase();
    }

    // 2. Handle the request
    return app(req, res);
  } catch (error) {
    console.error('Vercel Function Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}