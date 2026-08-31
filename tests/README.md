# Live GET endpoint tests

These tests run against the **real ResMan API**. They are read-only: every call is
a `GET`. No `POST`, `PUT`, or `DELETE` endpoint is exercised.

## Running

```bash
cp env.example .env    # fill in the three credentials
npm run test:live
```

`.env` needs only:

```
RESMAN_PARTNER_ID=
RESMAN_API_KEY=
RESMAN_ACCOUNT_ID=
```

Every other id — property, unit, lease, resident, billing account, rentable item,
vendor, document — is **discovered at runtime** by `tests/globalSetup.ts`, which
runs once before any suite and caches the result to
`node_modules/.cache/resman-test-context.json`.

Discovery lists the account's properties, then scans up to 8 of them for one that
has both units and leases. Resources still missing after that are searched for
individually. The chosen context is printed as a header at the start of the run.

## Optional knobs

| Variable | Effect |
| --- | --- |
| `RESMAN_TEST_PROPERTY_ID` | Pin discovery to one property instead of auto-selecting |
| `RESMAN_TEST_SUBDOMAIN` | Enables the `GET /Account/AccountId` test, which skips without it |
| `RESMAN_TEST_TIMEOUT` | Per-request timeout in ms (default 60000) |
| `RESMAN_TEST_MAX_PROPERTIES` | How many properties discovery may scan (default 8) |

## What a test asserts

Each test makes one real call and requires all three of:

1. **The call succeeded** — `res.error` is undefined. Modules never throw; they
   return `{ data: undefined, error }`, so a bare `await` looks fine even on a 401.
   `expectOk` is the gate that catches that.
2. **Data came back** — the array is non-empty. An empty result fails, on the
   basis that a working endpoint with no rows is worth surfacing rather than
   passing silently.
3. **Required DTO fields are present** — presence only. Values are never
   inspected, so `null` and `""` pass. A missing key means either ResMan changed
   the response or our type marks a field required that isn't.

## Interpreting failures

Failures fall into four kinds, and they mean different things:

- **`HTTP 401 [20001] credentials are not permitted`** — the partner ID is not
  entitled to that endpoint. Not a code bug; take it to ResMan.
- **`HTTP 404`** — the path does not exist on this API version.
- **`missing required field(s): …`** — our DTO disagrees with the live response.
  The message lists the keys ResMan actually returned, so the fix is usually
  obvious.
- **`returned no error but data was undefined`** — the module read the wrong key
  off the response envelope. A real connector bug.

## Concurrency

Runs serially (`maxWorkers: 1`). ResMan is not auto-scaled, and the connector
retries with 15-second backoffs, so parallel suites would compete for the same
rate limit and turn a slow response into a cascade of timeouts.
