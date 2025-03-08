import { type ClientSchema } from '~~/shared/schemas/clients';

import { faker } from '@faker-js/faker';
import { countryCodes } from '~~/shared/consts/countries';
import { currencyCodes } from '~~/shared/consts/currencies';

export function useClients() {
  const {
    data,
    execute,
    refresh: refreshApi,
  } = useAsyncData<ClientSchema[]>('clientsFakeData', () => Promise.all(Array.from({ length: 12 }, makeDummyClient)), {
    immediate: false,
  });

  const clients = useState<ClientSchema[]>('clients', () => []);
  const loading = useState<boolean>('clients-loading', () => false);
  const error = useState<string | null>('clients-error', () => null);
  const firstFetch = useState<boolean>('clients-first-fetch', () => false);

  const setValues = (promise: Promise<any>) => {
    loading.value = true;
    promise
      .then(() => {
        if (data.value) {
          if (!firstFetch.value) firstFetch.value = true;
          clients.value = data.value;
        }
      })
      .catch((err) => {
        error.value = err.message;
      })
      .finally(() => {
        loading.value = false;
      });
  };

  if (!firstFetch.value) {
    setValues(execute());
  }

  const refresh = () => {
    setValues(refreshApi());
  };

  const findById = (id: string) => clients.value.find((c) => c.id === id);

  return { clients, loading, error, refresh, firstFetch, findById };
}

const makeDummyClient = () => ({
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
