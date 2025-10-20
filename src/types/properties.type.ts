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
  start: Date;
  end: Date;
};

export type TPropertyManagementTeam = {
  personId: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type TPropertyResponse = {
  propertyId: string;
  abbreviation?: string;
  name: string;
  type: PropertyType;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  manager?: string;
  currentPeriod?: TPropertyCurrentPeriod;
  managementTeam?: TPropertyManagementTeam[];
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

export type TAmenityResponse = {
  amenityId: string;
  name: string;
  description?: string;
  amenityTypeId: string;
  amenityTypeName: string;
  ilsMapping: string;
  availableForOnlineMarketing: boolean;
  units?: TAmenityUnit[];
};

export type TBuildingResponse = {
  buildingId: string;
  propertyId: string;
  name: string;
  description?: string;
  floors: number;
  totalUnits: number;
};
