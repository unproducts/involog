import { faker } from '@faker-js/faker';
import { currencyCodes } from '~~/shared/consts/currencies';
import type { ItemSchema } from '~~/shared/schemas/item';
import type { UnitSchema } from '~~/shared/schemas/measurement';

export const useItemsStore = defineStore('item', () => {
  const { units } = storeToRefs(useUnitsStore());

  const items = ref<ItemSchema[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetchItems = async () => {
    try {
      console.log('fetching items');
      loading.value = true;
      items.value = Array.from({ length: 12 }, () => makeDummyItem(units.value));
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };
  callOnce(fetchItems);

  const findById = (id: string) => items.value.find((c) => c.id === id);

  return { items, findById, refresh: fetchItems, loading, error };
});

const makeDummyItem = (units: UnitSchema[]): ItemSchema => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  unitId: faker.helpers.arrayElement(units).id,
  price: Number(faker.commerce.price()),
  isService: false,
  currency: faker.helpers.arrayElement(currencyCodes),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
});
