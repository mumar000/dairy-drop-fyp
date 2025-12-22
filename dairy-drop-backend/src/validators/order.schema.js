import { z } from 'zod';

export const placeOrderSchema = z.object({
  address: z.object({
    name: z.string().min(1),
    phone: z.string().min(6),
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().min(1),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .optional(),
  fromCart: z.boolean().optional().default(true),
});

export const updateStatusSchema = z.object({
  status: z.enum(['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']),
});