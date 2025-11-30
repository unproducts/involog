import { z } from 'zod';
import { currencyCodes } from '../consts/currencies';
import { countryCodes } from '../consts/countries';

export const supplimentalFields = {
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
} as const;

export const currencyCodeSchema = z
  .string()
  .refine((c) => currencyCodes.includes(c), 'Invalid currency code. Must be a valid ISO 3166 three-letter code.');
export type CurrencyCodeSchema = z.infer<typeof currencyCodeSchema>;

export const countryCodeSchema = z
  .string()
  .refine((c) => countryCodes.includes(c), 'Invalid country code. Must be a valid ISO 4217 three-letter code.');
export type CountryCodeSchema = z.infer<typeof countryCodeSchema>;

export const dateRangeSchema = z.object({
  from: z.string().refine(isValidDate, 'Date must be formatted with YYYY-MM-DD format.'),
  to: z.string().refine(isValidDate, 'Date must be formatted with YYYY-MM-DD format.'),
});
export type DateRangeSchema = z.infer<typeof dateRangeSchema>;

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
  dateTimeRange: () => dateRangeSchema,
  string: () => z.string(),
  boolean: () => z.boolean(),
};

export const SupplimentalFieldsFilterSet = {
  id: FilterSets.discreteValues().optional(),
  createdAt: FilterSets.dateTimeRange().optional(),
  updatedAt: FilterSets.dateTimeRange().optional(),
};
