import { getClient } from '../helpers/client';
import { loadContext, TestContext } from '../helpers/context';
import { expectRows, expectFieldsOnAll } from '../helpers/assert';
import { defaultModifiedSince } from '../helpers/env';

describe('Leases — GET endpoints', () => {
  const client = getClient();
  let ctx: TestContext;

  beforeAll(() => {
    ctx = loadContext();
  });

  it('GET /Leasing/Leases returns leases', async () => {
    const rows = expectRows(
      'GET /Leasing/Leases',
      await client.leases.getLeases({
        propertyId: ctx.propertyId,
        includeLeaseHistory: false,
        modifiedSince: defaultModifiedSince(),
      })
    );
    expectFieldsOnAll('TLeaseResponse', rows, [
      'propertyId',
      'billingAccountId',
      'unitId',
      'unitNumber',
      'unitTypeId',
      'unitTypeName',
      'leaseId',
      'leaseStatus',
      'leaseStartDate',
      'leaseEndDate',
      'lastModified',
    ]);
  });

  it('GET /Leasing/Leases with includeLeaseHistory returns leases', async () => {
    expectRows(
      'GET /Leasing/Leases (includeLeaseHistory)',
      await client.leases.getLeases({
        propertyId: ctx.propertyId,
        includeLeaseHistory: true,
        modifiedSince: defaultModifiedSince(),
      })
    );
  });

  // Exercises the date-range filters that were sending misspelled query keys
  // before 0.2.0. A valid From/To pair must be accepted.
  it('GET /Leasing/Leases accepts the corrected date-range filters', async () => {
    const to = new Date();
    to.setDate(to.getDate() - 1);
    const from = new Date();
    from.setDate(from.getDate() - 300);

    expectRows(
      'GET /Leasing/Leases (date filters)',
      await client.leases.getLeases({
        propertyId: ctx.propertyId,
        includeLeaseHistory: false,
        modifiedSince: defaultModifiedSince(),
        moveInDateFrom: from,
        moveInDateTo: to,
      })
    );
  });

  it('GET /Leasing/MoveOuts returns move outs', async () => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 300);

    expectRows(
      'GET /Leasing/MoveOuts',
      await client.leases.getLeaseMoveOuts({ propertyId: ctx.propertyId, startDate, endDate })
    );
  });

  it('GET /Leasing/RecurringCharges returns recurring charges with lease ids', async () => {
    const rows = expectRows(
      'GET /Leasing/RecurringCharges',
      await client.leases.getRecurringCharges({ propertyId: ctx.propertyId })
    );
    expectFieldsOnAll('TRecurringChargeResponse', rows, [
      'recurringChargeId',
      'transactionCategoryId',
      'type',
      'description',
      'amount',
      'startDate',
      'endDate',
      'leaseId',
      'status',
    ]);
  });

  // The rentable-item-to-lease linkage this connector was audited for. Not all
  // properties rent items, so this asserts shape only when such a row exists.
  it('GET /Leasing/RecurringCharges exposes rentableItem when present', async () => {
    const rows = expectRows(
      'GET /Leasing/RecurringCharges',
      await client.leases.getRecurringCharges({ propertyId: ctx.propertyId })
    );
    const withItem = rows.filter((r) => r.rentableItem);
    if (withItem.length === 0) {
      // eslint-disable-next-line no-console
      console.warn(
        '  note: no recurring charge on this property carries a rentableItem — ' +
          'shape assertion skipped.'
      );
      return;
    }
    expectFieldsOnAll(
      'TRecurringCharge.rentableItem',
      withItem.map((r) => r.rentableItem),
      ['rentableItemId', 'name', 'rentableItemTypeId', 'rentableItemTypeName']
    );
  });
});
