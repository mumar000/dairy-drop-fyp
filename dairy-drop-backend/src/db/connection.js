import mongoose from 'mongoose';
import { env } from '../config/env.js';

// Store the connection state for serverless environments
let db = null;

export async function connectToDatabase() {
  // If we already have a connection, return it
  if (db) {
    if (db.readyState === 1) { // 1 means connected
      return db;
    }
    // If connection is not active, try to connect again
    if (db.readyState === 0 || db.readyState === 3) { // 0 = disconnected, 3 = disconnected
      try {
        await db.connect(env.MONGO_URI);
        return db;
      } catch (error) {
        console.error('MongoDB reconnection failed:', error);
        throw error;
      }
    }
  }

  // Set mongoose options for serverless environments
  mongoose.set('strictQuery', true);

  try {
    db = await mongoose.connect(env.MONGO_URI, {
      // Options for better serverless performance
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    mongoose.connection.on('connected', () => console.log('MongoDB connected'));
    mongoose.connection.on('error', (err) => console.error('MongoDB error', err));
    mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

    return db;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
}