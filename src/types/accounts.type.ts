export type TAccountInfo = {
  accountId: string;
  companyName?: string;
};

export type TSecurityGroupUser = {
  userId: string;
  username: string;
  email?: string;
  firstName: string;
  lastName: string;
};

export type TSecurityGroup = {
  securityGroupId: string;
  name: string;
  description?: string;
  type: string;
  users?: TSecurityGroupUser[];
};
