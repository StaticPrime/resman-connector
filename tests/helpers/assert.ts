import { TApiResponse } from '../../src';

/**
 * `TApiResponse.error` is typed `unknown`, so every read of it needs narrowing.
 * Renders whatever came back into something a failure message can show.
 */
export function errorMessage(error: unknown): string {
  const err = error as Partial<Error> & { statusCode?: number; code?: string };
  const status = err?.statusCode ? ` (HTTP ${err.statusCode})` : '';
  const code = err?.code ? ` [${err.code}]` : '';
  const message = err?.message ?? String(error);
  return `${message}${status}${code}`;
}

/**
 * Assert the call reached ResMan and came back without an error.
 *
 * Every module funnels failures through `createErrorResponse`, which returns
 * `{ data: undefined, error }` rather than throwing — so a bare `await` looks
 * successful even on a 401. This is the gate that catches that.
 */
export function expectOk<T>(label: string, res: TApiResponse<T>): T {
  if (res.error) {
    throw new Error(`${label} failed: ${errorMessage(res.error)}`);
  }
  if (res.data === undefined || res.data === null) {
    throw new Error(`${label} returned no error but data was ${String(res.data)}`);
  }
  return res.data;
}

/**
 * Assert the endpoint actually returned rows. An empty array means the call
 * worked but the account holds no data for it, which this suite treats as a
 * failure so it surfaces rather than passing silently.
 */
export function expectRows<T>(label: string, res: TApiResponse<T[]>): T[] {
  const data = expectOk(label, res);
  if (!Array.isArray(data)) {
    throw new Error(`${label} expected an array, got ${typeof data}`);
  }
  if (data.length === 0) {
    throw new Error(
      `${label} succeeded but returned 0 rows. The endpoint works; this account ` +
        `has no data for it, or the discovered id has no related records.`
    );
  }
  return data;
}

/**
 * Assert the required keys are present on a record. Presence only — the value
 * is never inspected, so nulls and empty strings pass. A missing key means
 * either ResMan changed the response or our DTO marks it required wrongly.
 */
export function expectFields(label: string, record: unknown, fields: string[]): void {
  if (record === null || typeof record !== 'object') {
    throw new Error(`${label} expected an object, got ${record === null ? 'null' : typeof record}`);
  }
  const missing = fields.filter((f) => !Object.prototype.hasOwnProperty.call(record, f));
  if (missing.length > 0) {
    throw new Error(
      `${label} is missing required field(s): ${missing.join(', ')}. ` +
        `Present keys: ${Object.keys(record as object).join(', ') || '(none)'}`
    );
  }
}

/** `expectFields` applied to every row, reporting the first offending index. */
export function expectFieldsOnAll(label: string, rows: unknown[], fields: string[]): void {
  rows.forEach((row, i) => expectFields(`${label}[${i}]`, row, fields));
}

/**
 * Declare a test for an endpoint this API key may not be entitled to.
 *
 * globalSetup probes each gated endpoint once. If it came back 401/403/404 the
 * test is skipped with the reason shown; otherwise it runs normally — so these
 * light up on their own once ResMan grants access, with no code change.
 */
export function itEndpoint(
  unavailable: Record<string, string>,
  endpoint: string,
  name: string,
  fn: () => Promise<void>,
  timeout?: number
): void {
  const reason = unavailable[endpoint];
  if (reason) {
    it.skip(`${name} — SKIPPED: ${reason}`, () => {
      /* not entitled */
    });
    return;
  }
  it(name, fn, timeout);
}

/**
 * Skip a test with a visible reason instead of failing, for the handful of
 * cases where the input genuinely cannot be discovered (see globalSetup).
 */
export function itWith<T>(
  value: T | undefined,
  name: string,
  fn: (value: T) => Promise<void>,
  timeout?: number
): void {
  if (value === undefined || value === null) {
    it.skip(`${name} — SKIPPED: prerequisite id not discoverable on this account`, () => {
      /* skipped */
    });
    return;
  }
  it(name, () => fn(value), timeout);
}
