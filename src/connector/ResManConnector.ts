import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { TResManConfig, TRequestOptions } from '../types/resmanConnector.type';
import { ResManApiError, ResManConfigError, ResManNoResponseError } from '../errors';

/**
 * ResMan API Connector
 * Provides a simple interface to interact with the ResMan API
 */
export class ResManConnector {
  private client: AxiosInstance;
  private config: TResManConfig;
  private baseUrl = 'https://partners-api.myresman.com';

  /**
   * Creates a new ResMan connector instance
   * @param config Configuration options for the connector
   */
  constructor(config: TResManConfig) {
    this.validateConfig(config);
    this.config = config;

    // Create Basic Auth credentials (Integration Partner ID : API Key)
    const basicAuth = Buffer.from(`${config.integrationPartnerId}:${config.apiKey}`).toString(
      'base64'
    );

    // Create axios instance with default configuration
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${basicAuth}`,
        'ResMan-Account-Id': config.accountId,
        ...config.headers,
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new ResManApiError(
            error.response.data?.message || error.message,
            error.response.status,
            error.response.data?.code,
            error.response.data
          );
        } else {
          // Unknown ResMan Error
          throw new ResManApiError(
            `Unknown ResMan Error: ${JSON.stringify(error)}`,
            undefined,
            'UNKNOWN_ERROR'
          );
        }
      }
    );
  }

  /**
   * Validates the configuration
   * @param config Configuration to validate
   */
  private validateConfig(config: TResManConfig): void {
    if (!config.integrationPartnerId) {
      throw new ResManConfigError('Integration Partner ID is required');
    }

    if (!config.apiKey) {
      throw new ResManConfigError('API key is required');
    }

    if (!config.accountId) {
      throw new ResManConfigError('ResMan Account ID is required');
    }
  }

  /**
   * Delays execution for a specified number of milliseconds
   * @param ms Milliseconds to delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Executes a request with retry logic and progressive delays
   * @param requestFn Function that makes the actual request
   * @returns API response
   */
  private async executeWithRetry<T>(
    requestFn: () => Promise<AxiosResponse<T>>
  ): Promise<AxiosResponse<T>> {
    const maxAttempts = 4;
    const delays = [0, 0, 15000, 15000]; // Attempt 1: no delay, Attempt 2: no delay, Attempt 3: 15s, Attempt 4: 15s

    let lastError: Error | undefined;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // Add delay before attempt (except first attempt)
        if (attempt > 0 && delays[attempt] > 0) {
          await this.delay(delays[attempt]);
        }

        return await requestFn();
      } catch (error) {
        lastError = error as Error;

        // If this is not a timeout/network error, throw immediately
        if (error instanceof ResManApiError && error.statusCode) {
          // This is a proper API response error (4xx, 5xx), not a timeout
          throw error;
        }

        // If we've exhausted all attempts, throw NoResponseError
        if (attempt === maxAttempts - 1) {
          throw new ResManNoResponseError(
            `Failed to get response from ResMan API after ${maxAttempts} attempts. Last error: ${lastError.message}`,
            maxAttempts
          );
        }

        // Continue to next attempt for timeout/network errors
      }
    }

    // This should never be reached, but TypeScript needs it
    throw new ResManNoResponseError(
      `Failed to get response from ResMan API after ${maxAttempts} attempts`,
      maxAttempts
    );
  }

  /**
   * Makes a GET request to the API
   * @param endpoint API endpoint
   * @param options Request options
   * @returns API response
   */
  async get<T = unknown>(endpoint: string, options?: TRequestOptions): Promise<AxiosResponse<T>> {
    return this.executeWithRetry(async () => {
      if (options?.params && typeof options.params === 'object') {
        for (const key of Object.keys(options.params)) {
          if (options.params[key] === undefined || options.params[key] === null) {
            delete options.params[key];
          }
        }
      }
      if (options?.headers && typeof options.headers === 'object') {
        for (const key of Object.keys(options.headers)) {
          if (options.headers[key] === undefined || options.headers[key] === null) {
            delete options.headers[key];
          }
        }
      }
      const config: AxiosRequestConfig = {
        params: options?.params,
        headers: options?.headers,
      };

      return this.client.get(endpoint, config);
    });
  }

  /**
   * Makes a POST request to the API
   * @param endpoint API endpoint
   * @param data Request body
   * @param options Request options
   * @returns API response
   */
  async post<T = unknown>(
    endpoint: string,
    data?: Record<string, unknown> | Record<string, unknown>[],
    options?: TRequestOptions
  ): Promise<AxiosResponse<T>> {
    return this.executeWithRetry(async () => {
      if (data && typeof data === 'object') {
        if (Array.isArray(data)) {
          for (const item of data) {
            for (const key of Object.keys(item as Record<string, unknown>)) {
              if (item[key] === undefined) {
                delete item[key];
              }
            }
          }
        } else {
          for (const key of Object.keys(data)) {
            if (data[key] === undefined) {
              delete data[key];
            }
          }
        }
      }
      const config: AxiosRequestConfig = {
        params: options?.params,
        headers: options?.headers,
      };

      return this.client.post(endpoint, data, config);
    });
  }

  /**
   * Makes a PUT request to the API
   * @param endpoint API endpoint
   * @param data Request body
   * @param options Request options
   * @returns API response
   */
  async put<T = unknown>(
    endpoint: string,
    data?: Record<string, unknown> | Record<string, unknown>[],
    options?: TRequestOptions
  ): Promise<AxiosResponse<T>> {
    return this.executeWithRetry(async () => {
      if (data && typeof data === 'object') {
        if (Array.isArray(data)) {
          for (const item of data) {
            for (const key of Object.keys(item as Record<string, unknown>)) {
              if (item[key] === undefined) {
                delete item[key];
              }
            }
          }
        } else {
          for (const key of Object.keys(data)) {
            if (data[key] === undefined) {
              delete data[key];
            }
          }
        }
      }
      const config: AxiosRequestConfig = {
        params: options?.params,
        headers: options?.headers,
      };

      return this.client.put(endpoint, data, config);
    });
  }

  /**
   * Makes a PATCH request to the API
   * @param endpoint API endpoint
   * @param data Request body
   * @param options Request options
   * @returns API response
   */
  async patch<T = unknown>(
    endpoint: string,
    data?: Record<string, unknown> | Record<string, unknown>[],
    options?: TRequestOptions
  ): Promise<AxiosResponse<T>> {
    return this.executeWithRetry(async () => {
      if (data && typeof data === 'object') {
        if (Array.isArray(data)) {
          for (const item of data) {
            for (const key of Object.keys(item as Record<string, unknown>)) {
              if (item[key] === undefined) {
                delete item[key];
              }
            }
          }
        } else {
          for (const key of Object.keys(data)) {
            if (data[key] === undefined) {
              delete data[key];
            }
          }
        }
      }
      const config: AxiosRequestConfig = {
        params: options?.params,
        headers: options?.headers,
      };

      return this.client.patch(endpoint, data, config);
    });
  }

  /**
   * Updates the API credentials
   * @param integrationPartnerId New Integration Partner ID
   * @param apiKey New API key
   */
  updateCredentials(integrationPartnerId: string, apiKey: string): void {
    this.config.integrationPartnerId = integrationPartnerId;
    this.config.apiKey = apiKey;

    const basicAuth = Buffer.from(`${integrationPartnerId}:${apiKey}`).toString('base64');
    this.client.defaults.headers.common['Authorization'] = `Basic ${basicAuth}`;
  }

  /**
   * Updates the ResMan Account ID
   * @param accountId New account ID
   */
  updateAccountId(accountId: string): void {
    this.config.accountId = accountId;
    this.client.defaults.headers.common['ResMan-Account-Id'] = accountId;
  }

  /**
   * Gets the current account ID
   */
  getAccountId(): string {
    return this.config.accountId;
  }
}
