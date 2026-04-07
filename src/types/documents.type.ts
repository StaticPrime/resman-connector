export enum DocumentType {
  LEASE = 'Lease',
  RESIDENT = 'Resident',
  WORK_ORDER = 'WorkOrder',
  UNIT = 'Unit',
  PROCESSOR_PAYMENT = 'ProcessorPayment',
}

export type TSingleDocumentResponse = {
  documentId: string;
  uri: string;
  uriExpiration: Date;
};

export type TMultipleDocumentResponse = {
  documentId: string;
  path: string;
  name: string;
  size: number;
  fileType: string;
  dateAttached: Date;
};

export type TAddDocumentLinkResponse = {
  id: string;
  type: DocumentType;
  fileName: string;
  url?: string;
  documentId: string;
  propertyId: string;
};
