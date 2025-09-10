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

export class DataGatewayImpl implements DataGateway {
  private clientService: ClientService;
  // private invoiceService: InvoiceService;
  // private invoicePrefixService: InvoicePrefixService;
  // private itemService: ItemService;
  // private transactionService: TransactionService;
  // private unitService: UnitService;

  constructor() {
    this.clientService = new ClientServiceImpl();
    // this.invoiceService = new InvoiceServiceImpl();
    // this.invoicePrefixService = new InvoicePrefixServiceImpl();
    // this.itemService = new ItemServiceImpl();
    // this.transactionService = new TransactionServiceImpl();
    // this.unitService = new UnitServiceImpl();
  }

  getClientService(): ClientService {
    return this.clientService;
  }
  getInvoiceService(): InvoiceService {
    throw new Error('Method not implemented.');
  }
  getInvoicePrefixService(): InvoicePrefixService {
    throw new Error('Method not implemented.');
  }
  getItemService(): ItemService {
    throw new Error('Method not implemented.');
  }
  getTransactionService(): TransactionService {
    throw new Error('Method not implemented.');
  }
  getUnitService(): UnitService {
    throw new Error('Method not implemented.');
  }
}
