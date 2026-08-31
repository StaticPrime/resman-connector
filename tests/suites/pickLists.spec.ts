import { getClient } from '../helpers/client';
import { loadContext } from '../helpers/context';
import { expectRows, expectFieldsOnAll } from '../helpers/assert';
import { PickListName } from '../../src';

describe('Pick Lists — GET endpoints', () => {
  const client = getClient();
  const { unavailable } = loadContext();
  const reason = unavailable['/PickLists'];

  // Every documented pick list name gets its own call.
  const cases = Object.values(PickListName);

  if (reason) {
    it.skip.each(cases)(`GET /PickLists?name=%s — SKIPPED: ${reason}`, () => {
      /* not entitled */
    });
  } else {
    it.each(cases)('GET /PickLists?name=%s returns items', async (name) => {
      const rows = expectRows(
        `GET /PickLists (${name})`,
        await client.pickLists.getPickLists({ name })
      );
      expectFieldsOnAll('TPickListResponse', rows, ['picklistItemId', 'name']);
    });
  }
});
