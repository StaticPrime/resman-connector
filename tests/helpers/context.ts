import * as fs from 'fs';
import * as path from 'path';

/**
 * Ids discovered once in globalSetup and shared by every suite.
 *
 * Only `propertyId` is guaranteed. Everything else is optional because a given
 * account may genuinely have no leases, no invoices, no documents and so on —
 * those tests skip with a visible reason rather than failing on a missing id.
 */
export type TestContext = {
  propertyId: string;
  propertyName: string;
  /** Every property id on the account, for endpoints that take no property. */
  allPropertyIds: string[];

  unitId?: string;
  unitNumber?: string;
  unitTypeId?: string;

  leaseId?: string;
  billingAccountId?: string;
  personId?: string;

  rentableItemId?: string;
  rentableItemTypeId?: string;

  vendorId?: string;
  documentId?: string;
  /** The (type, id) pair that actually yielded documents. */
  documentType?: string;
  documentTypeId?: string;

  /**
   * Endpoints this API key cannot reach, mapped to the reason. Probed once in
   * globalSetup; tests for these skip instead of failing, and start running by
   * themselves once ResMan grants access.
   */
  unavailable: Record<string, string>;

  /** Notes on what discovery could not find, surfaced in the run header. */
  notes: string[];
};

const CACHE_PATH = path.resolve(__dirname, '../../node_modules/.cache/resman-test-context.json');

export function saveContext(ctx: TestContext): void {
  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(ctx, null, 2), 'utf8');
}

export function loadContext(): TestContext {
  if (!fs.existsSync(CACHE_PATH)) {
    throw new Error(
      'Test context missing. globalSetup should have written it — run via `npm run test:live`.'
    );
  }
  return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')) as TestContext;
}
