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
  buildingId: string;
  building: string;
  /** The API returns this as a string (e.g. '1'), not a number. */
  floor: string;
  squareFeet: number;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  excludedFromOccupancy: boolean;
  availableForOnlineMarketing: boolean;
  marketRent: number;
  amenities: TUnitAmenity[];
  isAffordableUnit: boolean;
  isHoldingUnit: boolean;
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
  /** ISO date string; this connector performs no date deserialization. */
  applicationDate: string;
  /** ISO date string; this connector performs no date deserialization. */
  moveInDate: string;
};

export type TUnitOccupyingLease = {
  billingAccountId: string;
  leaseId: string;
  /** ISO date string; this connector performs no date deserialization. */
  moveInDate: string;
  /** ISO date string, or null when no notice has been given. */
  noticeToVacateDate: string | null;
  /** ISO date string, or null when the lease has not moved out. */
  moveOutDate: string | null;
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
  /** The API returns this as a string (e.g. '1'), not a number. */
  floor: string;
  squareFeet: number;
  unitTypeId: string;
  unitTypeName: string;
  /**
   * Always observed as null across every sampled unit; typed as a nullable string
   * because the field is a marketing name when populated.
   */
  unitTypeMarketingName: string | null;
  availableForOnlineMarketing: boolean;
  buildingId: string;
  buildingName: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  status: UnitStatus;
  /** ISO date string; this connector performs no date deserialization. */
  statusDate: string;
  /** ISO date string, or null when the unit has no availability date. */
  dateAvailable: string | null;
  vacancyStatus: UnitVacancyStatus;
  excludedFromOccupancy: boolean;
  marketRent: number;
  amenities: TUnitAmenity[];
  occupyingLease: TUnitOccupyingLease | null;
  applicantLease: TApplicantLease | null;
};

export type TUnitTypeResponse = {
  unitTypeId: string;
  propertyId: string;
  name: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  maximumOccupancy: number;
  marketRent: number;
  requiredDeposit: number;
};

export enum UnitChargeClass {
  RECURRING = 'Recurring',
  ONE_TIME = 'OneTime',
  RENTABLE_ITEM = 'RentableItem',
  AMENITY = 'Amenity',
}

/**
 * Shape of a GET /UnitCharges row. This endpoint returned no profileable payload,
 * so every field below is best-effort and unverified against a live response;
 * use `raw` when a field is missing.
 */
export type TUnitCharge = {
  unitId?: string;
  unitTypeId?: string;
  transactionCategoryId?: string;
  chargeName?: string;
  chargeCategory?: string;
  chargeClass?: UnitChargeClass | string;
  amount?: number;
  currency?: string;
  frequency?: string;
  isRecurring?: boolean;
  isRequired?: boolean;
  isEnabled?: boolean;
  rentableItemId?: string;
  rentableItemName?: string;
  rentableItemTypeId?: string;
  rentableItemTypeName?: string;
  amenityId?: string;
  amenityName?: string;
  /** ISO date string; this connector performs no date deserialization. */
  startDate?: string;
  /** ISO date string; this connector performs no date deserialization. */
  endDate?: string;
  raw?: Record<string, unknown>;
};
