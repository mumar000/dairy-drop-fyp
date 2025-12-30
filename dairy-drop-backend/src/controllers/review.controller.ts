import { asyncHandler } from '../utils/async-handler.js';
import { createReviewSchema } from '../validators/review.schema.js';
import { Review } from '../models/review.model.js';
import { Product } from '../models/product.model.js';
import mongoose from 'mongoose';

async function recomputeProductRating(productId: string) {
  const agg = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId), isApproved: true } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = agg[0] || {};
  await Product.findByIdAndUpdate(productId, { averageRating: avg ?? 0, ratingCount: count ?? 0 });
}

export const addReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = createReviewSchema.parse(req.body);
  const review = await Review.findOneAndUpdate(
    { product: productId, user: req.user!.id },
    { rating, comment },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await recomputeProductRating(productId);
  res.status(201).json({ review });
});

export const listProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params as { productId: string };
  const reviews = await Review.find({ product: productId, isApproved: true }).populate('user', 'name');
  res.json({ reviews });
});

export const deleteMyReview = asyncHandler(async (req, res) => {
  const { productId } = req.params as { productId: string };
  const review = await Review.findOneAndDelete({ product: productId, user: req.user!.id });
  if (!review) return res.status(404).json({ message: 'Review not found' });
  await recomputeProductRating(productId);
  res.json({ message: 'Review removed' });
});

export const adminModerateReview = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const { isApproved } = (req.body ?? {}) as { isApproved: boolean };
  const review = await Review.findByIdAndUpdate(id, { isApproved }, { new: true });
  if (review) await recomputeProductRating(String(review.product));
  res.json({ review });
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const searchTerm = req.query.search as string || '';

  const skip = (page - 1) * limit;

  // Build query
  let query: any = {};
  if (searchTerm) {
    query.$or = [
      { comment: { $regex: searchTerm, $options: 'i' } },
      { 'user.name': { $regex: searchTerm, $options: 'i' } },
      { 'product.name': { $regex: searchTerm, $options: 'i' } },
    ];
  }

  const reviews = await Review.find(query)
    .populate('user', 'name email')
    .populate('product', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments(query);

  res.json({ reviews, total });
});

export const adminDeleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const review = await Review.findByIdAndDelete(id);
  if (!review) return res.status(404).json({ message: 'Review not found' });

  // Recalculate product rating after deletion
  await recomputeProductRating(String(review.product));

  res.json({ message: 'Review deleted successfully' });
});
