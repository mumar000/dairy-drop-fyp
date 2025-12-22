import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  register,
  login,
  me,
  updateProfile,
  changePassword,
  listAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, me);
router.patch('/me', authenticate, updateProfile);
router.post('/change-password', authenticate, changePassword);

router.get('/addresses', authenticate, listAddresses);
router.post('/addresses', authenticate, addAddress);
router.patch('/addresses/:id', authenticate, updateAddress);
router.delete('/addresses/:id', authenticate, deleteAddress);

router.get('/cart', authenticate, getCart);
router.post('/cart', authenticate, addToCart);
router.patch('/cart', authenticate, updateCartItem);
router.delete('/cart/:productId', authenticate, removeCartItem);
router.delete('/cart', authenticate, clearCart);

export default router;