import { adjustmentEntrySchema, type AdjustmentEntrySchema } from '~~/shared/schemas/invoice';

const cachedCurrencyFormatters = new Map<string, Intl.NumberFormat>();

export const formatCurrency = (currency: string, amount: number) => {
  let formatter = cachedCurrencyFormatters.get(currency);
  if (!formatter) {
    // TODO: get locale as parameter and support multiple locales
    formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    });
    cachedCurrencyFormatters.set(currency, formatter);
  }
  return formatter.format(amount);
};

export const formatPercentage = (percentage: number) => {
  return Number(percentage).toFixed(2) + '%';
};

// If the entry is absolute, format as it with currency, else format as percentage
// If entry is discount, format as negative
export const formatAdjustmentEntry = (
  entry: AdjustmentEntrySchema,
  currency: string,
  entryType: 'tax' | 'discount'
) => {
  // validate adjustment entry
  adjustmentEntrySchema.parse(entry);
  let formattedEntry = `${entry.label}`;
  const sign = entryType === 'discount' ? '-' : '';
  if (entry.isAbsolute) {
    const currencyString = formatCurrency(currency, entry.value);
    formattedEntry = `${formattedEntry} (${sign}${currencyString})`;
  } else {
    formattedEntry = `${formattedEntry} (${sign}${entry.value}%)`;
  }
  return formattedEntry;
};
