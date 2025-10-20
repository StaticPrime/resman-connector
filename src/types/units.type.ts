export type TUnitPricing = {
  leaseTerm: number;
  startDate: string;
  endDate: string;
  price: number;
};

export type TRenewalPricing = {
  leaseTerm: number;
  price: number;
};

export type TUnitPricingRequest = {
  unitId: string;
  pricing: TUnitPricing[];
};

export type TUnitTypePricingRequest = {
  unitTypeId: string;
  pricing: TUnitPricing[];
};

export type TRenewalPricingRequest = {
  renewalId: string;
  pricing: TRenewalPricing[];
};

export type TUnitResponse = {
  unitId: string;
  propertyId: string;
  unitNumber: string;
  unitTypeId: string;
  unitType: string;
  buildingId?: string;
  building?: string;
  floor?: number;
  squareFeet: number;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  excludedFromOccupancy: boolean;
  availableForOnlineMarketing: boolean;
  marketRent: number;
  amenities: TUnitAmenity[];
};

export type TUnitAmenity = {
  amenityId: string;
  name: string;
  charge: number;
  impactsMarketRent: boolean;
  availableForOnlineMarketing: boolean;
};

export enum UnitStatus {
  NOT_READY = 'Not Ready',
  READY = 'Ready',
  DOWN = 'Down',
  ADMIN = 'Admin',
  MODEL = 'Model',
}

export type TApplicantLease = {
  billingAccountId: string;
  leaseId: string;
  appliicationDate: Date;
  moveInDate?: Date;
};

export type TUnitOccupyingLease = {
  billingAccountId: string;
  leaseId: string;
  moveInDate: Date;
  noticeToVacateDate?: Date;
  moveOutDate?: Date;
};

export enum UnitVacancyStatus {
  OCCUPIED = 'Occupied',
  VACANT = 'Vacant',
  NOTICE_TO_VACATE = 'Notice to Vacate',
  PRELEASED = 'Preleased',
  VACANT_PRELEASED = 'Vacant Preleased',
  NOTICE_TO_VACATE_PRELEASED = 'Notice to Vacate Preleased',
}

export type TUnitAvailabilityResponse = {
  propertyId: string;
  unitId: string;
  number: string;
  floor: number;
  squareFeet: number;
  unitTypeId: string;
  unitTypeName: string;
  unitTypeMarketingName?: string;
  availableforOnlinemarketing: boolean;
  buildingId?: string;
  buildingName?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  status: UnitStatus;
  statusDate?: Date;
  dateAvailable?: Date;
  vacancyStatus: UnitVacancyStatus;
  excludedFromOccupancy: boolean;
  amenities: TUnitAmenity[];
  occupyingLease?: TUnitOccupyingLease;
  applicantLease?: TApplicantLease;
};

export type TUnitTypeResponse = {
  unitTypeId: string;
  propertyId: string;
  name: string;
  description?: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  maximumOccupancy: number;
  marketRent: number;
  requiredDeposit: number;
};
