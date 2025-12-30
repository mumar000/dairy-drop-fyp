import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { addReview, listProductReviews, deleteMyReview, updateMyReview, adminModerateReview, getAllReviews, adminDeleteReview } from '../controllers/review.controller.js';

const router = Router();

router.get('/product/:productId', listProductReviews);
router.post('/', authenticate, addReview);
router.put('/product/:productId', authenticate, updateMyReview);
router.delete('/product/:productId', authenticate, deleteMyReview);

// Admin routes
router.get('/admin', authenticate, authorize('admin'), getAllReviews);
router.patch('/:id/moderate', authenticate, authorize('admin'), adminModerateReview);
router.delete('/:id', authenticate, authorize('admin'), adminDeleteReview);

export default router;