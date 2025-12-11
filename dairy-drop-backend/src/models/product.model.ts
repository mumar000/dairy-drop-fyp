import mongoose, { Schema, model } from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  description?: string;
  images: string[];
  price: number;
  category?: string;
  inStock: number;
  isActive: boolean;
  averageRating: number;
  ratingCount: number;
}

const ProductSchema = new Schema<IProduct>(
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

export const Product = model<IProduct>('Product', ProductSchema);

