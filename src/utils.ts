import { format } from 'date-fns';
import { TResmanApiError, TApiResponse } from './types';

/**
 * Helper function to create a success response
 */
export function createSuccessResponse<T>(data: T): TApiResponse<T> {
  return {
    data,
    error: undefined,
  } as TApiResponse<T>;
}

/**
 * Helper function to create an error response
 */
export function createErrorResponse<T = never>(error: Error | TResmanApiError): TApiResponse<T> {
  console.error(error);
  return {
    data: undefined,
    error,
  } as TApiResponse<T>;
}

/**
 * Formats a date to yyyy-MM-dd format
 * @param date The date to format (string, number, or Date object)
 * @returns Formatted date string or null if invalid
 */
export const formatDate = (date: string | number | Date | null | undefined): string | null => {
  if (!date) return null;

  // If it's a string, check if it's already in yyyy-MM-dd format
  if (typeof date === 'string') {
    // Regex pattern for yyyy-MM-dd format
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    // If the string already matches the format, return it as-is
    if (datePattern.test(date)) {
      return date;
    }

    // Otherwise, parse and format it
    try {
      const parsedDate = new Date(date);
      parsedDate.setMinutes(parsedDate.getMinutes() + parsedDate.getTimezoneOffset());
      return format(parsedDate, 'yyyy-MM-dd');
    } catch {
      return null;
    }
  }

  // For Date or number types, format normally
  return format(date, 'yyyy-MM-dd');
};

/**
 * Checks if a date is in yyyy-MM-dd format
 * @param date The date to check (string)
 * @returns True if the date is in yyyy-MM-dd format, false otherwise
 */
export const isValidDateFormatted = (date: string): boolean => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  return datePattern.test(date);
};

/**
 * Validates start and end dates
 * @param startDate The start date
 * @param endDate The end date
 * @returns The error response
 */
export const validateStartAndEndDate = (
  startDate: Date | undefined,
  endDate: Date | undefined
): string | undefined => {
  if (!startDate && !endDate) return;
  if (startDate && !endDate) return 'endDate is required if startDate is provided';
  if (endDate && !startDate) return 'startDate is required if endDate is provided';
  if (startDate && endDate) {
    if (startDate > endDate) {
      return 'startDate must be before endDate';
    }
    if (startDate > new Date()) {
      return 'startDate cannot be in the future';
    }
    if (endDate > new Date()) {
      return 'endDate cannot be in the future';
    }
  }
  return undefined;
};
