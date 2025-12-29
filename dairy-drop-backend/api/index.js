import { createApp } from '../../src/app.js';
import { connectToDatabase } from '../../src/db/connection.js';
import { env } from '../../src/config/env.js';
import mongoose from 'mongoose';

// Store the app instance to avoid recreating it on every invocation (for performance in serverless environment)
let cached = {
  app: null,
  dbConnected: false
};

async function initApp() {
  // Check if JWT_SECRET is secure in production
  if (env.NODE_ENV === 'production' && env.JWT_SECRET === 'change-me') {
    throw new Error('Refusing to start: insecure JWT_SECRET in production');
  }

  // Connect to database if not already connected
  if (!cached.dbConnected) {
    await connectToDatabase();
    cached.dbConnected = true;
  }
  
  // Create the Express app if not already created
  if (!cached.app) {
    cached.app = createApp();
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