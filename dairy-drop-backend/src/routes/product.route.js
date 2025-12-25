import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { createProduct, listProducts, getProduct, updateProduct, deleteProduct, listCategories } from '../controllers/product.controller.js';
import { upload } from '../utils/imageUpload.js';

const router = Router();

// Specific routes should be defined before dynamic routes
router.get('/', listProducts);
router.get('/categories', listCategories);
router.get('/:id', getProduct);

// Use Multer middleware for handling file uploads
router.post('/', authenticate, authorize('admin'), upload.array('images', 10), createProduct);
router.patch('/:id', authenticate, authorize('admin'), upload.array('images', 10), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

export default router;