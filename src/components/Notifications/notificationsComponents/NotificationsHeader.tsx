import React from 'react';
import { Text, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import styles from './styles';

type NotificationsHeaderProps = {
  unreadCount: number;
};

export default function NotificationsHeader({ unreadCount }: NotificationsHeaderProps) {
  return (
    <View style={styles.titleBand}>
      <View style={styles.headerIcon}>
        <Bell color="#0b3a00" size={24} />
        {unreadCount > 0 && <View style={styles.unreadDot} />}
      </View>
      <View style={styles.headerText}>
        <Text style={styles.title}>التنبيهات</Text>
        <Text style={styles.subtitle}>آخر تحديثات طلبات النقل الخاصة بك</Text>
      </View>
    </View>
  );
}
