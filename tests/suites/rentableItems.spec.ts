import { getClient } from '../helpers/client';
import { loadContext, TestContext } from '../helpers/context';
import { expectRows, expectFieldsOnAll } from '../helpers/assert';

const COMMON = [
  'rentableItemId',
  'name',
  'rentableItemTypeId',
  'rentableItemTypeName',
  'charge',
  'rentable',
];

describe('Rentable Items — GET endpoints', () => {
  const client = getClient();
  let ctx: TestContext;

  beforeAll(() => {
    ctx = loadContext();
  });

  it('GET /RentableItems returns items with occupancy', async () => {
    const rows = expectRows(
      'GET /RentableItems',
      await client.rentableItems.getRentableItems({ propertyId: ctx.propertyId })
    );
    // `leaseId` is normalised from ResMan's `leaseID` by the module, so it is
    // not present on the raw row and is asserted separately below.
    expectFieldsOnAll('TRentableItemResponse', rows, [...COMMON, 'isOccupied']);
  });

  // The direct item-to-lease link. Occupied items must carry a leaseId, and
  // that mapping is what would silently break if ResMan renamed `leaseID`.
  it('GET /RentableItems exposes leaseId on occupied items', async () => {
    const rows = expectRows(
      'GET /RentableItems',
      await client.rentableItems.getRentableItems({ propertyId: ctx.propertyId })
    );
    const occupied = rows.filter((r) => r.isOccupied);
    if (occupied.length === 0) {
      throw new Error(
        'No rentable item on this property is occupied, so the leaseId mapping ' +
          'could not be exercised.'
      );
    }
    const withLease = occupied.filter((r) => typeof r.leaseId === 'string' && r.leaseId.length > 0);
    if (withLease.length === 0) {
      throw new Error(
        `${occupied.length} occupied item(s) but none carried a leaseId. The module ` +
          `maps ResMan's \`leaseID\` onto \`leaseId\` — that mapping may have broken.`
      );
    }
  });

  it('GET /RentableItems/Availability returns items with availability', async () => {
    const rows = expectRows(
      'GET /RentableItems/Availability',
      await client.rentableItems.getRentableItemAvailability({ propertyId: ctx.propertyId })
    );
    expectFieldsOnAll('TRentableItemAvailabilityResponse', rows, [...COMMON, 'status']);
  });

  // The two endpoints return genuinely different shapes; this pins that so a
  // future refactor cannot quietly collapse them back into one type.
  it('the two rentable item endpoints return distinct shapes', async () => {
    const items = expectRows(
      'GET /RentableItems',
      await client.rentableItems.getRentableItems({ propertyId: ctx.propertyId })
    );
    const availability = expectRows(
      'GET /RentableItems/Availability',
      await client.rentableItems.getRentableItemAvailability({ propertyId: ctx.propertyId })
    );

    expect(items[0]).toHaveProperty('isOccupied');
    expect(Object.keys(items[0])).not.toContain('status');
    expect(availability[0]).toHaveProperty('status');
    expect(Object.keys(availability[0])).not.toContain('isOccupied');
  });

  it('GET /RentableItemTypes returns rentable item types', async () => {
    const rows = expectRows(
      'GET /RentableItemTypes',
      await client.rentableItems.getRentableItemTypes({ propertyId: ctx.propertyId })
    );
    expectFieldsOnAll('TRentableItemTypeResponse', rows, ['rentableItemTypeId', 'name', 'amount']);
  });
});
