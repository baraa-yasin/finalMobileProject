import { Armchair, BedDouble, Refrigerator } from 'lucide-react-native';

export const DRIVER_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDn6-BL8N2eTYEzIXUDENKNG17o_zlSD1zduEEplOmUj9WhXmQOivhsG_v1ItRF42aIrqgaF8v-KA5r5KWzjXuzvseDDlx_WMDIEjSUHtBRdMg5YYZauEvzsq8h6Ru7gt7nzsyP4P4UiLa1shpUB9PGHAcDt5BjnDTXxqxM92ou1FZmTDPw5sTQpxKr6Oe6nkWQYTS2WEBT5stVNb5F8oZ4r0J6IOZmONHRs60T63jvMZU1F37G5_Fces4AFITMHxzC00qt8s4z8LPi';

export function formatDate(value: any) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '14 أكتوبر، 2023';
  return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatTime(value: any) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '11:30 صباحا';
  return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
}

export function statusLabel(status?: string) {
  if (status === 'completed') return 'مكتملة';
  if (status === 'cancelled') return 'ملغاة';
  return 'نشط الآن';
}

export function itemIcon(name?: string) {
  const normalized = String(name || '').toLowerCase();
  if (normalized.includes('سرير') || normalized.includes('bed')) return BedDouble;
  if (normalized.includes('ثلاجة') || normalized.includes('fridge')) return Refrigerator;
  return Armchair;
}
