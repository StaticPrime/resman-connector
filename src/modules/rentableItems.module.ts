import { ResManConnector } from '../connector';
import {
  TApiResponse,
  TRentableItemAvailabilityResponse,
  TRentableItemResponse,
  TRentableItemTypeResponse,
} from '../types';
import { createSuccessResponse, createErrorResponse } from '../utils';

/**
 * GET /RentableItems as ResMan actually returns it. The lease id arrives as
 * `leaseID`; everything else already matches {@link TRentableItemResponse}.
 */
type TRentableItemWire = Omit<TRentableItemResponse, 'leaseId'> & { leaseID: string | null };

function normaliseRentableItem(item: TRentableItemWire): TRentableItemResponse {
  const { leaseID, ...rest } = item;
  return { ...rest, leaseId: leaseID ?? null };
}

/**
 * Rentable Items Modules
 * Provides methods for rentable items operations
 */
export class RentableItemsModules {
  constructor(private connector: ResManConnector) {}

  /**
   * Get every rentable item on a property, with its occupancy.
   * GET /RentableItems
   *
   * Each item carries `isOccupied` and, when occupied, `leaseId` — a direct
   * item-to-lease association. For availability data (`status`, `moveInDate`,
   * `dateAvailable`) use {@link RentableItemsModules.getRentableItemAvailability}
   * instead; the two endpoints return genuinely different shapes.
   *
   * @param propertyId The ID of the property
   * @returns List of rentable items
   */
  public async getRentableItems({
    propertyId,
  }: {
    propertyId: string;
  }): Promise<TApiResponse<TRentableItemResponse[]>> {
    return this.connector
      .get<{ rentableItems: TRentableItemWire[] }>('/RentableItems', {
        params: {
          propertyId,
        },
      })
      .then((response) =>
        createSuccessResponse((response.data.rentableItems ?? []).map(normaliseRentableItem))
      )
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get rentable item availability for a property.
   * GET /RentableItems/Availability
   *
   * Returns `status`, `moveInDate` and `dateAvailable`, but NOT `isOccupied` or
   * `leaseId` — for those use {@link RentableItemsModules.getRentableItems}.
   *
   * @param propertyId The ID of the property
   * @returns List of rentable item availability records
   */
  public async getRentableItemAvailability({
    propertyId,
  }: {
    propertyId: string;
  }): Promise<TApiResponse<TRentableItemAvailabilityResponse[]>> {
    return this.connector
      .get<{ rentableItems: TRentableItemAvailabilityResponse[] }>('/RentableItems/Availability', {
        params: {
          propertyId,
        },
      })
      .then((response) => createSuccessResponse(response.data.rentableItems ?? []))
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
