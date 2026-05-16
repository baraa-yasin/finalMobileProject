import React from 'react';
import { ScrollView } from 'react-native';
import NotificationCard from './NotificationCard';
import styles from './styles';
import type { NotificationItem } from './types';

type NotificationsListProps = {
  notifications: NotificationItem[];
  onNotificationPress: (notification: NotificationItem) => void;
};

export default function NotificationsList({ notifications, onNotificationPress }: NotificationsListProps) {
  return (
    <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onPress={() => onNotificationPress(notification)}
        />
      ))}
    </ScrollView>
  );
}
