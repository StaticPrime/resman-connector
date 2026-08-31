export enum EmployeeStatus {
  ACTIVE = 'Active',
  TERMINATED = 'Terminated',
}

export type TEmployeeResponse = {
  personId: string;
  /** Null for employees who have no ResMan login. */
  userId: string | null;
  firstName: string;
  lastName: string;
  preferredName: string;
  phone: string | null;
  email: string | null;
  securityGroup: string | null;
  isLeasing: boolean;
  isMaintenance: boolean;
  isCorporate: boolean;
  /**
   * ISO date string, or null while the employee is still active. Returned as a
   * raw JSON string — this connector performs no date deserialization.
   */
  terminationDate: string | null;
  propertyIds: string[];
};
