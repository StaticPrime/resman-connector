/**
 * Configuration options for the ResMan API connector
 */
export type TResManConfig = {
  /**
   * Integration Partner ID (provided by ResMan upon approval)
   */
  integrationPartnerId: string;

  /**
   * API Key (provided by ResMan upon approval)
   */
  apiKey: string;

  /**
   * ResMan Account ID - specifies which client account to access
   */
  accountId: string;

  /**
   * Optional timeout in milliseconds (default: 30000)
   */
  timeout?: number;

  /**
   * Optional custom headers to include in requests
   */
  headers?: Record<string, string>;
};

/**
 * Generic API response wrapper
 * Discriminated union: either success (with data) or error (with error details)
 */
export type TApiResponse<T = unknown> =
  | { data: T; error: undefined } // Success case
  | { data: undefined; error: unknown }; // Error case

/**
 * Error response from the API
 */
export type TResmanApiError = {
  message: string;
  code?: string;
  status?: string;
};

export type TRequestOptions = {
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
};
