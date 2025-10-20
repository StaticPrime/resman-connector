import { LeaseStatus } from './leases.type';

export type TProspectResponse = {
  prospectId: string;
  propertyId: string;
  mainPersonId: string;
  lastModified: Date;
  prospectSourceId: string;
  prospectSourceName: string;
  status: ProspectStatus;
  firstContactMethod?: string;
  firstContactDate?: Date;
  lastContactDate?: Date;
  lostDate?: Date;
  lostReason?: string;
  leasingAgent?: TProspectLeasingAgent;
  people: TProspectPerson[];
  communicationLog: TProspectCommunicationLog[];
  lease?: TProspectLease;
};

export type TProspectLease = {
  billingAccountId: string;
  leaseId: string;
  status: LeaseStatus;
  unitNumber: string;
  applicationDate: Date;
  approvalDate?: Date;
  denialDate?: Date;
  cancellationDate?: Date;
  leaseSignedDate?: Date;
  scheduledMoveInDate: Date;
  moveInDate?: Date;
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
