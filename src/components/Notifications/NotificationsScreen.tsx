import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from '@/src/api/firebaseConfig';
import AppHeader from '@/src/components/AppHeader';
import { notifyOrderArrival } from '@/src/utils/orderArrival';
import {
  getCreatedTime,
  NotificationItem,
  NotificationsHeader,
  NotificationsList,
  NotificationsState,
  styles,
  summarizeItems,
} from './notificationsComponents';

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

    const notificationsQuery = query(collection(db, 'notifications'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(
      notificationsQuery,
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

  const handleNotificationPress = (notification: NotificationItem) => {
    if (notification.orderId) {
      router.push(`/order-details?orderId=${notification.orderId}` as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppHeader />
      <NotificationsHeader unreadCount={unreadCount} />

      {loading ? (
        <NotificationsState type="loading" />
      ) : notifications.length === 0 ? (
        <NotificationsState type="empty" />
      ) : (
        <NotificationsList notifications={notifications} onNotificationPress={handleNotificationPress} />
      )}
    </SafeAreaView>
  );
}
