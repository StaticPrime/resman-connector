export enum DocumentType {
  LEASE = 'Lease',
  WORK_ORDER = 'WorkOrder',
  UNIT = 'Unit',
  PROCESSOR_PAYMENT = 'ProcessorPayment',
}

export type TSingleDocumentResponse = {
  documentId: string;
  uir: string;
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
