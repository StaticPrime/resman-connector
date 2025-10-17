import { ResManConnector } from '../connector';
import { TApiResponse, TVendorRequest, TVendorResponse } from '../types';
import { createSuccessResponse, createErrorResponse } from '../utils';

/**
 * Vendors Modules
 * Provides methods for vendors operations
 */
export class VendorsModules {
  constructor(private connector: ResManConnector) {}

  /**
   * Get vendors
   * GET /Vendors
   * @param vendorId Vendor ID
   * @returns Vendors
   */
  public async getVendors({
    vendorId,
  }: {
    vendorId?: string;
  }): Promise<TApiResponse<TVendorResponse[]>> {
    return this.connector
      .get<{ vendors: TVendorResponse[] }>('/Vendors', {
        params: {
          vendorId,
        },
      })
      .then((response) => createSuccessResponse(response.data.vendors))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Add a new vendor
   * POST /Vendors
   * @param vendor Vendor data
   * @returns Added vendor
   */
  public async addVendor(vendor: TVendorRequest): Promise<TApiResponse<TVendorResponse>> {
    return this.connector
      .post<TVendorResponse>('/Vendors', vendor)
      .then((response) => createSuccessResponse(response.data))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Update a vendor
   * PUT /Vendors
   * @param vendor Vendor data
   * @returns Updated vendor
   */
  public async updateVendor(vendor: TVendorRequest): Promise<TApiResponse<TVendorResponse>> {
    return this.connector
      .put<TVendorResponse>('/Vendors', vendor)
      .then((response) => createSuccessResponse(response.data))
      .catch((error) => createErrorResponse(error));
  }
}
