import { ResManConnector } from '../connector';
import { TEmployeeResponse, TApiResponse, EmployeeStatus } from '../types';
import { createSuccessResponse, createErrorResponse } from '../utils';

/**
 * Employees Modules
 * Provides methods for employees-related operations
 */
export class EmployeesModules {
  constructor(private connector: ResManConnector) {}

  /**
   * Get employees
   * GET /Employees
   * @param propertyId The ID of the property
   * @param status The status of the employee
   * @returns List of employees
   */
  public async getEmployees({
    propertyId,
    status,
  }: {
    propertyId?: string;
    status?: EmployeeStatus;
  } = {}): Promise<TApiResponse<TEmployeeResponse[]>> {
    return this.connector
      .get<{ employees: TEmployeeResponse[] }>('/Employees')
      .then((response) => {
        if (!propertyId && !status) {
          return createSuccessResponse(response.data.employees);
        } else {
          let filteredEmployees = response.data.employees;
          if (propertyId) {
            filteredEmployees = filteredEmployees.filter((employee) =>
              employee.propertyIds?.includes(propertyId)
            );
          }
          if (status) {
            if (status === EmployeeStatus.ACTIVE) {
              filteredEmployees = filteredEmployees.filter(
                (employee) => employee.terminateDate === null
              );
            } else {
              filteredEmployees = filteredEmployees.filter(
                (employee) => employee.terminateDate !== null
              );
            }
          }
          return createSuccessResponse(filteredEmployees);
        }
      })
      .catch((error) => createErrorResponse(error));
  }
}
