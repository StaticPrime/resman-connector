import { LeaseStatus } from './leases.type';

export type TProspectResponse = {
  prospectId: string;
  propertyId: string;
  mainPersonId: string;
  lastModified: string;
  transactionSourceId: string;
  prospectSourceId: string;
  prospectSourceName: string;
  status: ProspectStatus;
  firstContactMethod: string;
  firstContactDate: string;
  firstContactCommunicationLogId: string;
  /**
   * @deprecated Not observed in any live response.
   */
  lastContactDate?: string;
  lostDate: string | null;
  lostReason: string | null;
  leasingAgent: TProspectLeasingAgent | null;
  people: TProspectPerson[];
  /**
   * ONLY present when `getProspects` is called with `includeCommunicationLog:
   * true`. ResMan omits the key entirely otherwise — verified against the live
   * API with the flag both set and unset.
   */
  communicationLog?: TProspectCommunicationLog[];
  /**
   * A field separate from {@link TProspectResponse.communicationLog}, always
   * present on the response and unaffected by `includeCommunicationLog`.
   *
   * ResMan returned an explicit `null` for every prospect observed, so the
   * element shape could not be determined. Typed permissively rather than as
   * the literal `null` so a populated response does not break the type.
   */
  events: Record<string, unknown>[] | null;
  /**
   * Only present once the prospect has an application on file.
   */
  lease?: TProspectLease;
};

export type TProspectLease = {
  billingAccountId: string;
  leaseId: string;
  status: LeaseStatus;
  unitId: string;
  unitNumber: string;
  applicationDate: string;
  approvalDate: string | null;
  denialDate: string | null;
  cancellationDate: string | null;
  leaseSignedDate: string | null;
  scheduledMoveInDate: string;
  moveInDate: string | null;
};

export enum ProspectStatus {
  PROSPECT = 'Prospect',
  LOST = 'Lost',
  APPLICANT = 'Applicant',
  RESIDENT = 'Resident',
}

export type TProspectLeasingAgent = {
  agentId: string;
  personId: string;
  firstName: string;
  lastName: string;
};

export type TProspectPerson = {
  personId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string | null;
  phone: string | null;
  phoneType: string | null;
  householdStatus: string | null;
  isMainContact: boolean;
  isHeadOfHousehold: boolean | null;
  isLeaseSigner: boolean | null;
  isGuarantor: boolean | null;
  isDependent: boolean | null;
  isExcludedFromOccupancy: boolean | null;
};

export type TProspectCommunicationLog = {
  communicationLogId: string;
  date: string;
  interactionType: string;
  contactType: string;
  description: string | null;
  note: string | null;
  employee?: TProspectLeasingAgent;
  timestamp: string;
};

export type TProspectSourceResponse = {
  prospectSourceId: string;
  name: string;
  isActive?: boolean;
};
