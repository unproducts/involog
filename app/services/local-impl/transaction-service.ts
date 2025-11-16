import { useLocalStorage } from '@vueuse/core';
import { v4 as uuid } from 'uuid';
import type { TransactionService } from '~~/lib/api';
import { extractDate } from '~~/shared/utils/general';
import {
  createTransactionSchema,
  filterTransactionsSchema,
  updateTransactionSchema,
  type CreateTransactionSchema,
  type DeleteTransactionSchema,
  type FilterTransactionsSchema,
  type TransactionSchema,
  type UpdateTransactionSchema,
} from '~~/shared/schemas/transaction';

export class TransactionServiceImpl implements TransactionService {
  private transactions: Ref<TransactionSchema[]>;

  constructor() {
    this.transactions = useLocalStorage('transactions', []);
  }

  async fetch(params: FilterTransactionsSchema): Promise<TransactionSchema[]> {
    const filterTransactionArgs = filterTransactionsSchema.parse(params);
    let filtered = [...this.transactions.value];

    // Filter by id
    if (filterTransactionArgs.id && filterTransactionArgs.id.length > 0) {
      filtered = filtered.filter((t) => filterTransactionArgs.id!.includes(t.id));
    }

    // Filter by createdAt
    if (filterTransactionArgs.createdAt) {
      filtered = filtered.filter((t) => {
        const createdAt = new Date(t.createdAt);
        const from = filterTransactionArgs.createdAt!.from ? new Date(filterTransactionArgs.createdAt!.from) : null;
        const to = filterTransactionArgs.createdAt!.to ? new Date(filterTransactionArgs.createdAt!.to) : null;
        if (from && createdAt < from) return false;
        if (to && createdAt > to) return false;
        return true;
      });
    }

    // Filter by updatedAt
    if (filterTransactionArgs.updatedAt) {
      filtered = filtered.filter((t) => {
        const updatedAt = new Date(t.updatedAt);
        const from = filterTransactionArgs.updatedAt!.from ? new Date(filterTransactionArgs.updatedAt!.from) : null;
        const to = filterTransactionArgs.updatedAt!.to ? new Date(filterTransactionArgs.updatedAt!.to) : null;
        if (from && updatedAt < from) return false;
        if (to && updatedAt > to) return false;
        return true;
      });
    }

    // Filter by description
    if (filterTransactionArgs.description) {
      const searchTerm = filterTransactionArgs.description.toLowerCase();
      filtered = filtered.filter((t) => t.description.toLowerCase().includes(searchTerm));
    }

    // Filter by amount
    if (filterTransactionArgs.amount) {
      filtered = filtered.filter((t) => {
        const min = filterTransactionArgs.amount!.min;
        const max = filterTransactionArgs.amount!.max;
        if (min !== undefined && t.amount < min) return false;
        if (max !== undefined && t.amount > max) return false;
        return true;
      });
    }

    // Filter by currency
    if (filterTransactionArgs.currency && filterTransactionArgs.currency.length > 0) {
      filtered = filtered.filter((t) => filterTransactionArgs.currency!.includes(t.currency));
    }

    // Filter by date
    if (filterTransactionArgs.date) {
      filtered = filtered.filter((t) => {
        const transactionDate = extractDate(t.date);
        const from = filterTransactionArgs.date!.from ? extractDate(filterTransactionArgs.date!.from) : null;
        const to = filterTransactionArgs.date!.to ? extractDate(filterTransactionArgs.date!.to) : null;
        if (from && transactionDate < from) return false;
        if (to && transactionDate > to) return false;
        return true;
      });
    }

    // Filter by type
    if (filterTransactionArgs.type && filterTransactionArgs.type.length > 0) {
      filtered = filtered.filter((t) => filterTransactionArgs.type!.includes(t.type));
    }

    // Filter by category
    if (filterTransactionArgs.category && filterTransactionArgs.category.length > 0) {
      filtered = filtered.filter((t) => t.category && filterTransactionArgs.category!.includes(t.category));
    }

    // Filter by merchant
    if (filterTransactionArgs.merchant) {
      const searchTerm = filterTransactionArgs.merchant.toLowerCase();
      filtered = filtered.filter((t) => t.merchant?.toLowerCase().includes(searchTerm));
    }

    // Filter by clientId
    if (filterTransactionArgs.clientId && filterTransactionArgs.clientId.length > 0) {
      filtered = filtered.filter((t) => t.clientId && filterTransactionArgs.clientId!.includes(t.clientId));
    }

    // Filter by notes
    if (filterTransactionArgs.notes) {
      const searchTerm = filterTransactionArgs.notes.toLowerCase();
      filtered = filtered.filter((t) => t.notes?.toLowerCase().includes(searchTerm));
    }

    // Filter by isArchived
    if (filterTransactionArgs.isArchived !== undefined) {
      filtered = filtered.filter((t) => t.isArchived === filterTransactionArgs.isArchived);
    }

    return filtered;
  }

  async fetchById(id: string): Promise<TransactionSchema | null> {
    return this.transactions.value.find((t) => t.id === id) || null;
  }

  async create(params: CreateTransactionSchema): Promise<void> {
    const createTransactionArgs = createTransactionSchema.parse(params);
    const transaction: TransactionSchema = {
      ...createTransactionArgs,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.transactions.value.push(transaction);
  }

  async update(params: UpdateTransactionSchema): Promise<void> {
    const updateTransactionArgs = updateTransactionSchema.parse(params);
    const transaction = this.transactions.value.find((t) => t.id === updateTransactionArgs.id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    const { id, ...updateFields } = updateTransactionArgs;
    this.transactions.value = this.transactions.value.map((t) =>
      t.id === id ? { ...t, ...updateFields, updatedAt: new Date().toISOString() } : t
    );
  }

  async delete(params: DeleteTransactionSchema): Promise<void> {
    this.transactions.value = this.transactions.value.filter((t) => t.id !== params.id);
  }
}
