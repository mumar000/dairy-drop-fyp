import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { placeOrder, myOrders, getOrder, adminListOrders, adminUpdateStatus, cancelMyOrder, requestRefund } from '../controllers/order.controller.js';

const router = Router();

router.post('/', authenticate, placeOrder);
router.get('/me', authenticate, myOrders);
router.get('/:id', authenticate, getOrder);
router.post('/:id/cancel', authenticate, cancelMyOrder);
router.post('/:id/refund-request', authenticate, requestRefund);

router.get('/', authenticate, authorize('admin'), adminListOrders);
router.patch('/:id/status', authenticate, authorize('admin'), adminUpdateStatus);

export default router;
