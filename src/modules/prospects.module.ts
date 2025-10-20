import { ResManConnector } from '../connector';
import { TApiResponse, TProspectResponse } from '../types';
import { createSuccessResponse, createErrorResponse, validateStartAndEndDate } from '../utils';

/**
 * Prospects Modules
 * Provides methods for prospect operations
 */
export class ProspectsModules {
  constructor(private connector: ResManConnector) {}

  /**
   * GET /Prospects
   * @param propertyId The property ID
   * @param modifiedSince The modified since date
   * @param prospectId The prospect ID
   * @param personId The person ID
   * @param firstContactDateFrom The first contact date from
   * @param firstContactDateTo The first contact date to
   * @param includeCommunicationLog Whether to include communication log
   * @returns List of prospects
   */
  public async getProspects({
    propertyId,
    modifiedSince,
    prospectId,
    personId,
    firstContactDateFrom,
    firstContactDateTo,
    includeCommunicationLog,
  }: {
    propertyId: string;
    modifiedSince: Date;
    prospectId?: string;
    personId?: string;
    firstContactDateFrom?: Date;
    firstContactDateTo?: Date;
    includeCommunicationLog?: boolean;
  }): Promise<TApiResponse<TProspectResponse[]>> {
    if (modifiedSince > new Date()) {
      return createErrorResponse(new Error('modifiedSince cannot be in the future.'));
    }

    const errorResponse = validateStartAndEndDate(firstContactDateFrom, firstContactDateTo);
    if (errorResponse) {
      return createErrorResponse(new Error(errorResponse));
    }

    return this.connector
      .get<{ prospects: TProspectResponse[] }>('/Prospects', {
        params: {
          propertyId,
          modifiedSince: modifiedSince.toUTCString(),
          prospectId,
          personId,
          firstContactDateFrom: firstContactDateFrom
            ? firstContactDateFrom.toUTCString()
            : undefined,
          firstContactDateTo: firstContactDateTo ? firstContactDateTo.toUTCString() : undefined,
          includeCommunicationLog,
        },
      })
      .then((response) => createSuccessResponse(response.data.prospects))
      .catch((error) => createErrorResponse(error));
  }
}
