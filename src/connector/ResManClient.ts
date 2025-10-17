import { ResManConnector } from './ResManConnector';
import { TResManConfig } from '../types/resmanConnector.type';
import {
  AccountsModules,
  AccountingModules,
  DocumentsModules,
  EmployeesModules,
  LeasesModules,
  NotesModules,
  PickListsModules,
  PropertiesModules,
  ProspectsModules,
  ResidentsModules,
  RentableItemsModules,
  UnitsModules,
  VendorsModules,
  WorkOrdersModules,
} from '../modules';

/**
 * ResMan API Client
 * High-level client that provides organized access to all ResMan API endpoints
 */
export class ResManClient {
  private connector: ResManConnector;

  // Endpoint modules
  public readonly accounts: AccountsModules;
  public readonly accounting: AccountingModules;
  public readonly documents: DocumentsModules;
  public readonly employees: EmployeesModules;
  public readonly leases: LeasesModules;
  public readonly notes: NotesModules;
  public readonly pickLists: PickListsModules;
  public readonly properties: PropertiesModules;
  public readonly prospects: ProspectsModules;
  public readonly residents: ResidentsModules;
  public readonly rentableItems: RentableItemsModules;
  public readonly units: UnitsModules;
  public readonly vendors: VendorsModules;
  public readonly workOrders: WorkOrdersModules;
  /**
   * Creates a new ResMan API client
   * @param config Configuration options
   *
   * @example
   * ```typescript
   * const client = new ResManClient({
   *   integrationPartnerId: 'your-partner-id',
   *   apiKey: 'your-api-key',
   *   accountId: 'client-account-id',
   * });
   *
   * // Use endpoint modules
   * const properties = await client.account.getProperties();
   * const workOrder = await client.workOrders.createWorkOrder({ ... });
   * ```
   */
  constructor(config: TResManConfig) {
    this.connector = new ResManConnector(config);

    // Initialize endpoint modules
    this.accounting = new AccountingModules(this.connector);
    this.accounts = new AccountsModules(this.connector);
    this.documents = new DocumentsModules(this.connector);
    this.employees = new EmployeesModules(this.connector);
    this.leases = new LeasesModules(this.connector);
    this.notes = new NotesModules(this.connector);
    this.pickLists = new PickListsModules(this.connector);
    this.properties = new PropertiesModules(this.connector);
    this.prospects = new ProspectsModules(this.connector);
    this.residents = new ResidentsModules(this.connector);
    this.rentableItems = new RentableItemsModules(this.connector);
    this.units = new UnitsModules(this.connector);
    this.vendors = new VendorsModules(this.connector);
    this.workOrders = new WorkOrdersModules(this.connector);
  }

  /**
   * Get the underlying connector for direct API access
   * Use this when you need to make custom API calls not covered by endpoint modules
   */
  getConnector(): ResManConnector {
    return this.connector;
  }

  /**
   * Update the API credentials
   * @param integrationPartnerId New Integration Partner ID
   * @param apiKey New API key
   */
  updateCredentials(integrationPartnerId: string, apiKey: string): void {
    this.connector.updateCredentials(integrationPartnerId, apiKey);
  }

  /**
   * Update the ResMan Account ID
   * @param accountId New account ID
   */
  updateAccountId(accountId: string): void {
    this.connector.updateAccountId(accountId);
  }

  /**
   * Get the current account ID
   */
  getAccountId(): string {
    return this.connector.getAccountId();
  }
}
