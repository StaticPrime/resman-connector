import { getClient } from '../helpers/client';
import { expectOk, expectRows, expectFieldsOnAll, expectFields, itWith } from '../helpers/assert';
import { env } from '../helpers/env';

describe('Accounts — GET endpoints', () => {
  const client = getClient();

  it('GET /Account/SecurityGroups returns security groups', async () => {
    const rows = expectRows(
      'GET /Account/SecurityGroups',
      await client.accounts.getSecurityGroups()
    );
    expectFieldsOnAll('TSecurityGroup', rows, ['securityGroupId', 'name', 'type']);
  });

  // Needs a subdomain that only the account owner knows; there is no endpoint
  // that discovers it, so this is the one GET that cannot be fully dynamic.
  itWith(env.subDomain, 'GET /Account/AccountId resolves a subdomain', async (subDomain) => {
    const info = expectOk('GET /Account/AccountId', await client.accounts.getAccountId(subDomain));
    expectFields('TAccountInfo', info, ['accountId']);
  });
});
