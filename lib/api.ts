import type { ClientSchema, MutateClientSchema } from '~~/shared/schemas/client';

import type {
  InvoiceSchema,
  CreateInvoiceSchema,
  UpdateInvoiceSchema,
  InvoicePrefixSchema,
  CreateInvoicePrefixSchema,
  UpdateInvoicePrefixSchema,
} from '~~/shared/schemas/invoice';

import type { ItemSchema, CreateItemSchema, UpdateItemSchema } from '~~/shared/schemas/item';

import type {
  TransactionSchema,
  CreateExpenseTransactionSchema,
  CreateIncomeTransactionSchema,
  UpdateExpenseTransactionSchema,
  UpdateIncomeTransactionSchema,
} from '~~/shared/schemas/transaction';

import type { UnitSchema, CreateUnitSchema, UpdateUnitSchema } from '~~/shared/schemas/measurement';

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
  create(params: CreateItemSchema): Promise<void>;
  fetch(): Promise<ItemSchema[]>;
  fetchById(id: string): Promise<ItemSchema | null>;
  update(params: UpdateItemSchema): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface TransactionService {
  createExpense(params: CreateExpenseTransactionSchema): Promise<void>;
  createIncome(params: CreateIncomeTransactionSchema): Promise<void>;
  fetch(): Promise<TransactionSchema[]>;
  fetchById(id: string): Promise<TransactionSchema | null>;
  fetchByType(type: 'I' | 'E'): Promise<TransactionSchema[]>;
  fetchByClient(clientId: string): Promise<TransactionSchema[]>;
  updateExpense(params: UpdateExpenseTransactionSchema): Promise<void>;
  updateIncome(params: UpdateIncomeTransactionSchema): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface UnitService {
  create(params: CreateUnitSchema): Promise<void>;
  fetch(): Promise<UnitSchema[]>;
  fetchById(id: string): Promise<UnitSchema | null>;
  fetchBySymbolSingular(symbol: string): Promise<UnitSchema | null>;
  fetchBySymbolPlural(symbol: string): Promise<UnitSchema | null>;
  update(params: UpdateUnitSchema): Promise<void>;
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
