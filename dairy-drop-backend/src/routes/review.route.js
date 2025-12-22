import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { addReview, listProductReviews, deleteMyReview, adminModerateReview } from '../controllers/review.controller.js';

const router = Router();

router.get('/product/:productId', listProductReviews);
router.post('/', authenticate, addReview);
router.delete('/product/:productId', authenticate, deleteMyReview);
router.patch('/:id/moderate', authenticate, authorize('admin'), adminModerateReview);

export default router;