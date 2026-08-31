import { getClient } from '../helpers/client';
import { loadContext } from '../helpers/context';
import { expectRows, expectFieldsOnAll } from '../helpers/assert';
import { EmployeeStatus } from '../../src';

const REQUIRED = [
  'personId',
  'userId',
  'firstName',
  'lastName',
  'securityGroup',
  'isLeasing',
  'isMaintenance',
  'isCorporate',
];

describe('Employees — GET endpoints', () => {
  const client = getClient();
  const ctx = loadContext();

  it('GET /Employees returns employees', async () => {
    const rows = expectRows('GET /Employees', await client.employees.getEmployees());
    expectFieldsOnAll('TEmployeeResponse', rows, REQUIRED);
  });

  // propertyId and status are applied client-side after the same call, so these
  // exercise the filtering rather than a distinct endpoint.
  it('GET /Employees filtered by status returns employees', async () => {
    const rows = expectRows(
      'GET /Employees (status=Active)',
      await client.employees.getEmployees({ status: EmployeeStatus.ACTIVE })
    );
    expectFieldsOnAll('TEmployeeResponse', rows, REQUIRED);
  });

  it('GET /Employees filtered by the discovered property returns employees', async () => {
    const rows = expectRows(
      'GET /Employees (propertyId)',
      await client.employees.getEmployees({ propertyId: ctx.propertyId })
    );
    expectFieldsOnAll('TEmployeeResponse', rows, REQUIRED);
  });
});
