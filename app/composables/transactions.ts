import { faker } from '@faker-js/faker';
import { watchImmediate } from '@vueuse/core';
import { currencyCodes } from '~~/shared/consts/currencies';
import { expenseCategories, incomeCategories } from '~~/shared/consts/transactions';
import type { TransactionSchema } from '~~/shared/schemas/transactions';

export function useTransactions() {
  const { clients, firstFetch: clientsFirstFetch } = useClients();

  const makeDummyTransaction = () => {
    const trxDate = faker.date.past();
    const type = faker.helpers.arrayElement(['I', 'E']);
    const category =
      type == 'I' ? faker.helpers.arrayElement(incomeCategories) : faker.helpers.arrayElement(expenseCategories);

    const shouldUseClient = faker.datatype.boolean();
    const clientId = shouldUseClient ? faker.helpers.arrayElement(clients.value).id : undefined;
    const merchant = shouldUseClient ? undefined : faker.company.name();

    const transaction = {
      id: faker.string.uuid(),
      description: faker.lorem.sentence(),
      type,
      category,
      clientId,
      merchant,
      amount: Number(faker.finance.amount()),
      currency: faker.helpers.arrayElement(currencyCodes),
      date: formatDate(trxDate),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    } satisfies TransactionSchema;

    return transaction;
  };

  const {
    data,
    execute,
    refresh: refreshApi,
  } = useAsyncData<TransactionSchema[]>(
    'transactionsFakeData',
    async () => Promise.all(Array.from({ length: 80 }, makeDummyTransaction)),
    {
      immediate: false,
    }
  );

  const transactions = useState<TransactionSchema[]>('transactions', () => []);
  const loading = useState<boolean>('transactions-loading', () => false);
  const error = useState<string | null>('transactions-error', () => null);
  const firstFetch = useState<boolean>('transactions-first-fetch', () => false);

  const setValues = (promise: Promise<any>) => {
    loading.value = true;
    promise
      .then(() => {
        if (data.value) {
          transactions.value = data.value;
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
    watchImmediate(clientsFirstFetch, () => {
      if (clientsFirstFetch.value) {
        firstFetch.value = true;
        setValues(execute());
      }
    });
  }

  const refresh = () => {
    setValues(refreshApi());
  };

  return { transactions, loading, error, refresh };
}
