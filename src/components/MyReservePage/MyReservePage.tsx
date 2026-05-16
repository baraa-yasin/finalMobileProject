import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { useFocusEffect } from 'expo-router';
import AppHeader from '@/src/components/AppHeader';
import { auth, db } from '../../api/firebaseConfig';
import {ActiveMovesSection, MoveOrder, MyMovesTitle, PastMovesSection, styles,} from './myReserveComponents';

type MyMovesScreenProps = {
  onNavigate?: (path: string) => void;
};

const MyMovesScreen = ({ onNavigate }: MyMovesScreenProps) => {
  const [activeOrders, setActiveOrders] = useState<MoveOrder[]>([]);
  const [pastOrders, setPastOrders] = useState<MoveOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearingPast, setClearingPast] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const clearPastOrders = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    Alert.alert(
      'تفريغ النقلات السابقة',
      'هل أنت متأكد؟ سيتم حذف كل النقلات السابقة (المكتملة والملغاة) ولا يمكن التراجع.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تفريغ',
          style: 'destructive',
          onPress: async () => {
            try {
              setClearingPast(true);
              const pastOrdersQuery = query(
                collection(db, 'orders'),
                where('userId', '==', userId),
                where('status', 'in', ['completed', 'cancelled'])
              );
              const snap = await getDocs(pastOrdersQuery);
              const batch = writeBatch(db);
              snap.docs.forEach((doc) => batch.delete(doc.ref));
              await batch.commit();
              setPastOrders([]);
            } catch (error) {
              console.error('Error clearing past orders:', error);
              Alert.alert('خطأ', 'تعذر تفريغ النقلات السابقة.');
            } finally {
              setClearingPast(false);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const userId = auth.currentUser?.uid;
          if (!userId) {
            setLoading(false);
            return;
          }

          const ordersQuery = query(collection(db, 'orders'), where('userId', '==', userId));
          const snap = await getDocs(ordersQuery);
          const allOrders = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as MoveOrder[];

          const active = allOrders.filter((order) => order.status === 'active');
          const past = allOrders.filter((order) => order.status === 'completed' || order.status === 'cancelled');

          active.sort((a, b) => new Date(b.scheduledTime || 0).getTime() - new Date(a.scheduledTime || 0).getTime());
          past.sort((a, b) => new Date(b.scheduledTime || 0).getTime() - new Date(a.scheduledTime || 0).getTime());

          setActiveOrders(active);
          setPastOrders(past);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppHeader />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MyMovesTitle />
        <ActiveMovesSection activeOrders={activeOrders} loading={loading} now={now} onNavigate={onNavigate} />
        <PastMovesSection
          pastOrders={pastOrders}
          loading={loading}
          clearingPast={clearingPast}
          onClearPast={clearPastOrders}
          onNavigate={onNavigate}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyMovesScreen;
