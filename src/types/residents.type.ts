export enum ResidentLeaseStatus {
  CURRENT = 'Current',
  UNDER_EVICTION = 'Under Eviction',
  NOTICE_TO_VACATE = 'Notice to Vacate',
  MONTH_TO_MONTH = 'Month to Month',
}

export enum ResidencyStatus {
  CURRENT = 'Current',
  UNDER_EVICTION = 'Under Eviction',
  NOTICE_TO_VACATE = 'Notice to Vacate',
  MONTH_TO_MONTH = 'Month to Month',
}

export type TResidentLease = {
  leaseId: string;
  startDate: Date;
  endDate: Date;
  status: string;
};

export type TResidentResponse = {
  billingAccountId: string;
  personId: string;
  leaseId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  unitId?: string;
  unit?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  building?: string;
  email?: string;
  mobilePhone?: string;
  homePhone?: string;
  workPhone?: string;
  householdStatus?: string;
  isHeadOfHousehold: boolean;
  isDependent: boolean;
  isLeaseSigner: boolean;
  isMainContact: boolean;
  isExcludedFromOccupancy: boolean;
  birthdate?: Date;
  socialSecurityNumber?: string;
  leaseStartDate?: Date;
  leaseEndDate?: Date;
  moveInDate?: Date;
  moveOutDate?: Date;
  leaseStatus: ResidentLeaseStatus;
  residencyStatus: ResidencyStatus;
  rent: number;
  leases: TResidentLease[];
};
