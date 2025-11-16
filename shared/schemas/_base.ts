import { z } from 'zod';

export const supplimentalFields = {
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
} as const;

export const FilterSets = {
  discreteValues: (refinement: z.ZodType<string> = z.string()) => z.array(refinement),
  numberRange: () =>
    z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }),
  dateRange: () =>
    z.object({
      from: z.string().refine(isValidDate, 'Date must be formatted with YYYY-MM-DD format.'),
      to: z.string().refine(isValidDate, 'Date must be formatted with YYYY-MM-DD format.'),
    }),
  dateTimeRange: () =>
    z.object({
      from: z.string().datetime(),
      to: z.string().datetime(),
    }),
  string: () => z.string(),
  boolean: () => z.boolean(),
};

export const SupplimentalFieldsFilterSet = {
  id: FilterSets.discreteValues().optional(),
  createdAt: FilterSets.dateTimeRange().optional(),
  updatedAt: FilterSets.dateTimeRange().optional(),
};
