import { z } from 'zod';
import { transactionCategories, type TransactionCategory } from '../consts/transactions';
import { isValidDate } from '../utils/general';
import { currencyCodeSchema, FilterSets, supplimentalFields, SupplimentalFieldsFilterSet } from './_base';

export const transactionTypeSchema = z.enum(['I', 'E']);
export const transactionCategorySchema = z
  .string()
  .refine((c) => transactionCategories.includes(c as TransactionCategory), 'Invalid category code.');

const transactionFields = {
  description: z
    .string()
    .max(500, 'Description cannot be longer than 500 chars')
    .min(2, 'Description must have atleast 2 chars.'),
  amount: z.number().min(0, 'Amount must be a positive number'),
  currency: currencyCodeSchema,
  date: z.string().refine(isValidDate, 'Date must be formatted with YYYY-MM-DD format.'), // date string, YYYY-MM-DD
  type: transactionTypeSchema,
  category: transactionCategorySchema.optional(),
  merchant: z.string().max(255, 'Merchant name cannot be longer than 255 chars').optional(),
  clientId: z.string().uuid().optional(),
  notes: z.string().max(5000, 'Notes cannot be longer than 5000 chars').optional(),
  isArchived: z.boolean(),
};

export const transactionSchema = z.object({
  ...supplimentalFields,
  ...transactionFields,
});
export type TransactionSchema = z.infer<typeof transactionSchema>;

export const createTransactionSchema = z.object({
  ...transactionFields,
});
export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;

export const updateTransactionSchema = z.object({
  id: supplimentalFields.id,
  ...transactionFields,
});
export type UpdateTransactionSchema = z.infer<typeof updateTransactionSchema>;

export const deleteTransactionSchema = z.object({
  id: supplimentalFields.id,
});
export type DeleteTransactionSchema = z.infer<typeof deleteTransactionSchema>;

export const filterTransactionsSchema = z.object({
  ...SupplimentalFieldsFilterSet,
  amount: FilterSets.numberRange().optional(),
  search: FilterSets.string().optional(),
  currency: FilterSets.discreteValues(transactionFields.currency).optional(),
  date: FilterSets.dateRange().optional(),
  type: FilterSets.discreteValues(transactionTypeSchema).optional(),
  category: FilterSets.discreteValues(transactionCategorySchema).optional(),
  clientId: FilterSets.discreteValues(z.string().uuid()).optional(),
  isArchived: FilterSets.boolean().optional(),
});
export type FilterTransactionsSchema = z.infer<typeof filterTransactionsSchema>;
