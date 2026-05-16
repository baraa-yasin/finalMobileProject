import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, PackageCheck } from 'lucide-react-native';
import { formatDate, getItemCount, getOrderTitle, getStatusLabel } from './helpers';
import styles from './styles';
import type { OrderListItem } from './types';

type OrderListCardProps = {
  order: OrderListItem;
  onPress: () => void;
};

export default function OrderListCard({ order, onPress }: OrderListCardProps) {
  const itemCount = getItemCount(order);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.86} onPress={onPress}>
      <ChevronLeft color="#bdc7db" size={20} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, order.status === 'cancelled' && styles.cancelledBadge]}>
            <Text style={[styles.statusText, order.status === 'cancelled' && styles.cancelledText]}>
              {getStatusLabel(order.status)}
            </Text>
          </View>
          <Text style={styles.cardTitle}>{getOrderTitle(order)}</Text>
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
}
