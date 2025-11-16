import { useLocalStorage } from '@vueuse/core';
import type { InvoicePrefixService } from '~~/lib/api';
import { v4 as uuid } from 'uuid';
import {
  createInvoicePrefixSchema,
  deleteInvoicePrefixSchema,
  filterInvoicePrefixesSchema,
  updateInvoicePrefixSchema,
  type CreateInvoicePrefixSchema,
  type DeleteInvoicePrefixSchema,
  type FilterInvoicePrefixesSchema,
  type InvoicePrefixSchema,
  type UpdateInvoicePrefixSchema,
} from '~~/shared/schemas/invoice';

export class InvoicePrefixServiceImpl implements InvoicePrefixService {
  private invoicePrefixes: Ref<InvoicePrefixSchema[]>;

  constructor() {
    this.invoicePrefixes = useLocalStorage('invoicePrefixes', []);
  }

  async fetch(params: FilterInvoicePrefixesSchema): Promise<InvoicePrefixSchema[]> {
    const filterArgs = filterInvoicePrefixesSchema.parse(params);
    let filtered = [...this.invoicePrefixes.value];

    if (filterArgs.id && filterArgs.id.length > 0) {
      filtered = filtered.filter((p) => filterArgs.id!.includes(p.id));
    }
    if (filterArgs.createdAt) {
      const { from, to } = filterArgs.createdAt;
      filtered = filtered.filter((p) => {
        const createdAt = new Date(p.createdAt);
        if (from && createdAt < new Date(from)) return false;
        if (to && createdAt > new Date(to)) return false;
        return true;
      });
    }
    if (filterArgs.updatedAt) {
      const { from, to } = filterArgs.updatedAt;
      filtered = filtered.filter((p) => {
        const updatedAt = new Date(p.updatedAt);
        if (from && updatedAt < new Date(from)) return false;
        if (to && updatedAt > new Date(to)) return false;
        return true;
      });
    }
    if (filterArgs.name) {
      const term = filterArgs.name.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(term));
    }

    return filtered;
  }

  async fetchById(id: string): Promise<InvoicePrefixSchema | null> {
    return this.invoicePrefixes.value.find((p) => p.id === id) || null;
  }

  async create(params: CreateInvoicePrefixSchema): Promise<void> {
    const args = createInvoicePrefixSchema.parse(params);
    const prefix: InvoicePrefixSchema = {
      ...args,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.invoicePrefixes.value.push(prefix);
  }

  async update(params: UpdateInvoicePrefixSchema): Promise<void> {
    const args = updateInvoicePrefixSchema.parse(params);
    const existing = this.invoicePrefixes.value.find((p) => p.id === args.id);
    if (!existing) {
      throw new Error('Invoice prefix not found');
    }
    const { id, ...rest } = args;
    this.invoicePrefixes.value = this.invoicePrefixes.value.map((p) =>
      p.id === id ? { ...p, ...rest, updatedAt: new Date().toISOString() } : p
    );
  }

  async delete(params: DeleteInvoicePrefixSchema): Promise<void> {
    const args = deleteInvoicePrefixSchema.parse(params);
    this.invoicePrefixes.value = this.invoicePrefixes.value.filter((p) => p.id !== args.id);
  }
}
