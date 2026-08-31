import { getClient } from '../helpers/client';
import { loadContext } from '../helpers/context';
import { expectOk, expectRows, expectFieldsOnAll, expectFields, itWith } from '../helpers/assert';
import { DocumentType } from '../../src';

describe('Documents — GET endpoints', () => {
  const client = getClient();
  const ctx = loadContext();

  // globalSetup already probed Lease/Unit/Resident and recorded whichever type
  // actually yielded a document, so this uses the pair known to return rows.
  itWith(ctx.documentId, 'GET /Documents returns documents for the discovered record', async () => {
    const rows = expectRows(
      `GET /Documents (type=${ctx.documentType})`,
      await client.documents.getDocuments({
        propertyId: ctx.propertyId,
        type: ctx.documentType as DocumentType,
        typeId: ctx.documentTypeId as string,
      })
    );
    expectFieldsOnAll('TMultipleDocumentResponse', rows, [
      'documentId',
      'path',
      'name',
      'size',
      'fileType',
      'dateAttached',
    ]);
  });

  itWith(
    ctx.documentId,
    'GET /Documents/Document returns a single document link',
    async (documentId) => {
      const doc = expectOk(
        'GET /Documents/Document',
        await client.documents.getSingleDocument({ documentId })
      );
      expectFields('TSingleDocumentResponse', doc, ['documentId', 'uri', 'uriExpiration']);
    }
  );
});
