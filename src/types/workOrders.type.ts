export enum WorkOrderStatus {
  SUBMITTED = 'Submitted',
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  SCHEDULED = 'Scheduled',
  CANCELLED = 'Cancelled',
  CLOSED = 'Closed',
  ON_HOLD = 'On Hold',
}

export type TWorkOrderResponse = {
  workOrderId: string;
  propertyId: string;
  assignedTo: string;
  assignedToPersonId: string;
  number: number;
  /** ISO date string. The API returns dates as strings; no deserialization is performed. */
  reportedDate: string;
  /** ISO date string. The API returns dates as strings; no deserialization is performed. */
  dueDate: string;
  reportedBy: string | null;
  /** Absent on some work orders (observed on ~62% of responses). */
  reportedByPersonId?: string;
  description: string;
  category: string;
  categoryId: string;
  isMakeReady: boolean;
  location: TWorkOrderLocation | null;
  areas: string[] | null;
  pets: string[] | null;
  appointment: WorkOrderAppointment | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  cost: number;
  completedBy: string | null;
  completedByPersonId?: string;
  completedNotes: string | null;
  /** ISO date string. The API returns dates as strings; no deserialization is performed. */
  completedDate?: string;
  documents: TWorkOrderDocument[];
  /** ISO date string. The API returns dates as strings; no deserialization is performed. */
  lastModified: string;
};

export enum WorkOrderAppointment {
  NOT_REQUIRED = 'Not Required',
  CALL = 'Call',
  PERMISSION_GIVEN = 'Permission Given',
  PERMISSION_NOT_GIVEN = 'Permission Not Given',
}

export enum WorkOrderPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

/**
 * Location nested on a work order. ResMan returns the identifier as `id` here,
 * unlike the flattened GET /WorkOrders/Locations list.
 */
export type TWorkOrderLocation = {
  id: string;
  name: string;
  type: string;
};

export type TWorkOrderDocument = {
  documentId: string;
  name: string;
};

export type TWorkOrderCreateRequest = {
  propertyId: string;
  reportedDate?: Date;
  dueDate?: Date;
  scheduledDate?: Date;
  reportedByPersonId?: string;
  assignedToPersonId?: string;
  description?: string;
  categoryId?: string;
  areas?: string[];
  pets?: string[];
  location?: TWorkOrderLocation;
  appointment?: WorkOrderAppointment;
  notes?: string;
  priority?: WorkOrderPriority;
  cost?: number;
  startedDate?: Date;
  status?: WorkOrderStatus;
  completedByPersonId?: string;
  completedNotes?: string;
  completedDate?: Date;
};

export type TWorkOrderUpdateRequest = TWorkOrderCreateRequest & {
  workOrderId: string;
};

export type TWorkOrderCreateResponse = {
  workOrderId: string;
  number: number;
  propertyId: string;
};

export type TWorkOrderUpdateResponse = {
  workOrderId: string;
  propertyId: string;
  number: number;
};

export type TWorkOrderCategoryResponse = {
  categoryId: string;
  name: string;
};

/**
 * Location from GET /WorkOrders/Locations. ResMan returns the identifier as `id`
 * on the wire, matching the location nested on a work order.
 */
export type TWorkOrderLocationResponse = {
  id: string;
  name: string;
  type: string;
};
