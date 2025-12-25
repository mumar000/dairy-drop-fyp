import 'dotenv/config';

const getEnv = (key, fallback) => {
  const value = process.env[key];
  if (value === undefined || value === '') return fallback;
  return value;
};

export const env = {
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: Number(getEnv('PORT', '4000')),
  MONGO_URI: getEnv('MONGO_URI', 'mongodb://127.0.0.1:27017/dairy-drop'),
  JWT_SECRET: getEnv('JWT_SECRET', 'change-me'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '1d'),
  ADMIN_EMAIL: getEnv('ADMIN_EMAIL'),
  CORS_ORIGIN: getEnv('CORS_ORIGIN', '*'),
  RATE_LIMIT_WINDOW_MS: Number(getEnv('RATE_LIMIT_WINDOW_MS', String(15 * 60 * 1000))),
  RATE_LIMIT_MAX: Number(getEnv('RATE_LIMIT_MAX', '200')),
  CLOUDINARY_CLOUD_NAME: getEnv('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: getEnv('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: getEnv('CLOUDINARY_API_SECRET'),
};