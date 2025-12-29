import { createApp } from '../../../src/app.js';
import { connectToDatabase } from '../../../src/db/connection.js';
import mongoose from 'mongoose';

// Store the app instance to avoid recreating it on every invocation (for performance in serverless environment)
let cachedApp = null;

async function createServerlessApp() {
  if (!cachedApp) {
    // Connect to database if not already connected
    if (mongoose.connection.readyState === 0) {
      await connectToDatabase();
    }
    
    // Create the Express app
    cachedApp = createApp();
  }
  
  return cachedApp;
}

export default async function handler(req, res) {
  try {
    // Create or get the cached Express app
    const app = await createServerlessApp();
    
    // Handle the request with the Express app
    await new Promise((resolve, reject) => {
      app(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};