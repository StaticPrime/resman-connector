export enum PropertyType {
  MULTI_FAMILY = 'Multi-Family',
  STUDENT = 'Student',
  MOBILE_HOME_LOT = 'Mobile Home Lot',
  SINGLE_FAMILY = 'Single Family',
  RESIDENTIAL_SUBDIVISION = 'Residential Subdivision',
  COMMERCIAL = 'Commercial',
  ENTITY = 'Entity',
  MANAGEMENT_COMPANY = 'Management Company',
  TRAINING = 'Training',
  CONDO = 'Condo',
  TAX_CREDIT = 'Tax Credit',
  HUD = 'HUD',
  AFFORDABLE_COMBO = 'Affordable Combo',
  RURAL_DEVELOPMENT = 'Rural Development',
}

export type TPropertyCurrentPeriod = {
  /** ISO date string. The API returns dates as strings; no deserialization is performed. */
  start: string;
  /** ISO date string. The API returns dates as strings; no deserialization is performed. */
  end: string;
};

export type TPropertyManagementTeam = {
  personId: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type TPropertyResponse = {
  propertyId: string;
  abbreviation: string;
  name: string;
  type: PropertyType;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  /** IANA/Windows time zone identifier for the property. */
  timeZone: string;
  /** Always null in observed responses. */
  manager: string | null;
  /** Default online application URL used for units at this property. */
  defaultUnitApplicationUrl: string;
  currentPeriod: TPropertyCurrentPeriod;
  managementTeam: TPropertyManagementTeam[];
};

export type TPropertyGroupResponse = {
  propertyGroupId: string;
  name: string;
  propertyIds: string[];
};

export type TAmenityUnit = {
  unitId: string;
  unitNumber: string;
};

export type TAmenityCharge = {
  /** ISO date string for when the charge takes effect. */
  date: string;
  impactsMarketRent: boolean;
  amount: number;
  /** Always null in observed responses. */
  category: string | null;
};

export type TAmenityResponse = {
  amenityId: string;
  propertyId: string;
  name: string;
  description: string;
  amenityTypeId: string;
  amenityTypeName: string;
  ilsMapping: string;
  availableForOnlineMarketing: boolean;
  units: TAmenityUnit[];
  charges: TAmenityCharge[];
};

export type TBuildingResponse = {
  buildingId: string;
  propertyId: string;
  name: string;
  description: string;
  floors: number;
  totalUnits: number;
};

export type PropertyChargeFrequency = string;

export type TPropertyCharge = {
  transactionCategoryId: string;
  chargeName: string;
  chargeCategory?: string;
  amount: number;
  currency?: string;
  frequency?: PropertyChargeFrequency;
  isRequired: boolean;
  isRecurring: boolean;
  isEnabled: boolean;
  isSituational?: boolean;
  isRefundable?: boolean;
  isThirdParty?: boolean;
  isTaxable?: boolean;
};

export type TPropertyChargesResponse = {
  propertyId: string;
  accountId: string;
  propertyCharges: TPropertyCharge[];
};
