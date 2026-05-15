import React, { useCallback, useState } from 'react';
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
import { useFocusEffect, useRouter } from 'expo-router';
import { PackageCheck, ReceiptText, ChevronLeft } from 'lucide-react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '@/src/api/firebaseConfig';
import AppHeader from '@/src/components/AppHeader';
import { cacheOrders, getCachedOrderHistory, getOrderSortTime } from '@/src/storage/ordersCache';

const formatDate = (value: any) => {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return 'غير محدد';
  return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getStatusLabel = (status?: string) => {
  if (status === 'completed') return 'مكتمل';
  if (status === 'cancelled') return 'ملغى';
  return 'سابق';
};

export default function OrdersListScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
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
            setOrders(cachedOrders);
            setSourceLabel('sqlite');
            setLoading(false);
          }

          const q = query(collection(db, 'orders'), where('userId', '==', userId));
          const snapshot = await getDocs(q);
          const list = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((order: any) => order.status === 'completed' || order.status === 'cancelled')
            .sort((a, b) => getOrderSortTime(b) - getOrderSortTime(a));

          await cacheOrders(list, userId);

          if (mounted) {
            setOrders(list);
            setSourceLabel('firebase');
          }
        } catch (error) {
          console.error('Error loading order history:', error);
          const userId = auth.currentUser?.uid;
          if (userId) {
            const cachedOrders = await getCachedOrderHistory(userId);
            if (mounted) {
              setOrders(cachedOrders);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <AppHeader />

      <View style={styles.titleBand}>
        <View style={styles.headerText}>
          <Text style={styles.title}>تفاصيل الطلبات</Text>
          <Text style={styles.subtitle}>
            {sourceLabel === 'sqlite' ? 'معروضة من بيانات الجهاز' : 'قائمة مختصرة للطلبات السابقة'}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#145300" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centerState}>
          <View style={styles.emptyIcon}>
            <ReceiptText color="#9ca3af" size={30} />
          </View>
          <Text style={styles.emptyTitle}>لا توجد طلبات سابقة</Text>
          <Text style={styles.emptyText}>الطلبات المكتملة أو الملغاة ستظهر هنا بشكل مختصر.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {orders.map((order) => {
            const title = Array.isArray(order.items) && order.items[0]?.name ? order.items[0].name : 'طلب نقل';
            const itemCount = Array.isArray(order.items)
              ? order.items.reduce((sum: number, item: any) => sum + Number(item.quantity || 1), 0)
              : 1;

            return (
              <TouchableOpacity
                key={order.id}
                style={styles.card}
                activeOpacity={0.86}
                onPress={() => router.push(`/order-details?orderId=${order.id}` as any)}
              >
                <ChevronLeft color="#bdc7db" size={20} />
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.statusBadge, order.status === 'cancelled' && styles.cancelledBadge]}>
                      <Text style={[styles.statusText, order.status === 'cancelled' && styles.cancelledText]}>
                        {getStatusLabel(order.status)}
                      </Text>
                    </View>
                    <Text style={styles.cardTitle}>{title}</Text>
                  </View>

                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>{formatDate(order.scheduledTime)}</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaText}>#{String(order.id).slice(0, 6).toUpperCase()}</Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <PackageCheck color="#145300" size={16} />
                    <Text style={styles.summaryText}>{itemCount} قطع</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  titleBand: {
    height: 78,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 2,
  },
  headerText: { alignItems: 'flex-end' },
  title: { fontSize: 24, fontWeight: '900', color: '#0b3a00' },
  subtitle: { marginTop: 2, fontSize: 13, color: '#666' },
  listContent: { padding: 20, paddingBottom: 36 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eef0ef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },
  cardContent: { flex: 1, alignItems: 'flex-end' },
  cardHeader: {
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardTitle: { flex: 1, textAlign: 'right', color: '#111827', fontSize: 16, fontWeight: '900' },
  statusBadge: {
    backgroundColor: '#e8f7e1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { color: '#145300', fontSize: 11, fontWeight: '900' },
  cancelledBadge: { backgroundColor: '#fef2f2' },
  cancelledText: { color: '#dc2626' },
  metaRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 7,
    marginTop: 8,
  },
  metaText: { color: '#6b7280', fontSize: 12, fontWeight: '700' },
  metaDot: { color: '#9ca3af', fontSize: 12 },
  summaryRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  summaryText: { color: '#374151', fontSize: 12, fontWeight: '800' },
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
