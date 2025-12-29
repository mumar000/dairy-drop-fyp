import { asyncHandler } from '../utils/async-handler.js';
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema, addressSchema } from '../validators/auth.schema.js';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt.js';
import mongoose from 'mongoose';
import { Product } from '../models/product.model.js';

export const register = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);
  const exists = await User.findOne({ $or: [{ email: data.email }, { phone: data.phone }] });
  if (exists) return res.status(409).json({ message: 'Email or phone already in use' });
  const hash = await bcrypt.hash(data.password, 10);
  const user = await User.create({ ...data, password: hash });
  const token = signToken({ id: String(user._id), role: user.role });
  res.status(201).json({ token, user: sanitizeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { emailOrPhone, password } = loginSchema.parse(req.body);
  const user = await User.findOne({ $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken({ id: String(user._id), role: user.role });
  res.json({ token, user: sanitizeUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: sanitizeUser(user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = updateProfileSchema.parse(req.body);
  if (updates.email) {
    const dupe = await User.findOne({ email: updates.email, _id: { $ne: req.user.id } });
    if (dupe) return res.status(409).json({ message: 'Email already in use' });
  }
  if (updates.phone) {
    const dupe = await User.findOne({ phone: updates.phone, _id: { $ne: req.user.id } });
    if (dupe) return res.status(409).json({ message: 'Phone already in use' });
  }
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  res.json({ user: sanitizeUser(user) });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);
  const user = await User.findById(req.user.id).select('+password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) return res.status(400).json({ message: 'Old password incorrect' });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password updated' });
});

export const listAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ addresses: user?.addresses ?? [] });
});

export const addAddress = asyncHandler(async (req, res) => {
  const addr = addressSchema.parse(req.body);
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (addr.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
  user.addresses.push({ ...addr, _id: new mongoose.Types.ObjectId() });
  if (!user.addresses.some((a) => a.isDefault)) {
    user.addresses[0].isDefault = true;
  }
  await user.save();
  res.status(201).json({ addresses: user.addresses });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const patch = addressSchema.partial().parse(req.body);
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const addr = user.addresses.id(id);
  if (!addr) return res.status(404).json({ message: 'Address not found' });
  if (patch.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
  Object.assign(addr, patch);
  await user.save();
  res.json({ addresses: user.addresses });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const addr = user.addresses.id(id);
  if (!addr) return res.status(404).json({ message: 'Address not found' });
  addr.deleteOne();
  // ensure at least one default
  if (!user.addresses.some((a) => a.isDefault) && user.addresses.length) {
    user.addresses[0].isDefault = true;
  }
  await user.save();
  res.json({ addresses: user.addresses });
});

function sanitizeUser(user) {
  const obj = user.toObject?.() ?? user;
  delete obj.password;
  return obj;
}

// Cart operations
export const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Update inStock and image for each cart item based on current product data
  if (user && user.cart && user.cart.length > 0) {
    for (let cartItem of user.cart) {
      const product = await Product.findById(cartItem.product);
      if (product) {
        cartItem.inStock = product.inStock;
        // Add image if it doesn't exist in the cart item
        if (!cartItem.image) {
          cartItem.image = product.images?.[0] || null;
        }
      }
    }
  }

  res.json({ cart: user?.cart ?? [] });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = (req.body ?? {}) || {};
  if (!productId || !quantity) return res.status(400).json({ message: 'Invalid cart item' });
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const product = await Product.findById(productId);
  if (!product || !product.isActive) return res.status(404).json({ message: 'Product not found' });
  const existing = user.cart.find((c) => String(c.product) === productId);
  if (existing) existing.quantity += quantity;
  else user.cart.push({
    product: new mongoose.Types.ObjectId(productId),
    name: product.name,
    price: product.price,
    image: product.images?.[0] || null,  // Add image field from product
    inStock: product.inStock,  // Add inStock field
    quantity
  });
  await user.save();
  res.status(201).json({ cart: user.cart });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = (req.body ?? {}) || {};
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const item = user.cart.find((c) => String(c.product) === productId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  item.quantity = quantity;

  // Update inStock if product exists
  const product = await Product.findById(productId);
  if (product) {
    item.inStock = product.inStock;
  }

  await user.save();
  res.json({ cart: user.cart });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.cart = user.cart.filter((c) => String(c.product) !== productId);
  await user.save();
  res.json({ cart: user.cart });
});

export const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.cart = [];
  await user.save();
  res.json({ cart: user.cart });
});