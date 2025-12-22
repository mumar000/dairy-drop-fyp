import { ApiError } from '../utils/api-error.js';
import { ZodError } from 'zod';
import { env } from '../config/env.js';

export function errorHandler(err, _req, res, _next) {
  let status = 500;
  let message = 'Internal Server Error';

  if (err instanceof ApiError) {
    status = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    status = 400;
    message = 'Validation error';
  } else if (err?.name === 'ValidationError') {
    status = 400;
    message = 'Validation error';
  } else if (err?.code === 11000) {
    status = 409;
    message = 'Duplicate key';
  } else if (err instanceof Error) {
    message = err.message || message;
  }

  const payload = { message };
  if (env.NODE_ENV !== 'production') payload.error = err?.message ?? String(err);

  res.status(status).json(payload);
}