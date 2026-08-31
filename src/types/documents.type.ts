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
  /**
   * When the `uri` stops working. Returned as a raw JSON string — this
   * connector performs no date deserialization.
   */
  uriExpiration: string;
};

export type TMultipleDocumentResponse = {
  documentId: string;
  path: string;
  name: string;
  size: number;
  fileType: string;
  /**
   * Returned as a raw JSON string — this connector performs no date
   * deserialization.
   */
  dateAttached: string;
  /** ResMan's sub-classification of the document within its {@link DocumentType}. */
  subType?: string;
};

export type TAddDocumentLinkResponse = {
  id: string;
  type: DocumentType;
  fileName: string;
  url?: string;
  documentId: string;
  propertyId: string;
};
