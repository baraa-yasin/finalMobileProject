import React from 'react';
import { Text, View } from 'react-native';
import { statusLabel } from './helpers';
import styles from './styles';

type StatusSummaryProps = {
  orderId?: string;
  status?: string;
};

export default function StatusSummary({ orderId, status }: StatusSummaryProps) {
  const shortId = orderId ? `#${String(orderId).slice(0, 8).toUpperCase()}` : '#SF-99281';

  return (
    <View style={styles.statusRow}>
      <View style={styles.orderNumber}>
        <Text style={styles.label}>رقم الطلب</Text>
        <Text style={styles.orderCode}>{shortId}</Text>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{statusLabel(status)}</Text>
      </View>
    </View>
  );
}
