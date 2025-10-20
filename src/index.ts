/**
 * ResMan Connector - NodeJS Connector for ResMan API
 */

// Export main client (recommended)
export { ResManClient } from './connector';

// Export base connector class
export { ResManConnector } from './connector';

// Export endpoint modules
export {
  AccountsModules,
  AccountingModules,
  DocumentsModules,
  EmployeesModules,
  LeasesModules,
  NotesModules,
  PickListsModules,
  PropertiesModules,
  ProspectsModules,
  ResidentsModules,
  RentableItemsModules,
  UnitsModules,
  VendorsModules,
  WorkOrdersModules,
} from './modules';

// Export enums
export {
  AccountingBasis,
  BankAccountMethod,
  BillingAccountType,
  ChargeType,
  DocumentType,
  EmployeeStatus,
  GLAccountType,
  InvoiceStatus,
  LeaseStatus,
  PickListName,
  PropertyType,
  ProspectStatus,
  RentableItemStatus,
  ResidentLeaseStatus,
  ResidencyStatus,
  BankAccountPaymentRecipientType,
  BankAccountPaymentStatus,
  BankAccountPaymentType,
  TransactionCategoryType,
  UnitStatus,
  UnitVacancyStatus,
  WorkOrderAppointment,
  WorkOrderPriority,
  WorkOrderStatus,
} from './types';

// Export config and API types
export type { TResManConfig, TApiResponse, TResmanApiError, TRequestOptions } from './types';

// Export account types
export type { TAccountInfo, TSecurityGroupUser, TSecurityGroup } from './types';

// Export accounting types
export type {
  TTransactionCategoryRequest,
  TTransactionGLAccount,
  TTransactionCategoryResponse,
  TChartOfAccountResponse,
  TBalancePeriod,
  TBalanceResponse,
  TBillingAccountTransaction,
  TBillingAccountResponse,
  TBankAccountPaymentPayable,
  TBankAccountPayment,
  TBankAccountPaymentResponse,
  TLedgerResponse,
  TLedgerResponseCategory,
  TReceivableResponse,
  TReceivableResponseTransaction,
  TDepositSummaryByCategoryResponse,
  TReceivableDeposit,
  TInvoiceLineItem,
  TInvoiceResponse,
} from './types';

// Export document types
export type { TSingleDocumentResponse, TMultipleDocumentResponse } from './types';

// Export employee types
export type { TEmployeeResponse } from './types';

// Export lease types
export type {
  TLeaseTransfer,
  TLeasePerson,
  TLeaseHistory,
  TForwardingAddress,
  TLeaseResponse,
  TTransactionCategory,
  TRentableItem,
  TRecurringCharge,
  TRecurringChargeUngroupedResponse,
  TRecurringChargeResponse,
} from './types';

// Export note types
export type { TNoteResponse } from './types';

// Export pick list types
export type { TPickListResponse } from './types';

// Export property types
export type {
  TPropertyCurrentPeriod,
  TPropertyManagementTeam,
  TPropertyResponse,
  TPropertyGroupResponse,
  TAmenityUnit,
  TAmenityResponse,
  TBuildingResponse,
} from './types';

// Export prospect types
export type {
  TProspectResponse,
  TProspectLeasingAgent,
  TProspectPerson,
  TProspectCommunicationLog,
} from './types';

// Export rentable item types
export type {
  TRentableItemResponse,
  TRentableItemTypeCategory,
  TRentableItemTypeResponse,
} from './types';

// Export resident types
export type { TResidentLease, TResidentResponse } from './types';

// Export unit types
export type {
  TUnitPricing,
  TRenewalPricing,
  TUnitPricingRequest,
  TUnitTypePricingRequest,
  TRenewalPricingRequest,
  TUnitResponse,
  TUnitAmenity,
  TApplicantLease,
  TUnitOccupyingLease,
  TUnitAvailabilityResponse,
  TUnitTypeResponse,
} from './types';

// Export vendor types
export type {
  TVendorResponse,
  TVendorGeneralInformation,
  TVendorPaymentInformation,
  TVendorForm1099Information,
  TVendorInsurancePolicy,
  TVendorAddress,
  TVendorRequest,
  TVendorPhoneNumberRequest,
} from './types';

// Export work order types
export type {
  TWorkOrderResponse,
  TWorkOrderLocation,
  TWorkOrderDocument,
  TWorkOrderCreateRequest,
  TWorkOrderUpdateRequest,
  TWorkOrderCreateResponse,
  TWorkOrderUpdateResponse,
  TWorkOrderCategoryResponse,
  TWorkOrderLocationResponse,
} from './types';

// Export errors
export { ResManApiError, ResManConfigError } from './errors';

// Default export
export { ResManClient as default } from './connector';
