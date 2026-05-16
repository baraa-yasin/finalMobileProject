import type { MoveItem } from '@/src/services/orderService';

export type BookingFormValues = {
  items: MoveItem[];
};

export type LocationTarget = 'pickup' | 'dropoff';
