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
  assignedTo?: string;
  assignedToPersonId?: string;
  number: number;
  reportedDate?: Date;
  dueDate?: Date;
  reportedBy?: string;
  reportedByPersonId?: string;
  description: string;
  category: string;
  categoryId: string;
  isMakeReady: boolean;
  location?: TWorkOrderLocation;
  areas?: string[];
  pets?: string[];
  appointment: WorkOrderAppointment;
  phone?: string;
  notes?: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  cost: number;
  completedBy?: string;
  completedByPersonId?: string;
  completedNotes?: string;
  completedDate?: Date;
  documents?: TWorkOrderDocument[];
  lastModified: Date;
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

export type TWorkOrderLocationResponse = {
  locationId: string;
  name: string;
  type: string;
};
