export enum TransactionCategoryType {
  CREDIT = 'Credit',
  CHARGE = 'Charge',
  PAYMENT = 'Payment',
  DEPOSIT = 'Deposit',
}

export type TTransactionCategoryRequest = {
  types: TransactionCategoryType[];
};

export type TTransactionGLAccount = {
  glAccountId: string;
  number: string;
  name: string;
  type: string;
};

export type TTransactionCategoryResponse = {
  transactionCategoryId: string;
  abbreviation: string;
  name: string;
  type: TransactionCategoryType;
  isRent: boolean;
  isRecurringMonthlyRentConcession: boolean;
  isOneTimeConcession: boolean;
  glAccount: TTransactionGLAccount;
};

export enum AccountingBasis {
  CASH = 'Cash',
  ACCRUAL = 'Accrual',
}

export enum GLAccountType {
  BANK = 'Bank',
  ACCOUNTS_RECEIVABLE = 'Accounts Receivable',
  OTHER_CURRENT_ASSET = 'Other Current Asset',
  FIXED_ASSET = 'Fixed Asset',
  OTHER_ASSET = 'Other Asset',
  ACCOUNTS_PAYABLE = 'Accounts Payable',
  OTHER_CURRENT_LIABILITY = 'Other Current Liability',
  LONG_TERM_LIABILITY = 'Long Term Liability',
  EQUITY = 'Equity',
  INCOME = 'Income',
  OTHER_INCOME = 'Other Income',
  EXPENSE = 'Expense',
  OTHER_EXPENSE = 'Other Expense',
  NON_OPERATING_EXPENSE = 'Non-Operating Expense',
}

export type TChartOfAccountResponse = {
  glAccountId: string;
  name: string;
  number: string;
  description: string | null;
  type: GLAccountType;
  /**
   * ResMan spells this `parentGLAccountId` on the wire. Null for top-level accounts.
   */
  parentGLAccountId: string | null;
};

export type TBalancePeriod = {
  month: number;
  year: number;
  actual: number;
  budget: number;
};

export type TBalanceResponse = {
  glAccountId: string;
  name: string;
  number: string;
  type: GLAccountType;
  /** Balance at the start of the requested range. */
  startBalance: number;
  /** Balance at the end of the requested range. */
  endBalance: number;
  periods: TBalancePeriod[];
};

export enum BillingAccountType {
  LEASE = 'Lease',
  SPLIT_LEDGER = 'Split Ledger',
  NON_RESIDENT = 'Non-Resident',
  ACCOUNT = 'Account',
  WOIT_ACCOUNT = 'WOIT Account',
  PROSPECT = 'Prospect',
}

export type TBillingAccountTransaction = {
  id: string;
  date: string;
  type: string;
  transactionCategoryId: string | null;
  description: string;
  reference: string | null;
  amount: number;
};

export type TBillingAccountResponse = {
  propertyId: string;
  accountType: BillingAccountType;
  billingAccountId: string;
  personId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  building: string;
  unit: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  email: string | null;
  mobilePhone: string | null;
  homePhone: string | null;
  householdStatus: string | null;
  moveInDate: string | null;
  moveOutDate: string | null;
  /**
   * Normalised by this connector from ResMan's `leaseID` so it matches the
   * `leaseId` spelling used everywhere else in this package.
   */
  leaseId: string | null;
  leaseStatus: string;
  leaseSignedDate: string | null;
  leaseStartDate: string | null;
  leaseEndDate: string | null;
  balance: number;
  paymentStatus: string;
  transactions: TBillingAccountTransaction[];
};

export enum BankAccountMethod {
  ACH = 'ACH',
  AVID_PAY = 'AvidPay',
  CHECK = 'Check',
  CASH = 'Cash',
  CASHIER_CHECK = 'Cashiers Check',
  CREDIT_CARD = 'Credit Card',
  DEBIT_CARD = 'Debit Card',
  ETF = 'ETF',
  MONEY_ORDER = 'Money Order',
  NEXUS_PAY = 'Nexus Pay',
  PAYMENT_FILE = 'Payment File',
  WIRE = 'Wire',
}

export type TBankAccountPaymentPayable = {
  id: string;
  type: string;
  propertyId: string;
  propertyAbbreviation: string;
  reference: string;
  date: string;
  description: string | null;
  amount: number;
};

export enum BankAccountPaymentStatus {
  OPEN = 'Open',
  CLEARED = 'Cleared',
  RECONCILED = 'Reconciled',
  VOIDED = 'Voided',
}

export enum BankAccountPaymentRecipientType {
  RESIDENT = 'Resident',
  PERSON = 'Person',
  VENDOR = 'Vendor',
}

export enum BankAccountPaymentType {
  INVOICE_PAYMENT = 'Invoice Payment',
  REFUND = 'Refund',
  VENDOR = 'Vendor',
}

