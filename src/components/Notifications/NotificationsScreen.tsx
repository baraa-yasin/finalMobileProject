import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, CalendarClock, ChevronLeft, MapPin, PackageCheck, Truck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from '@/src/api/firebaseConfig';
import { notifyOrderArrival } from '@/src/utils/orderArrival';
import AppHeader from '@/src/components/AppHeader';

type NotificationItem = {
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

const summarizeItems = (items: any[]) => {
  if (!Array.isArray(items) || items.length === 0) return 'تفاصيل المنقولات غير محددة';
  return items.map((item) => `${item.quantity || '1'} x ${item.name || 'قطعة'}`).join('، ');
};

const formatDate = (value?: string) => {
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

const getCreatedTime = (notification: NotificationItem) => {
  const timestamp = notification.createdAt;
  if (timestamp?.toDate) return timestamp.toDate().getTime();
  if (typeof timestamp === 'string') return new Date(timestamp).getTime();
  return 0;
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'notifications'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }) as NotificationItem)
          .sort((a, b) => getCreatedTime(b) - getCreatedTime(a));

        setNotifications(list);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const checkArrivedOrders = async () => {
      try {
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          where('status', '==', 'active')
        );
        const snapshot = await getDocs(ordersQuery);
        const now = Date.now();

        await Promise.all(
          snapshot.docs.map(async (orderDoc) => {
            const order: any = orderDoc.data();
            const arrivalTime = order.arrivalAt ? new Date(order.arrivalAt).getTime() : 0;

            if (!arrivalTime || arrivalTime > now || order.arrivalNotified) return;

            await notifyOrderArrival({
              userId,
              orderId: orderDoc.id,
              itemsSummary: summarizeItems(order.items),
              pickupAddress: order.pickup?.address || 'موقع غير محدد',
              dropoffAddress: order.dropoff?.address || 'موقع غير محدد',
              scheduledTime: order.scheduledTime || order.arrivalAt,
              driverName: order.driverName || null,
            });
          })
        );
      } catch (error) {
        console.error('Error checking arrived orders:', error);
      }
    };

    checkArrivedOrders();
    const interval = setInterval(checkArrivedOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <AppHeader />

      <View style={styles.titleBand}>
        <View style={styles.headerIcon}>
          <Bell color="#0b3a00" size={24} />
          {unreadCount > 0 && <View style={styles.unreadDot} />}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>التنبيهات</Text>
          <Text style={styles.subtitle}>آخر تحديثات طلبات النقل الخاصة بك</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#145300" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.centerState}>
          <View style={styles.emptyIcon}>
            <Bell color="#9ca3af" size={30} />
          </View>
          <Text style={styles.emptyTitle}>لا توجد تنبيهات بعد</Text>
          <Text style={styles.emptyText}>عند رفع طلب نقل جديد ستظهر تفاصيله هنا.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[styles.card, !notification.read && styles.unreadCard]}
              activeOpacity={0.85}
              onPress={() => {
                if (notification.orderId) {
                  router.push(`/order-details?orderId=${notification.orderId}` as any);
                }
              }}
            >
              <ChevronLeft color="#bdc7db" size={20} />

              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  {!notification.read && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>جديد</Text>
                    </View>
                  )}
                  <Text style={styles.cardTitle}>{notification.title || 'تحديث على طلبك'}</Text>
                </View>

                <Text style={styles.message}>{notification.message || 'تم تحديث طلب النقل الخاص بك.'}</Text>

                <View style={styles.detailRow}>
                  <PackageCheck color="#145300" size={17} />
                  <Text style={styles.detailText}>{notification.itemsSummary || 'تفاصيل المنقولات غير محددة'}</Text>
                </View>

                <View style={styles.detailRow}>
                  <MapPin color="#145300" size={17} />
                  <Text style={styles.detailText}>
                    من {notification.pickupAddress || 'موقع غير محدد'} إلى {notification.dropoffAddress || 'موقع غير محدد'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <CalendarClock color="#145300" size={17} />
                  <Text style={styles.detailText}>{formatDate(notification.scheduledTime)}</Text>
                </View>

                {notification.arrivalAt && notification.type !== 'arrival' ? (
                  <View style={styles.detailRow}>
                    <CalendarClock color="#145300" size={17} />
                    <Text style={styles.detailText}>الوصول المتوقع: {formatDate(notification.arrivalAt)}</Text>
                  </View>
                ) : null}

                {notification.driverName ? (
                  <View style={styles.detailRow}>
                    <Truck color="#145300" size={17} />
                    <Text style={styles.detailText}>السائق: {notification.driverName}</Text>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  titleBand: {
    height: 78,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
  },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef9ea',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#dc2626',
  },
  headerText: { alignItems: 'flex-end' },
  title: { fontSize: 26, fontWeight: '900', color: '#0b3a00' },
  subtitle: { marginTop: 2, fontSize: 13, color: '#666' },
  listContent: { padding: 20, paddingBottom: 110 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eef0ef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },
  unreadCard: {
    borderColor: '#aff592',
    backgroundColor: '#fbfff9',
  },
  cardContent: { flex: 1, alignItems: 'flex-end' },
  cardHeader: {
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardTitle: { flex: 1, textAlign: 'right', fontSize: 17, fontWeight: '900', color: '#111827' },
  newBadge: {
    backgroundColor: '#aff592',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  newBadgeText: { color: '#042100', fontSize: 10, fontWeight: '900' },
  message: { marginTop: 6, marginBottom: 12, color: '#4b5563', fontSize: 13, textAlign: 'right' },
  detailRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginTop: 7,
    width: '100%',
  },
  detailText: { flex: 1, color: '#374151', fontSize: 12, lineHeight: 18, textAlign: 'right' },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 66,
    height: 66,
    borderRadius: 20,
    backgroundColor: '#eef0ef',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 6 },
  emptyText: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 20 },
});
