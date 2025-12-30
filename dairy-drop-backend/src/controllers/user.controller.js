import { asyncHandler } from '../utils/async-handler.js';
import { User } from '../models/user.model.js';

export const adminListUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  res.json({ users });
});

export const adminGetUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

export const adminUpdateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body || {};
  if (!role || !['user', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

export const adminUpdateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body || {};
  if (typeof isActive !== 'boolean') return res.status(400).json({ message: 'isActive must be a boolean' });

  // Prevent admin from deactivating their own account
  if (req.params.id === req.user.id && !isActive) {
    return res.status(400).json({ message: 'Admin cannot deactivate their own account' });
  }

  const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

export const adminDeleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
});