import { createApp } from './app.js';
import { connectToDatabase } from './db/connection.js';
import { env } from './config/env.js';
import { ensureAdmin } from './bootstrap/ensure-admin.js';
import mongoose from 'mongoose';

const app = createApp();
const port = env.PORT;

connectToDatabase()
  .then(() => {
    if (env.NODE_ENV === 'production' && env.JWT_SECRET === 'change-me') {
      console.error('Refusing to start: insecure JWT_SECRET in production');
      process.exit(1);
    }
    ensureAdmin().catch((e) => console.warn('ensureAdmin failed', e));
    const server = app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });

    const shutdown = async (signal) => {
      try {
        console.log(`\n${signal} received: closing server...`);
        await new Promise((resolve) => server.close(() => resolve()));
        await mongoose.connection.close();
        console.log('Closed gracefully');
        process.exit(0);
      } catch (e) {
        console.error('Error during shutdown', e);
        process.exit(1);
      }
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });