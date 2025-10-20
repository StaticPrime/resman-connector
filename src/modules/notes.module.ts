import { ResManConnector } from '../connector';
import { TApiResponse, TNoteResponse } from '../types';
import { createSuccessResponse, createErrorResponse } from '../utils';

/**
 * Notes Modules
 * Provides methods for note operations
 */
export class NotesModules {
  constructor(private connector: ResManConnector) {}

  /**
   * POST /Notes
   * @param propertyId The ID of the property
   * @param type The type of the note
   * @param typeId The ID of the note
   * @param note The note
   * @returns The note
   */
  public async addNote({
    propertyId,
    type,
    typeId,
    note,
  }: {
    propertyId: string;
    type: string;
    typeId: string;
    note: string;
  }): Promise<TApiResponse<TNoteResponse>> {
    return this.connector
      .post<TNoteResponse>('/Notes', { propertyId, type, recordId: typeId, note })
      .then((response) => createSuccessResponse(response.data))
      .catch((error) => createErrorResponse(error));
  }
}
