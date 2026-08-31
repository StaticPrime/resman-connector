import { ResManClient } from '../../src';
import { env } from './env';

let cached: ResManClient | undefined;

/**
 * The shared client for the live suite. Built from .env only — every other id
 * the tests need is discovered at runtime.
 */
export function getClient(): ResManClient {
  if (!cached) {
    cached = new ResManClient({
      integrationPartnerId: env.partnerId,
      apiKey: env.apiKey,
      accountId: env.accountId,
      timeout: env.timeout,
    });
  }
  return cached;
}
