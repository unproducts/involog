import { useLocalStorage } from '@vueuse/core';
import type { InvoiceService } from '~~/lib/api';
import { v4 as uuid } from 'uuid';
import {
  createInvoiceSchema,
  deleteInvoiceSchema,
  filterInvoicesSchema,
  updateInvoiceSchema,
  invoiceInfoSchema,
  type CreateInvoiceSchema,
  type DeleteInvoiceSchema,
  type FilterInvoicesSchema,
  type InvoiceInfoSchema,
  type InvoiceSchema,
  type UpdateInvoiceSchema,
  type UpdateInvoiceInfoSchema,
  updateInvoiceInfoSchema,
} from '~~/shared/schemas/invoice';
import { extractDate } from '~~/shared/utils/general';

export class InvoiceServiceImpl implements InvoiceService {
  private invoices: Ref<InvoiceSchema[]>;

  constructor() {
    this.invoices = useLocalStorage('invoices', []);
  }

  async fetch(params: FilterInvoicesSchema): Promise<InvoiceInfoSchema[]> {
    const filterArgs = filterInvoicesSchema.parse(params);
    let filtered = [...this.invoices.value];

    if (filterArgs.id && filterArgs.id.length > 0) {
      filtered = filtered.filter((i) => filterArgs.id!.includes(i.id));
    }
    if (filterArgs.createdAt) {
      const { from, to } = filterArgs.createdAt;
      filtered = filtered.filter((i) => {
        const createdAt = new Date(i.createdAt);
        if (from && createdAt < new Date(from)) return false;
        if (to && createdAt > new Date(to)) return false;
        return true;
      });
    }
    if (filterArgs.updatedAt) {
      const { from, to } = filterArgs.updatedAt;
      filtered = filtered.filter((i) => {
        const updatedAt = new Date(i.updatedAt);
        if (from && updatedAt < new Date(from)) return false;
        if (to && updatedAt > new Date(to)) return false;
        return true;
      });
    }

    if (filterArgs.search) {
      const term = filterArgs.search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.subject?.toLowerCase().includes(term) ||
          i.number.toLowerCase().includes(term) ||
          i.note?.toLowerCase().includes(term)
      );
    }
    if (filterArgs.date) {
      const { from, to } = filterArgs.date;
      filtered = filtered.filter((i) => {
        const date = extractDate(i.date);
        const fromDate = from ? extractDate(from) : null;
        const toDate = to ? extractDate(to) : null;
        if (fromDate && date < fromDate) return false;
        if (toDate && date > toDate) return false;
        return true;
      });
    }
    if (filterArgs.dueDate) {
      const { from, to } = filterArgs.dueDate;
      filtered = filtered.filter((i) => {
        const date = i.dueDate ? extractDate(i.dueDate) : null;
        const fromDate = from ? extractDate(from) : null;
        const toDate = to ? extractDate(to) : null;
        if (date === null) return false;
        if (fromDate && date < fromDate) return false;
        if (toDate && date > toDate) return false;
        return true;
      });
    }
    if (filterArgs.currency && filterArgs.currency.length > 0) {
      filtered = filtered.filter((i) => filterArgs.currency!.includes(i.currency));
    }
    if (filterArgs.clientId && filterArgs.clientId.length > 0) {
      filtered = filtered.filter((i) => filterArgs.clientId!.includes(i.clientId));
    }
    if (filterArgs.items && filterArgs.items.length > 0) {
      filtered = filtered.filter((i) => i.items.some((ie) => filterArgs.items!.includes(ie.itemId)));
    }

    // Map to info shape
    const infos: InvoiceInfoSchema[] = filtered.map((i) =>
      invoiceInfoSchema.parse({
          id: i.id,
          createdAt: i.createdAt,
          updatedAt: i.updatedAt,
          clientId: i.clientId,
          subject: i.subject,
          prefixId: i.prefixId,
          number: i.number,
          date: i.date,
          dueDate: i.dueDate,
          currency: i.currency,
          isArchived: i.isArchived,
        })
    );
    return infos;
  }

  async fetchById(id: string): Promise<InvoiceInfoSchema | null> {
    const inv = this.invoices.value.find((c) => c.id === id);
    if (!inv) return null;
    return invoiceInfoSchema.parse({
      id: inv.id,
      createdAt: inv.createdAt,
      updatedAt: inv.updatedAt,
      clientId: inv.clientId,
      subject: inv.subject,
      prefixId: inv.prefixId,
      number: inv.number,
      date: inv.date,
      dueDate: inv.dueDate,
      currency: inv.currency,
      isArchived: inv.isArchived,
    });
  }

  async loadById(id: string): Promise<InvoiceSchema | null> {
    const invoice = this.invoices.value.find((c) => c.id === id) || null;
    console.log({invoice});
    return invoice
  }

  async create(params: CreateInvoiceSchema): Promise<void> {
    const args = createInvoiceSchema.parse(params);
    const invoice: InvoiceSchema = {
      ...args,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.invoices.value.push(invoice);
  }

  async updateInfo(params: UpdateInvoiceInfoSchema): Promise<void> {
    const args = updateInvoiceInfoSchema.parse(params);
    const existing = this.invoices.value.find((c) => c.id === args.id);
    if (!existing) {
      throw new Error('Invoice not found');
    }
    const { id, ...rest } = args;
    this.invoices.value = this.invoices.value.map((i) =>
      i.id === id ? { ...i, ...rest, updatedAt: new Date().toISOString() } : i
    );
  }

  async update(params: UpdateInvoiceSchema): Promise<void> {
    const args = updateInvoiceSchema.parse(params);
    const existing = this.invoices.value.find((c) => c.id === args.id);
    if (!existing) {
      throw new Error('Invoice not found');
    }
    const { id, ...rest } = args;
    this.invoices.value = this.invoices.value.map((i) =>
      i.id === id ? { ...i, ...rest, updatedAt: new Date().toISOString() } : i
    );
  }

  async delete(params: DeleteInvoiceSchema): Promise<void> {
    const args = deleteInvoiceSchema.parse(params);
    this.invoices.value = this.invoices.value.filter((i) => i.id !== args.id);
  }
}
