import { asyncHandler } from '../utils/async-handler.js';
import { createProductSchema, updateProductSchema } from '../validators/product.schema.js';
import { Product } from '../models/product.model.js';
import { uploadMultipleToCloudinary, deleteFromCloudinary } from '../utils/imageUpload.js';

export const createProduct = asyncHandler(async (req, res) => {
  const data = createProductSchema.parse(req.body);

  // Handle image uploads if files are present
  if (req.files && req.files.length > 0) {
    const uploadResults = await uploadMultipleToCloudinary(req.files);
    data.images = uploadResults.map(result => result.secure_url);
  }

  const product = await Product.create(data);
  res.status(201).json({ product });
});

export const listProducts = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice, inStock, ratings, page = '1', limit = '12', sort = '-createdAt' } = req.query as any;
  const filter: any = { isActive: true };
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (minPrice || maxPrice) filter.price = { ...(minPrice ? { $gte: Number(minPrice) } : {}), ...(maxPrice ? { $lte: Number(maxPrice) } : {}) };
  if (inStock) filter.inStock = { $gte: Number(inStock) };
  if (ratings) {
    // Convert ratings to an array and find the highest rating
    const ratingValues = ratings.split(',').map(r => Number(r));
    if (ratingValues.length > 0) {
      // Filter for products with averageRating greater than or equal to the highest selected rating
      // For example, if user selects 4 and 3 stars, show products with rating >= 3 (the minimum)
      const minRating = Math.min(...ratingValues);
      filter.averageRating = { $gte: minRating };
    }
  }
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
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: 'Product not found' });

  // Handle image uploads if files are present
  if (req.files && req.files.length > 0) {
    // Delete old images from Cloudinary if they exist
    if (product.images && product.images.length > 0) {
      // Extract public IDs from the URLs to delete them
      for (const imageUrl of product.images) {
        try {
          // Extract public ID from Cloudinary URL
          const urlParts = imageUrl.split('/');
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExtension.split('.')[0]; // Remove extension
          await deleteFromCloudinary(publicId);
        } catch (error) {
          console.error('Error deleting old image from Cloudinary:', error);
          // Continue even if deletion fails
        }
      }
    }

    // Upload new images
    const uploadResults = await uploadMultipleToCloudinary(req.files);
    patch.images = uploadResults.map(result => result.secure_url);
  }

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, patch, { new: true });
  res.json({ product: updatedProduct });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: 'Product not found' });

  // Delete images from Cloudinary if they exist
  if (product.images && product.images.length > 0) {
    // Extract public IDs from the URLs to delete them
    for (const imageUrl of product.images) {
      try {
        // Extract public ID from Cloudinary URL
        const urlParts = imageUrl.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0]; // Remove extension
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        // Continue even if deletion fails
      }
    }
  }

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

