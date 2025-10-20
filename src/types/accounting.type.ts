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
  abbreviation?: string;
  name: string;
  type: TransactionCategoryType;
  isRent: boolean;
  isRecurringMonthlyRentConcession: boolean;
  isOneTimeConcession: boolean;
  glAccount?: TTransactionGLAccount;
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
  description?: string;
  type: GLAccountType;
  parentGlAccountId?: string;
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
  periods?: TBalancePeriod[];
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
  date: Date;
  type: string;
  trasactionCategoryId: string;
  description?: string;
  reference: string;
  amount: number;
};

export type TBillingAccountResponse = {
  propertyId: string;
  accountType: BillingAccountType;
  billingAccountId: string;
  personId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  building?: string;
  unit: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  email?: string;
  mobilePhone?: string;
  homePhone?: string;
  householdStatus?: string;
  moveInDate?: Date;
  moveOutDate?: Date;
  leaseID?: string;
  leaseStatus?: string;
  leaseSignedDate?: Date;
  leaseStartDate?: Date;
  leaseEndDate?: Date;
  balance: number;
  paymentStatus?: string;
  transactions?: TBillingAccountTransaction[];
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
  propertyAbbreviation?: string;
  reference: string;
  date: Date;
  description?: string;
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
  reference: string;
  method: BankAccountMethod;
  payTo?: string;
  recipientId: string;
  recipientType: BankAccountPaymentRecipientType;
  amount: number;
  memo?: string;
  status: BankAccountPaymentStatus;
  clearedDate?: Date;
  voidedDate?: Date;
  printedDate?: Date;
  postedDate?: Date;
  payables?: TBankAccountPaymentPayable[];
};

export type TBankAccountPaymentResponse = {
  bankAccountId: string;
  accountName: string;
  accountNumber: string;
  payments?: TBankAccountPayment[];
};

export type TLedgerResponse = {
  transactionId: string;
  date: Date;
  type: TransactionCategoryType;
  category: TLedgerResponseCategory;
  description?: string;
  amount: number;
};

export type TLedgerResponseCategory = {
  transactionCategoryId: string;
  name: string;
  abbreviation?: string;
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
  date: Date;
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

export type TInvoiceResponse = {
  invoiceId: string;
  number: string;
  status: InvoiceStatus;
  vendorId?: string;
  vendorName?: string;
  vendorAbbreviation?: string;
  expenseTypeId: string;
  expenseType: string;
  invoiceDate?: Date;
  receivedDate?: Date;
  accountingDate?: Date;
  dueDate?: Date;
  holdDate?: Date;
  description?: string;
  total: number;
  amountPaid: number;
  isCredit: boolean;
  postingPersonId?: string;
  postingPerson?: string;
  lastModified: Date;
  lineItems?: TInvoiceLineItem[];
};
