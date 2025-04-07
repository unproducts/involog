import { faker } from '@faker-js/faker';
import { countryCodes } from '~~/shared/consts/countries';
import { currencyCodes } from '~~/shared/consts/currencies';
import type { ClientSchema } from '~~/shared/schemas/client';

export const useClientsStore = defineStore('client', () => {
  const loading = ref(false);
  const clients = ref<ClientSchema[]>([]);
  const error = ref<Error | null>(null);

  const fetchClients = async () => {
    try {
      loading.value = true;
      console.log('fetching clients');
      clients.value = Array.from({ length: 12 }, makeDummyClient);
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };
  callOnce(fetchClients);

  const findById = (id: string) => clients.value.find((c) => c.id === id);

  return { clients, findById, refresh: fetchClients, loading, error };
});

const makeDummyClient = (): ClientSchema => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  billingAddress: faker.location.streetAddress(),
  shippingAddress: faker.location.streetAddress(),
  country: faker.helpers.arrayElement(countryCodes),
  taxTag: faker.lorem.word(),
  taxNumber: faker.finance.accountNumber(),
  currency: faker.helpers.arrayElement(currencyCodes),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});
