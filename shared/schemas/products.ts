import { z } from 'zod';
import { currencyCodes } from '../consts/currencies';

const productFields = {
  name: z.string().max(255, 'Name cannot be longer than 255 chars').min(2, 'Name must have atleast 2 chars.'),
  description: z.string().max(500, 'Description cannot be longer than 500 chars').optional(),
  price: z.number().min(0, 'Price must be a positive number'),
  currency: z
    .string()
    .refine((c) => currencyCodes.includes(c), 'Invalid currency code. Must be a valid ISO 3166 three-letter code.'),
};

const supplimentalFields = {
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
} as const;

export const productSchema = z.object({
  ...supplimentalFields,
  ...productFields,
});
export type ProductSchema = z.infer<typeof productSchema>;

export const createProductSchema = z.object({
  ...productFields,
});
export type CreateProductSchema = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  id: supplimentalFields.id,
  ...productFields,
});
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
