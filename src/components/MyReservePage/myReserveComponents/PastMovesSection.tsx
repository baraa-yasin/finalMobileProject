import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import PastMoveItem from './PastMoveItem';
import styles from './styles';
import type { MoveOrder } from './types';

type PastMovesSectionProps = {
  pastOrders: MoveOrder[];
  loading: boolean;
  clearingPast: boolean;
  onClearPast: () => void;
  onNavigate?: (path: string) => void;
};

const getCityFromAddress = (address?: string) => {
  if (!address) return 'موقع';
  const parts = address.split('،');
  return parts[parts.length - 1]?.trim() || address;
};

export default function PastMovesSection({
  pastOrders,
  loading,
  clearingPast,
  onClearPast,
  onNavigate,
}: PastMovesSectionProps) {
  return (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, styles.sectionHeaderTight]}>
        <TouchableOpacity
          style={[styles.clearPastBtn, (pastOrders.length === 0 || clearingPast) && styles.disabledButton]}
          onPress={onClearPast}
          disabled={pastOrders.length === 0 || clearingPast}
        >
          {clearingPast ? (
            <ActivityIndicator size="small" color="#dc2626" />
          ) : (
            <Text style={styles.clearPastBtnText}>تفريغ</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>النقلات السابقة</Text>
      </View>

      {!loading && pastOrders.length === 0 ? (
        <Text style={styles.emptyText}>لا توجد نقلات سابقة</Text>
      ) : (
        pastOrders.map((order) => {
          const orderDate = order.scheduledTime
            ? new Date(order.scheduledTime).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })
            : 'غير محدد';
          const title = order.items && order.items.length > 0 ? order.items[0].name : 'نقل بضائع';
          const fromCity = getCityFromAddress(order.pickup?.address);
          const toCity = getCityFromAddress(order.dropoff?.address);

          return (
            <PastMoveItem
              key={order.id}
              title={`نقل ${title}`}
              details={`${orderDate} • من ${fromCity} إلى ${toCity}`}
              status={order.status}
              onPress={() => onNavigate?.(`/order-details?orderId=${order.id}`)}
            />
          );
        })
      )}
    </View>
  );
}
