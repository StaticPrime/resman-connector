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
  startDate: string;
  endDate: string;
  status: string;
};

export type TResidentResponse = {
  billingAccountId: string;
  personId: string;
  leaseId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  unitId: string;
  unit: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  building: string;
  email: string | null;
  mobilePhone: string | null;
  homePhone: string | null;
  workPhone: string | null;
  householdStatus: string;
  isHeadOfHousehold: boolean;
  isDependent: boolean;
  isLeaseSigner: boolean;
  isMainContact: boolean;
  isExcludedFromOccupancy: boolean;
  isGuarantor: boolean;
  birthdate: string | null;
  socialSecurityNumber: string | null;
  leaseStartDate: string;
  leaseEndDate: string;
  moveInDate: string;
  moveOutDate: string | null;
  leaseStatus: ResidentLeaseStatus;
  residencyStatus: ResidencyStatus;
  rent: number | null;
  leases: TResidentLease[];
};
