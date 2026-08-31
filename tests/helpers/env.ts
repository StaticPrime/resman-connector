import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function required(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(
      `Missing ${name}. Copy env.example to .env and fill in your ResMan credentials ` +
        `before running the live test suite.`
    );
  }
  return value.trim();
}

export const env = {
  partnerId: required('RESMAN_PARTNER_ID'),
  apiKey: required('RESMAN_API_KEY'),
  accountId: required('RESMAN_ACCOUNT_ID'),

  /** Pin discovery to one property instead of auto-selecting. */
  propertyId: process.env.RESMAN_TEST_PROPERTY_ID?.trim() || undefined,
  /** Only used by the GET /Account/AccountId test, which is skipped without it. */
  subDomain: process.env.RESMAN_TEST_SUBDOMAIN?.trim() || undefined,
  /** Per-request timeout handed to the connector. */
  timeout: Number(process.env.RESMAN_TEST_TIMEOUT ?? 60000),
};

/**
 * How many properties discovery may scan when looking for one that actually
 * holds data. Kept small: ResMan is not auto-scaled and the connector retries
 * with 15s backoffs.
 */
export const MAX_PROPERTIES_TO_SCAN = Number(process.env.RESMAN_TEST_MAX_PROPERTIES ?? 8);

/**
 * A `modifiedSince` safe for every endpoint that takes one. Several endpoints
 * (billing accounts, work orders, invoices) reject anything older than 364
 * days, so this stays comfortably inside that window.
 */
export function defaultModifiedSince(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 300);
  return d;
}
