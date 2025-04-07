import { faker } from '@faker-js/faker';
import type { InvoicePrefixSchema, InvoiceSchema } from '~~/shared/schemas/invoice';

export const useInvoicePrefixesStore = defineStore('invoicePrefix', () => {
  const invoicePrefixes = ref<InvoicePrefixSchema[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetchInvoicePrefixes = async () => {
    try {
      loading.value = true;
      invoicePrefixes.value = Array.from({ length: 12 }, () => makeDummyInvoicePrefix());
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };
  callOnce(fetchInvoicePrefixes);

  const findById = (id: string) => invoicePrefixes.value.find((c) => c.id === id);

  return { invoicePrefixes, findById, refresh: fetchInvoicePrefixes, loading, error };
});

const makeDummyInvoicePrefix = (): InvoicePrefixSchema => ({
  id: faker.string.uuid(),
  name: faker.string.alphanumeric({ length: { min: 2, max: 4 }, casing: 'upper' }),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
});

export const useInvoicesStore = defineStore('invoice', () => {
  const invoices = ref<InvoiceSchema[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetchInvoices = async () => {
    try {
      console.log('fetching invoices');
      loading.value = true;
      invoices.value = [];
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };
  callOnce(fetchInvoices);

  const findById = (id: string) => invoices.value.find((c) => c.id === id);

  return { invoices, findById, refresh: fetchInvoices, loading, error };
});
