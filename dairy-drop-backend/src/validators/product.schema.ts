import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional().default([]),
  price: z.number().min(0),
  category: z.string().optional(),
  inStock: z.number().int().min(0),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