export type TBankAccountPayment = {
  paymentId: string;
  type: BankAccountPaymentType;
  date: string;
  reference: string | null;
  method: BankAccountMethod;
  payTo: string;
  recipientId: string;
  recipientType: BankAccountPaymentRecipientType;
  /** Only returned for payments made to a vendor. */
  vendorAbbreviation?: string | null;
  /** Only returned for payments made to a vendor. */
  vendorName?: string;
  amount: number;
  memo: string | null;
  status: BankAccountPaymentStatus;
  clearedDate: string | null;
  voidedDate: string | null;
  printedDate: string | null;
  postedDate: string;
  payables: TBankAccountPaymentPayable[];
};

export type TBankAccountPaymentResponse = {
  bankAccountId: string;
  accountName: string;
  accountNumber: string;
  payments: TBankAccountPayment[];
};

/**
 * A row of GET /Transactions/Ledger.
 *
 * Note: /Transactions/DepositLedger returns a different shape — see
 * {@link TDepositLedgerResponse}.
 */
export type TLedgerResponse = {
  transactionId: string;
  date: string;
  type: TransactionCategoryType;
  /** Null on transactions that carry no transaction category (e.g. reversals). */
  category: TLedgerResponseCategory | null;
  description: string;
  amount: number;
  /** Present on payment-style rows only. */
  reference?: string;
  /** Present on payment-style rows only. */
  method?: string;
  /** Only present when the transaction has been reversed. */
  dateReversed?: string;
};

/**
 * A row of GET /Transactions/DepositLedger. Unlike {@link TLedgerResponse} it
 * carries `billingAccountId`, always carries a `category`, and never returns
 * `reference`.
 */
export type TDepositLedgerResponse = {
  transactionId: string;
  billingAccountId: string;
  date: string;
  type: TransactionCategoryType;
  category: TLedgerResponseCategory;
  description: string;
  amount: number;
  /** Present on payment-style rows only. */
  method?: string;
  /** Only present when the transaction has been reversed. */
  dateReversed?: string;
};

export type TLedgerResponseCategory = {
  transactionCategoryId: string;
  name: string;
  abbreviation: string;
};

export type TReceivableResponse = {
  propertyId: string;
  billingAccountId: string;
  accountType: BillingAccountType;
  unit: string;
  accountName: string;
  charges: number;
  payments: number;
  credits: number;
  balance: number;
  transactions: TReceivableResponseTransaction[];
};

export type TReceivableResponseTransaction = {
  transactionId: string;
  date: string;
  type: TransactionCategoryType;
  category: TLedgerResponseCategory;
  amount: number;
};

export type TDepositSummaryByCategoryResponse = {
  propertyId: string;
  billingAccountId: string;
  accountType: BillingAccountType;
  unit: string;
  accountName: string;
  leaseRequired: number;
  paidIn: number;
  paidOut: number;
  held: number;
  deposits: TReceivableDeposit[];
};

export type TReceivableDeposit = {
  category: TLedgerResponseCategory;
  leaseRequired: number;
  paidIn: number;
  paidOut: number;
  held: number;
};

export enum InvoiceStatus {
  PENDING_APPROVAL = 'Pending Approval',
  APPROVED = 'Approved',
  SUBMITTED = 'Submitted',
  AUTHORIZED = 'Authorized',
  PARTIALLY_PAID = 'Partially Paid',
  PAID = 'Paid',
  PARTIALLY_APPLIED = 'Partially Applied',
  APPLIED = 'Applied',
  VOID = 'Void',
}

export type TInvoiceLineItem = {
  lineItemId: string;
  propertyId: string;
  propertyAbbreviation?: string;
  locationType?: string;
  locationId?: string;
  glAccountNumber?: string;
  description?: string;
  unitPrice: number;
  quantity: number;
  total: number;
  isTaxable: boolean;
  isReplacementReserve: boolean;
  is1099Reportable: boolean;
};

/**
 * A row of GET /Invoices.
 *
 * Note: the profiled credentials could not reach /Invoices, so optionality here
 * is unverified against a live response. The date fields are typed `string`
 * because this connector performs no date deserialization — every response date
 * arrives as the raw JSON string ResMan sent.
 */
export type TInvoiceResponse = {
  invoiceId: string;
  number: string;
  status: InvoiceStatus;
  vendorId?: string;
  vendorName?: string;
  vendorAbbreviation?: string;
  expenseTypeId: string;
  expenseType: string;
  invoiceDate?: string;
  receivedDate?: string;
  accountingDate?: string;
  dueDate?: string;
  holdDate?: string;
  description?: string;
  total: number;
  amountPaid: number;
  isCredit: boolean;
  postingPersonId?: string;
  postingPerson?: string;
  lastModified: string;
  lineItems?: TInvoiceLineItem[];
};
