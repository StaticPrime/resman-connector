/**
 * Custom error class for ResMan API errors
 */
export class ResManApiError extends Error {
  public readonly statusCode?: number;
  public readonly code?: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode?: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ResManApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResManApiError);
    }
  }
}

/**
 * Custom error class for configuration errors
 */
export class ResManConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ResManConfigError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResManConfigError);
    }
  }
}
