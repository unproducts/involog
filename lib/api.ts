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
  InvoiceInfoSchema,
  FilterInvoicesSchema,
  DeleteInvoiceSchema,
} from '~~/shared/schemas/invoice';

import type { ItemSchema, MutateItemSchema } from '~~/shared/schemas/item';

import type {
  TransactionSchema,
  CreateTransactionSchema,
  UpdateTransactionSchema,
  FilterTransactionsSchema,
  DeleteTransactionSchema,
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
  fetch(params: FilterInvoicesSchema): Promise<InvoiceInfoSchema[]>;
  fetchById(id: string): Promise<InvoiceInfoSchema | null>;
  loadById(id: string): Promise<InvoiceSchema | null>;
  create(params: CreateInvoiceSchema): Promise<void>;
  update(params: UpdateInvoiceSchema): Promise<void>;
  delete(params: DeleteInvoiceSchema): Promise<void>;
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
  fetch(params: FilterTransactionsSchema): Promise<TransactionSchema[]>;
  fetchById(id: string): Promise<TransactionSchema | null>;
  create(params: CreateTransactionSchema): Promise<void>;
  update(params: UpdateTransactionSchema): Promise<void>;
  delete(params: DeleteTransactionSchema): Promise<void>;
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
