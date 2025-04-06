import { z } from 'zod';
import { currencyCodes } from '../consts/currencies';
import { supplimentalFields } from './_base';

const itemEntryFields = {
  itemId: z.string().uuid(),
  quantity: z.number().int().positive().optional(),
  narration: z.string().max(255, 'Narration cannot be longer than 255 chars').optional(),
};
export const itemEntrySchema = z.object(itemEntryFields);
export type ItemEntrySchema = z.infer<typeof itemEntrySchema>;

export const adjustmentEntryFields = (fieldName: string) => ({
  label: z
    .string()
    .max(255, `${fieldName} label cannot be longer than 255 chars`)
    .min(2, `${fieldName} label must have atleast 2 chars.`),
  isAbsolute: z.boolean().optional(),
  amount: z.number().min(0, `${fieldName} amount must be a positive number`).optional(),
  currency: z
    .string()
    .refine((c) => currencyCodes.includes(c), 'Invalid currency code. Must be a valid ISO 3166 three-letter code.')
    .optional(),
  rate: z
    .number()
    .min(0, `${fieldName} rate must be a positive number`)
    .max(100, `${fieldName} rate must be less than 100`),
});

export const adjustmentEntrySchema = z.object(adjustmentEntryFields('Root Adjustment'));
export type AdjustmentEntrySchema = z.infer<typeof adjustmentEntrySchema>;

export const taxEntrySchema = z.object(adjustmentEntryFields('Tax'));
export type TaxEntrySchema = z.infer<typeof taxEntrySchema>;

export const discountEntrySchema = z.object(adjustmentEntryFields('Discount'));
export type DiscountEntrySchema = z.infer<typeof discountEntrySchema>;

const prefixFields = {
  name: z.string().max(15, 'Prefix cannot be longer than 15 chars').min(2, 'Prefix must have atleast 2 chars.'),
};

export const invoicePrefixSchema = z.object({
  ...supplimentalFields,
  ...prefixFields,
});
export type InvoicePrefixSchema = z.infer<typeof invoicePrefixSchema>;

export const createInvoicePrefixSchema = z.object({
  ...prefixFields,
});
export type CreateInvoicePrefixSchema = z.infer<typeof createInvoicePrefixSchema>;

export const updateInvoicePrefixSchema = z.object({
  id: supplimentalFields.id,
  ...prefixFields,
});
export type UpdateInvoicePrefixSchema = z.infer<typeof updateInvoicePrefixSchema>;

const invoiceFields = {
  clientId: z.string().uuid(),
  subject: z.string().max(255, 'Subject cannot be longer than 255 chars').min(2, 'Subject must have atleast 2 chars.'),
  prefixId: z.string().uuid(),
  number: z.string().max(255, 'Number cannot be longer than 255 chars').min(2, 'Number must have atleast 2 chars.'),
  date: z.string().refine(isValidDate, 'Date must be formatted with YYYY-MM-DD format.'), // date string, YYYY-MM-DD
  dueDate: z.string().refine(isValidDate, 'Date must be formatted with YYYY-MM-DD format.').optional(), // date string, YYYY-MM-DD
  currency: z
    .string()
    .refine((c) => currencyCodes.includes(c), 'Invalid currency code. Must be a valid ISO 3166 three-letter code.'),
  items: z.array(itemEntrySchema),
  taxes: z.array(taxEntrySchema),
  discounts: z.array(discountEntrySchema),
  note: z.string().max(5000, 'Note cannot be longer than 5000 chars').optional(),
};

export const invoiceSchema = z.object({
  ...supplimentalFields,
  ...invoiceFields,
});
export type InvoiceSchema = z.infer<typeof invoiceSchema>;

export const createInvoiceSchema = z.object({
  ...invoiceFields,
});
export type CreateInvoiceSchema = z.infer<typeof createInvoiceSchema>;

export const updateInvoiceSchema = z.object({
  id: supplimentalFields.id,
  ...invoiceFields,
});
export type UpdateInvoiceSchema = z.infer<typeof updateInvoiceSchema>;
