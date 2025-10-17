import { ResManConnector } from '../connector';
import { TApiResponse, TAccountInfo, TSecurityGroup } from '../types';
import { createSuccessResponse, createErrorResponse } from '../utils';

/**
 * Account Management Modules
 * Provides methods for account-related operations
 */
export class AccountsModules {
  constructor(private connector: ResManConnector) {}

  /**
   * Get the Account ID
   * GET /Account/AccountId
   * @param subDomain The subdomain of the account
   * @returns Account information
   */
  async getAccountId(subDomain: string): Promise<TApiResponse<TAccountInfo>> {
    return this.connector
      .get<TAccountInfo>('/Account/AccountId', {
        params: { subdomain: subDomain },
      })
      .then((response) => createSuccessResponse(response.data))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get security groups for the account
   * GET /Account/SecurityGroups
   * @returns List of security groups
   */
  async getSecurityGroups(): Promise<TApiResponse<TSecurityGroup[]>> {
    return this.connector
      .get<{ groups: TSecurityGroup[] }>('/Account/SecurityGroups')
      .then((response) => createSuccessResponse(response.data.groups))
      .catch((error) => createErrorResponse(error));
  }
}
