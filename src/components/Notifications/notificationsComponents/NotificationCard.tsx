import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CalendarClock, ChevronLeft, MapPin, PackageCheck, Truck } from 'lucide-react-native';
import { formatDate } from './helpers';
import styles from './styles';
import type { NotificationItem } from './types';

type NotificationCardProps = {
  notification: NotificationItem;
  onPress: () => void;
};

export default function NotificationCard({ notification, onPress }: NotificationCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, !notification.read && styles.unreadCard]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <ChevronLeft color="#bdc7db" size={20} />

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          {!notification.read && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>جديد</Text>
            </View>
          )}
          <Text style={styles.cardTitle}>{notification.title || 'تحديث على طلبك'}</Text>
        </View>

        <Text style={styles.message}>{notification.message || 'تم تحديث طلب النقل الخاص بك.'}</Text>

        <View style={styles.detailRow}>
          <PackageCheck color="#145300" size={17} />
          <Text style={styles.detailText}>{notification.itemsSummary || 'تفاصيل المنقولات غير محددة'}</Text>
        </View>

        <View style={styles.detailRow}>
          <MapPin color="#145300" size={17} />
          <Text style={styles.detailText}>
            من {notification.pickupAddress || 'موقع غير محدد'} إلى {notification.dropoffAddress || 'موقع غير محدد'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <CalendarClock color="#145300" size={17} />
          <Text style={styles.detailText}>{formatDate(notification.scheduledTime)}</Text>
        </View>

        {notification.arrivalAt && notification.type !== 'arrival' ? (
          <View style={styles.detailRow}>
            <CalendarClock color="#145300" size={17} />
            <Text style={styles.detailText}>الوصول المتوقع: {formatDate(notification.arrivalAt)}</Text>
          </View>
        ) : null}

        {notification.driverName ? (
          <View style={styles.detailRow}>
            <Truck color="#145300" size={17} />
            <Text style={styles.detailText}>السائق: {notification.driverName}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
