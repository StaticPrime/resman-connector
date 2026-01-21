export enum EmployeeStatus {
  ACTIVE = 'Active',
  TERMINATED = 'Terminated',
}

export type TEmployeeResponse = {
  personId: string;
  userId: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  phone?: string;
  email?: string;
  securityGroup: string;
  isLeasing: boolean;
  isMaintenance: boolean;
  isCorporate: boolean;
  terminationDate?: Date;
  propertyIds?: string[];
};
