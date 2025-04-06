import { z } from 'zod';
import { supplimentalFields } from './_base';

const unitFields = {
  name: z.string().max(255, 'Name cannot be longer than 255 chars').min(2, 'Name must have atleast 2 chars.'),
  symbolSingular: z
    .string()
    .max(255, 'Symbol singular cannot be longer than 255 chars')
    .min(2, 'Symbol singular must have atleast 2 chars.'),
  symbolPlural: z
    .string()
    .max(255, 'Symbol plural cannot be longer than 255 chars')
    .min(2, 'Symbol plural must have atleast 2 chars.'),
};

export const unitSchema = z.object({
  ...supplimentalFields,
  ...unitFields,
});
export type UnitSchema = z.infer<typeof unitSchema>;

export const createUnitSchema = z.object({
  ...unitFields,
});
export type CreateUnitSchema = z.infer<typeof createUnitSchema>;

export const updateUnitSchema = z.object({
  id: supplimentalFields.id,
  ...unitFields,
});
export type UpdateUnitSchema = z.infer<typeof updateUnitSchema>;
