import { ResManConnector } from '../connector';
import { TApiResponse, TRentableItemResponse, TRentableItemTypeResponse } from '../types';
import { createSuccessResponse, createErrorResponse } from '../utils';

/**
 * Rentable Items Modules
 * Provides methods for rentable items operations
 */
export class RentableItemsModules {
  constructor(private connector: ResManConnector) {}

  /**
   * Get rentable items
   * GET /RentableItems
   * @param propertyId The ID of the property
   * @param onlyAvailable Whether to only return available rentable items
   * @returns List of rentable items
   */
  public async getRentableItems({
    propertyId,
    onlyAvailable,
  }: {
    propertyId: string;
    onlyAvailable: boolean;
  }): Promise<TApiResponse<TRentableItemResponse[]>> {
    return this.connector
      .get<{ rentableItems: TRentableItemResponse[] }>(
        onlyAvailable ? '/RentableItems/Availability' : '/RentableItems',
        {
          params: {
            propertyId,
          },
        }
      )
      .then((response) => createSuccessResponse(response.data.rentableItems))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get rentable item types
   * GET /RentableItemTypes
   * @param propertyId The ID of the property
   * @returns List of rentable item types
   */
  public async getRentableItemTypes({
    propertyId,
  }: {
    propertyId: string;
  }): Promise<TApiResponse<TRentableItemTypeResponse[]>> {
    return this.connector
      .get<{ rentableItemTypes: TRentableItemTypeResponse[] }>('/RentableItemTypes', {
        params: { propertyId },
      })
      .then((response) => createSuccessResponse(response.data.rentableItemTypes))
      .catch((error) => createErrorResponse(error));
  }
}
