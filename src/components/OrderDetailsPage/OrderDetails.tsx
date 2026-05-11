import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Calendar, Hash, MapPin, Package, User } from 'lucide-react-native';
import { db } from '../../api/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

type OrderStatus = 'pending' | 'active' | 'completed' | 'cancelled' | string;

function formatArabicDate(iso?: string) {
  if (!iso) return 'غير محدد';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'غير محدد';
  return d.toLocaleString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatCreatedAt(value: any) {
  if (!value) return 'غير محدد';
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return 'غير محدد';
  return date.toLocaleString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatCoords(coords?: { latitude?: number; longitude?: number }) {
  if (coords?.latitude == null || coords?.longitude == null) return 'غير محدد';
  return `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
}

function valueOrUnset(value?: string | number) {
  return value ? String(value) : 'غير محدد';
}

function valueWithUnit(value: string | number | undefined, unit: string) {
  return value ? `${value} ${unit}` : 'غير محدد';
}

function statusLabel(status: OrderStatus) {
  switch (status) {
    case 'pending':
      return 'بانتظار الموافقة';
    case 'active':
      return 'قيد التنفيذ';
    case 'completed':
      return 'مكتملة';
    case 'cancelled':
      return 'ملغاة';
    default:
      return status || 'غير معروف';
  }
}

function statusStyle(status: OrderStatus) {
  if (status === 'cancelled') return { bg: '#FEF2F2', border: '#FECACA', fg: '#DC2626' };
  if (status === 'completed') return { bg: '#ECFDF5', border: '#A7F3D0', fg: '#065F46' };
  if (status === 'active') return { bg: '#EFF6FF', border: '#BFDBFE', fg: '#1D4ED8' };
  return { bg: '#F3F4F6', border: '#E5E7EB', fg: '#374151' };
}

export default function OrderDetailsScreen({ orderId, onBack }: { orderId: string; onBack?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [driver, setDriver] = useState<any>(null);

  useEffect(() => {
    const run = async () => {
      try {
        if (!orderId) {
          setOrder(null);
          return;
        }
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);
        if (!orderSnap.exists()) {
          setOrder(null);
          return;
        }
        const orderData = { id: orderSnap.id, ...orderSnap.data() };
        setOrder(orderData);

        const dId = (orderData as any).driverId;
        if (dId) {
          const driverSnap = await getDoc(doc(db, 'drivers', dId));
          setDriver(driverSnap.exists() ? { id: driverSnap.id, ...driverSnap.data() } : null);
        } else {
          setDriver(null);
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [orderId]);

  const status = (order?.status || '') as OrderStatus;
  const badge = useMemo(() => statusStyle(status), [status]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowRight color="#064e3b" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تفاصيل الطلب</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#064e3b" />
        </View>
      ) : !order ? (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>الطلب غير موجود</Text>
          <Text style={styles.emptySub}>قد يكون تم حذفه أو رقم الطلب غير صحيح.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.topCard}>
            <View style={styles.topRow}>
              <View style={[styles.badge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
                <Text style={[styles.badgeText, { color: badge.fg }]}>{statusLabel(status)}</Text>
              </View>
              <Text style={styles.orderId}>#{String(order.id).slice(0, 8).toUpperCase()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Calendar color="#064e3b" size={16} />
              <Text style={styles.dateText}>{formatArabicDate(order.scheduledTime)}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>بيانات الطلب</Text>
              <Hash color="#064e3b" size={18} />
            </View>

            <View style={styles.kv}>
              <Text style={styles.kvLabel}>تاريخ الإنشاء</Text>
              <Text style={styles.kvValue}>{formatCreatedAt(order.createdAt)}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>الموقع والوجهة</Text>
              <MapPin color="#064e3b" size={18} />
            </View>

            <View style={styles.kv}>
              <Text style={styles.kvLabel}>من</Text>
              <Text style={styles.kvValue}>{order.pickup?.address || 'غير محدد'}</Text>
            </View>
            <Text style={styles.coordText}>الإحداثيات: {formatCoords(order.pickup?.coords)}</Text>
            <View style={styles.divider} />
            <View style={styles.kv}>
              <Text style={styles.kvLabel}>إلى</Text>
              <Text style={styles.kvValue}>{order.dropoff?.address || 'غير محدد'}</Text>
            </View>
            <Text style={styles.coordText}>الإحداثيات: {formatCoords(order.dropoff?.coords)}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>المنقولات</Text>
              <Package color="#064e3b" size={18} />
            </View>

            {(order.items || []).length === 0 ? (
              <Text style={styles.muted}>لا توجد عناصر.</Text>
            ) : (
              (order.items || []).map((it: any, idx: number) => (
                <View key={it.id || `${idx}`} style={styles.itemCard}>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemQty}>×{it.quantity || '1'}</Text>
                    <Text style={styles.itemName}>{it.name || `عنصر #${idx + 1}`}</Text>
                  </View>
                  <View style={styles.itemMetaRow}>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemMetaLabel}>الوزن</Text>
                      <Text style={styles.itemMetaValue}>{valueWithUnit(it.weight, 'كجم')}</Text>
                    </View>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemMetaLabel}>الطول</Text>
                      <Text style={styles.itemMetaValue}>{valueOrUnset(it.length)}</Text>
                    </View>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemMetaLabel}>العرض</Text>
                      <Text style={styles.itemMetaValue}>{valueOrUnset(it.width)}</Text>
                    </View>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemMetaLabel}>الارتفاع</Text>
                      <Text style={styles.itemMetaValue}>{valueOrUnset(it.height)}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>موعد النقل</Text>
              <Calendar color="#064e3b" size={18} />
            </View>

            <View style={styles.kv}>
              <Text style={styles.kvLabel}>التاريخ والوقت</Text>
              <Text style={styles.kvValue}>{formatArabicDate(order.scheduledTime)}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>السائق</Text>
              <User color="#064e3b" size={18} />
            </View>

            {driver ? (
              <>
                <View style={styles.kv}>
                  <Text style={styles.kvLabel}>الاسم</Text>
                  <Text style={styles.kvValue}>{driver.name || 'غير محدد'}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.kv}>
                  <Text style={styles.kvLabel}>النوع</Text>
                  <Text style={styles.kvValue}>{driver.type || 'غير محدد'}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.kv}>
                  <Text style={styles.kvLabel}>التقييم</Text>
                  <Text style={styles.kvValue}>{driver.rate || 'غير محدد'}</Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.muted}>لم يتم العثور على بيانات السائق.</Text>
              </>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    height: 64,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#064e3b' },
  backButton: { padding: 8, borderRadius: 20, backgroundColor: '#f3f4f6' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  emptySub: { marginTop: 6, color: '#6B7280', textAlign: 'center' },
  scroll: { padding: 20, paddingBottom: 40 },

  topCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(11, 58, 0, 0.05)',
  },
  topRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 12, fontWeight: '800', color: '#6B7280', letterSpacing: 1 },
  summaryRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginTop: 10 },
  dateText: { flex: 1, color: '#374151', textAlign: 'right', fontWeight: '700' },

  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontSize: 12, fontWeight: '900' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(11, 58, 0, 0.05)',
  },
  cardTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: '900', color: '#064e3b' },

  kv: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  kvLabel: { color: '#6B7280', fontWeight: '800' },
  kvValue: { flex: 1, color: '#111827', textAlign: 'right', fontWeight: '800' },
  coordText: { marginTop: 6, color: '#6B7280', textAlign: 'right', fontSize: 12, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },

  muted: { color: '#6B7280', textAlign: 'right', fontWeight: '700' },
  itemRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  itemName: { flex: 1, textAlign: 'right', fontWeight: '800', color: '#111827' },
  itemQty: { width: 60, textAlign: 'left', fontWeight: '900', color: '#064e3b' },
  itemCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingBottom: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  itemMetaRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemMeta: {
    minWidth: '22%',
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'flex-end',
  },
  itemMetaLabel: { color: '#6B7280', fontSize: 11, fontWeight: '800' },
  itemMetaValue: { color: '#111827', fontSize: 12, fontWeight: '900', marginTop: 2 },
});

