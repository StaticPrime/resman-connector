import { ResManConnector } from '../connector';
import {
  TChartOfAccountResponse,
  AccountingBasis,
  TBalanceResponse,
  TApiResponse,
  TBankAccountPaymentResponse,
  BankAccountMethod,
  TBillingAccountResponse,
  BillingAccountType,
  TransactionCategoryType,
  TTransactionCategoryResponse,
  TLedgerResponse,
  TReceivableResponse,
  TDepositSummaryByCategoryResponse,
  InvoiceStatus,
  TInvoiceResponse,
} from '../types';
import {
  formatDate,
  validateStartAndEndDate,
  createSuccessResponse,
  createErrorResponse,
} from '../utils';

/**
 * Accounting Modules
 * Provides methods for accounting-related operations
 */
export class AccountingModules {
  constructor(private connector: ResManConnector) {}

  /**
   * Validates the bank account dates
   * @param startDate The start date
   * @param endDate The end date
   * @param postedSince The posted since
   * @returns The error response
   */
  private validateBankAccountDates = (
    startDate: Date | undefined,
    endDate: Date | undefined,
    postedSince: Date | undefined
  ): string | undefined => {
    if (!startDate && !endDate && !postedSince) {
      return 'startDate and endDate are required unless postedSince is provided';
    }

    if (startDate && endDate && postedSince) {
      return 'startDate and endDate are not allowed if postedSince is provided';
    }

    return validateStartAndEndDate(startDate, endDate);
  };

