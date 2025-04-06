import { faker } from '@faker-js/faker';
import { currencyCodes } from '~~/shared/consts/currencies';
import { expenseCategories, incomeCategories } from '~~/shared/consts/transactions';
import type { ClientSchema } from '~~/shared/schemas/client';
import type { TransactionSchema } from '~~/shared/schemas/transaction';

export const useTransactionsStore = defineStore('transactions', () => {
  const { clients } = storeToRefs(useClientsStore());

  const transactions = ref<TransactionSchema[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetchTransactions = () => {
    try {
      console.log('fetching transactions');
      loading.value = true;
      transactions.value = Array.from({ length: 12 }, () => makeDummyTransaction(clients.value));
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };
  callOnce(fetchTransactions);

  const findById = (id: string) => transactions.value.find((t) => t.id === id);

  return { transactions, findById, refresh: fetchTransactions, loading, error };
});

const makeDummyTransaction = (clients: ClientSchema[]) => {
  const trxDate = faker.date.past();
  const type = faker.helpers.arrayElement(['I', 'E']);
  const category =
    type == 'I' ? faker.helpers.arrayElement(incomeCategories) : faker.helpers.arrayElement(expenseCategories);

  const shouldUseClient = faker.datatype.boolean();
  const clientId = shouldUseClient ? faker.helpers.arrayElement(clients).id : undefined;
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
