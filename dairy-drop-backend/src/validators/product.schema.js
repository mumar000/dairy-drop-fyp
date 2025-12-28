import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  images: z.preprocess(
    (val) => (Array.isArray(val) ? val : []),
    z.array(z.string()).optional().default([])
  ),
  price: z.preprocess(
    (val) => {
      if (typeof val === 'string') return parseFloat(val);
      if (typeof val === 'number') return val;
      return val;
    },
    z.number().min(0)
  ),
  category: z.string().optional(),
  inStock: z.preprocess(
    (val) => {
      if (typeof val === 'string') return parseInt(val, 10);
      if (typeof val === 'number') return val;
      return val;
    },
    z.number().int().min(0)
  ),
  isActive: z.preprocess(
    (val) => {
      if (typeof val === 'string') return val === 'true';
      return val;
    },
    z.boolean().optional()
  ),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  images: z.preprocess(
    (val) => (Array.isArray(val) ? val : undefined),
    z.array(z.string()).optional()
  ),
  price: z.preprocess(
    (val) => {
      if (typeof val === 'string') return parseFloat(val);
      if (typeof val === 'number') return val;
      return val;
    },
    z.number().min(0).optional()
  ),
  category: z.string().optional(),
  inStock: z.preprocess(
    (val) => {
      if (typeof val === 'string') return parseInt(val, 10);
      if (typeof val === 'number') return val;
      return val;
    },
    z.number().int().min(0).optional()
  ),
  isActive: z.preprocess(
    (val) => {
      if (typeof val === 'string') return val === 'true';
      return val;
    },
    z.boolean().optional()
  ),
});