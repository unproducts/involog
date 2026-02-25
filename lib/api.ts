import type {
  ClientSchema,
  CreateClientSchema,
  DeleteClientSchema,
  FilterClientsSchema,
  UpdateClientBulkSchema,
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
  DeleteInvoicePrefixSchema,
  FilterInvoicePrefixesSchema,
  UpdateInvoiceInfoSchema,
} from '~~/shared/schemas/invoice';

import type {
  ItemSchema,
  CreateItemSchema,
  UpdateItemSchema,
  DeleteItemSchema,
  FilterItemsSchema,
} from '~~/shared/schemas/item';

import type {
  TransactionSchema,
  CreateTransactionSchema,
  UpdateTransactionSchema,
  FilterTransactionsSchema,
  DeleteTransactionSchema,
} from '~~/shared/schemas/transaction';

import type {
  UnitSchema,
  CreateUnitSchema,
  UpdateUnitSchema,
  DeleteUnitSchema,
  FilterUnitsSchema,
} from '~~/shared/schemas/unit';

export interface ClientService {
  fetch(params: FilterClientsSchema): Promise<ClientSchema[]>;
  fetchById(id: string): Promise<ClientSchema | null>;
  create(params: CreateClientSchema): Promise<void>;
  update(params: UpdateClientSchema): Promise<void>;
  updateBulk(params: UpdateClientBulkSchema): Promise<void>;
  delete(params: DeleteClientSchema): Promise<void>;
}

export interface InvoiceService {
  fetch(params: FilterInvoicesSchema): Promise<InvoiceInfoSchema[]>;
  fetchById(id: string): Promise<InvoiceInfoSchema | null>;
  loadById(id: string): Promise<InvoiceSchema | null>;
  create(params: CreateInvoiceSchema): Promise<void>;
  update(params: UpdateInvoiceSchema): Promise<void>;
  updateInfo(params: UpdateInvoiceInfoSchema): Promise<void>;
  delete(params: DeleteInvoiceSchema): Promise<void>;
}

export interface InvoicePrefixService {
  fetch(params: FilterInvoicePrefixesSchema): Promise<InvoicePrefixSchema[]>;
  fetchById(id: string): Promise<InvoicePrefixSchema | null>;
  create(params: CreateInvoicePrefixSchema): Promise<void>;
  update(params: UpdateInvoicePrefixSchema): Promise<void>;
  delete(params: DeleteInvoicePrefixSchema): Promise<void>;
}

export interface ItemService {
  fetch(params: FilterItemsSchema): Promise<ItemSchema[]>;
  fetchById(id: string): Promise<ItemSchema | null>;
  create(params: CreateItemSchema): Promise<void>;
  update(params: UpdateItemSchema): Promise<void>;
  delete(params: DeleteItemSchema): Promise<void>;
}

export interface TransactionService {
  fetch(params: FilterTransactionsSchema): Promise<TransactionSchema[]>;
  fetchById(id: string): Promise<TransactionSchema | null>;
  create(params: CreateTransactionSchema): Promise<void>;
  update(params: UpdateTransactionSchema): Promise<void>;
  delete(params: DeleteTransactionSchema): Promise<void>;
}

export interface UnitService {
  fetch(params: FilterUnitsSchema): Promise<UnitSchema[]>;
  fetchById(id: string): Promise<UnitSchema | null>;
  create(params: CreateUnitSchema): Promise<void>;
  update(params: UpdateUnitSchema): Promise<void>;
  delete(params: DeleteUnitSchema): Promise<void>;
}

export interface DataGateway {
  getClientService(): ClientService;
  getInvoiceService(): InvoiceService;
  getInvoicePrefixService(): InvoicePrefixService;
  getItemService(): ItemService;
  getTransactionService(): TransactionService;
  getUnitService(): UnitService;
}
