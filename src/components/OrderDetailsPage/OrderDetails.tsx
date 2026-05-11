import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Armchair,
  ArrowRight,
  BedDouble,
  CalendarDays,
  Clock3,
  MessageCircle,
  Navigation,
  Phone,
  Refrigerator,
} from 'lucide-react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../api/firebaseConfig';

const DRIVER_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDn6-BL8N2eTYEzIXUDENKNG17o_zlSD1zduEEplOmUj9WhXmQOivhsG_v1ItRF42aIrqgaF8v-KA5r5KWzjXuzvseDDlx_WMDIEjSUHtBRdMg5YYZauEvzsq8h6Ru7gt7nzsyP4P4UiLa1shpUB9PGHAcDt5BjnDTXxqxM92ou1FZmTDPw5sTQpxKr6Oe6nkWQYTS2WEBT5stVNb5F8oZ4r0J6IOZmONHRs60T63jvMZU1F37G5_Fces4AFITMHxzC00qt8s4z8LPi';

type Props = {
  orderId?: string;
  onBack?: () => void;
  onTrack?: () => void;
};

function formatDate(value: any) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '14 أكتوبر، 2023';
  return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(value: any) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '11:30 صباحاً';
  return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
}

function statusLabel(status?: string) {
  if (status === 'pending') return 'بانتظار الموافقة';
  if (status === 'completed') return 'مكتملة';
  if (status === 'cancelled') return 'ملغاة';
  return 'نشط الآن';
}

function itemIcon(name?: string) {
  const normalized = String(name || '').toLowerCase();
  if (normalized.includes('سرير') || normalized.includes('bed')) return BedDouble;
  if (normalized.includes('ثلاجة') || normalized.includes('fridge')) return Refrigerator;
  return Armchair;
}

