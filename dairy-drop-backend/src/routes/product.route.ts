import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { createProduct, listProducts, getProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProduct);

router.post('/', authenticate, authorize('admin'), createProduct);
router.patch('/:id', authenticate, authorize('admin'), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

export default router;

