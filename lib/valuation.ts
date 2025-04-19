import { z } from 'zod';
import {
  adjustmentEntrySchema,
  type AdjustmentEntrySchema,
  type InvoiceSchema,
  invoiceSchema,
} from '~~/shared/schemas/invoice';
import { itemSchema, type ItemSchema } from '~~/shared/schemas/item';

export const calculateInvoiceTotal = (invoice: InvoiceSchema, getItemById: (id: string) => ItemSchema | undefined) => {
  invoiceSchema.parse(invoice);

  const itemEntries = invoice.items.map((item) => ({ item: getItemById(item.itemId), quantity: item.quantity }));
  const itemsValue = itemEntries.reduce((acc, item) => acc + calculateItemSubtotal(item.item, item.quantity), 0);

  const taxAdjustments = invoice.taxes
    .map((adjustment) => calculateAdjustment(itemsValue, adjustment, 'positive'))
    .reduce((acc, adjustment) => (acc || 0) + (adjustment || 0), 0)!;

  const discountAdjustments = invoice.discounts
    .map((adjustment) => calculateAdjustment(itemsValue, adjustment, 'negative'))
    .reduce((acc, adjustment) => (acc || 0) + (adjustment || 0), 0)!;

  return itemsValue + taxAdjustments + discountAdjustments;
};

export const calculateItemSubtotal = (item?: ItemSchema, quantity?: number) => {
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

  return baseAmount + baseAmount * (adjustmentEntry.value / 100) * amountMultiplier;
};
