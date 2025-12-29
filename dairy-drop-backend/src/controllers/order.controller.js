import { asyncHandler } from '../utils/async-handler.js';
import { placeOrderSchema, updateStatusSchema } from '../validators/order.schema.js';
import { Order } from '../models/order.model.js';
import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';

export const placeOrder = asyncHandler(async (req, res) => {
  const { address, items, fromCart } = placeOrderSchema.parse(req.body);
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  let orderItems = [];
  if (fromCart || (!items || items.length === 0)) {
    if (!user.cart.length) return res.status(400).json({ message: 'Cart is empty' });
    orderItems = user.cart.map((c) => ({
      product: c.product,
      name: c.name,
      price: c.price,
      quantity: c.quantity,
      image: c.image  // Include image from cart item
    }));
  } else {
    // items provided: fetch product snapshots
    const products = await Product.find({ _id: { $in: items.map((i) => i.productId) } });
    orderItems = items.map((i) => {
      const p = products.find((pp) => String(pp._id) === i.productId);
      if (!p) throw Object.assign(new Error('Product not found'), { status: 404 });
      return {
        product: p._id,
        name: p.name,
        price: p.price,
        quantity: i.quantity,
        image: p.images?.[0] || null  // Include image from product
      };
    });
  }

  // Check stock and compute total
  const productIds = orderItems.map((i) => i.product);
  const storeProducts = await Product.find({ _id: { $in: productIds } });
  for (const item of orderItems) {
    const p = storeProducts.find((pp) => String(pp._id) === String(item.product));
    if (!p) return res.status(404).json({ message: `Product not found: ${item.name}` });
    if (!p.isActive) return res.status(400).json({ message: `Product inactive: ${p.name}` });
    if (p.inStock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${p.name}` });
  }

  let totalAmount = 0;
  orderItems.forEach((i) => (totalAmount += i.price * i.quantity));

  // Decrement stock atomically-ish (simple sequential updates)
  for (const item of orderItems) {
    await Product.updateOne({ _id: item.product, inStock: { $gte: item.quantity } }, { $inc: { inStock: -item.quantity } });
  }

  const order = await Order.create({
    user: user._id,
    items: orderItems,
    address,
    totalAmount,
    status: 'Pending',
    paymentMethod: 'COD',
    paymentStatus: 'Unpaid',
  });

  // Save the shipping address to user's address book if it doesn't already exist
  const existingAddressIndex = user.addresses.findIndex(
    addr => addr.line1 === address.line1 &&
            addr.city === address.city &&
            addr.postalCode === address.postalCode
  );

  if (existingAddressIndex === -1) {
    // Add the new address to user's address book
    const newAddress = {
      ...address,
      label: address.name, // Use the name as the label
      isDefault: user.addresses.length === 0 // Set as default if it's the first address
    };
    user.addresses.push(newAddress);
    await user.save();
  }

  // Clear cart if we placed from cart
  if (fromCart || (!items || items.length === 0)) {
    user.cart = [];
    await user.save();
  }

  res.status(201).json({ order });
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
  res.json({ orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ order });
});

export const adminListOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().sort('-createdAt');
  res.json({ orders });
});

export const adminUpdateStatus = asyncHandler(async (req, res) => {
  const { status } = updateStatusSchema.parse(req.body);
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = status;
  if (status === 'Delivered') order.paymentStatus = 'Paid';
  await order.save();
  res.json({ order });
});

export const cancelMyOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.status !== 'Pending') return res.status(400).json({ message: 'Only pending orders can be cancelled' });
  order.status = 'Cancelled';
  await order.save();
  // Restock
  for (const item of order.items) {
    await Product.updateOne({ _id: item.product }, { $inc: { inStock: item.quantity } });
  }
  res.json({ order });
});