import { z } from 'zod';
import { currencyCodes } from '../consts/currencies';
import { countryCodes } from '../consts/countries';

const clientFields = {
  name: z.string().max(255, 'Name cannot be longer than 255 chars').min(2, 'Name must have atleast 2 chars.'),
  email: z.string().email('Email must be a valid email address').optional(),
  phone: z.string().min(10).max(50).optional(),
  billingAddress: z.string().optional(),
  shippingAddress: z.string().optional(),
  country: z
    .string()
    .refine((c) => countryCodes.includes(c), 'Invalid country code. Must be a valid ISO 4217 three-letter code.')
    .optional(),
  taxTag: z.string().optional(),
  taxNumber: z.string().optional(),
  currency: z
    .string()
    .refine((c) => currencyCodes.includes(c), 'Invalid currency code. Must be a valid ISO 3166 three-letter code.')
    .optional(),
  isArchived: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
};
export const clientSchema = z.object({
  id: z.string().uuid(),
  ...clientFields,
});
export type ClientSchema = z.infer<typeof clientSchema>;

export const createClientSchema = z.object({
  ...clientFields,
});
export type CreateClientSchema = z.infer<typeof createClientSchema>;

export const updateClientSchema = z.object({
  id: z.string().uuid(),
  ...clientFields,
});
export type UpdateClientSchema = z.infer<typeof updateClientSchema>;
