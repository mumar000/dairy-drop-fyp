import { asyncHandler } from '../utils/async-handler.js';
import { createReviewSchema } from '../validators/review.schema.js';
import { Review } from '../models/review.model.js';
import { Product } from '../models/product.model.js';
import mongoose from 'mongoose';
import { z } from 'zod';

async function recomputeProductRating(productId) {
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
    { product: productId, user: req.user.id },
    { rating, comment },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await recomputeProductRating(productId);
  res.status(201).json({ review });
});

export const listProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const reviews = await Review.find({ product: productId, isApproved: true })
    .populate('user', 'name')
    .sort({ createdAt: -1 }) // Sort by newest first
    .skip(skip)
    .limit(limit);

  const totalReviews = await Review.countDocuments({ product: productId, isApproved: true });
  const totalPages = Math.ceil(totalReviews / limit);

  res.json({
    reviews,
    pagination: {
      currentPage: page,
      totalPages,
      totalReviews,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit
    }
  });
});

export const deleteMyReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const review = await Review.findOneAndDelete({ product: productId, user: req.user.id });
  if (!review) return res.status(404).json({ message: 'Review not found' });
  await recomputeProductRating(productId);
  res.json({ message: 'Review removed' });
});

export const updateMyReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  // Validate rating and comment without productId
  const updateReviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional(),
  });
  const validatedData = updateReviewSchema.parse({ rating, comment });

  const review = await Review.findOneAndUpdate(
    { product: productId, user: req.user.id },
    { rating: validatedData.rating, comment: validatedData.comment, updatedAt: Date.now() },
    { new: true, runValidators: true }
  );

  if (!review) return res.status(404).json({ message: 'Review not found' });

  await recomputeProductRating(productId);
  res.json({ review });
});

export const adminModerateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isApproved } = req.body || {};
  const review = await Review.findByIdAndUpdate(id, { isApproved }, { new: true });
  if (review) await recomputeProductRating(String(review.product));
  res.json({ review });
});