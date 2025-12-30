import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { adminListUsers, adminGetUser, adminUpdateUserRole, adminUpdateUserStatus, adminDeleteUser } from '../controllers/user.controller.js';

const router = Router();

router.use(authenticate, authorize('admin'));
router.get('/', adminListUsers);
router.get('/:id', adminGetUser);
router.patch('/:id/role', adminUpdateUserRole);
router.patch('/:id/status', adminUpdateUserStatus);
router.delete('/:id', adminDeleteUser);

export default router;