  /**
   * Get the Chart of Accounts
   * @param propertyId The ID of the property
   * @returns Chart of accounts
   */
  public async getChartOfAccounts({
    propertyId,
  }: {
    propertyId: string;
  }): Promise<TApiResponse<TChartOfAccountResponse[]>> {
    return this.connector
      .get<{ glAccounts: TChartOfAccountResponse[] }>('/Accounting/ChartOfAccounts', {
        params: { propertyId },
      })
      .then((response) => createSuccessResponse(response.data.glAccounts))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get budget and actual balances
   * @param propertyId The ID of the property
   * @param startMonth The start month
   * @param endMonth The end month
   * @param accountingBasis The accounting basis
   * @returns Balance information
   */
  public async getBalances({
    propertyId,
    startMonth,
    endMonth,
    accountingBasis,
  }: {
    propertyId: string;
    startMonth: Date;
    endMonth: Date;
    accountingBasis: AccountingBasis;
  }): Promise<TApiResponse<TBalanceResponse[]>> {
    if (new Date(startMonth) > new Date(endMonth)) {
      return createErrorResponse(new Error('startMonth must be before endMonth'));
    }
    return this.connector
      .get<{ glAccounts: TBalanceResponse[] }>('/Accounting/Balances', {
        params: {
          propertyId,
          startMonth: formatDate(startMonth),
          endMonth: formatDate(endMonth),
          accountingBasis,
        },
      })
      .then((response) => createSuccessResponse(response.data.glAccounts))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get bank account payments
   * @param propertyId The ID of the property
   * @param bankAccountId The ID of the bank account
   * @param startDate The start date
   * @param endDate The end date
   * @param postedSince The posted since
   * @param methods The methods
   * @returns Bank account payments
   */
  public async getBankAccountPayments({
    propertyId,
    bankAccountId,
    startDate,
    endDate,
    postedSince,
    methods,
  }: {
    propertyId: string;
    bankAccountId?: string;
    startDate?: Date;
    endDate?: Date;
    postedSince?: Date;
    methods?: BankAccountMethod[];
  }): Promise<TApiResponse<TBankAccountPaymentResponse[]>> {
    const errorResponse = this.validateBankAccountDates(startDate, endDate, postedSince);
    if (errorResponse) {
      return createErrorResponse(new Error(errorResponse));
    }

    return this.connector
      .get<{ bankAccounts: TBankAccountPaymentResponse[] }>('/BankAccounts/Payments', {
        params: {
          propertyId,
          bankAccountId,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          postedSince: postedSince ? new Date(postedSince).toUTCString() : undefined,
          methods: methods ? methods.join(',') : undefined,
        },
      })
      .then((response) => createSuccessResponse(response.data.bankAccounts))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get billing accounts
   * GET /BillingAccounts
   * @param propertyId The ID of the property
   * @param modifiedSince The modified since
   * @param includeTransactions The include transactions
   * @param billingAccountId The ID of the billing account
   * @param personId The ID of the person
   * @param accountTypes The account types
   * @returns List of billing accounts
   */
  public async getBillingAccounts({
    propertyId,
    modifiedSince,
    includeTransactions,
    billingAccountId,
    personId,
    accountTypes,
  }: {
    propertyId: string;
    modifiedSince: Date;
    includeTransactions: boolean;
    billingAccountId?: string;
    personId?: string;
    accountTypes?: BillingAccountType[];
  }): Promise<TApiResponse<TBillingAccountResponse[]>> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    if (modifiedSince && modifiedSince > startOfDay) {
      return createErrorResponse(new Error('Modified since must be in the past'));
    }
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 364);
    if (modifiedSince && modifiedSince < oneYearAgo) {
      return createErrorResponse(new Error('Modified since date cannot be more than one year ago'));
    }

    return this.connector
      .get<{ billingAccounts: TBillingAccountResponse[] }>('/BillingAccounts', {
        params: {
          propertyId,
          modifiedSince: modifiedSince.toUTCString(),
          includeTransactions,
          billingAccountId,
          personId,
          accountTypes: accountTypes ? accountTypes.join(',') : undefined,
        },
      })
      .then((response) => createSuccessResponse(response.data.billingAccounts))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get transaction categories for the account
   * GET /Account/TransactionCategories
   * @param types Array of transaction category types
   * @returns List of transaction categories
   */
  public async getTransactionCategories({
    types,
  }: {
    types: TransactionCategoryType[];
  }): Promise<TApiResponse<TTransactionCategoryResponse[]>> {
    return this.connector
      .get<{ categories: TTransactionCategoryResponse[] }>('/TransactionCategories', {
        params: { types: types.join(',') },
      })
      .then((response) => createSuccessResponse(response.data.categories))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get ledger transactions
   * GET /Transactions/Ledger
   * @param propertyId The ID of the property
   * @param billingAccountId The ID of the billing account
   * @param postedSince The posted since
   * @param includeSplitLedger The include split ledger
   * @returns List of ledger transactions
   */
  public async getLedger({
    propertyId,
    billingAccountId,
    postedSince,
    includeSplitLedger,
  }: {
    propertyId: string;
    billingAccountId: string;
    postedSince: Date;
    includeSplitLedger?: boolean;
  }): Promise<TApiResponse<TLedgerResponse[]>> {
    if (postedSince > new Date()) {
      return createErrorResponse(new Error('postedSince cannot be in the future.'));
    }

    return this.connector
      .get<{ transactions: TLedgerResponse[] }>('/Transactions/Ledger', {
        params: {
          propertyId,
          billingAccountId,
          postedSince: postedSince.toUTCString(),
          includeSplitLedger,
        },
      })
      .then((response) => createSuccessResponse(response.data.transactions))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get deposit ledger transactions
   * GET /Transactions/DepositLedger
   * @param propertyId The ID of the property
   * @param billingAccountId The ID of the billing account
   * @param postedSince The posted since
   * @returns List of deposit ledger transactions
   */
  public async getDepositLedger({
    propertyId,
    billingAccountId,
    postedSince,
  }: {
    propertyId: string;
    billingAccountId: string;
    postedSince: Date;
  }): Promise<TApiResponse<TLedgerResponse[]>> {
    if (postedSince > new Date()) {
      return createErrorResponse(new Error('postedSince cannot be in the future.'));
    }

    return this.connector
      .get<{ transactions: TLedgerResponse[] }>('/Transactions/DepositLedger', {
        params: { propertyId, billingAccountId, postedSince: postedSince.toUTCString() },
      })
      .then((response) => createSuccessResponse(response.data.transactions))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get receivables
   * GET /Transactions/Receivables
   * @param propertyId The ID of the property
   * @param date The date
   * @returns List of receivables
   */
  public async getReceivables({
    propertyId,
    date,
  }: {
    propertyId: string;
    date: Date;
  }): Promise<TApiResponse<TReceivableResponse[]>> {
    if (date > new Date()) {
      return createErrorResponse(new Error('date cannot be in the future.'));
    }

    return this.connector
      .get<{ accounts: TReceivableResponse[] }>('/Transactions/Receivables', {
        params: { propertyId, date: formatDate(date) },
      })
      .then((response) => createSuccessResponse(response.data.accounts))
      .catch((error) => createErrorResponse(error));
  }

  public async getDepositSummaryByCategory({
    propertyId,
    date,
    variancesOnly,
    includeZeroDepositsHeldAccounts,
  }: {
    propertyId: string;
    date: Date;
    variancesOnly?: boolean;
    includeZeroDepositsHeldAccounts?: boolean;
  }): Promise<TApiResponse<TDepositSummaryByCategoryResponse[]>> {
    if (date > new Date()) {
      return createErrorResponse(new Error('date cannot be in the future.'));
    }

    return this.connector
      .get<{ accounts: TDepositSummaryByCategoryResponse[] }>(
        '/Transactions/DepositSummaryByCategory',
        {
          params: {
            propertyId,
            date: formatDate(date),
            variancesOnly,
            includeZeroDepositsHeldAccounts,
          },
        }
      )
      .then((response) => createSuccessResponse(response.data.accounts))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get invoices for a property
   * GET /Invoices
   * @param propertyId The ID of the property
   * @param modifiedSince The date to filter invoices by
   * @param invoiceId The ID of the invoice
   * @param number The number of the invoice
   * @param invoiceDateFrom The date to filter invoices by
   * @param invoiceDateTo The date to filter invoices by
   * @param accountingDateFrom The date to filter invoices by
   * @param accountingDateTo The date to filter invoices by
   * @param dueDateFrom The date to filter invoices by
   * @param dueDateTo The date to filter invoices by
   * @param statuses The statuses to filter invoices by
   * @param integrationPartnerId The integration partner ID to filter invoices by
   * @param vendorIds The vendor IDs to filter invoices by
   * @returns List of Invoices
   */
  public async getInvoices({
    propertyId,
    modifiedSince,
    invoiceId,
    number,
    invoiceDateFrom,
    invoiceDateTo,
    accountingDateFrom,
    accountingDateTo,
    dueDateFrom,
    dueDateTo,
    statuses,
    integrationPartnerId,
    vendorIds,
  }: {
    propertyId: string;
    modifiedSince: Date;
    invoiceId?: string;
    number?: string;
    invoiceDateFrom?: Date;
    invoiceDateTo?: Date;
    accountingDateFrom?: Date;
    accountingDateTo?: Date;
    dueDateFrom?: Date;
    dueDateTo?: Date;
    statuses?: InvoiceStatus[];
    integrationPartnerId?: string;
    vendorIds?: string[];
  }): Promise<TApiResponse<TInvoiceResponse[]>> {
    if (modifiedSince > new Date()) {
      return createErrorResponse(new Error('modifiedSince cannot be in the future.'));
    }

    // Validate all date pairs
    const datePairsToValidate = [
      { start: invoiceDateFrom, end: invoiceDateTo },
      { start: accountingDateFrom, end: accountingDateTo },
      { start: dueDateFrom, end: dueDateTo },
    ];

    for (const { start, end } of datePairsToValidate) {
      const errorResponse = validateStartAndEndDate(start, end);
      if (errorResponse) {
        return createErrorResponse(new Error(errorResponse));
      }
    }

    return this.connector
      .get<{ invoices: TInvoiceResponse[] }>('/Invoices', {
        params: {
          propertyId,
          modifiedSince: modifiedSince ? modifiedSince.toUTCString() : undefined,
          invoiceId,
          number,
          invoiceDateFrom: invoiceDateFrom ? formatDate(invoiceDateFrom) : undefined,
          invoiceDateTo: invoiceDateTo ? formatDate(invoiceDateTo) : undefined,
          accountingDateFrom: accountingDateFrom ? formatDate(accountingDateFrom) : undefined,
          accountingDateTo: accountingDateTo ? formatDate(accountingDateTo) : undefined,
          dueDateFrom: dueDateFrom ? formatDate(dueDateFrom) : undefined,
          dueDateTo: dueDateTo ? formatDate(dueDateTo) : undefined,
          statuses: statuses ? statuses.join(',') : undefined,
          integrationPartnerId,
          vendorIds: vendorIds ? vendorIds.join(',') : undefined,
        },
      })
      .then((response) => createSuccessResponse(response.data.invoices))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Pay an invoice
   * POST /Invoices/Pay
   * @param propertyId The ID of the property
   * @param invoiceId The ID of the invoice
   * @param reference The reference of the invoice
   * @param method The method of the invoice
   * @param date The date of the invoice
   * @param amount The amount of the invoice
   * @param memo The memo of the invoice
   * @returns Null
   */
  public async payInvoice({
    propertyId,
    invoiceId,
    reference,
    method,
    date,
    amount,
    memo,
  }: {
    propertyId: string;
    invoiceId: string;
    reference: string;
    method: BankAccountMethod;
    date: Date;
    amount: number;
    memo: string;
  }): Promise<TApiResponse<null>> {
    if (amount <= 0) {
      return createErrorResponse(new Error('amount must be greater than 0'));
    }
    if (date > new Date()) {
      return createErrorResponse(new Error('date cannot be in the future'));
    }

    return this.connector
      .post<null>('/Invoices/Pay', {
        propertyId,
        invoiceId,
        reference,
        method,
        date: formatDate(date),
        amount,
        memo,
      })
      .then(() => createSuccessResponse(null))
      .catch((error) => createErrorResponse(error));
  }
}
