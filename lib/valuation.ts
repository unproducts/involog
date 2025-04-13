import { z } from 'zod';
import { adjustmentEntrySchema, type AdjustmentEntrySchema } from '~~/shared/schemas/invoice';
import { itemSchema, type ItemSchema } from '~~/shared/schemas/item';

export const calculateItemSubtotal = (item: ItemSchema, quantity?: number) => {
  if (!item || !quantity) return 0;

  // validate item
  itemSchema.parse(item);
  z.number().min(0).parse(item.price);

  return item.price * quantity;
};

export const calculateAdjustment = (
  baseAmount: number,
  adjustmentEntry: AdjustmentEntrySchema,
  adjustmentType: 'positive' | 'negative'
) => {
  if (!baseAmount || !adjustmentEntry) return;

  // validate adjustment entry
  adjustmentEntrySchema.parse(adjustmentEntry);
  z.number().min(0).parse(baseAmount);
  z.enum(['positive', 'negative']).parse(adjustmentType);

  const amountMultiplier = adjustmentType === 'positive' ? 1 : -1;
  if (adjustmentEntry.isAbsolute) {
    return baseAmount + adjustmentEntry.value * amountMultiplier;
  }

  return baseAmount + baseAmount * adjustmentEntry.value * amountMultiplier;
};
