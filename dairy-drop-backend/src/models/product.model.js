import mongoose, { Schema, model } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    images: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    category: { type: String },
    inStock: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', description: 'text' });

export const Product = model('Product', ProductSchema);