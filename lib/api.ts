import type { ClientSchema, MutateClientSchema } from '~~/shared/schemas/client';

import type {
  InvoiceSchema,
  CreateInvoiceSchema,
  UpdateInvoiceSchema,
  InvoicePrefixSchema,
  CreateInvoicePrefixSchema,
  UpdateInvoicePrefixSchema,
} from '~~/shared/schemas/invoice';

import type { ItemSchema, MutateItemSchema } from '~~/shared/schemas/item';

import type {
  MutateTransactionSchema,
  mutateTransactionSchema,
  TransactionSchema,
  CreateExpenseTransactionSchema,
  CreateIncomeTransactionSchema,
  UpdateExpenseTransactionSchema,
  UpdateIncomeTransactionSchema,
} from '~~/shared/schemas/transaction';

import type { UnitSchema, MutateUnitSchema } from '~~/shared/schemas/measurement';

export interface ClientService {
  create(params: MutateClientSchema): Promise<void>;
  fetch(): Promise<ClientSchema[]>;
  fetchById(id: string): Promise<ClientSchema | null>;
  update(id: string, params: MutateClientSchema): Promise<void>;
  delete(id: string): Promise<void>;
  archive(id: string): Promise<ClientSchema>;
  unarchive(id: string): Promise<ClientSchema>;
}

export interface InvoiceService {
  create(params: CreateInvoiceSchema): Promise<void>;
  fetch(): Promise<InvoiceSchema[]>;
  fetchById(id: string): Promise<InvoiceSchema | null>;
  update(params: UpdateInvoiceSchema): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface InvoicePrefixService {
  create(params: CreateInvoicePrefixSchema): Promise<void>;
  fetch(): Promise<InvoicePrefixSchema[]>;
  fetchById(id: string): Promise<InvoicePrefixSchema | null>;
  update(params: UpdateInvoicePrefixSchema): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface ItemService {
  create(params: MutateItemSchema): Promise<void>;
  fetch(): Promise<ItemSchema[]>;
  fetchById(id: string): Promise<ItemSchema | null>;
  update(id: string, params: MutateItemSchema): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface TransactionService {
  create(params: MutateTransactionSchema): Promise<void>;
  createExpense(params: MutateTransactionSchema): Promise<void>;
  createIncome(params: MutateTransactionSchema): Promise<void>;
  update(id: string, params: MutateTransactionSchema): Promise<void>;
  updateExpense(id: string, params: MutateTransactionSchema): Promise<void>;
  updateIncome(id: string, params: MutateTransactionSchema): Promise<void>;
  archive(id: string): Promise<TransactionSchema>;
  unarchive(id: string): Promise<TransactionSchema>;
  fetch(): Promise<TransactionSchema[]>;
  fetchById(id: string): Promise<TransactionSchema | null>;
  fetchByType(type: 'I' | 'E'): Promise<TransactionSchema[]>;
  fetchByClient(clientId: string): Promise<TransactionSchema[]>;
  delete(id: string): Promise<void>;
}

export interface UnitService {
  create(params: MutateUnitSchema): Promise<void>;
  fetch(): Promise<UnitSchema[]>;
  fetchById(id: string): Promise<UnitSchema | null>;
  fetchBySymbolSingular(symbol: string): Promise<UnitSchema | null>;
  fetchBySymbolPlural(symbol: string): Promise<UnitSchema | null>;
  update(id: string, params: MutateUnitSchema): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface DataGateway {
  getClientService(): ClientService;
  getInvoiceService(): InvoiceService;
  getInvoicePrefixService(): InvoicePrefixService;
  getItemService(): ItemService;
  getTransactionService(): TransactionService;
  getUnitService(): UnitService;
}
