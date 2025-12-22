import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.json({
      service: 'dairy-drop-api',
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;