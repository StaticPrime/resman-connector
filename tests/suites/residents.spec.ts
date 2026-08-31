import { getClient } from '../helpers/client';
import { loadContext, TestContext } from '../helpers/context';
import { expectRows, expectFieldsOnAll, itWith } from '../helpers/assert';

const REQUIRED_RESIDENT_FIELDS = [
  'billingAccountId',
  'personId',
  'leaseId',
  'firstName',
  'lastName',
  'isHeadOfHousehold',
  'isDependent',
  'isLeaseSigner',
  'isMainContact',
  'isExcludedFromOccupancy',
  'leaseStatus',
  'residencyStatus',
  'rent',
  'leases',
];

describe('Residents — GET endpoints', () => {
  const client = getClient();
  const ctxAtLoad = loadContext();
  let ctx: TestContext;

  beforeAll(() => {
    ctx = loadContext();
  });

  it('GET /CreditReporting/Residents returns residents', async () => {
    const rows = expectRows(
      'GET /CreditReporting/Residents',
      await client.residents.getResidents({
        propertyId: ctx.propertyId,
        includeLeaseHistory: false,
      })
    );
    expectFieldsOnAll('TResidentResponse', rows, REQUIRED_RESIDENT_FIELDS);
  });

  it('GET /CreditReporting/Residents with includeLeaseHistory returns residents', async () => {
    const rows = expectRows(
      'GET /CreditReporting/Residents (includeLeaseHistory)',
      await client.residents.getResidents({
        propertyId: ctx.propertyId,
        includeLeaseHistory: true,
      })
    );
    expectFieldsOnAll('TResidentResponse', rows, REQUIRED_RESIDENT_FIELDS);
  });

  itWith(
    ctxAtLoad.personId,
    'GET /CreditReporting/Residents filtered by a discovered personId returns that resident',
    async (personId) => {
      const rows = expectRows(
        'GET /CreditReporting/Residents (personId)',
        await client.residents.getResidents({
          propertyId: ctx.propertyId,
          personId,
          includeLeaseHistory: false,
        })
      );
      expectFieldsOnAll('TResidentResponse', rows, REQUIRED_RESIDENT_FIELDS);
    }
  );
});
