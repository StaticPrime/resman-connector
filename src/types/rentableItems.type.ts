export enum RentableItemStatus {
  VACANT = 'Vacant',
  NOTICE_TO_VACATE = 'Notice to Vacate',
  RESERVED = 'Reserved',
}

export type TRentableItemResponse = {
  rentableItemId: string;
  name: string;
  rentableItemTypeId: string;
  rentableItemTypeName: string;
  status: RentableItemStatus;
  charge: number;
  rentable: boolean;
  attachedUnitNumber?: string;
  moveInDate?: Date;
  dateAvailable?: Date;
};

export type TRentableItemTypeCategory = {
  transactionCategoryId: string;
  name: string;
  abbreviation?: string;
};

export type TRentableItemTypeResponse = {
  rentableItemTypeId: string;
  name: string;
  description?: string;
  marketingDescription?: string;
  squareFootage?: number;
  includeInOnlineApplication?: boolean;
  category?: TRentableItemTypeCategory;
  amount: number;
  rentabbleItemCount?: number;
  rentableItemCount?: number;
};
