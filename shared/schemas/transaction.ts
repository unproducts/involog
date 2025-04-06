import { z } from 'zod';
import { currencyCodes } from '../consts/currencies';
import { expenseCategories, incomeCategories, type ExpenseCategory, type IncomeCategory } from '../consts/transactions';
import { isValidDate } from '../utils/general';

export const transactionTypeSchema = z.enum(['I', 'E']);

const transactionFields = {
  description: z
    .string()
    .max(500, 'Description cannot be longer than 500 chars')
    .min(2, 'Description must have atleast 2 chars.'),
  amount: z.number().min(0, 'Amount must be a positive number'),
  currency: z
    .string()
    .refine((c) => currencyCodes.includes(c), 'Invalid currency code. Must be a valid ISO 3166 three-letter code.'),
  date: z.string().refine(isValidDate, 'Date must be formatted with YYYY-MM-DD format.'), // date string, YYYY-MM-DD
  type: transactionTypeSchema,
  merchant: z.string().max(255, 'Merchant name cannot be longer than 255 chars').optional(),
  clientId: z.string().uuid().optional(),
  notes: z.string().max(5000, 'Notes cannot be longer than 5000 chars').optional(),
};

// TODO: extract it to be global and shared across all assets.
const supplimentalFields = {
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
} as const;

const expenseTransactionFields = {
  ...transactionFields,
  category: z
    .string()
    .refine((c) => expenseCategories.includes(c as ExpenseCategory), 'Invalid category code.')
    .optional(),
};

export const expenseTransactionSchema = z.object({
  ...supplimentalFields,
  ...expenseTransactionFields,
});
export type ExpenseTransactionSchema = z.infer<typeof expenseTransactionSchema>;

export const createExpenseTransactionSchema = z.object({
  ...expenseTransactionFields,
});
export type CreateExpenseTransactionSchema = z.infer<typeof createExpenseTransactionSchema>;

export const updateExpenseTransactionSchema = z.object({
  id: supplimentalFields.id,
  ...expenseTransactionFields,
});
export type UpdateExpenseTransactionSchema = z.infer<typeof updateExpenseTransactionSchema>;

const incomeTransactionFields = {
  ...transactionFields,
  category: z
    .string()
    .refine((c) => incomeCategories.includes(c as IncomeCategory), 'Invalid category code.')
    .optional(),
};

export const incomeTransactionSchema = z.object({
  ...supplimentalFields,
  ...incomeTransactionFields,
});
export type IncomeTransactionSchema = z.infer<typeof incomeTransactionSchema>;

export const createIncomeTransactionSchema = z.object({
  ...incomeTransactionFields,
});
export type CreateIncomeTransactionSchema = z.infer<typeof createIncomeTransactionSchema>;

export const updateIncomeTransactionSchema = z.object({
  id: supplimentalFields.id,
  ...incomeTransactionFields,
});
export type UpdateIncomeTransactionSchema = z.infer<typeof updateIncomeTransactionSchema>;

export const transactionSchema = z.union([expenseTransactionSchema, incomeTransactionSchema]);
export type TransactionSchema = z.infer<typeof transactionSchema>;
