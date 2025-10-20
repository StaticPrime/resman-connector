export type TVendorResponse = {
  vendorId: string;
  generalInformation: TVendorGeneralInformation;
  paymentInformation: TVendorPaymentInformation;
  form1099Information: TVendorForm1099Information;
  insurancePolicies: TVendorInsurancePolicy[];
};

export type TVendorGeneralInformation = {
  company: string;
  abbreviation?: string;
  isApproved: boolean;
  contact: string;
  address: TVendorAddress;
  phoneNumbers: string[];
  email?: string;
  website?: string;
  notes?: string;
  customerNumber?: string;
  defaultGLAccountNumber?: string;
  isExcessLiabilityInsuranceRequired: boolean;
  isGarageLiabilityInsuranceRequired: boolean;
  isGeneralLiabilityInsuranceRequired: boolean;
  isUmbrellaInsuranceRequired: boolean;
  isVehicleInsuranceRequired: boolean;
  isWorkersCompenstationInsuranceRequired: boolean;
  isOtherInsuranceRequired: boolean;
  propertyIds: string[];
};

export type TVendorAddress = {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
};

export type TVendorPaymentInformation = {
  contact: string;
  address: TVendorAddress;
  phoneNumbers: string[];
  email?: string;
  website?: string;
  isHighPriorityPayment: boolean;
  isEFTPaymentsOnly: boolean;
  printOnCheckAs?: string;
  isOneCheckPerInvoice: boolean;
  achRoutingNumber?: string;
  achAccountNumber?: string;
  achAccountType: string;
  defaultDueDateOffset: number;
  defaultDueDay?: string;
  isPurchaseOrderRequried: boolean;
};

export type TVendorForm1099Information = {
  receives1099: boolean;
  form1099Type: string;
  recipientsId: string;
  recipientsName: string;
  isSecondTINNotice: boolean;
  isGrossProceedsPaidToAttorney: boolean;
};

export type TVendorInsurancePolicy = {
  insurancePolicyId: string;
  type: string;
  provider: string;
  policyNumber: string;
  coverage: number;
  expirationDate: Date;
  contact?: string;
  phoneNumber?: string;
  email?: string;
  notes?: string;
};

export type TVendorRequest = {
  generalInformation: Omit<TVendorGeneralInformation, 'phoneNumber'> & {
    phoneNumbers: TVendorPhoneNumberRequest[];
  };
  paymentInformation: Omit<TVendorPaymentInformation, 'phoneNumber'> & {
    phoneNumbers: TVendorPhoneNumberRequest[];
  };
  form1099Information: TVendorForm1099Information;
  insurancePolicies: TVendorInsurancePolicy[];
};

export type TVendorPhoneNumberRequest = {
  type: string;
  number: string;
};
