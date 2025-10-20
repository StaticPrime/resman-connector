import { ResManConnector } from '../connector';
import { PickListName, TApiResponse, TPickListResponse } from '../types';
import { createSuccessResponse, createErrorResponse } from '../utils';

/**
 * Pick Lists Modules
 * Provides methods for pick list operations
 */
export class PickListsModules {
  constructor(private connector: ResManConnector) {}

  /**
   * GET /PickLists
   * @param name The name of the pick list
   * @returns The pick list
   */
  public async getPickLists({
    name,
  }: {
    name: PickListName;
  }): Promise<TApiResponse<TPickListResponse[]>> {
    return this.connector
      .get<{ pickList: TPickListResponse[] }>('/PickLists', { params: { name } })
      .then((response) => createSuccessResponse(response.data.pickList))
      .catch((error) => createErrorResponse(error));
  }
}
