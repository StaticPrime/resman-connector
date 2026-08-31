import { getClient } from '../helpers/client';
import { loadContext, TestContext } from '../helpers/context';
import { expectRows, expectFieldsOnAll, itEndpoint } from '../helpers/assert';

describe('Units — GET endpoints', () => {
  const client = getClient();
  const ctxAtLoad = loadContext();
  let ctx: TestContext;

  beforeAll(() => {
    ctx = loadContext();
  });

  it('GET /Units returns units for the property', async () => {
    const rows = expectRows(
      'GET /Units',
      await client.units.getUnits({ propertyId: ctx.propertyId })
    );
    expectFieldsOnAll('TUnitResponse', rows, [
      'unitId',
      'propertyId',
      'unitNumber',
      'unitTypeId',
      'unitType',
      'squareFeet',
      'excludedFromOccupancy',
      'availableForOnlineMarketing',
      'marketRent',
      'amenities',
    ]);
  });

  it('GET /Units/Availability returns unit availability', async () => {
    const rows = expectRows(
      'GET /Units/Availability',
      await client.units.getUnitsAvailability({ propertyId: ctx.propertyId })
    );
    // Note: the unit number field is `number` here, not `unitNumber` as on TUnitResponse.
    expectFieldsOnAll('TUnitAvailabilityResponse', rows, [
      'propertyId',
      'unitId',
      'number',
      'floor',
      'squareFeet',
      'unitTypeId',
      'unitTypeName',
      'status',
      'vacancyStatus',
      'excludedFromOccupancy',
      'amenities',
    ]);
  });

  it('GET /UnitTypes returns unit types', async () => {
    const rows = expectRows(
      'GET /UnitTypes',
      await client.units.getUnitTypes({ propertyId: ctx.propertyId })
    );
    expectFieldsOnAll('TUnitTypeResponse', rows, [
      'unitTypeId',
      'propertyId',
      'name',
      'bedrooms',
      'bathrooms',
      'squareFootage',
      'maximumOccupancy',
      'marketRent',
      'requiredDeposit',
    ]);
  });

  // Undocumented response schema — asserts the call works and returns rows.
  // Field names on TUnitCharge are inferred, so none are asserted as required.
  itEndpoint(
    ctxAtLoad.unavailable,
    '/UnitCharges',
    'GET /UnitCharges returns charges for the property',
    async () => {
      expectRows(
        'GET /UnitCharges',
        await client.units.getUnitCharges({ propertyId: ctx.propertyId })
      );
    }
  );

  itEndpoint(
    ctxAtLoad.unavailable,
    '/UnitCharges',
    'GET /UnitCharges scoped to a discovered unit returns charges',
    async () => {
      if (!ctx.unitId) {
        throw new Error('No unitId discovered — cannot scope /UnitCharges to a unit.');
      }
      expectRows(
        'GET /UnitCharges (unit-scoped)',
        await client.units.getUnitCharges({ propertyId: ctx.propertyId, unitId: ctx.unitId })
      );
    }
  );
});
