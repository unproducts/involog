import { useLocalStorage } from '@vueuse/core';
import { v4 as uuid } from 'uuid';
import type { TransactionService } from '~~/lib/api';
import {
  type CreateExpenseTransactionSchema,
  type CreateIncomeTransactionSchema,
  type MutateTransactionSchema,
  type TransactionSchema,
  type UpdateExpenseTransactionSchema,
  type UpdateIncomeTransactionSchema,
  createExpenseTransactionSchema,
  createIncomeTransactionSchema,
  updateExpenseTransactionSchema,
  updateIncomeTransactionSchema,
  mutateTransactionSchema,
} from '~~/shared/schemas/transaction';

export class TransactionServiceImpl implements TransactionService {
  private transactions: Ref<TransactionSchema[]>;

  constructor() {
    this.transactions = useLocalStorage('transactions', []);
  }
   async create(params: MutateTransactionSchema): Promise<void> {
    const createIncomeArgs = createIncomeTransactionSchema.parse(params);
    const transaction = {
      ...createIncomeArgs,
      type: 'I' as const,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.transactions.value.push(transaction);
  }
  update(id: string, params: MutateTransactionSchema): Promise<void> {
    throw new Error('Method not implemented.');
  }
  archive(id: string): Promise<TransactionSchema> {
    throw new Error('Method not implemented.');
  }
  unarchive(id: string): Promise<TransactionSchema> {
    throw new Error('Method not implemented.');
  }

  async createExpense(params: MutateTransactionSchema): Promise<void> {
    const createExpenseArgs = mutateTransactionSchema.parse(params);
    const transaction = {
      ...createExpenseArgs,
      type: 'E' as const,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.transactions.value.push(transaction);
  }

  async createIncome(params: MutateTransactionSchema): Promise<void> {
    const createIncomeArgs = mutateTransactionSchema.parse(params);
    const transaction = {
      ...createIncomeArgs,
      type: 'I' as const,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.transactions.value.push(transaction);
  }

  async fetch(): Promise<TransactionSchema[]> {
    return this.transactions.value;
  }

  async fetchById(id: string): Promise<TransactionSchema | null> {
    return this.transactions.value.find((transaction) => transaction.id === id) || null;
  }

  async fetchByType(type: 'I' | 'E'): Promise<TransactionSchema[]> {
    return this.transactions.value.filter((transaction) => transaction.type === type);
  }

  async fetchByClient(clientId: string): Promise<TransactionSchema[]> {
    return this.transactions.value.filter((transaction) => transaction.clientId === clientId);
  }

  async updateExpense(id : string ,params: MutateTransactionSchema): Promise<void> {
    const updateExpenseArgs = mutateTransactionSchema.parse(params);
    const transaction = this.transactions.value.find((c) => c.id === id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    if (transaction.type !== 'E') {
      throw new Error('Transaction is not an income transaction');
    }
    this.transactions.value = this.transactions.value.map((c) => (c.id === id ? { ...c, ...updateExpenseArgs } : c));
  }

  async updateIncome(id : string , params: MutateTransactionSchema): Promise<void> {
    const updateExpenseArgs = mutateTransactionSchema.parse(params);
    const transaction = this.transactions.value.find((c) => c.id === id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    if (transaction.type !== 'I') {
      throw new Error('Transaction is not an income transaction');
    }
    this.transactions.value = this.transactions.value.map((c) => (c.id === id ? { ...c, ...updateExpenseArgs } : c));

  }

  async delete(id: string): Promise<void> {
    this.transactions.value = this.transactions.value.filter((transaction) => transaction.id !== id);
  }
}
