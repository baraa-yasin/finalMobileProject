import React, { useCallback, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '@/src/api/firebaseConfig';
import AppHeader from '@/src/components/AppHeader';
import { cacheOrders, getCachedOrderHistory, getOrderSortTime } from '@/src/storage/ordersCache';
import { OrderListItem, OrdersList, OrdersListHeader, OrdersListState, styles } from './orderListComponents';

export default function OrdersListScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceLabel, setSourceLabel] = useState<'firebase' | 'sqlite' | null>(null);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const loadOrders = async () => {
        try {
          setLoading(true);
          const userId = auth.currentUser?.uid;
          if (!userId) {
            setOrders([]);
            return;
          }

          const cachedOrders = await getCachedOrderHistory(userId);
          if (mounted && cachedOrders.length > 0) {
            setOrders(cachedOrders as OrderListItem[]);
            setSourceLabel('sqlite');
            setLoading(false);
          }

          const ordersQuery = query(collection(db, 'orders'), where('userId', '==', userId));
          const snapshot = await getDocs(ordersQuery);
          const list = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((order: any) => order.status === 'completed' || order.status === 'cancelled')
            .sort((a, b) => getOrderSortTime(b) - getOrderSortTime(a));

          await cacheOrders(list, userId);

          if (mounted) {
            setOrders(list as OrderListItem[]);
            setSourceLabel('firebase');
          }
        } catch (error) {
          console.error('Error loading order history:', error);
          const userId = auth.currentUser?.uid;
          if (userId) {
            const cachedOrders = await getCachedOrderHistory(userId);
            if (mounted) {
              setOrders(cachedOrders as OrderListItem[]);
              setSourceLabel(cachedOrders.length > 0 ? 'sqlite' : null);
            }
          }
        } finally {
          if (mounted) setLoading(false);
        }
      };

      loadOrders();
      return () => {
        mounted = false;
      };
    }, [])
  );

  const handleOrderPress = (order: OrderListItem) => {
    router.push(`/order-details?orderId=${order.id}` as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppHeader />
      <OrdersListHeader sourceLabel={sourceLabel} />

      {loading ? (
        <OrdersListState type="loading" />
      ) : orders.length === 0 ? (
        <OrdersListState type="empty" />
      ) : (
        <OrdersList orders={orders} onOrderPress={handleOrderPress} />
      )}
    </SafeAreaView>
  );
}
