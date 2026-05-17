import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';
import AppHeader from '@/src/components/AppHeader';
import { auth, db } from '../../api/firebaseConfig';
import { cacheOrders, getCachedOrderById } from '@/src/storage/ordersCache';
import {DriverCard, InventoryCard, RouteCard, ScheduleInfo, StatusSummary, styles, TrackBottomAction,} from './orderDetailsComponents';

type Props = {
  orderId?: string;
  onBack?: () => void;
  onTrack?: () => void;
};

export default function OrderDetailsScreen({ orderId, onTrack }: Props) {
  const [order, setOrder] = useState<any>(null);
  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState(Boolean(orderId));

  useEffect(() => {
    let mounted = true;

    const loadOrder = async () => {
      try {
        if (!orderId) return;

        const orderSnap = await getDoc(doc(db, 'orders', orderId));
        if (!mounted || !orderSnap.exists()) {
          const cachedOrder = await getCachedOrderById(orderId);
          if (mounted && cachedOrder) setOrder(cachedOrder);
          return;
        }

        const orderData = { id: orderSnap.id, ...orderSnap.data() };
        setOrder(orderData);
        await cacheOrders([orderData], (orderData as any).userId || auth.currentUser?.uid || 'guest');

        if ((orderData as any).driverId) {
          const driverSnap = await getDoc(doc(db, 'drivers', (orderData as any).driverId));
          if (mounted && driverSnap.exists()) {
            setDriver({ id: driverSnap.id, ...driverSnap.data() });
          }
        }
      } catch (error) {
        console.error('Error loading order details:', error);
        if (orderId) {
          const cachedOrder = await getCachedOrderById(orderId);
          if (mounted && cachedOrder) setOrder(cachedOrder);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator color="#0b3a00" size="large" style={styles.loader} />
        ) : (
          <>
            <StatusSummary orderId={order?.id} status={order?.status} />
            <RouteCard pickupAddress={order?.pickup?.address} dropoffAddress={order?.pickup?.address} />
            <ScheduleInfo scheduledTime={order?.scheduledTime} />
            <InventoryCard items={items} />
            <DriverCard driver={driver} />
          </>
        )}
      </ScrollView>

      {order?.status === 'active' ? <TrackBottomAction onTrack={onTrack} /> : null}
    </SafeAreaView>
  );
}

