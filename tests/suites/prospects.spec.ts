import { getClient } from '../helpers/client';
import { loadContext } from '../helpers/context';
import { expectRows, expectFieldsOnAll, itEndpoint } from '../helpers/assert';
import { defaultModifiedSince } from '../helpers/env';

describe('Prospects — GET endpoints', () => {
  const client = getClient();
  const ctx = loadContext();

  it('GET /Prospects returns prospects', async () => {
    const rows = expectRows(
      'GET /Prospects',
      await client.prospects.getProspects({
        propertyId: ctx.propertyId,
        modifiedSince: defaultModifiedSince(),
      })
    );
    expectFieldsOnAll('TProspectResponse', rows, [
      'prospectId',
      'propertyId',
      'mainPersonId',
      'lastModified',
      'prospectSourceId',
      'prospectSourceName',
      'status',
      'people',
      'events',
    ]);
  });

  // communicationLog is omitted entirely unless the flag is set, so it gets its
  // own test rather than being asserted on the default call.
  it('GET /Prospects returns communicationLog only when requested', async () => {
    const without = expectRows(
      'GET /Prospects (no flag)',
      await client.prospects.getProspects({
        propertyId: ctx.propertyId,
        modifiedSince: defaultModifiedSince(),
      })
    );
    expect(Object.keys(without[0])).not.toContain('communicationLog');

    const withLog = expectRows(
      'GET /Prospects (includeCommunicationLog)',
      await client.prospects.getProspects({
        propertyId: ctx.propertyId,
        modifiedSince: defaultModifiedSince(),
        includeCommunicationLog: true,
      })
    );
    expect(Object.keys(withLog[0])).toContain('communicationLog');
  });

  itEndpoint(
    ctx.unavailable,
    '/ProspectSources',
    'GET /ProspectSources returns prospect sources',
    async () => {
      const rows = expectRows(
        'GET /ProspectSources',
        await client.prospects.getProspectSources({ propertyId: ctx.propertyId })
      );
      expectFieldsOnAll('TProspectSourceResponse', rows, ['prospectSourceId', 'name']);
    }
  );
});
