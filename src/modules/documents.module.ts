import { ResManConnector } from '../connector';
import {
  TMultipleDocumentResponse,
  TApiResponse,
  DocumentType,
  TSingleDocumentResponse,
} from '../types';
import { createSuccessResponse, createErrorResponse } from '../utils';

/**
 * Documents Modules
 * Provides methods for documents-related operations
 */
export class DocumentsModules {
  constructor(private connector: ResManConnector) {}

  /**
   * Get documents for a property by type and type ID
   * GET /Documents
   * @param propertyId The ID of the property
   * @param type The type of document
   * @param typeId The ID of the document type
   * @returns List of multiple documents
   */
  public async getDocuments({
    propertyId,
    type,
    typeId,
  }: {
    propertyId: string;
    type: DocumentType;
    typeId: string;
  }): Promise<TApiResponse<TMultipleDocumentResponse[]>> {
    return this.connector
      .get<{ documents: TMultipleDocumentResponse[] }>('/Documents', {
        params: { propertyId, type, id: typeId },
      })
      .then((response) => createSuccessResponse(response.data.documents))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get a single document by ID
   * GET /Documents/Document
   * @param documentId The ID of the document
   * @returns Single document
   */
  async getSingleDocument({
    documentId,
  }: {
    documentId: string;
  }): Promise<TApiResponse<TSingleDocumentResponse>> {
    return this.connector
      .get<TSingleDocumentResponse>('/Documents/Document', {
        params: { documentId },
      })
      .then((response) => createSuccessResponse(response.data))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Add a document link
   * POST /Documents
   * @param propertyId The ID of the property
   * @param type The type of document
   * @param typeId The ID of the document type
   * @param fileName The name of the document
   * @param url The URL of the document
   * @param showInResidentPortal Whether to show the document in the resident portal
   * @returns Null
   */
  public async addDocumentLink({
    propertyId,
    type,
    typeId,
    fileName,
    url,
    showInResidentPortal,
  }: {
    propertyId: string;
    type: DocumentType;
    typeId: string;
    fileName: string;
    url: string;
    showInResidentPortal: boolean;
  }): Promise<TApiResponse<null>> {
    return this.connector
      .post<null>('/Documents', {
        propertyId,
        type,
        Id: typeId,
        fileName,
        url,
        showInResidentPortal,
      })
      .then(() => createSuccessResponse(null))
      .catch((error) => createErrorResponse(error));
  }
}
