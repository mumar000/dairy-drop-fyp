import mongoose from 'mongoose';
import { env } from '../config/env.js';

export async function connectToDatabase() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGO_URI);

  mongoose.connection.on('connected', () => console.log('MongoDB connected'));
  mongoose.connection.on('error', (err) => console.error('MongoDB error', err));
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
}