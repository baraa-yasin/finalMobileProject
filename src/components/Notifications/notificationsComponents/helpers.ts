import type { NotificationItem } from './types';

export const summarizeItems = (items: any[]) => {
  if (!Array.isArray(items) || items.length === 0) return 'تفاصيل المنقولات غير محددة';
  return items.map((item) => `${item.quantity || '1'} x ${item.name || 'قطعة'}`).join('، ');
};

export const formatDate = (value?: string) => {
  if (!value) return 'موعد غير محدد';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'موعد غير محدد';
  return date.toLocaleString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getCreatedTime = (notification: NotificationItem) => {
  const timestamp = notification.createdAt;
  if (timestamp?.toDate) return timestamp.toDate().getTime();
  if (typeof timestamp === 'string') return new Date(timestamp).getTime();
  return 0;
};
