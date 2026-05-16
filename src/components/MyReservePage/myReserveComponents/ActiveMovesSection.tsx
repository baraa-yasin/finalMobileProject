import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import ActiveMoveCard from './ActiveMoveCard';
import styles from './styles';
import type { MoveOrder } from './types';

type ActiveMovesSectionProps = {
  activeOrders: MoveOrder[];
  loading: boolean;
  now: number;
  onNavigate?: (path: string) => void;
};

export default function ActiveMovesSection({ activeOrders, loading, now, onNavigate }: ActiveMovesSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{activeOrders.length} نشط</Text>
        </View>
        <Text style={styles.sectionTitle}>النقلات الحالية</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#145300" style={styles.loadingIndicator} />
      ) : activeOrders.length === 0 ? (
        <Text style={[styles.emptyText, styles.emptyTextWithMargin]}>لا توجد نقلات حالية</Text>
      ) : (
        activeOrders.map((order) => (
          <ActiveMoveCard key={order.id} order={order} now={now} onNavigate={onNavigate} />
        ))
      )}
    </View>
  );
}
