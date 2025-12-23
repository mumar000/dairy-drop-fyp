import { asyncHandler } from '../utils/async-handler.js';
import { createProductSchema, updateProductSchema } from '../validators/product.schema.js';
import { Product } from '../models/product.model.js';

export const createProduct = asyncHandler(async (req, res) => {
  const data = createProductSchema.parse(req.body);
  const product = await Product.create(data);
  res.status(201).json({ product });
});

export const listProducts = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice, inStock, page = '1', limit = '12', sort = '-createdAt' } = req.query;
  const filter = { isActive: true };
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (minPrice || maxPrice) filter.price = { ...(minPrice ? { $gte: Number(minPrice) } : {}), ...(maxPrice ? { $lte: Number(maxPrice) } : {}) };
  if (inStock) filter.inStock = { $gte: Number(inStock) };
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).sort(String(sort)).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const patch = updateProductSchema.parse(req.body);
  const product = await Product.findByIdAndUpdate(req.params.id, patch, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category', { isActive: true });
  res.json({ categories });
});