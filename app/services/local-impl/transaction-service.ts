import { useLocalStorage } from '@vueuse/core';
import { v4 as uuid } from 'uuid';
import type { TransactionService } from '~~/lib/api';
import {
  type CreateExpenseTransactionSchema,
  type CreateIncomeTransactionSchema,
  type TransactionSchema,
  type UpdateExpenseTransactionSchema,
  type UpdateIncomeTransactionSchema,
  createExpenseTransactionSchema,
  createIncomeTransactionSchema,
  updateExpenseTransactionSchema,
  updateIncomeTransactionSchema,
} from '~~/shared/schemas/transaction';

export class TransactionServiceImpl implements TransactionService {
  private transactions: Ref<TransactionSchema[]>;

  constructor() {
    this.transactions = useLocalStorage('transactions', []);
  }

  async createExpense(params: CreateExpenseTransactionSchema): Promise<void> {
    const createExpenseArgs = createExpenseTransactionSchema.parse(params);
    const transaction = {
      ...createExpenseArgs,
      type: 'E' as const,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.transactions.value.push(transaction);
  }

  async createIncome(params: CreateIncomeTransactionSchema): Promise<void> {
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

  async updateExpense(params: UpdateExpenseTransactionSchema): Promise<void> {
    const updateExpenseArgs = updateExpenseTransactionSchema.parse(params);
    const transaction = this.transactions.value.find((t) => t.id === updateExpenseArgs.id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    if (transaction.type !== 'E') {
      throw new Error('Transaction is not an expense transaction');
    }
    this.transactions.value = this.transactions.value.map((t) =>
      t.id === updateExpenseArgs.id ? { ...t, ...updateExpenseArgs, updatedAt: new Date().toISOString() } : t
    );
  }

  async updateIncome(params: UpdateIncomeTransactionSchema): Promise<void> {
    const updateIncomeArgs = updateIncomeTransactionSchema.parse(params);
    const transaction = this.transactions.value.find((t) => t.id === updateIncomeArgs.id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    if (transaction.type !== 'I') {
      throw new Error('Transaction is not an income transaction');
    }
    this.transactions.value = this.transactions.value.map((t) =>
      t.id === updateIncomeArgs.id ? { ...t, ...updateIncomeArgs, updatedAt: new Date().toISOString() } : t
    );
  }

  async delete(id: string): Promise<void> {
    this.transactions.value = this.transactions.value.filter((transaction) => transaction.id !== id);
  }
}
