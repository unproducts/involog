import { z } from 'zod';

export const supplimentalFields = {
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
} as const;
