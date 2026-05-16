import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import styles from './styles';

type NotificationsStateProps = {
  type: 'loading' | 'empty';
};

export default function NotificationsState({ type }: NotificationsStateProps) {
  return (
    <View style={styles.centerState}>
      {type === 'loading' ? (
        <ActivityIndicator size="large" color="#145300" />
      ) : (
        <>
          <View style={styles.emptyIcon}>
            <Bell color="#9ca3af" size={30} />
          </View>
          <Text style={styles.emptyTitle}>لا توجد تنبيهات بعد</Text>
          <Text style={styles.emptyText}>عند رفع طلب نقل جديد ستظهر تفاصيله هنا.</Text>
        </>
      )}
    </View>
  );
}
