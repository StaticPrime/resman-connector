import { getClient } from '../helpers/client';
import { loadContext } from '../helpers/context';
import { expectRows, expectFieldsOnAll, itWith, itEndpoint } from '../helpers/assert';

const REQUIRED = [
  'vendorId',
  'generalInformation',
  'paymentInformation',
  'form1099Information',
  'insurancePolicies',
];

describe('Vendors — GET endpoints', () => {
  const client = getClient();
  const ctx = loadContext();

  itEndpoint(ctx.unavailable, '/Vendors', 'GET /Vendors returns vendors', async () => {
    const rows = expectRows('GET /Vendors', await client.vendors.getVendors({}));
    expectFieldsOnAll('TVendorResponse', rows, REQUIRED);
  });

  itWith(ctx.vendorId, 'GET /Vendors filtered by a discovered vendorId', async (vendorId) => {
    const rows = expectRows(
      'GET /Vendors (vendorId)',
      await client.vendors.getVendors({ vendorId })
    );
    expectFieldsOnAll('TVendorResponse', rows, REQUIRED);
  });
});