export default function OrderDetailsScreen({ orderId, onBack, onTrack }: Props) {
  const [order, setOrder] = useState<any>(null);
  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState(Boolean(orderId));

  useEffect(() => {
    let mounted = true;

    const loadOrder = async () => {
      try {
        if (!orderId) return;

        const orderSnap = await getDoc(doc(db, 'orders', orderId));
        if (!mounted || !orderSnap.exists()) return;

        const orderData = { id: orderSnap.id, ...orderSnap.data() };
        setOrder(orderData);

        if ((orderData as any).driverId) {
          const driverSnap = await getDoc(doc(db, 'drivers', (orderData as any).driverId));
          if (mounted && driverSnap.exists()) {
            setDriver({ id: driverSnap.id, ...driverSnap.data() });
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadOrder();
    return () => {
      mounted = false;
    };
  }, [orderId]);

  const items = useMemo(() => {
    const orderItems = Array.isArray(order?.items) ? order.items : [];
    if (orderItems.length > 0) return orderItems;
    return [
      { name: 'كنبة مزدوجة', quantity: 2 },
      { name: 'سرير ملكي', quantity: 1 },
      { name: 'ثلاجة حجم كبير', quantity: 2 },
    ];
  }, [order]);

  const itemCount = items.reduce((sum: number, item: any) => sum + Number(item.quantity || 1), 0);
  const shortId = order?.id ? `#${String(order.id).slice(0, 8).toUpperCase()}` : '#SF-99281';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={onBack}>
          <ArrowRight color="#0b3a00" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تفاصيل النقلة</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <ActivityIndicator color="#0b3a00" size="large" style={styles.loader} />
        ) : (
          <>
            <View style={styles.statusRow}>
              <View style={styles.orderNumber}>
                <Text style={styles.label}>رقم الطلب</Text>
                <Text style={styles.orderCode}>{shortId}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{statusLabel(order?.status)}</Text>
              </View>
            </View>

            <View style={styles.routeCard}>
              <View style={styles.routeLine}>
                <View style={styles.pickupDot} />
                <View style={styles.line} />
                <View style={styles.dropoffDot} />
              </View>
              <View style={styles.routeContent}>
                <View>
                  <Text style={styles.routeLabel}>موقع الاستلام</Text>
                  <Text style={styles.routeValue}>
                    {order?.pickup?.address || 'حي الصحافة، شارع العليا، الرياض'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.routeLabel}>وجهة الوصول</Text>
                  <Text style={styles.routeValue}>
                    {order?.dropoff?.address || 'حي الياسمين، طريق الثمامة، الرياض'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.infoGrid}>
              <InfoTile
                icon={<CalendarDays color="#0b3a00" size={21} />}
                label="التاريخ"
                value={formatDate(order?.scheduledTime)}
              />
              <InfoTile
                icon={<Clock3 color="#0b3a00" size={21} />}
                label="الوقت المقدر"
                value={formatTime(order?.scheduledTime)}
              />
            </View>

            <View style={styles.inventoryCard}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>قائمة المنقولات</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{itemCount} قطع</Text>
                </View>
              </View>

              {items.map((item: any, index: number) => {
                const Icon = itemIcon(item.name);
                return (
                  <View key={item.id || `${item.name}-${index}`} style={styles.itemRow}>
                    <View style={styles.itemLeft}>
                      <View style={styles.itemIconBox}>
                        <Icon color="#9ca3af" size={24} />
                      </View>
                      <Text style={styles.itemName}>{item.name || `عنصر ${index + 1}`}</Text>
                    </View>
                    <Text style={styles.itemQuantity}>× {item.quantity || 1}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.driverCard}>
              <View style={styles.driverInfo}>
                <Image
                  source={{ uri: driver?.avatar || DRIVER_IMAGE }}
                  style={styles.driverImage}
                />
                <View style={styles.driverText}>
                  <Text style={styles.driverEyebrow}>السائق</Text>
                  <Text style={styles.driverName}>{driver?.name || 'أحمد منصور'}</Text>
                  <Text style={styles.driverVehicle}>
                    {driver?.type || 'شاحنة متوسطة'} - طراز 2023
                  </Text>
                </View>
              </View>
              <View style={styles.driverActions}>
                <TouchableOpacity style={styles.driverActionButton}>
                  <Phone color="#fff" size={19} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.driverActionButton}>
                  <MessageCircle color="#fff" size={19} />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.trackButton} onPress={onTrack} activeOpacity={0.88}>
          <Navigation color="#fff" fill="#fff" size={22} />
          <Text style={styles.trackButtonText}>تتبع النقلة</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.infoTile}>
      <View style={styles.infoIcon}>{icon}</View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.94)',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f5',
  },
  headerTitle: { color: '#0b3a00', fontSize: 18, fontWeight: '800' },
  headerSpacer: { width: 40 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 130 },
  loader: { marginTop: 80 },
  statusRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  orderNumber: { alignItems: 'flex-end', gap: 4 },
  label: { color: '#41493c', fontSize: 13, fontWeight: '600' },
  orderCode: { color: '#191c1d', fontSize: 18, fontWeight: '900' },
  statusBadge: {
    backgroundColor: '#145300',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
  },
  statusText: { color: '#84c769', fontSize: 12, fontWeight: '900' },
  routeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row-reverse',
    gap: 16,
    marginBottom: 16,
  },
  routeLine: { alignItems: 'center', paddingVertical: 4 },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#94d878',
    borderWidth: 4,
    borderColor: '#ecfdf5',
  },
  line: { width: 2, flex: 1, backgroundColor: '#e2e8f0', marginVertical: 5 },
  dropoffDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0b3a00',
    borderWidth: 4,
    borderColor: '#ecfdf5',
  },
  routeContent: { flex: 1, gap: 24, alignItems: 'flex-end' },
  routeLabel: { color: '#41493c', fontSize: 12, fontWeight: '800', marginBottom: 4 },
  routeValue: { color: '#191c1d', fontSize: 16, fontWeight: '900', lineHeight: 23, textAlign: 'right' },
  infoGrid: { flexDirection: 'row-reverse', gap: 12, marginBottom: 16 },
  infoTile: {
    flex: 1,
    minHeight: 76,
    backgroundColor: '#f3f4f5',
    borderRadius: 24,
    padding: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: { flex: 1, alignItems: 'flex-end' },
  infoLabel: { color: '#41493c', fontSize: 10, fontWeight: '900' },
  infoValue: { color: '#191c1d', fontSize: 13, fontWeight: '900', marginTop: 3, textAlign: 'right' },
  inventoryCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 16 },
  cardTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardTitle: { color: '#191c1d', fontSize: 18, fontWeight: '900' },
  countBadge: { backgroundColor: '#ecfdf5', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
  countText: { color: '#0b3a00', fontSize: 12, fontWeight: '900' },
  itemRow: {
    minHeight: 72,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemLeft: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, flex: 1 },
  itemIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: { color: '#191c1d', fontSize: 15, fontWeight: '800', flex: 1, textAlign: 'right' },
  itemQuantity: { color: '#0b3a00', fontSize: 16, fontWeight: '900', marginRight: 8 },
  driverCard: {
    backgroundColor: '#0b3a00',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  driverInfo: { flexDirection: 'row-reverse', alignItems: 'center', gap: 14, flex: 1 },
  driverImage: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: 'rgba(52, 211, 153, 0.35)' },
  driverText: { flex: 1, alignItems: 'flex-end' },
  driverEyebrow: { color: '#6ee7b7', fontSize: 10, fontWeight: '900' },
  driverName: { color: '#fff', fontSize: 18, fontWeight: '900', marginTop: 2 },
  driverVehicle: { color: 'rgba(209, 250, 229, 0.78)', fontSize: 12, marginTop: 2, textAlign: 'right' },
  driverActions: { flexDirection: 'row-reverse', gap: 8 },
  driverActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#065f46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomAction: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 28,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  trackButton: {
    height: 64,
    borderRadius: 24,
    backgroundColor: '#0b3a00',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  trackButtonText: { color: '#fff', fontSize: 18, fontWeight: '900' },
});
