import { DocumentType } from '../src';
import { getClient } from './helpers/client';
import { env, MAX_PROPERTIES_TO_SCAN, defaultModifiedSince } from './helpers/env';
import { saveContext, TestContext } from './helpers/context';
import { errorMessage } from './helpers/assert';

/**
 * Discovers every id the live suite needs, using only the three credentials in
 * .env. Runs once before any suite.
 *
 * Strategy: list properties, then scan them (newest-first order as returned)
 * until one yields both units and leases — that becomes the primary property.
 * Resources still missing afterwards are searched for across the remaining
 * properties individually, so a sparse account still produces a usable context.
 */
export default async function globalSetup(): Promise<void> {
  const client = getClient();
  const notes: string[] = [];

  const propertiesRes = await client.properties.getProperties();
  if (propertiesRes.error) {
    throw new Error(
      `Discovery failed at GET /Properties: ${errorMessage(propertiesRes.error)}. ` +
        `Check RESMAN_PARTNER_ID / RESMAN_API_KEY / RESMAN_ACCOUNT_ID in .env.`
    );
  }
  const properties = propertiesRes.data ?? [];
  if (properties.length === 0) {
    throw new Error('GET /Properties returned 0 properties — nothing to test against.');
  }

  const allPropertyIds = properties.map((p) => p.propertyId);

  // Honour a pinned property if one was supplied.
  const candidates = env.propertyId
    ? properties.filter((p) => p.propertyId === env.propertyId)
    : properties.slice(0, MAX_PROPERTIES_TO_SCAN);

  if (env.propertyId && candidates.length === 0) {
    throw new Error(
      `RESMAN_TEST_PROPERTY_ID=${env.propertyId} is not present on account ${env.accountId}.`
    );
  }

  const modifiedSince = defaultModifiedSince();
  let ctx: TestContext | undefined;

  for (const property of candidates) {
    const propertyId = property.propertyId;

    const [unitsRes, leasesRes] = await Promise.all([
      client.units.getUnits({ propertyId }),
      client.leases.getLeases({ propertyId, includeLeaseHistory: false, modifiedSince }),
    ]);

    const units = unitsRes.data ?? [];
    const leases = leasesRes.data ?? [];

    // Prefer a property that has both; otherwise remember the first with units.
    const usable = units.length > 0 && leases.length > 0;
    if (!usable && ctx) continue;

    const lease = leases[0];
    const unit = units[0];

    const next: TestContext = {
      propertyId,
      propertyName: property.name,
      allPropertyIds,
      unitId: unit?.unitId,
      unitNumber: unit?.unitNumber,
      unitTypeId: unit?.unitTypeId,
      leaseId: lease?.leaseId,
      billingAccountId: lease?.billingAccountId,
      personId: lease?.people?.[0]?.personId,
      unavailable: {},
      notes,
    };

    if (usable) {
      ctx = next;
      break;
    }
    if (!ctx && units.length > 0) ctx = next;
  }

  if (!ctx) {
    // No property had units; fall back to the first so property-level endpoints
    // can still be exercised.
    ctx = {
      propertyId: properties[0].propertyId,
      propertyName: properties[0].name,
      allPropertyIds,
      unavailable: {},
      notes,
    };
    notes.push('No property had units; only property-level endpoints will run.');
  }

  const propertyId = ctx.propertyId;

  // personId: fall back to the resident roster if the lease carried no people.
  if (!ctx.personId) {
    const residentsRes = await client.residents.getResidents({
      propertyId,
      includeLeaseHistory: false,
    });
    const resident = residentsRes.data?.[0];
    if (resident) {
      ctx.personId = resident.personId;
      ctx.billingAccountId = ctx.billingAccountId ?? resident.billingAccountId;
      ctx.leaseId = ctx.leaseId ?? resident.leaseId;
    }
  }

  // billingAccountId: the ledger endpoints need one; billing accounts are the
  // most reliable source since they exist for non-residents too.
  if (!ctx.billingAccountId) {
    const billingRes = await client.accounting.getBillingAccounts({ propertyId, modifiedSince });
    ctx.billingAccountId = billingRes.data?.[0]?.billingAccountId;
  }

  // Rentable items — the reason this connector got audited in the first place.
  const rentableRes = await client.rentableItems.getRentableItems({ propertyId });
  ctx.rentableItemId = rentableRes.data?.[0]?.rentableItemId;
  ctx.rentableItemTypeId = rentableRes.data?.[0]?.rentableItemTypeId;

  // Vendors are account-scoped, not property-scoped.
  const vendorsRes = await client.vendors.getVendors({});
  ctx.vendorId = vendorsRes.data?.[0]?.vendorId;

  // Work orders are the most reliable source of documents on a typical account,
  // so find one that actually has attachments to drive the /Documents tests.
  const workOrdersRes = await client.workOrders.getWorkOrders({ propertyId, modifiedSince });
  const workOrderWithDocs = (workOrdersRes.data ?? []).find((w) => (w.documents ?? []).length > 0);

  // Documents: try each type that maps to an id we hold, stopping at the first
  // that actually returns a document.
  const documentAttempts: Array<{ type: DocumentType; id?: string }> = [
    { type: DocumentType.WORK_ORDER, id: workOrderWithDocs?.workOrderId },
    { type: DocumentType.LEASE, id: ctx.leaseId },
    { type: DocumentType.UNIT, id: ctx.unitId },
    { type: DocumentType.RESIDENT, id: ctx.personId },
  ];
  for (const attempt of documentAttempts) {
    if (!attempt.id) continue;
    const docsRes = await client.documents.getDocuments({
      propertyId,
      type: attempt.type,
      typeId: attempt.id,
    });
    const doc = docsRes.data?.[0];
    if (doc) {
      ctx.documentId = doc.documentId;
      ctx.documentType = attempt.type;
      ctx.documentTypeId = attempt.id;
      break;
    }
  }

  // Probe the endpoints this partner may not be entitled to. One call each; a
  // 401/403/404 marks the endpoint unavailable so its tests skip rather than
  // fail, and start running by themselves once access is granted.
  const raw = client.getConnector();
  const probes: Array<[string, () => Promise<unknown>]> = [
    ['/PropertyCharges', () => raw.get('/PropertyCharges', { params: { PropertyId: propertyId } })],
    ['/UnitCharges', () => raw.get('/UnitCharges', { params: { propertyId } })],
    ['/ProspectSources', () => raw.get('/ProspectSources', { params: { propertyId } })],
    [
      '/Invoices',
      () =>
        raw.get('/Invoices', {
          params: { propertyId, modifiedSince: modifiedSince.toUTCString() },
        }),
    ],
    ['/PickLists', () => raw.get('/PickLists', { params: { name: 'Area' } })],
    ['/Vendors', () => raw.get('/Vendors', { params: {} })],
  ];

  const unavailable: Record<string, string> = {};
  for (const [endpoint, call] of probes) {
    try {
      await call();
    } catch (error) {
      const status = (error as { statusCode?: number }).statusCode;
      if (status === 401 || status === 403) {
        unavailable[endpoint] = `HTTP ${status} — this API key is not entitled to ${endpoint}`;
      } else if (status === 404) {
        unavailable[endpoint] = `HTTP 404 — ${endpoint} does not exist on this API version`;
      } else if (status === 400) {
        unavailable[endpoint] =
          `HTTP 400 — ${endpoint} requires a filter that cannot be discovered`;
      } else {
        unavailable[endpoint] = `${errorMessage(error)}`;
      }
    }
  }
  ctx.unavailable = unavailable;

  const missing: Array<[string, unknown]> = [
    ['unitId', ctx.unitId],
    ['leaseId', ctx.leaseId],
    ['billingAccountId', ctx.billingAccountId],
    ['personId', ctx.personId],
    ['rentableItemId', ctx.rentableItemId],
    ['vendorId', ctx.vendorId],
    ['documentId', ctx.documentId],
  ];
  for (const [name, value] of missing) {
    if (!value) notes.push(`Could not discover ${name} — dependent tests will skip.`);
  }
  if (!env.subDomain) {
    notes.push('RESMAN_TEST_SUBDOMAIN unset — GET /Account/AccountId will skip.');
  }

  ctx.notes = notes;
  saveContext(ctx);

  /* eslint-disable no-console */
  console.log('\n─── ResMan live test context ───────────────────────────────');
  console.log(`  account      : ${env.accountId}`);
  console.log(`  properties   : ${allPropertyIds.length} on account`);
  console.log(`  property     : ${ctx.propertyName} (${ctx.propertyId})`);
  console.log(`  unit         : ${ctx.unitNumber ?? '—'} (${ctx.unitId ?? '—'})`);
  console.log(`  lease        : ${ctx.leaseId ?? '—'}`);
  console.log(`  billingAcct  : ${ctx.billingAccountId ?? '—'}`);
  console.log(`  person       : ${ctx.personId ?? '—'}`);
  console.log(`  rentableItem : ${ctx.rentableItemId ?? '—'}`);
  console.log(`  vendor       : ${ctx.vendorId ?? '—'}`);
  console.log(`  document     : ${ctx.documentId ?? '—'}`);
  for (const note of notes) console.log(`  note         : ${note}`);
  for (const [endpoint, reason] of Object.entries(ctx.unavailable)) {
    console.log(`  unavailable  : ${endpoint} — ${reason}`);
  }
  console.log('────────────────────────────────────────────────────────────\n');
  /* eslint-enable no-console */
}
