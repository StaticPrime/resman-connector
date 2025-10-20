import { ResManConnector } from '../connector';
import { TApiResponse, TResidentResponse } from '../types';
import { createSuccessResponse, createErrorResponse } from '../utils';

/**
 * Residents Modules
 * Provides methods for credit reporting operations
 */
export class ResidentsModules {
  constructor(private connector: ResManConnector) {}

  /**
   * Get residents
   * GET /CreditReporting/Residents
   * @param propertyId The ID of the property
   * @param personId The ID of the person
   * @param includeLeaseHistory Whether to include lease history
   * @returns List of residents
   */
  public async getResidents({
    propertyId,
    personId,
    includeLeaseHistory,
  }: {
    propertyId: string;
    personId?: string;
    includeLeaseHistory: boolean;
  }): Promise<TApiResponse<TResidentResponse[]>> {
    return this.connector
      .get<{ people: TResidentResponse[] }>('/CreditReporting/Residents', {
        params: {
          propertyId,
          personId,
          includeLeaseHistory,
        },
      })
      .then((response) => createSuccessResponse(response.data.people))
      .catch((error) => createErrorResponse(error));
  }
}
