/**
 * Status of a rentable item, returned by GET /RentableItems/Availability only.
 *
 * NOTE: this set is not known to be exhaustive — ResMan does not publish the
 * full value list. Treat unrecognised values as valid rather than assuming a
 * `switch` over these members covers every response.
 */
export enum RentableItemStatus {
  VACANT = 'Vacant',
  NOTICE_TO_VACATE = 'Notice to Vacate',
  RESERVED = 'Reserved',
}

/** Fields common to both rentable item shapes. */
type TRentableItemCommon = {
  rentableItemId: string;
  name: string;
  rentableItemTypeId: string;
  rentableItemTypeName: string;
  /**
   * The item's configured charge from the property setup. This is current
   * configuration and is NOT dated, so it is not the price agreed on any
   * particular lease. For the amount charged on a specific lease, read `amount`
   * from `leases.getRecurringCharges()`.
   */
  charge: number;
  rentable: boolean;
  /**
   * The unit NUMBER (a display string), not a `unitId` — joining on it is a
   * string match against `TUnitResponse.unitNumber`, `TLeaseResponse.unitNumber`
   * or `TUnitAvailabilityResponse.number`, and is only unique within a property.
   *
   * Always present on the wire but null in every observed response, even for
   * occupied items, so prefer {@link TRentableItemResponse.leaseId} where you
   * have it.
   */
  attachedUnitNumber: string | null;
};

/**
 * A rentable item from GET /RentableItems.
 *
 * Carries the occupancy fields `isOccupied` and `leaseId`, which give a direct
 * item-to-lease association without going through recurring charges. Does NOT
 * carry `status`, `moveInDate` or `dateAvailable` — those come from
 * {@link TRentableItemAvailabilityResponse}.
 */
export type TRentableItemResponse = TRentableItemCommon & {
  isOccupied: boolean;
  /**
   * The lease this item is currently rented on, or null when it is not
   * occupied. Always present on the wire.
   *
   * Normalised by this connector from ResMan's `leaseID` so it matches the
   * `leaseId` spelling used everywhere else in this package.
   */
  leaseId: string | null;
};

/**
 * A rentable item from GET /RentableItems/Availability.
 *
 * Carries the availability fields `status`, `moveInDate` and `dateAvailable`.
 * Does NOT carry `isOccupied` or `leaseId`.
 */
export type TRentableItemAvailabilityResponse = TRentableItemCommon & {
  status: RentableItemStatus;
  /**
   * ISO date string, or null when the item has no move-in. Returned as a raw
   * JSON string — this connector performs no date deserialization.
   */
  moveInDate: string | null;
  /**
   * ISO date string, or null when no availability date is set. Returned as a
   * raw JSON string — this connector performs no date deserialization.
   */
  dateAvailable: string | null;
};

export type TRentableItemTypeCategory = {
  transactionCategoryId: string;
  name: string;
  abbreviation: string;
};

/**
 * A rentable item type from GET /RentableItemTypes.
 *
 * Only one rentable item type was returned across the profiled account, so the
 * "always present" status of these fields rests on a single sample.
 */
export type TRentableItemTypeResponse = {
  rentableItemTypeId: string;
  name: string;
  description: string;
  /**
   * Null in the only sampled rentable item type; typed as a nullable string because
   * the field is a marketing description when populated.
   */
  marketingDescription: string | null;
  squareFootage: number;
  includeInOnlineApplication: boolean;
  category: TRentableItemTypeCategory;
  amount: number;
  rentableItemCount: number;
};
