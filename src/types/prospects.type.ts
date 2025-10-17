export type TProspectResponse = {
  prospectId: string;
  propertyId: string;
  mainPersonId: string;
  lastModified: Date;
  prospectSourceId: string;
  prospectSourceName: string;
  status: ProspectStatus;
  firstContactDate?: Date;
  lastContactDate?: Date;
  lostDate?: Date;
  lostReason?: string;
  leasingAgent?: TProspectLeasingAgent;
  people: TProspectPerson[];
  communicationLog: TProspectCommunicationLog[];
};

export enum ProspectStatus {
  PROSPECT = 'Prospect',
  LOST = 'Lost',
  APPLICANT = 'Applicant',
  RESIDENT = 'Resident',
}

export type TProspectLeasingAgent = {
  personId: string;
  firstName: string;
  lastName: string;
};

export type TProspectPerson = {
  personId: string;
  firstName: string;
  middleName?: null;
  lastName: string;
  email?: string;
  phone?: string;
  phoneType?: string;
  householdStatus?: string;
  isMainContact: boolean;
  isHeadOfHousehold: boolean;
  isLeaseSigner: boolean;
  isGuarantor: boolean;
  isDependent: boolean;
  isExcludedFromOccupancy: boolean;
};

export type TProspectCommunicationLog = {
  communicationLogId: string;
  date: Date;
  interactionType: string;
  contactType: string;
  description?: string;
  note?: string;
  employee?: TProspectLeasingAgent;
  timestamp: Date;
};
