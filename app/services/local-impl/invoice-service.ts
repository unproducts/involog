import { useLocalStorage } from '@vueuse/core';
import type { InvoiceService } from '~~/lib/api';
import { v4 as uuid } from 'uuid';
import type { ClientSchema } from '~~/shared/schemas/client';
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  type CreateInvoiceSchema,
  type InvoiceSchema,
  type UpdateInvoiceSchema,
} from '~~/shared/schemas/invoice';

export class InvoiceServiceImpl implements InvoiceService {
  private invoices: Ref<InvoiceSchema[]>;

  constructor() {
    this.invoices = useLocalStorage('invoices', []);
  }

  async create(params: CreateInvoiceSchema): Promise<void> {
    const createInvoiceArgs = createInvoiceSchema.parse(params);
    const invoice = {
      ...createInvoiceArgs,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.invoices.value.push(invoice);
  }

  async fetch(): Promise<InvoiceSchema[]> {
    return this.invoices.value;
  }

  async fetchById(id: string): Promise<InvoiceSchema | null> {
    return this.invoices.value.find((c) => c.id === id) || null;
  }

  async update(params: UpdateInvoiceSchema): Promise<void> {
    const updateInvoiceArgs = updateInvoiceSchema.parse(params);
    const invoice = this.invoices.value.find((c) => c.id === updateInvoiceArgs.id);
    if (!invoice) {
      throw new Error('Client not found');
    }
    this.invoices.value = this.invoices.value.map((c) =>
      c.id === updateInvoiceArgs.id ? { ...c, ...updateInvoiceArgs } : c
    );
  }

  async delete(id: string): Promise<void> {
    this.invoices.value = this.invoices.value.filter((c) => c.id !== id);
  }
}
