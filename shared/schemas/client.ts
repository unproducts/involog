import { z } from 'zod';
import {
  ArchivableEntityBulkUpdateSchemaFields,
  countryCodeSchema,
  currencyCodeSchema,
  FilterSets,
  supplimentalFields,
  SupplimentalFieldsFilterSet,
} from './_base';

export const clientFields = {
  name: z.string().max(255, 'Name cannot be longer than 255 chars').min(2, 'Name must have atleast 2 chars.'),
  email: z.string().email('Email must be a valid email address').optional(),
  phone: z.string().min(10).max(50).optional(),
  billingAddress: z.string().optional(),
  shippingAddress: z.string().optional(),
  country: countryCodeSchema.optional(),
  taxTag: z.string().optional(),
  taxNumber: z.string().optional(),
  currency: currencyCodeSchema.optional(),
  isArchived: z.boolean().optional(),
};
export const clientSchema = z.object({
  ...supplimentalFields,
  ...clientFields,
});
export type ClientSchema = z.infer<typeof clientSchema>;

export const createClientSchema = z.object({
  ...clientFields,
});
export type CreateClientSchema = z.infer<typeof createClientSchema>;

export const updateClientSchema = z.object({
  id: supplimentalFields.id,
  ...clientFields,
});

export type UpdateClientSchema = z.infer<typeof updateClientSchema>;

export const deleteClientSchema = z.object({
  id: supplimentalFields.id,
});

export type DeleteClientSchema = z.infer<typeof deleteClientSchema>;

export const filterClientsSchema = z.object({
  ...SupplimentalFieldsFilterSet,
  search: FilterSets.string().optional(),
  country: FilterSets.discreteValues(countryCodeSchema).optional(),
  currency: FilterSets.discreteValues(currencyCodeSchema).optional(),
  isArchived: FilterSets.boolean().optional(),
});

export type FilterClientsSchema = z.infer<typeof filterClientsSchema>;

export const updateClientBulkSchema = z.object({
  ...ArchivableEntityBulkUpdateSchemaFields,
});
export type UpdateClientBulkSchema = z.infer<typeof updateClientBulkSchema>;
