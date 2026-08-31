import { AccountingBasis, TransactionCategoryType } from '../../src';
import { getClient } from '../helpers/client';
import { loadContext, TestContext } from '../helpers/context';
import { expectRows, expectFieldsOnAll, itWith, itEndpoint } from '../helpers/assert';
import { defaultModifiedSince } from '../helpers/env';

/** Yesterday — several endpoints reject future dates. */
function yesterday(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
}

describe('Accounting — GET endpoints', () => {
  const client = getClient();
  const ctxAtLoad = loadContext();
  let ctx: TestContext;

  beforeAll(() => {
    ctx = loadContext();
  });

  it('GET /Accounting/ChartOfAccounts returns GL accounts', async () => {
    const rows = expectRows(
      'GET /Accounting/ChartOfAccounts',
      await client.accounting.getChartOfAccounts({ propertyId: ctx.propertyId })
    );
    expectFieldsOnAll('TChartOfAccountResponse', rows, ['glAccountId', 'name', 'number', 'type']);
  });

  it('GET /Accounting/Balances returns balances', async () => {
    const endMonth = yesterday();
    const startMonth = new Date();
    startMonth.setMonth(startMonth.getMonth() - 2);

    const rows = expectRows(
      'GET /Accounting/Balances',
      await client.accounting.getBalances({
        propertyId: ctx.propertyId,
        startMonth,
        endMonth,
        accountingBasis: AccountingBasis.ACCRUAL,
      })
    );
    expectFieldsOnAll('TBalanceResponse', rows, ['glAccountId', 'name', 'number', 'type']);
  });

  it('GET /BankAccounts/Payments returns payments', async () => {
    const rows = expectRows(
      'GET /BankAccounts/Payments',
      await client.accounting.getBankAccountPayments({
        propertyId: ctx.propertyId,
        postedSince: defaultModifiedSince(),
      })
    );
    expectFieldsOnAll('TBankAccountPaymentResponse', rows, [
      'bankAccountId',
      'accountName',
      'accountNumber',
    ]);
  });

  it('GET /BillingAccounts returns billing accounts', async () => {
    const rows = expectRows(
      'GET /BillingAccounts',
      await client.accounting.getBillingAccounts({
        propertyId: ctx.propertyId,
        modifiedSince: defaultModifiedSince(),
      })
    );
    expectFieldsOnAll('TBillingAccountResponse', rows, [
      'propertyId',
      'accountType',
      'billingAccountId',
      'personId',
      'firstName',
      'lastName',
      'unit',
      'balance',
    ]);
  });

  it('GET /TransactionCategories returns categories', async () => {
    const rows = expectRows(
      'GET /TransactionCategories',
      await client.accounting.getTransactionCategories({
        types: [
          TransactionCategoryType.CHARGE,
          TransactionCategoryType.CREDIT,
          TransactionCategoryType.PAYMENT,
          TransactionCategoryType.DEPOSIT,
        ],
      })
    );
    expectFieldsOnAll('TTransactionCategoryResponse', rows, [
      'transactionCategoryId',
      'name',
      'type',
      'isRent',
      'isRecurringMonthlyRentConcession',
      'isOneTimeConcession',
    ]);
  });

  it('GET /Transactions/Receivables returns receivables', async () => {
    const rows = expectRows(
      'GET /Transactions/Receivables',
      await client.accounting.getReceivables({ propertyId: ctx.propertyId, date: yesterday() })
    );
    expectFieldsOnAll('TReceivableResponse', rows, [
      'propertyId',
      'billingAccountId',
      'accountType',
      'unit',
      'accountName',
      'charges',
      'payments',
      'credits',
      'balance',
      'transactions',
    ]);
  });

  it('GET /Transactions/DepositSummaryByCategory returns deposit summaries', async () => {
    const rows = expectRows(
      'GET /Transactions/DepositSummaryByCategory',
      await client.accounting.getDepositSummaryByCategory({
        propertyId: ctx.propertyId,
        date: yesterday(),
      })
    );
    expectFieldsOnAll('TDepositSummaryByCategoryResponse', rows, [
      'propertyId',
      'billingAccountId',
      'accountType',
      'unit',
      'accountName',
      'leaseRequired',
      'paidIn',
      'paidOut',
      'held',
      'deposits',
    ]);
  });

  itEndpoint(ctxAtLoad.unavailable, '/Invoices', 'GET /Invoices returns invoices', async () => {
    const rows = expectRows(
      'GET /Invoices',
      await client.accounting.getInvoices({
        propertyId: ctx.propertyId,
        modifiedSince: defaultModifiedSince(),
      })
    );
    expectFieldsOnAll('TInvoiceResponse', rows, [
      'invoiceId',
      'number',
      'status',
      'expenseTypeId',
      'expenseType',
      'total',
      'amountPaid',
      'isCredit',
    ]);
  });

  // The two ledger endpoints need a billingAccountId discovered at runtime.
  // globalSetup has already run by the time this file is evaluated, so reading
  // the context at describe scope is safe.
  describe('ledger endpoints (need a discovered billingAccountId)', () => {
    const { billingAccountId } = loadContext();

    itWith(billingAccountId, 'GET /Transactions/Ledger returns ledger transactions', async (id) => {
      const rows = expectRows(
        'GET /Transactions/Ledger',
        await client.accounting.getLedger({
          propertyId: ctx.propertyId,
          billingAccountId: id,
          postedSince: defaultModifiedSince(),
        })
      );
      expectFieldsOnAll('TLedgerResponse', rows, [
        'transactionId',
        'date',
        'type',
        'category',
        'amount',
      ]);
    });

    itWith(
      billingAccountId,
      'GET /Transactions/DepositLedger returns deposit ledger transactions',
      async (id) => {
        expectRows(
          'GET /Transactions/DepositLedger',
          await client.accounting.getDepositLedger({
            propertyId: ctx.propertyId,
            billingAccountId: id,
            postedSince: defaultModifiedSince(),
          })
        );
      }
    );
  });
});
