import { ResManConnector } from '../connector';
import {
  TLeaseResponse,
  TRecurringChargeResponse,
  TRecurringChargeUngroupedResponse,
  TApiResponse,
  LeaseStatus,
} from '../types';
import {
  formatDate,
  validateStartAndEndDate,
  createSuccessResponse,
  createErrorResponse,
} from '../utils';

/**
 * Leases Modules
 * Provides methods for leases-related operations
 */
export class LeasesModules {
  constructor(private connector: ResManConnector) {}

  /**
   * Get leases for a property
   * GET /Leasing/Leases
   * @param propertyId The ID of the property
   * @param includeLeaseHistory Whether to include lease history
   * @param modifiedSince The date to filter leases by
   * @param billingAccountId The ID of the billing account
   * @param leaseStatuses The statuses of the leases
   * @param unitId The ID of the unit
   * @param unitNumber The number of the unit
   * @param applicationDateFrom The date to filter leases by
   * @param applicationDateTo The date to filter leases by
   * @param approvalDateFrom The date to filter leases by
   * @param approvalDateTo The date to filter leases by
   * @param cancellationDateFrom The date to filter leases by
   * @param cancellationDateTo The date to filter leases by
   * @param denialDateFrom The date to filter leases by
   * @param denialDateTo The date to filter leases by
   * @param isLeaseSigned Whether the lease is signed
   * @param leaseSignedDateFrom The date to filter leases by
   * @param leaseSignedDateTo The date to filter leases by
   * @param scheduledMoveInDateFrom The date to filter leases by
   * @param scheduledMoveInDateTo The date to filter leases by
   * @param isMovedIn Whether the lease is moved in
   * @param moveInDateFrom The date to filter leases by
   * @param moveInDateTo The date to filter leases by
   * @param isNoticeToVacateGiven Whether the notice to vacate is given
   * @param noticeToVacateGivenDateFrom The date to filter leases by
   * @param noticeToVacateGivenDateTo The date to filter leases by
   * @param scheduledMoveOutDateFrom The date to filter leases by
   * @param scheduledMoveOutDateTo The date to filter leases by
   * @param isMovedOut Whether the lease is moved out
   * @param moveOutDateFrom The date to filter leases by
   * @param moveOutDateTo The date to filter leases by
   * @param isMoveOutReconcillationComplete Whether the move out reconciliation is complete
   * @param moveOutReconcillationDateFrom The date to filter leases by
   * @param moveOutReconcillationDateTo The date to filter leases by
   * @returns List of Leases
   */
  public async getLeases({
    propertyId,
    includeLeaseHistory,
    modifiedSince,
    billingAccountId,
    leaseStatuses,
    unitId,
    unitNumber,
    applicationDateFrom,
    applicationDateTo,
    approvalDateFrom,
    approvalDateTo,
    cancellationDateFrom,
    cancellationDateTo,
    denialDateFrom,
    denialDateTo,
    isLeaseSigned,
    leaseSignedDateFrom,
    leaseSignedDateTo,
    scheduledMoveInDateFrom,
    scheduledMoveInDateTo,
    isMovedIn,
    moveInDateFrom,
    moveInDateTo,
    isNoticeToVacateGiven,
    noticeToVacateGivenDateFrom,
    noticeToVacateGivenDateTo,
    scheduledMoveOutDateFrom,
    scheduledMoveOutDateTo,
    isMovedOut,
    moveOutDateFrom,
    moveOutDateTo,
    isMoveOutReconcillationComplete,
    moveOutReconcillationDateFrom,
    moveOutReconcillationDateTo,
  }: {
    propertyId: string;
    includeLeaseHistory: boolean;
    modifiedSince: Date;
    billingAccountId?: string;
    leaseStatuses?: LeaseStatus[];
    unitId?: string;
    unitNumber?: string;
    applicationDateFrom?: Date;
    applicationDateTo?: Date;
    approvalDateFrom?: Date;
    approvalDateTo?: Date;
    cancellationDateFrom?: Date;
    cancellationDateTo?: Date;
    denialDateFrom?: Date;
    denialDateTo?: Date;
    isLeaseSigned?: boolean;
    leaseSignedDateFrom?: Date;
    leaseSignedDateTo?: Date;
    scheduledMoveInDateFrom?: Date;
    scheduledMoveInDateTo?: Date;
    isMovedIn?: boolean;
    moveInDateFrom?: Date;
    moveInDateTo?: Date;
    isNoticeToVacateGiven?: boolean;
    noticeToVacateGivenDateFrom?: Date;
    noticeToVacateGivenDateTo?: Date;
    scheduledMoveOutDateFrom?: Date;
    scheduledMoveOutDateTo?: Date;
    isMovedOut?: boolean;
    moveOutDateFrom?: Date;
    moveOutDateTo?: Date;
    isMoveOutReconcillationComplete?: boolean;
    moveOutReconcillationDateFrom?: Date;
    moveOutReconcillationDateTo?: Date;
  }): Promise<TApiResponse<TLeaseResponse[]>> {
    if (modifiedSince > new Date()) {
      return createErrorResponse(new Error('modifiedSince cannot be in the future.'));
    }

    // Validate all date pairs
    const datePairsToValidate = [
      { start: applicationDateFrom, end: applicationDateTo },
      { start: approvalDateFrom, end: approvalDateTo },
      { start: cancellationDateFrom, end: cancellationDateTo },
      { start: denialDateFrom, end: denialDateTo },
      { start: leaseSignedDateFrom, end: leaseSignedDateTo },
      { start: scheduledMoveInDateFrom, end: scheduledMoveInDateTo },
      { start: moveInDateFrom, end: moveInDateTo },
      { start: noticeToVacateGivenDateFrom, end: noticeToVacateGivenDateTo },
      { start: scheduledMoveOutDateFrom, end: scheduledMoveOutDateTo },
      { start: moveOutDateFrom, end: moveOutDateTo },
      { start: moveOutReconcillationDateFrom, end: moveOutReconcillationDateTo },
    ];

    for (const { start, end } of datePairsToValidate) {
      const errorResponse = validateStartAndEndDate(start, end);
      if (errorResponse) {
        return createErrorResponse(new Error(errorResponse));
      }
    }

    return this.connector
      .get<{ leases: TLeaseResponse[] }>('/Leasing/Leases', {
        params: {
          propertyId,
          modifiedSince: modifiedSince.toUTCString(),
          includeLeaseHistory,
          billingAccountId,
          leaseStatuses: leaseStatuses ? leaseStatuses.join(',') : undefined,
          unitId,
          unitNumber,
          applicationDateFrom: applicationDateFrom ? formatDate(applicationDateFrom) : undefined,
          applicationDateTo: applicationDateTo ? formatDate(applicationDateTo) : undefined,
          approvalDateFrom: approvalDateFrom ? formatDate(approvalDateFrom) : undefined,
          approvalDateTo: approvalDateTo ? formatDate(approvalDateTo) : undefined,
          cancellationDateFrom: cancellationDateFrom ? formatDate(cancellationDateFrom) : undefined,
          cancellationDateTo: cancellationDateTo ? formatDate(cancellationDateTo) : undefined,
          denialDateFrom: denialDateFrom ? formatDate(denialDateFrom) : undefined,
          denialDateTo: denialDateTo ? formatDate(denialDateTo) : undefined,
          isLeaseSigned,
          leaseSignedDateFrom: leaseSignedDateFrom ? formatDate(leaseSignedDateFrom) : undefined,
          leaseSignedDateTo: leaseSignedDateTo ? formatDate(leaseSignedDateTo) : undefined,
          scheduledMoveInDateFrom: scheduledMoveInDateFrom
            ? formatDate(scheduledMoveInDateFrom)
            : undefined,
          scheduledMoveInDateTo: scheduledMoveInDateTo
            ? formatDate(scheduledMoveInDateTo)
            : undefined,
          isMovedIn,
          moveInDateFrom: moveInDateFrom ? formatDate(moveInDateFrom) : undefined,
          moveInDateTo: moveInDateTo ? formatDate(moveInDateTo) : undefined,
          isNoticeToVacateGiven,
          noticeToVacateGivenDateFrom: noticeToVacateGivenDateFrom
            ? formatDate(noticeToVacateGivenDateFrom)
            : undefined,
          noticeToVacateGivenDateTo: noticeToVacateGivenDateTo
            ? formatDate(noticeToVacateGivenDateTo)
            : undefined,
          scheduledMoveOutDateFrom: scheduledMoveOutDateFrom
            ? formatDate(scheduledMoveOutDateFrom)
            : undefined,
          scheduledMoveOutDateTo: scheduledMoveOutDateTo
            ? formatDate(scheduledMoveOutDateTo)
            : undefined,
          isMovedOut,
          moveOutDateFrom: moveOutDateFrom ? formatDate(moveOutDateFrom) : undefined,
          moveOutDateTo: moveOutDateTo ? formatDate(moveOutDateTo) : undefined,
          isMoveOutReconcillationComplete,
          moveOutReconcillationDateFrom: moveOutReconcillationDateFrom
            ? formatDate(moveOutReconcillationDateFrom)
            : undefined,
          moveOutReconcillationDateTo: moveOutReconcillationDateTo
            ? formatDate(moveOutReconcillationDateTo)
            : undefined,
        },
      })
      .then((response) => createSuccessResponse(response.data.leases))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get move outs for a property
   * GET /Leasing/MoveOuts
   * @param propertyId The ID of the property
   * @param startDate The start date
   * @param endDate The end date
   * @returns List of move outs
   */
  public async getLeaseMoveOuts({
    propertyId,
    startDate,
    endDate,
  }: {
    propertyId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<TApiResponse<TLeaseResponse[]>> {
    return this.connector
      .get<{ moveOuts: TLeaseResponse[] }>('/Leasing/MoveOuts', {
        params: {
          propertyId,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      })
      .then((response) => createSuccessResponse(response.data.moveOuts))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * Get recurring charges for a property
   * GET /Leasing/RecurringCharges
   * @param propertyId The ID of the property
   * @returns Flattened array of recurring charges with leaseId and status
   */
  public async getRecurringCharges({
    propertyId,
  }: {
    propertyId: string;
  }): Promise<TApiResponse<TRecurringChargeResponse[]>> {
    return this.connector
      .get<{ leases: TRecurringChargeUngroupedResponse[] }>('/Leasing/RecurringCharges', {
        params: {
          propertyId,
        },
      })
      .then((response) => {
        // Flatten the recurring charges and add leaseId and status to each
        const flattenedCharges: TRecurringChargeResponse[] = response.data.leases.flatMap((lease) =>
          lease.recurringCharges.map((charge) => ({
            ...charge,
            leaseId: lease.leaseId,
            status: lease.status,
          }))
        );
        return createSuccessResponse(flattenedCharges);
      })
      .catch((error) => createErrorResponse(error));
  }
}
