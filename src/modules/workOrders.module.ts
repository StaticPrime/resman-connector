import { ResManConnector } from '../connector';
import {
  TApiResponse,
  TWorkOrderResponse,
  TWorkOrderCreateRequest,
  TWorkOrderUpdateRequest,
  TWorkOrderCreateResponse,
  TWorkOrderUpdateResponse,
  WorkOrderStatus,
  TWorkOrderCategoryResponse,
  TWorkOrderLocationResponse,
} from '../types';
import {
  formatDate,
  validateStartAndEndDate,
  createSuccessResponse,
  createErrorResponse,
} from '../utils';

/**
 * Work Orders Modules
 * Provides methods for work orders operations
 */
export class WorkOrdersModules {
  constructor(private connector: ResManConnector) {}

  /**
   * Get work orders
   * GET /WorkOrders
   * @param propertyId Property ID
   * @param modifiedSince Modified since date
   * @param assignedToPersonId Assigned to person ID
   * @param startDate Start date
   * @param endDate End date
   * @param statuses Statuses
   * @param workOrderNumber Work order number
   * @returns List of work orders
   */
  public async getWorkOrders({
    propertyId,
    modifiedSince,
    assignedToPersonId,
    startDate,
    endDate,
    statuses,
    workOrderNumber,
  }: {
    propertyId: string;
    modifiedSince?: Date;
    assignedToPersonId?: string;
    startDate?: Date;
    endDate?: Date;
    statuses?: WorkOrderStatus[];
    workOrderNumber?: string | number;
  }): Promise<TApiResponse<TWorkOrderResponse[]>> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    if (modifiedSince && modifiedSince > startOfDay) {
      return createErrorResponse(new Error('Modified since must be in the past'));
    }
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 366);
    if (modifiedSince && modifiedSince < oneYearAgo) {
      return createErrorResponse(new Error('Modified since date cannot be more than one year ago'));
    }
    const errorResponse = validateStartAndEndDate(startDate, endDate);
    if (errorResponse) {
      return createErrorResponse(new Error(errorResponse));
    }
    return this.connector
      .get<{ workOrders: TWorkOrderResponse[] }>('/WorkOrders', {
        params: {
          propertyId,
          modifiedSince: modifiedSince ? modifiedSince.toUTCString() : undefined,
          assignedToPersonId,
          startDate: startDate ? formatDate(startDate) : undefined,
          endDate: endDate ? formatDate(endDate) : undefined,
          statuses: statuses ? statuses.join(',') : undefined,
          workOrderNumber,
        },
      })
      .then((response) => createSuccessResponse(response.data.workOrders))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Add a new work order
   * POST /WorkOrders
   * @param workOrder Work order data
   * @returns Created work order
   */
  public async addWorkOrder(
    workOrder: TWorkOrderCreateRequest
  ): Promise<TApiResponse<TWorkOrderCreateResponse>> {
    return this.connector
      .post<TWorkOrderCreateResponse>('/WorkOrders', workOrder)
      .then((response) => createSuccessResponse(response.data))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Update a work order
   * PUT /WorkOrders
   * @param workOrder Work order data
   * @returns Updated work order
   */
  public async updateWorkOrder(
    workOrder: TWorkOrderUpdateRequest
  ): Promise<TApiResponse<TWorkOrderUpdateResponse>> {
    return this.connector
      .put<TWorkOrderUpdateResponse>('/WorkOrders', workOrder)
      .then((response) => createSuccessResponse(response.data))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get work order areas
   * GET /WorkOrders/Areas
   * @param propertyId Property ID
   * @returns List of work order areas
   */
  public async getWorkOrderAreas({
    propertyId,
  }: {
    propertyId: string;
  }): Promise<TApiResponse<string[]>> {
    return this.connector
      .get<{ areas: string[] }>('/WorkOrders/Areas', { params: { propertyId } })
      .then((response) => createSuccessResponse(response.data.areas))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get work order categories
   * GET /WorkOrders/Categories
   * @param propertyId Property ID
   * @returns List of work order categories
   */
  public async getWorkOrderCategories({
    propertyId,
  }: {
    propertyId: string;
  }): Promise<TApiResponse<TWorkOrderCategoryResponse[]>> {
    return this.connector
      .get<{ categories: TWorkOrderCategoryResponse[] }>('/WorkOrders/Categories', {
        params: { propertyId },
      })
      .then((response) => createSuccessResponse(response.data.categories))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get work order locations
   * GET /WorkOrders/Locations
   * @param propertyId Property ID
   * @returns List of work order locations
   */
  public async getWorkOrderLocations({
    propertyId,
  }: {
    propertyId: string;
  }): Promise<TApiResponse<TWorkOrderLocationResponse[]>> {
    return this.connector
      .get<{ locations: TWorkOrderLocationResponse[] }>('/WorkOrders/Locations', {
        params: { propertyId },
      })
      .then((response) => createSuccessResponse(response.data.locations))
      .catch((error) => createErrorResponse(error));
  }
}
