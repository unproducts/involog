import { z } from 'zod';
import { currencyCodeSchema, FilterSets, supplimentalFields, SupplimentalFieldsFilterSet } from './_base';

const itemEntryFields = {
  itemId: z.string().uuid(),
  quantity: z
    .number()
    .positive()
    .refine((q) => q > 0, 'Quantity must be greater than 0'),
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
  value: z.number().min(0, `${fieldName} amount must be a positive number`),
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
  subject: z
    .string()
    .max(255, 'Subject cannot be longer than 255 chars')
    .min(2, 'Subject must have atleast 2 chars.')
    .optional(),
  prefixId: z.string().uuid(),
  number: z.string().max(255, 'Number cannot be longer than 255 chars').min(2, 'Number must have atleast 2 chars.'),
  date: z.string().refine(isValidDate, 'Date must be formatted with YYYY-MM-DD format.'), // date string, YYYY-MM-DD
  dueDate: z.string().refine(isValidDate, 'Date must be formatted with YYYY-MM-DD format.').optional(), // date string, YYYY-MM-DD
  currency: currencyCodeSchema,
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

export const deleteInvoiceSchema = z.object({
  id: supplimentalFields.id,
});
export type DeleteInvoiceSchema = z.infer<typeof deleteInvoiceSchema>;

export const filterInvoicesSchema = z.object({
  ...SupplimentalFieldsFilterSet,
  subject: FilterSets.string().optional(),
  number: FilterSets.string().optional(),
  date: FilterSets.dateRange().optional(),
  dueDate: FilterSets.dateRange().optional(),
  currency: FilterSets.discreteValues(currencyCodeSchema).optional(),
  clientId: FilterSets.discreteValues(supplimentalFields.id).optional(),
  items: FilterSets.discreteValues(itemEntryFields.itemId).optional(),
  note: FilterSets.string().optional(),
});
export type FilterInvoicesSchema = z.infer<typeof filterInvoicesSchema>;

export const invoiceInfoFields = {
  ...supplimentalFields,
  clientId: invoiceFields.clientId,
  subject: invoiceFields.subject,
  prefixId: invoiceFields.prefixId,
  number: invoiceFields.number,
  date: invoiceFields.date,
  dueDate: invoiceFields.dueDate,
  currency: invoiceFields.currency,
};
export const invoiceInfoSchema = z.object(invoiceInfoFields);
export type InvoiceInfoSchema = z.infer<typeof invoiceInfoSchema>;
