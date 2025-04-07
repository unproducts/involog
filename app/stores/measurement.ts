import { faker } from '@faker-js/faker';
import type { UnitSchema } from '~~/shared/schemas/measurement';

export const useUnitsStore = defineStore('unit', () => {
  const loading = ref(false);
  const units = ref<UnitSchema[]>([]);
  const error = ref<Error | null>(null);

  const fetchUnits = async () => {
    try {
      console.log('fetching units');
      loading.value = true;
      units.value = prefilledUnits;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };
  callOnce(fetchUnits);

  const findById = (id: string) => units.value.find((c) => c.id === id);
  const findBySymbolSingular = (symbolSingular: string) => units.value.find((c) => c.symbolSingular === symbolSingular);
  const findBySymbolPlural = (symbolPlural: string) => units.value.find((c) => c.symbolPlural === symbolPlural);

  return { units, findById, findBySymbolSingular, findBySymbolPlural, refresh: fetchUnits, loading, error };
});

const prefilledUnits: UnitSchema[] = [
  {
    id: faker.string.uuid(),
    name: 'Hours',
    symbolSingular: 'Hr',
    symbolPlural: 'Hrs',
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  },
  {
    id: faker.string.uuid(),
    name: 'Days',
    symbolSingular: 'D',
    symbolPlural: 'Ds',
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  },

  {
    id: faker.string.uuid(),
    name: 'Weeks',
    symbolSingular: 'W',
    symbolPlural: 'Ws',
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  },
  {
    id: faker.string.uuid(),
    name: 'Months',
    symbolSingular: 'M',
    symbolPlural: 'Ms',
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  },
  {
    id: faker.string.uuid(),
    name: 'Years',
    symbolSingular: 'Y',
    symbolPlural: 'Ys',
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  },
  {
    id: faker.string.uuid(),
    name: 'Unit',
    symbolSingular: 'Unit',
    symbolPlural: 'Units',
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  },
];
