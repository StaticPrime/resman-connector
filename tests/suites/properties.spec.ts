import { getClient } from '../helpers/client';
import { loadContext, TestContext } from '../helpers/context';
import { expectRows, expectFieldsOnAll, itEndpoint } from '../helpers/assert';

describe('Properties — GET endpoints', () => {
  const client = getClient();
  const ctxAtLoad = loadContext();
  let ctx: TestContext;

  beforeAll(() => {
    ctx = loadContext();
  });

  it('GET /Properties returns properties', async () => {
    const rows = expectRows('GET /Properties', await client.properties.getProperties());
    expectFieldsOnAll('TPropertyResponse', rows, ['propertyId', 'name', 'type']);
  });

  it('GET /Properties/Groups returns property groups', async () => {
    const rows = expectRows('GET /Properties/Groups', await client.properties.getPropertyGroups());
    expectFieldsOnAll('TPropertyGroupResponse', rows, ['propertyGroupId', 'name', 'propertyIds']);
  });

  it('GET /Amenities returns amenities for the property', async () => {
    const rows = expectRows(
      'GET /Amenities',
      await client.properties.getAmenities({ propertyId: ctx.propertyId })
    );
    expectFieldsOnAll('TAmenityResponse', rows, [
      'amenityId',
      'name',
      'amenityTypeId',
      'amenityTypeName',
      'ilsMapping',
      'availableForOnlineMarketing',
    ]);
  });

  it('GET /Buildings returns buildings for the property', async () => {
    const rows = expectRows(
      'GET /Buildings',
      await client.properties.getBuildings({ propertyId: ctx.propertyId })
    );
    expectFieldsOnAll('TBuildingResponse', rows, [
      'buildingId',
      'propertyId',
      'name',
      'floors',
      'totalUnits',
    ]);
  });

  itEndpoint(
    ctxAtLoad.unavailable,
    '/PropertyCharges',
    'GET /PropertyCharges returns the property charge catalog',
    async () => {
      const rows = expectRows(
        'GET /PropertyCharges',
        await client.properties.getPropertyCharges({ propertyId: ctx.propertyId })
      );
      expectFieldsOnAll('TPropertyCharge', rows, [
        'transactionCategoryId',
        'chargeName',
        'amount',
        'isRequired',
        'isRecurring',
        'isEnabled',
      ]);
    }
  );
});
