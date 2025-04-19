import { faker } from '@faker-js/faker';
import { currencyCodes } from '~~/shared/consts/currencies';
import type {
  InvoicePrefixSchema,
  InvoiceSchema,
  TaxEntrySchema,
  DiscountEntrySchema,
} from '~~/shared/schemas/invoice';
import type { ItemSchema } from '~~/shared/schemas/item';

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

const makeDummyInvoice = (clientIds: string[], prefixIds: string[], items: ItemSchema[]): InvoiceSchema => ({
  id: faker.string.uuid(),
  clientId: faker.helpers.arrayElement(clientIds),
  subject: faker.commerce.productDescription(),
  prefixId: faker.helpers.arrayElement(prefixIds),
  number: faker.string.numeric(3),
  date: faker.date.past().toISOString().split('T')[0]!,
  dueDate: faker.date.past().toISOString().split('T')[0]!,
  currency: faker.helpers.arrayElement(currencyCodes),
  items: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
    itemId: faker.helpers.arrayElement(items.map((i) => i.id)),
    quantity: faker.number.int({ min: 1, max: 10 }),
    narration: faker.commerce.productDescription(),
  })),
  taxes: Array.from({ length: faker.number.int({ min: 0, max: 2 }) }, () => ({
    value: faker.number.int({ min: 5, max: 20 }),
    label: faker.commerce.productAdjective(),
    isAbsolute: faker.datatype.boolean(),
  })) as TaxEntrySchema[],
  discounts: Array.from({ length: faker.number.int({ min: 0, max: 2 }) }, () => ({
    value: faker.number.int({ min: 5, max: 20 }),
    label: faker.commerce.productAdjective(),
    isAbsolute: faker.datatype.boolean(),
  })) as DiscountEntrySchema[],
  note: faker.lorem.sentence(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
});

export const useInvoicesStore = defineStore('invoice', () => {
  const clientsStore = useClientsStore();
  const invoicePrefixesStore = useInvoicePrefixesStore();
  const itemsStore = useItemsStore();

  const invoices = ref<InvoiceSchema[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetchInvoices = async () => {
    try {
      console.log('fetching invoices');
      loading.value = true;
      const clientIds = clientsStore.clients.map((c) => c.id);
      const invoicePrefixIds = invoicePrefixesStore.invoicePrefixes.map((p) => p.id);
      invoices.value = Array.from({ length: 5 }, () => makeDummyInvoice(clientIds, invoicePrefixIds, itemsStore.items));
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
