import type {
  ClientSchema,
  CreateClientSchema,
  DeleteClientSchema,
  FilterClientsSchema,
  UpdateClientSchema,
} from '~~/shared/schemas/client';

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
  TransactionSchema,
  CreateExpenseTransactionSchema,
  CreateIncomeTransactionSchema,
  UpdateExpenseTransactionSchema,
  UpdateIncomeTransactionSchema,
} from '~~/shared/schemas/transaction';

import type { UnitSchema, MutateUnitSchema } from '~~/shared/schemas/measurement';

export interface ClientService {
  fetch(params: FilterClientsSchema): Promise<ClientSchema[]>;
  fetchById(id: string): Promise<ClientSchema | null>;
  create(params: CreateClientSchema): Promise<void>;
  update(params: UpdateClientSchema): Promise<void>;
  delete(params: DeleteClientSchema): Promise<void>;
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
