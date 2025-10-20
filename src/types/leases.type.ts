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

export type TLeasePerson = {
  personId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  phone?: string;
  phoneType?: string;
  householdStatus?: string;
  residencyStatus: ResidencyStatus;
  isMainContact: boolean;
  isHeadOfHousehold: boolean;
  isLeaseSigner: boolean;
  isGrantor: boolean;
  isDependent: boolean;
  isExcludedFromOccupancy: boolean;
  moveInDate?: Date;
  moveOutDate?: Date;
  moveOutReason?: string;
  lastModified: Date;
};

export type TLeaseHistory = {
  leaseId: string;
  status: LeaseStatus;
  applicationDate?: Date;
  signedDate?: Date;
  startDate?: Date;
  endDate?: Date;
  rent: number;
  recurringRentConcessions: number;
  otherConcessions: number;
  otherCharges: number;
  dateCreated: Date;
};

export type TForwardingAddress = {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
};

export type TLeaseResponse = {
  propertyId: string;
  billingAccountId: string;
  unitId: string;
  unitNumber: string;
  unitTypeId: string;
  unitTypeName: string;
  prospectId?: string;
  prospectSourceId?: string;
  prospectSourceName?: string;
  leaseId: string;
  leaseStatus: LeaseStatus;
  leasingAgentPersonId?: string;
  leasingAgentName?: string;
  leaseStartDate: Date;
  leaseEndDate: Date;
  applicationDate?: Date;
  approvalDate?: Date;
  denialDate?: Date;
  cancellationDate?: Date;
  leaseSignedDate?: Date;
  scheduledMoveInDate?: Date;
  moveInDate?: Date;
  noticeToVacateDate?: Date;
  scheduledMoveOutDate?: Date;
  moveOutDate?: Date;
  moveOutReconcillationDate?: Date;
  transferredTo?: TLeaseTransfer;
  lastModified: Date;
  people?: TLeasePerson[];
  history?: TLeaseHistory[];
  forwardingAddress?: TForwardingAddress;
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
  startDate: Date;
  endDate: Date;
  splitLedger?: string;
  rentableItem?: TRentableItem;
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
