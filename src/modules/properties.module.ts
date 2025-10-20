import { ResManConnector } from '../connector';
import {
  TAmenityResponse,
  TApiResponse,
  TBuildingResponse,
  TPropertyGroupResponse,
  TPropertyResponse,
} from '../types';
import { createSuccessResponse, createErrorResponse } from '../utils';

/**
 * Properties Modules
 * Provides methods for property operations
 */
export class PropertiesModules {
  constructor(private connector: ResManConnector) {}

  /**
   * Get all properties
   * GET /Properties
   * @returns List of properties
   */
  public async getProperties(): Promise<TApiResponse<TPropertyResponse[]>> {
    return this.connector
      .get<{ properties: TPropertyResponse[] }>('/Properties')
      .then((response) => createSuccessResponse(response.data.properties))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * GET /Properties/Groups
   * @returns List of property groups
   */
  public async getPropertyGroups(): Promise<TApiResponse<TPropertyGroupResponse[]>> {
    return this.connector
      .get<{ propertyGroups: TPropertyGroupResponse[] }>('/Properties/Groups')
      .then((response) => createSuccessResponse(response.data.propertyGroups))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get amenities for a property
   * GET /Amenities
   * @param propertyId The ID of the property
   * @returns List of amenities
   */
  async getAmenities({
    propertyId,
  }: {
    propertyId: string;
  }): Promise<TApiResponse<TAmenityResponse[]>> {
    return this.connector
      .get<{ amenities: TAmenityResponse[] }>('/Amenities', {
        params: { propertyId },
      })
      .then((response) => createSuccessResponse(response.data.amenities))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get buildings for a property
   * GET /Buildings
   * @param propertyId The ID of the property
   * @returns List of buildings
   */
  public async getBuildings({
    propertyId,
  }: {
    propertyId: string;
  }): Promise<TApiResponse<TBuildingResponse[]>> {
    return this.connector
      .get<{ buildings: TBuildingResponse[] }>('/Buildings', {
        params: { propertyId },
      })
      .then((response) => createSuccessResponse(response.data.buildings))
      .catch((error) => createErrorResponse(error));
  }
}
