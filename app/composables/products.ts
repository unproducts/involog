import { type ProductSchema } from '~~/shared/schemas/products';

import { faker } from '@faker-js/faker';
import { currencyCodes } from '~~/shared/consts/currencies';

export function useProducts() {
  const {
    data,
    execute,
    refresh: refreshApi,
  } = useAsyncData<ProductSchema[]>(
    'productsFakeData',
    () => Promise.all(Array.from({ length: 12 }, makeDummyProduct)),
    {
      immediate: false,
    }
  );

  const products = useState<ProductSchema[]>('products', () => []);
  const loading = useState<boolean>('products-loading', () => false);
  const error = useState<string | null>('products-error', () => null);
  const firstFetch = useState<boolean>('products-first-fetch', () => false);

  const setValues = (promise: Promise<any>) => {
    loading.value = true;
    promise
      .then(() => {
        if (data.value) {
          if (!firstFetch.value) firstFetch.value = true;
          products.value = data.value;
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

  const findById = (id: string) => products.value.find((c) => c.id === id);

  return { products, loading, error, refresh, firstFetch, findById };
}

const makeDummyProduct = () => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: Number(faker.commerce.price()),
  currency: faker.helpers.arrayElement(currencyCodes),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
});
