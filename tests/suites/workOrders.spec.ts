import { getClient } from '../helpers/client';
import { loadContext, TestContext } from '../helpers/context';
import { expectRows, expectFieldsOnAll } from '../helpers/assert';
import { defaultModifiedSince } from '../helpers/env';

describe('Work Orders — GET endpoints', () => {
  const client = getClient();
  let ctx: TestContext;

  beforeAll(() => {
    ctx = loadContext();
  });

  it('GET /WorkOrders returns work orders', async () => {
    const rows = expectRows(
      'GET /WorkOrders',
      await client.workOrders.getWorkOrders({
        propertyId: ctx.propertyId,
        modifiedSince: defaultModifiedSince(),
      })
    );
    expectFieldsOnAll('TWorkOrderResponse', rows, [
      'workOrderId',
      'propertyId',
      'number',
      'description',
      'category',
      'categoryId',
      'isMakeReady',
      'appointment',
      'status',
      'priority',
      'cost',
      'lastModified',
    ]);
  });

  it('GET /WorkOrders/Areas returns areas', async () => {
    expectRows(
      'GET /WorkOrders/Areas',
      await client.workOrders.getWorkOrderAreas({ propertyId: ctx.propertyId })
    );
  });

  it('GET /WorkOrders/Categories returns categories', async () => {
    const rows = expectRows(
      'GET /WorkOrders/Categories',
      await client.workOrders.getWorkOrderCategories({ propertyId: ctx.propertyId })
    );
    expectFieldsOnAll('TWorkOrderCategoryResponse', rows, ['categoryId', 'name']);
  });

  it('GET /WorkOrders/Locations returns locations', async () => {
    const rows = expectRows(
      'GET /WorkOrders/Locations',
      await client.workOrders.getWorkOrderLocations({ propertyId: ctx.propertyId })
    );
    expectFieldsOnAll('TWorkOrderLocationResponse', rows, ['id', 'name', 'type']);
  });
});
