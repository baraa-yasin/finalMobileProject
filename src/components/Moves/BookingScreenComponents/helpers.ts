import type { MoveItem } from '@/src/services/orderService';

export const createEmptyItem = (): MoveItem => ({
  id: `${Date.now()}-${Math.random()}`,
  name: '',
  quantity: '1',
  weight: '',
  length: '',
  width: '',
  height: '',
});

export const getDriverAvatarUrl = (driver: any): string | null => {
  const raw = driver?.avatar || driver?.avatarUrl || driver?.photoURL || driver?.photoUrl || driver?.image || driver?.imageUrl || '';
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  return /^https?:\/\//i.test(trimmed) ? encodeURI(trimmed) : null;
};
