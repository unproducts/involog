import type {
  ClientService,
  DataGateway,
  InvoicePrefixService,
  InvoiceService,
  ItemService,
  TransactionService,
  UnitService,
} from '~~/lib/api';
import { ClientServiceImpl } from './client-service';
import { InvoiceServiceImpl } from './invoice-service';
import { InvoicePrefixServiceImpl } from './invoice-prefix-service';
import { ItemServiceImpl } from './item-service';
import { TransactionServiceImpl } from './transaction-service';
import { UnitServiceImpl } from './unit-service';

export class DataGatewayImpl implements DataGateway {
  private clientService: ClientService;
  private invoiceService: InvoiceService;
  private invoicePrefixService: InvoicePrefixService;
  private itemService: ItemService;
  private transactionService: TransactionService;
  private unitService: UnitService;

  constructor() {
    this.clientService = new ClientServiceImpl();
    this.invoiceService = new InvoiceServiceImpl();
    this.invoicePrefixService = new InvoicePrefixServiceImpl();
    this.itemService = new ItemServiceImpl();
    this.transactionService = new TransactionServiceImpl();
    this.unitService = new UnitServiceImpl();
  }

  getClientService(): ClientService {
    return this.clientService;
  }
  getInvoiceService(): InvoiceService {
    return this.invoiceService;
  }
  getInvoicePrefixService(): InvoicePrefixService {
    return this.invoicePrefixService;
  }
  getItemService(): ItemService {
    return this.itemService;
  }
  getTransactionService(): TransactionService {
    return this.transactionService;
  }
  getUnitService(): UnitService {
    return this.unitService;
  }
}
