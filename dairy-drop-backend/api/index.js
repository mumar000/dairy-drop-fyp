import mongoose from 'mongoose';
import { createApp } from '../src/app.js';
import { connectToDatabase } from '../src/db/connection.js';

let cachedApp = null;

async function initApp() {
  if (mongoose.connection.readyState !== 1) {
    await connectToDatabase();
  }

  if (!cachedApp) {
    cachedApp = createApp();
  }

  return cachedApp;
}

export default async function handler(req, res) {
  try {
    const app = await initApp();
    return app(req, res);
  } catch (error) {
    console.error('Vercel Function Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.message,
    });
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
