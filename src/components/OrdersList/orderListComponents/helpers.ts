import type { OrderListItem } from './types';

export const formatDate = (value: any) => {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return 'غير محدد';
  return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const getStatusLabel = (status?: string) => {
  if (status === 'completed') return 'مكتمل';
  if (status === 'cancelled') return 'ملغى';
  return 'سابق';
};

export const getOrderTitle = (order: OrderListItem) => {
  return Array.isArray(order.items) && order.items[0]?.name ? order.items[0].name : 'طلب نقل';
};

export const getItemCount = (order: OrderListItem) => {
  return Array.isArray(order.items)
    ? order.items.reduce((sum: number, item) => sum + Number(item.quantity || 1), 0)
    : 1;
};
