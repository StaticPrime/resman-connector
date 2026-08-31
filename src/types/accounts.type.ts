/**
 * GET /Account/AccountId. This endpoint is not covered by the response profile,
 * so this shape is unverified against the live API.
 */
export type TAccountInfo = {
  accountId: string;
  companyName?: string;
};

export type TSecurityGroupUser = {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type TSecurityGroup = {
  securityGroupId: string;
  name: string;
  /**
   * Null in every sampled response (14 groups); typed as a nullable string because
   * the field is a free-text description when populated.
   */
  description: string | null;
  type: string;
  users: TSecurityGroupUser[];
};
