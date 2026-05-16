import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

type OrdersListHeaderProps = {
  sourceLabel: 'firebase' | 'sqlite' | null;
};

export default function OrdersListHeader({ sourceLabel }: OrdersListHeaderProps) {
  return (
    <View style={styles.titleBand}>
      <View style={styles.headerText}>
        <Text style={styles.title}>تفاصيل الطلبات</Text>
        <Text style={styles.subtitle}>
          {sourceLabel === 'sqlite' ? 'معروضة من بيانات الجهاز' : 'قائمة مختصرة للطلبات السابقة'}
        </Text>
      </View>
    </View>
  );
}
