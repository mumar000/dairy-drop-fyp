import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error.js';
import { ZodError } from 'zod';
import { env } from '../config/env.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  let status = 500;
  let message = 'Internal Server Error';

  if (err instanceof ApiError) {
    status = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    status = 400;
    message = 'Validation error';
  } else if ((err as any)?.name === 'ValidationError') {
    status = 400;
    message = 'Validation error';
  } else if ((err as any)?.code === 11000) {
    status = 409;
    message = 'Duplicate key';
  } else if (err instanceof Error) {
    message = err.message || message;
  }

  const payload: Record<string, unknown> = { message };
  if (env.NODE_ENV !== 'production') payload.error = (err as any)?.message ?? String(err);

  res.status(status).json(payload);
}
