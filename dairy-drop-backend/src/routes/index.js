import { Router } from 'express';
import healthRouter from './health.route.js';
import authRouter from './auth.route.js';
import productRouter from './product.route.js';
import reviewRouter from './review.route.js';
import orderRouter from './order.route.js';
import userRouter from './user.route.js';
import notificationRouter from './notification.route.js';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use("/api/auth", authRouter);
router.use('/products', productRouter);
router.use('/reviews', reviewRouter);
router.use('/orders', orderRouter);
router.use('/users', userRouter);
router.use('/notifications', notificationRouter);

export default router;
