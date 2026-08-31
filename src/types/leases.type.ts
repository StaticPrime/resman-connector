import { ResidencyStatus } from './residents.type';

export enum LeaseStatus {
  PENDING = 'Pending',
  PENDING_RENEWAL = 'Pending Renewal',
  PENDING_TRANSFER = 'Pending Transfer',
  DENIED = 'Denied',
  CANCELLED = 'Cancelled',
  CURRENT = 'Current',
  NOTICE_TO_VACATE = 'Notice to Vacate',
  MONTH_TO_MONTH = 'Month to Month',
  UNDER_EVICTION = 'Under Eviction',
  FORMER = 'Former',
  EVICED = 'Evicted',
  RENEWED = 'Renewed',
}

export type TLeaseTransfer = {
  billingAccountId: string;
  unitId: string;
  unitNumber: string;
};

/**
 * A forwarding address as returned on each person of `GET /Leasing/MoveOuts`.
 * Every member is nullable — the object is always present on a move-out person
 * even when nothing has been captured yet.
 */
export type TForwardingAddress = {
  streetAddress: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
};

export type TLeasePerson = {
  personId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string | null;
  phone: string | null;
  phoneType: string | null;
  householdStatus: string;
  residencyStatus: ResidencyStatus;
  isMainContact: boolean;
  isHeadOfHousehold: boolean;
  isLeaseSigner: boolean;
  isGuarantor: boolean;
  isDependent: boolean;
  isExcludedFromOccupancy: boolean;
  /** ISO date string, not a `Date` — this connector does not deserialize dates. */
  moveInDate: string;
  moveOutDate: string | null;
  moveOutReason: string | null;
  lastModified: string;
  /**
   * Only returned by `GET /Leasing/MoveOuts`, where it is present on every
   * person (all five members may still be `null`). Never returned by
   * `GET /Leasing/Leases`, which is why it is optional on this shared type.
   */
  forwardingAddress?: TForwardingAddress;
};

export type TLeaseHistory = {
  leaseId: string;
  status: LeaseStatus;
  applicationDate: string;
  signedDate: string | null;
  startDate: string;
  endDate: string;
  rent: number;
  recurringRentConcessions: number;
  otherConcessions: number;
  otherCharges: number;
  dateCreated: string;
};

/**
 * Shared shape for `GET /Leasing/Leases` and `GET /Leasing/MoveOuts`.
 * All date fields arrive as strings on the wire and are never converted.
 *
 * Members that only one of the two endpoints returns are declared optional so
 * the type stays truthful for both; see {@link TLeaseResponse.history}.
 *
 * Note: `forwardingAddress` used to be declared here, but the live payload
 * carries it on each entry of {@link TLeaseResponse.people} (move-outs only),
 * never on the lease itself. It now lives on {@link TLeasePerson}.
 */
export type TLeaseResponse = {
  propertyId: string;
  billingAccountId: string;
  unitId: string;
  unitNumber: string;
  unitTypeId: string;
  unitTypeName: string;
  prospectId: string;
  prospectSourceId: string;
  prospectSourceName: string;
  leaseId: string;
  leaseStatus: LeaseStatus;
  leasingAgentPersonId: string;
  leasingAgentName: string;
  leaseStartDate: string;
  leaseEndDate: string;
  applicationDate: string;
  approvalDate: string | null;
  denialDate: string | null;
  cancellationDate: string | null;
  leaseSignedDate: string | null;
  scheduledMoveInDate: string;
  moveInDate: string | null;
  noticeToVacateDate: string | null;
  scheduledMoveOutDate: string | null;
  moveOutDate: string | null;
  moveOutReconciliationDate: string | null;
  transferredTo: TLeaseTransfer | null;
  lastModified: string;
  people: TLeasePerson[];
  /**
   * Returned on every lease by `GET /Leasing/Leases` (gated by that endpoint's
   * `includeLeaseHistory` flag), and never returned by `GET /Leasing/MoveOuts`,
   * which is why it is optional on this shared type.
   */
  history?: TLeaseHistory[];
};

export type TTransactionCategory = {
  transactionCategoryId: string;
  abbreviation: string;
  type: ChargeType;
  name: string;
  isRent: boolean;
  isRecurringRentConcession: boolean;
  isOneTimeConcession: boolean;
  isNotProratable: boolean;
  isLateFeeAssessable: boolean;
};

export type TRentableItem = {
  rentableItemId: string;
  name: string;
  rentableItemTypeId: string;
  rentableItemTypeName: string;
};

export enum ChargeType {
  CREDIT = 'Credit',
  CHARGE = 'Charge',
}

export type TRecurringCharge = {
  recurringChargeId: string;
  transactionCategoryId: string;
  type: ChargeType;
  description: string;
  amount: number;
  startDate: string;
  endDate: string;
  /** Always present, but only ever observed as `null` in live responses. */
  splitLedger: string | null;
  rentableItem: TRentableItem | null;
};

export type TRecurringChargeUngroupedResponse = {
  leaseId: string;
  status: string;
  recurringCharges: TRecurringCharge[];
};

export type TRecurringChargeResponse = TRecurringCharge & {
  leaseId: string;
  status: string;
};
