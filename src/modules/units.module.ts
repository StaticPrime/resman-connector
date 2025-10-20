import { ResManConnector } from '../connector';
import {
  TApiResponse,
  TUnitPricingRequest,
  TUnitTypePricingRequest,
  TRenewalPricingRequest,
  TUnitPricing,
  TUnitResponse,
  TUnitAvailabilityResponse,
  TUnitTypeResponse,
} from '../types';
import {
  formatDate,
  isValidDateFormatted,
  createSuccessResponse,
  createErrorResponse,
} from '../utils';

/**
 * Units Modules
 * Provides methods for units operations
 */
export class UnitsModules {
  constructor(private connector: ResManConnector) {}

  private validatePricing = (pricing: TUnitPricing[]) => {
    pricing.forEach((price) => {
      if (!price.leaseTerm || !price.startDate || !price.endDate || !price.price)
        throw new Error('leaseTerm, startDate, endDate, and price are required');
      if (!price.leaseTerm || !price.startDate || !price.endDate || !price.price)
        throw new Error('leaseTerm, startDate, endDate, and price are required');
      if (!Number.isInteger(price.leaseTerm) || !Number.isInteger(price.price))
        throw new Error('leaseTerm and price must be whole numbers');
      if (!isValidDateFormatted(price.startDate) || !isValidDateFormatted(price.endDate))
        throw new Error('startDate and endDate must be valid dates');
      if (new Date(price.startDate) > new Date(price.endDate))
        throw new Error('startDate must be before endDate');
    });
  };

  /**
   * POST /Pricing
   * @param propertyId The ID of the property
   * @param units The units to price
   * @param unitTypes The unit types to price
   * @param renewals The renewals to price
   * @returns Null
   */
  public async addPricing({
    propertyId,
    units,
    unitTypes,
    renewals,
  }: {
    propertyId: string;
    units?: TUnitPricingRequest[];
    unitTypes?: TUnitTypePricingRequest[];
    renewals?: TRenewalPricingRequest[];
  }): Promise<TApiResponse<null>> {
    const payload: {
      propertyId: string;
      units?: TUnitPricingRequest[];
      unitTypes?: TUnitTypePricingRequest[];
      renewals?: TRenewalPricingRequest[];
    } = { propertyId };

    try {
      if (units) {
        units.forEach((unit) => {
          if (!unit.pricing.length) throw new Error('Units pricing is required');
          this.validatePricing(unit.pricing);
        });
      }

      if (unitTypes) {
        unitTypes.forEach((unitType) => {
          if (!unitType.pricing.length) throw new Error('Unit types pricing is required');
          this.validatePricing(unitType.pricing);
        });
      }

      if (renewals) {
        renewals.forEach((renewal) => {
          if (!renewal.pricing.length) throw new Error('Renewals pricing is required');
          renewal.pricing.forEach((price) => {
            if (!Number.isInteger(price.leaseTerm) || !Number.isInteger(price.price))
              throw new Error('leaseTerm and price must be whole numbers');
          });
        });
      }
      return this.connector
        .post<null>('/Pricing', payload)
        .then(() => createSuccessResponse(null))
        .catch((error) => createErrorResponse(error));
    } catch (error) {
      return createErrorResponse(error as Error);
    }
  }

  /**
   * POST /Units/MarketRent
   * @param propertyId The ID of the property
   * @param unitId The ID of the unit
   * @param date The date of the market rent
   * @param marketRent The market rent
   * @returns Null
   */
  public async addMarketRent({
    propertyId,
    unitId,
    date,
    marketRent,
  }: {
    propertyId: string;
    unitId: string;
    date: Date;
    marketRent: number;
  }): Promise<TApiResponse<null>> {
    if (date > new Date()) {
      return createErrorResponse(new Error('date cannot be in the future'));
    }
    return this.connector
      .post<null>('/Units/MarketRent', { propertyId, unitId, date: formatDate(date), marketRent })
      .then(() => createSuccessResponse(null))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * GET /Units
   * @param propertyId The ID of the property
   * @returns List of units
   */
  public async getUnits({
    propertyId,
  }: {
    propertyId: string;
  }): Promise<TApiResponse<TUnitResponse[]>> {
    return this.connector
      .get<{ units: TUnitResponse[] }>('/Units', { params: { propertyId } })
      .then((response) => createSuccessResponse(response.data.units))
      .catch((error) => createErrorResponse(error));
  }

  public async getUnitsAvailability({
    propertyId,
  }: {
    propertyId: string;
  }): Promise<TApiResponse<TUnitAvailabilityResponse[]>> {
    return this.connector
      .get<{ units: TUnitAvailabilityResponse[] }>('/Units/Availability', {
        params: { propertyId },
      })
      .then((response) => createSuccessResponse(response.data.units))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * POST /Units/MakeReady
   * @param propertyId The ID of the property
   * @param unitId The ID of the unit
   * @param date The date of the make ready
   * @returns Null
   */
  public async makeUnitReady({
    propertyId,
    unitId,
    date,
  }: {
    propertyId: string;
    unitId: string;
    date: Date;
  }): Promise<TApiResponse<null>> {
    if (date > new Date()) {
      return createErrorResponse(new Error('date cannot be in the future'));
    }
    return this.connector
      .post<null>('/Units/MakeReady', { propertyId, unitId, date: formatDate(date) })
      .then(() => createSuccessResponse(null))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * PATCH /Units/DateAvailable
   * @param propertyId The ID of the property
   * @param unitId The ID of the unit
   * @param date The date of the date available
   * @returns Null
   */
  public async updateUnitDateAvailable({
    propertyId,
    unitId,
    date,
  }: {
    propertyId: string;
    unitId: string;
    date: Date;
  }): Promise<TApiResponse<null>> {
    if (date > new Date()) {
      return createErrorResponse(new Error('date cannot be in the future'));
    }
    return this.connector
      .patch<null>('/Units/DateAvailable', { propertyId, unitId, date: formatDate(date) })
      .then(() => createSuccessResponse(null))
      .catch((error) => createErrorResponse(error));
  }

  /**
   * GET /UnitTypes
   * @param propertyId The ID of the property
   * @returns List of unit types
   */
  public async getUnitTypes({
    propertyId,
  }: {
    propertyId: string;
  }): Promise<TApiResponse<TUnitTypeResponse[]>> {
    return this.connector
      .get<{ unitTypes: TUnitTypeResponse[] }>('/UnitTypes', { params: { propertyId } })
      .then((response) => createSuccessResponse(response.data.unitTypes))
      .catch((error) => createErrorResponse(error));
  }
}
