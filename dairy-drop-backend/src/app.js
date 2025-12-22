import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import router from './routes/index.js';
import { notFound } from './middlewares/not-found.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { env } from './config/env.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());

  // CORS: allow configured origin(s)
  const origins = (env.CORS_ORIGIN || '*').split(',').map((o) => o.trim());
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (origins.includes('*') || origins.includes(origin)) return cb(null, true);
        return cb(new Error('CORS not allowed'), false);
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(hpp());
  app.use(compression());

  const logFormat = env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(morgan(logFormat));

  // Basic rate limiter
  const limiter = rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, max: env.RATE_LIMIT_MAX, standardHeaders: true, legacyHeaders: false });
  app.use(limiter);

  app.get('/', (_req, res) => {
    res.json({ name: 'Dairy Drop API', status: 'ok' });
  });

  // Mount API with "/api" prefix (no version)
  app.use('/api', router);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}