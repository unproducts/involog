import { useLocalStorage } from '@vueuse/core';
import type { InvoicePrefixService } from '~~/lib/api';
import { v4 as uuid } from 'uuid';
import {
  createInvoicePrefixSchema,
  updateInvoicePrefixSchema,
  type CreateInvoicePrefixSchema,
  type InvoicePrefixSchema,
  type UpdateInvoicePrefixSchema,
} from '~~/shared/schemas/invoice';

export class InvoicePrefixServiceImpl implements InvoicePrefixService {
  private invoicePrefixes: Ref<InvoicePrefixSchema[]>;

  constructor() {
    this.invoicePrefixes = useLocalStorage('invoicePrefixes', []);
  }

  async create(params: CreateInvoicePrefixSchema): Promise<void> {
    const createInvoicePrefixArgs = createInvoicePrefixSchema.parse(params);
    const invoicePrefix = {
      ...createInvoicePrefixArgs,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.invoicePrefixes.value.push(invoicePrefix);
  }

  async fetch(): Promise<InvoicePrefixSchema[]> {
    return this.invoicePrefixes.value;
  }

  async fetchById(id: string): Promise<InvoicePrefixSchema | null> {
    return this.invoicePrefixes.value.find((prefix) => prefix.id === id) || null;
  }

  async update(params: UpdateInvoicePrefixSchema): Promise<void> {
    const updateInvoicePrefixArgs = updateInvoicePrefixSchema.parse(params);
    const invoicePrefix = this.invoicePrefixes.value.find((prefix) => prefix.id === updateInvoicePrefixArgs.id);
    if (!invoicePrefix) {
      throw new Error('Invoice prefix not found');
    }
    this.invoicePrefixes.value = this.invoicePrefixes.value.map((prefix) =>
      prefix.id === updateInvoicePrefixArgs.id 
        ? { ...prefix, ...updateInvoicePrefixArgs, updatedAt: new Date().toISOString() }
        : prefix
    );
  }

  async delete(id: string): Promise<void> {
    this.invoicePrefixes.value = this.invoicePrefixes.value.filter((prefix) => prefix.id !== id);
  }
}
