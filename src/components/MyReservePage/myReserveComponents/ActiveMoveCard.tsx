import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, Truck } from 'lucide-react-native';
import { formatRemainingTime } from '@/src/utils/timeRemaining';
import styles from './styles';
import type { MoveOrder } from './types';

type ActiveMoveCardProps = {
  order: MoveOrder;
  now: number;
  onNavigate?: (path: string) => void;
};

export default function ActiveMoveCard({ order, now, onNavigate }: ActiveMoveCardProps) {
  const orderDate = order.scheduledTime
    ? new Date(order.scheduledTime).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'غير محدد';
  const remainingMs = order.arrivalAt ? Math.max(new Date(order.arrivalAt).getTime() - now, 0) : 0;
  const remainingLabel = order.arrivalAt ? formatRemainingTime(remainingMs) : 'غير محدد';

  return (
    <View style={styles.activeCard}>
      <View style={styles.activeIndicator} />

      <View style={styles.cardHeader}>
        <View style={styles.driverInfo}>
          <View style={styles.iconContainer}>
            <Truck color="#145300" size={24} fill="#aff592" />
          </View>
          <View style={styles.orderTextGroup}>
            <Text style={styles.orderId}>معرف الطلب #{order.id.slice(0, 6).toUpperCase()}</Text>
            <Text style={styles.statusText}>قيد التنفيذ</Text>
          </View>
        </View>
        <View>
          <Text style={styles.dateLabel}>تاريخ النقل</Text>
          <Text style={styles.dateValue}>{orderDate}</Text>
        </View>
      </View>

      <View style={styles.pathContainer}>
        <View style={styles.locationInfo}>
          <Text style={styles.pathLabel}>من</Text>
          <Text style={styles.locationName}>{order.pickup?.address || 'غير محدد'}</Text>
        </View>

        <View style={styles.pathVisual}>
          <View style={styles.dashLine} />
          <ChevronLeft color="#145300" size={20} />
          <View style={styles.dashLine} />
        </View>

        <View style={[styles.locationInfo, styles.dropoffInfo]}>
          <Text style={styles.pathLabel}>إلى</Text>
          <Text style={styles.locationName}>{order.dropoff?.address || 'غير محدد'}</Text>
        </View>
      </View>

      <View style={styles.timerBox}>
        <Text style={styles.timerLabel}>الوقت المتبقي للوصول</Text>
        <Text style={[styles.timerValue, remainingMs <= 0 && styles.timerArrived]}>
          {remainingLabel}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.primaryActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.detailsButton]}
            onPress={() => onNavigate?.(`/order-details?orderId=${order.id}`)}
          >
            <Text style={styles.detailsButtonText}>تفاصيل الطلب</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.trackButton]}
            onPress={() => onNavigate?.(`/tracking?orderId=${order.id}`)}
          >
            <Text style={styles.trackButtonText}>تتبع الشحنة</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
