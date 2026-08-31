# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0]

### Breaking

- `rentableItems.getRentableItems()` no longer takes `onlyAvailable`. The two
  endpoints it used to switch between return genuinely different shapes, so they
  are now separate methods with separate types:
  - `getRentableItems({ propertyId })` -> `TRentableItemResponse[]`, which carries
    `isOccupied` and `leaseId`
  - `getRentableItemAvailability({ propertyId })` -> `TRentableItemAvailabilityResponse[]`,
    which carries `status`, `moveInDate` and `dateAvailable`
- `TRentableItemResponse.status`, `.moveInDate` and `.dateAvailable` moved to
  `TRentableItemAvailabilityResponse`. `GET /RentableItems` never returned them.
- `TProspectResponse.communicationLog` is now optional. ResMan omits the key
  unless `getProspects` is called with `includeCommunicationLog: true`.

- `leases.getLeases()` parameters renamed to the spellings ResMan documents.
  Update call sites:
  - `noticeToVacateGivenDateFrom` -> `noticeToVacateDateFrom`
  - `noticeToVacateGivenDateTo` -> `noticeToVacateDateTo`
  - `isMoveOutReconcillationComplete` -> `isMoveOutReconciliationComplete`
  - `moveOutReconcillationDateFrom` -> `moveOutReconciliationDateFrom`
  - `moveOutReconcillationDateTo` -> `moveOutReconciliationDateTo`

- Misspelled response fields renamed to their correct spellings. The old names
  are gone, not deprecated. Update any code reading them:
  - `TRentableItemTypeResponse.marketinDescription` -> `marketingDescription`
  - `TRentableItemTypeResponse.includeinOnlineApplication` -> `includeInOnlineApplication`
  - `TRentableItemTypeResponse.rentabbleItemCount` -> `rentableItemCount`
  - `TUnitAvailabilityResponse.availableForOnlinemarketing` -> `availableForOnlineMarketing`
  - `TBillingAccountTransaction.trasactionCategoryId` -> `transactionCategoryId`
  - `TBillingAccountResponse.leaseID` -> `leaseId`
  - `TLeaseResponse.moveOutReconcillationDate` -> `moveOutReconciliationDate`

  All of these except `leaseID` were since confirmed correct against the live API.
  `TBillingAccountResponse.leaseID` is genuinely spelled that way on the wire, so
  it is now normalised in the module rather than renamed on the type — see Fixed.

### Changed

- Every response DTO was reconciled field-by-field against live API responses.
  55 types were checked against a recursive profile of 30 endpoints and 67 nested
  object paths. Three systemic corrections:
  - **Response date fields are now `string`, not `Date`.** This connector performs
    no date deserialization anywhere, so every `Date`-typed response field was a
    lie -- `lease.leaseStartDate.getTime()` threw. Request parameters are
    unchanged and remain `Date`, since the modules format those correctly.
  - **Optionality now reflects reality.** A field is optional (`?`) only where the
    API genuinely omits the key. Fields always present but sometimes null are
    typed `T | null` instead.
  - **Undeclared fields were added** across nearly every type, including nested
    shapes that previously had no type at all (e.g. amenity charges).
- Notable individual corrections:
  - `TLeasePerson.isGrantor` -> `isGuarantor`. The old spelling never matched the
    wire and always read `undefined`.
  - `forwardingAddress` moved off `TLeaseResponse` onto `TLeasePerson`, which is
    where the API actually returns it. `TForwardingAddress` gained `country`.
  - `TUnitResponse.floor` and `TUnitAvailabilityResponse.floor` are `string`, not
    `number`. Arithmetic on them was silently wrong.
  - `TChartOfAccountResponse.parentGlAccountId` -> `parentGLAccountId`.
  - `TWorkOrderLocationResponse.locationId` -> `id`, matching both the wire and
    the nested `TWorkOrderLocation`.
  - `TProspectResponse.communicationLog` is optional -- the API omits the key
    unless `includeCommunicationLog: true` is passed. `events` is a separate
    field and is not the communication log.
  - `TLedgerResponse` was split: `/Transactions/DepositLedger` returns a
    different shape and now has its own `TDepositLedgerResponse`.

### Fixed

- `leases.getLeases()` was sending misspelled query keys for the notice-to-vacate
  and move-out-reconciliation date filters, so ResMan silently ignored them.
  These filters now work.
- `accounting.getTransactionCategories()` returned `undefined` for every call: it
  read `categories` off the response envelope, but ResMan returns
  `transactionCategories`. It also comma-joined the `types` filter, which ResMan
  accepts but answers with an empty set — each type is now fetched separately and
  the results merged and de-duplicated. On a test account this took the result
  from 0 categories to 87. Calling it with an empty `types` array now returns an
  error rather than 500ing.
- `rentableItems.getRentableItems()` now exposes `isOccupied` and `leaseId`.
  ResMan returns both on `GET /RentableItems`; neither was modelled, so the
  direct rentable-item-to-lease association was invisible to consumers.
- `TBillingAccountResponse.leaseId` was always `undefined`. ResMan returns the
  field as `leaseID`, so the module now normalises it. On a test account this
  took the number of billing accounts exposing a lease from 0 to 563.
- `workOrders.getWorkOrderLocations()` returned `locationId: undefined`. ResMan
  returns the identifier as `id`, so `TWorkOrderLocationResponse` now declares
  `id` -- matching both the wire and the nested `TWorkOrderLocation`.
- `TBillingAccountTransaction.transactionCategoryId` is required again, matching
  the live response.
- Removed a duplicated validation branch in `units.addPricing()`.
- `TAddDocumentLinkResponse` is now exported from the package root; it was
  previously unreachable for consumers.

### Added

- `properties.getPropertyCharges()` - GET /PropertyCharges
- `units.getUnitCharges()` - GET /UnitCharges
- `units.addUnitTypeMarketRent()` - POST /UnitTypes/MarketRent
- `prospects.getProspectSources()` - GET /ProspectSources

  Only `/PropertyCharges` has a schema published by ResMan; the shapes for the
  other three are inferred from endpoint descriptions and are unconfirmed.
  `TUnitCharge.raw` carries the untouched response row so no data is lost if a
  field name is wrong.

  NOT YET VERIFIABLE: against the test account, `/PropertyCharges`, `/UnitCharges`
  and `/ProspectSources` all return HTTP 401 -- the API key is not entitled to
  them, so they are wrapped but unproven.

  A `GET /BankAccounts` wrapper was also written and then removed before release:
  the bare path returns HTTP 404 for every variant tried (with and without
  params, trailing slash, lowercase, singular, and under /Accounting), while
  `/BankAccounts/Payments` returns 200 on the same credentials. The resource does
  not exist on this API version. Bank account identity is available from
  `getBankAccountPayments()`, whose rows carry `bankAccountId`, `accountName`
  and `accountNumber`.
- `TAmenityResponse.charges` (new `TAmenityCharge`), `TAmenityResponse.propertyId`,
  `TPropertyResponse.timeZone` / `.defaultUnitApplicationUrl`,
  `TUnitResponse.isAffordableUnit` / `.isHoldingUnit`,
  `TUnitAvailabilityResponse.marketRent`, `TResidentResponse.isGuarantor`,
  `TProspectLeasingAgent.agentId`, `TProspectLease.unitId`,
  `TBalanceResponse.startBalance` / `.endBalance`,
  `TBankAccountPayment.vendorName` / `.vendorAbbreviation`,
  `TLedgerResponse.reference` / `.method` / `.dateReversed`,
  `TWorkOrderResponse.email`, `TMultipleDocumentResponse.subType`.
