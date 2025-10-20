export enum PickListName {
  AREA = 'Area',
  ID_NUMBER_TYPE = 'IDNumberType',
  INDUSTRY = 'Industry',
  LANGUAGE = 'Language',
  LOST_PROSPECT_REASON = 'LostProspectReason',
  OTHER_INCOME_TYPE = 'OtherIncomeType',
  REASON_FOR_LEAVING = 'ReasonForLeaving',
  WORK_ORDER_CANCELLATION_REASONS = 'WorkOrderCancellationReasons',
}

export type TPickListResponse = {
  picklistItemId: string;
  name: PickListName;
};
