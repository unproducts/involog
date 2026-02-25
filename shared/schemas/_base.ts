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

export const numberRangeSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
});
export type NumberRangeSchema = z.infer<typeof numberRangeSchema>;

export const dateTimeRangeSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
});
export type DateTimeRangeSchema = z.infer<typeof dateTimeRangeSchema>;

export const FilterSets = {
  discreteValues: (refinement: z.ZodType<string> = z.string()) => z.array(refinement),
  numberRange: () => numberRangeSchema,
  dateRange: () => dateRangeSchema,
  dateTimeRange: () => dateTimeRangeSchema,
  string: () => z.string(),
  boolean: () => z.boolean(),
};

export const SupplimentalFieldsFilterSet = {
  id: FilterSets.discreteValues().optional(),
  createdAt: FilterSets.dateTimeRange().optional(),
  updatedAt: FilterSets.dateTimeRange().optional(),
};

export const BaseBulkActions = ['delete'] as const;
export const ArchivableEntityBulkActions = [...BaseBulkActions, 'archive', 'unarchive'] as const;

export const BulkUpdateFieldTypes = {
  discreteValues: (refinement: z.ZodType<string> = z.string()) => z.array(refinement),
  actions: <T extends readonly [string, ...string[]]>(refinement: T) => z.enum(refinement),
};

export const DefaultBulkUpdateSchemaFields = {
  ids: BulkUpdateFieldTypes.discreteValues(),
  action: BulkUpdateFieldTypes.actions(BaseBulkActions),
};

export const ArchivableEntityBulkUpdateSchemaFields = {
  ...DefaultBulkUpdateSchemaFields,
  action: BulkUpdateFieldTypes.actions(ArchivableEntityBulkActions),
};
