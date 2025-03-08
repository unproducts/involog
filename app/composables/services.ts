import { type ServiceSchema } from '~~/shared/schemas/services';

import { faker } from '@faker-js/faker';
import { currencyCodes } from '~~/shared/consts/currencies';

export function useServices() {
  const {
    data,
    execute,
    refresh: refreshApi,
  } = useAsyncData<ServiceSchema[]>(
    'servicesFakeData',
    () => Promise.all(Array.from({ length: 12 }, makeDummyService)),
    {
      immediate: false,
    }
  );

  const services = useState<ServiceSchema[]>('services', () => []);
  const loading = useState<boolean>('services-loading', () => false);
  const error = useState<string | null>('services-error', () => null);
  const firstFetch = useState<boolean>('services-first-fetch', () => false);

  const setValues = (promise: Promise<any>) => {
    loading.value = true;
    promise
      .then(() => {
        if (data.value) {
          if (!firstFetch.value) firstFetch.value = true;
          services.value = data.value;
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

  const findById = (id: string) => services.value.find((c) => c.id === id);

  return { services, loading, error, refresh, firstFetch, findById };
}

const makeDummyService = () => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: Number(faker.commerce.price()),
  currency: faker.helpers.arrayElement(currencyCodes),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
});
