export type NotificationItem = {
  id: string;
  orderId?: string;
  title?: string;
  message?: string;
  itemsSummary?: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  scheduledTime?: string;
  arrivalAt?: string;
  arrivalDelaySeconds?: number;
  driverName?: string | null;
  status?: string;
  type?: string;
  read?: boolean;
  createdAt?: any;
};
