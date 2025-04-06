import { z } from 'zod';
import { currencyCodes } from '../consts/currencies';
import { supplimentalFields } from './_base';

const itemFields = {
  name: z.string().max(255, 'Name cannot be longer than 255 chars').min(2, 'Name must have atleast 2 chars.'),
  description: z.string().max(500, 'Description cannot be longer than 500 chars').optional(),
  price: z.number().min(0, 'Price must be a positive number'),
  isService: z.boolean(),
  unitId: supplimentalFields.id,
  currency: z
    .string()
    .refine((c) => currencyCodes.includes(c), 'Invalid currency code. Must be a valid ISO 3166 three-letter code.'),
};

export const itemSchema = z.object({
  ...supplimentalFields,
  ...itemFields,
});
export type ItemSchema = z.infer<typeof itemSchema>;

export const createItemSchema = z.object({
  ...itemFields,
});
export type CreateItemSchema = z.infer<typeof createItemSchema>;

export const updateItemSchema = z.object({
  id: supplimentalFields.id,
  ...itemFields,
});
export type UpdateItemSchema = z.infer<typeof updateItemSchema>;
